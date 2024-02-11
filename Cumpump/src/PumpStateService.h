#pragma once

#ifndef PumpStateService_h
#define PumpStateService_h

/**
 *   ESP32 SvelteKit
 *
 *   A simple, secure and extensible framework for IoT projects for ESP32 platforms
 *   with responsive Sveltekit front-end built with TailwindCSS and DaisyUI.
 *   https://github.com/theelims/ESP32-sveltekit
 *
 *   Copyright (C) 2018 - 2023 rjwats
 *   Copyright (C) 2023 theelims
 *
 *   All Rights Reserved. This software may be modified and distributed under
 *   the terms of the LGPL v3 license. See the LICENSE file for details.
 **/

#include <PumpSettingsService.h>

#include <FastAccelStepper.h>
#include <HttpEndpoint.h>
#include <MqttPubSub.h>
#include <WebSocketServer.h>
#include <NotificationEvents.h>

#define DEFAULT_EJECT_STATE false

#define PUMP_STATE_ENDPOINT_PATH "/rest/pumpState"
#define PUMP_STATE_SOCKET_PATH "/ws/pumpState"

class PumpState
{
public:
    bool ejecting;

    static void read(PumpState &settings, JsonObject &root)
    {
        root["ejecting"] = settings.ejecting;
    }

    static StateUpdateResult update(JsonObject &root, PumpState &pumpState)
    {
        boolean newState = root["ejecting"] | DEFAULT_EJECT_STATE;

        if (pumpState.ejecting != newState)
        {
            pumpState.ejecting = newState;
            return StateUpdateResult::CHANGED;
        }
        return StateUpdateResult::UNCHANGED;
    }

    static void mqttRead(PumpState &settings, JsonObject &root)
    {
        root["state"] = settings.ejecting;
    }

    static StateUpdateResult mqttUpdate(JsonObject &root, PumpState &pumpState)
    {
        // String state = root["state"];
        // // parse new led state
        // boolean newState = false;
        // if (state.equals(ON_STATE))
        // {
        //     newState = true;
        // }
        // else if (!state.equals(OFF_STATE))
        // {
        //     return StateUpdateResult::ERROR;
        // }
        // // change the new state, if required
        // if (pumpState.ejecting != newState)
        // {
        //     pumpState.ejecting = newState;
        //     return StateUpdateResult::CHANGED;
        // }
        return StateUpdateResult::UNCHANGED;
    }
};

class PumpStateService : public StatefulService<PumpState>
{
public:
    PumpStateService(PsychicHttpServer *server,
                      SecurityManager *securityManager,
                      PsychicMqttClient *mqttClient,
                      PumpSettingsService *pumpSettingsService,
                      NotificationEvents *notificationEvents);
    void begin();

protected:
    static void _loopImpl(void *_this) { static_cast<PumpStateService *>(_this)->_loop(); }
    void _loop()
    {
        while (1)
        {
            if (_state.ejecting && !stepper->isRunning()) {
                updatePumpState(false);
            }
            vTaskDelay(100);
        }
    };

private:
    HttpEndpoint<PumpState> _httpEndpoint;
    MqttPubSub<PumpState> _mqttPubSub;
    WebSocketServer<PumpState> _webSocketServer;
    PsychicMqttClient *_mqttClient;
    PumpSettingsService *_pumpSettingsService;
    NotificationEvents *_notificationEvents;
    FastAccelStepperEngine engine;
    FastAccelStepper *stepper;

    void onConfigUpdated();
    void updatePumpState(bool ejecting);
};

#endif
