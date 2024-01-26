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

// #include <ESP_FlexyStepper.h>
#include <HttpEndpoint.h>
#include <MqttPubSub.h>
#include <WebSocketServer.h>
#include <NotificationEvents.h>
// #include <WebSocketClient.h>

#define DEFAULT_EJECT_STATE false
#define OFF_STATE "OFF"
#define ON_STATE "ON"

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

    static void homeAssistRead(PumpState &settings, JsonObject &root)
    {
        root["state"] = settings.ejecting ? ON_STATE : OFF_STATE;
    }

    static StateUpdateResult homeAssistUpdate(JsonObject &root, PumpState &pumpState)
    {
        String state = root["state"];
        // parse new led state
        boolean newState = false;
        if (state.equals(ON_STATE))
        {
            newState = true;
        }
        else if (!state.equals(OFF_STATE))
        {
            return StateUpdateResult::ERROR;
        }
        // change the new state, if required
        if (pumpState.ejecting != newState)
        {
            pumpState.ejecting = newState;
            return StateUpdateResult::CHANGED;
        }
        return StateUpdateResult::UNCHANGED;
    }
};

class PumpStateService : public StatefulService<PumpState>
{
public:
    PumpStateService(PsychicHttpServer *server,
                      SecurityManager *securityManager,
                      AsyncMqttClient *mqttClient,
                      PumpSettingsService *pumpSettingsService,
                      NotificationEvents *notificationEvents);
    void begin();
    void processMovement();
    // void loop();

private:
    HttpEndpoint<PumpState> _httpEndpoint;
    MqttPubSub<PumpState> _mqttPubSub;
    WebSocketServer<PumpState> _webSocketServer;
    //  WebSocketClient<PumpState> _webSocketClient;
    AsyncMqttClient *_mqttClient;
    PumpSettingsService *_pumpSettingsService;
    NotificationEvents *_notificationEvents;
    // ESP_FlexyStepper stepper;

    void registerConfig();
    void onConfigUpdated();
};

#endif
