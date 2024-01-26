#ifndef PumpSettingsService_h
#define PumpSettingsService_h

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

#include <HttpEndpoint.h>
#include <WebSocketServer.h>
#include <FSPersistence.h>
// #include <SettingValue.h>

#define PUMP_SETTINGS_FILE "/config/pumpSettings.json"
#define PUMP_SETTINGS_ENDPOINT_PATH "/rest/pumpSettings"
#define PUMP_SETTINGS_SOCKET_PATH "/ws/pumpSettings"

class PumpSettings
{
public:
    float cumTime = 1.0;
    float cumSize = 800.0;
    float cumAccel = 800.0;
    bool reverse = false;
    bool continuous = false;

    static void read(PumpSettings &settings, JsonObject &root)
    {
        root["cum_time"] = settings.cumTime;
        root["cum_size"] = settings.cumSize;
        root["cum_accel"] = settings.cumAccel;
        root["reverse"] = settings.reverse;
        root["continuous"] = settings.continuous;
    }

    static StateUpdateResult update(JsonObject &root, PumpSettings &settings)
    {
        settings.cumTime = root["cum_time"] | 1.0;
        settings.cumSize = root["cum_size"] | 800.0;
        settings.cumAccel = root["cum_accel"] | 800.0;
        settings.reverse = root["reverse"] | false;
        settings.continuous = root["continuous"] | false;
        return StateUpdateResult::CHANGED;
    }
};

class PumpSettingsService : public StatefulService<PumpSettings>
{
public:
    PumpSettingsService(PsychicHttpServer *server, FS *fs, SecurityManager *securityManager);
    void begin();

private:
    HttpEndpoint<PumpSettings> _httpEndpoint;
    FSPersistence<PumpSettings> _fsPersistence;
    WebSocketServer<PumpSettings> _webSocketServer;
};

#endif // end PumpSettingsService_h
