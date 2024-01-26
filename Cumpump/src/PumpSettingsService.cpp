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

PumpSettingsService::PumpSettingsService(PsychicHttpServer *server, FS *fs, SecurityManager *securityManager) : _httpEndpoint(PumpSettings::read,
                                                                                                                                        PumpSettings::update,
                                                                                                                                        this,
                                                                                                                                        server,
                                                                                                                                        PUMP_SETTINGS_ENDPOINT_PATH,
                                                                                                                                        securityManager,
                                                                                                                                        AuthenticationPredicates::IS_AUTHENTICATED),
                                                                                                                          _fsPersistence(PumpSettings::read, PumpSettings::update, this, fs, PUMP_SETTINGS_FILE),
                                                                                           _webSocketServer(PumpSettings::read,
                                                                                                            PumpSettings::update,
                                                                                                            this,
                                                                                                            server,
                                                                                                            PUMP_SETTINGS_SOCKET_PATH,
                                                                                                            securityManager,
                                                                                                            AuthenticationPredicates::IS_AUTHENTICATED)
{
}

void PumpSettingsService::begin()
{
    _httpEndpoint.begin();
    _webSocketServer.begin();
    _fsPersistence.readFromFS();
}
