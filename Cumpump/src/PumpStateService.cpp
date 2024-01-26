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

#include <PumpStateService.h>


const int MOTOR_STEP_PIN = 25;
const int MOTOR_DIRECTION_PIN = 26;
const int MOTOR_ENA_PIN = 27;

StaticJsonDocument<128> responseDoc;

PumpStateService::PumpStateService(PsychicHttpServer *server,
                                     SecurityManager *securityManager,
                                     AsyncMqttClient *mqttClient,
                                     PumpSettingsService *pumpSettingsService,
                                     NotificationEvents *notificationEvents) : _httpEndpoint(PumpState::read,
                                                                                                         PumpState::update,
                                                                                                         this,
                                                                                                         server,
                                                                                                         PUMP_STATE_ENDPOINT_PATH,
                                                                                                         securityManager,
                                                                                                         AuthenticationPredicates::IS_AUTHENTICATED),
                                                                                           _mqttPubSub(PumpState::homeAssistRead, PumpState::homeAssistUpdate, this, mqttClient),
                                                                                           _webSocketServer(PumpState::read,
                                                                                                            PumpState::update,
                                                                                                            this,
                                                                                                            server,
                                                                                                            PUMP_STATE_SOCKET_PATH,
                                                                                                            securityManager,
                                                                                                            AuthenticationPredicates::IS_AUTHENTICATED),
                                                                                           _mqttClient(mqttClient),
                                                                                           _pumpSettingsService(pumpSettingsService),
                                                                                            _notificationEvents(notificationEvents)
/*  _webSocketClient(PumpState::read,
                   PumpState::update,
                   this,
                   LIGHT_SETTINGS_SOCKET_PATH)*/
{
    // configure led to be output
    // pinMode(LED_BUILTIN, OUTPUT);

    // configure MQTT callback TODO:
    // _mqttClient->onConnect(std::bind(&PumpStateService::registerConfig, this));

    // configure update handler for when the light settings change
    _pumpSettingsService->addUpdateHandler([&](const String &originId)
                                                { registerConfig(); },
                                                false);

    // configure settings service update handler to update LED state
    // addUpdateHandler([&](const String &originId)
    //                  { onConfigUpdated(); },
    //                  false);
}

void PumpStateService::begin()
{
    _httpEndpoint.begin();
    _webSocketServer.begin();
    _state.ejecting = false;

    Serial.println("PumpStateService::begin");

  // set up motor
  // digitalWrite(MOTOR_ENA_PIN, LOW);
  // stepper.connectToPins(MOTOR_STEP_PIN, MOTOR_DIRECTION_PIN);
  // stepper.startAsService();

    // onConfigUpdated();

//   stepper.setSpeedInStepsPerSecond(500);
//   stepper.moveRelativeInSteps(2000);

  Serial.println("PumpStateService::begin done");

}

// NOTE: is this used?
// void PumpStateService::loop()
// {
//     // stepper.processMovement();

//     Serial.println("PumpStateService::loop");
// }

// void PumpStateService::processMovement()
// {
//     // stepper.processMovement();
// }

// void PumpStateService::onConfigUpdated()
// {
//     // digitalWrite(LED_BUILTIN, _state.ledOn ? 1 : 0);
    
// Serial.println("onConfigUpdated:  ejecting: " + _state.ejecting ? "true" : "false");

//   // stepper.setSpeedInStepsPerSecond(500);
//   // stepper.setAccelerationInStepsPerSecondPerSecond(100);
//   // stepper.setDecelerationInStepsPerSecondPerSecond(100);

//   if (_state.ejecting) {
//     // digitalWrite(MOTOR_ENA_PIN, LOW);
//     // stepper.moveRelativeInSteps(1600);

//     // respond
//     if (true) {
//       _state.ejecting = false;
      
//       // String output;
//       // responseDoc["ejecting"] = _state.ejecting;
//       // serializeJson(responseDoc, output);
//       // _notificationEvents->send(output, "ejector-state", millis());

// // _webSocketServer.transmitData(nullptr, "ejector-state");

//       // _notificationEvents->notify("PumpStateService::onConfigUpdated:  ejecting: " + _state.ejecting ? "true" : "false");
//     }

//     // if (!continuous) {
//     //   SendCommand(CUMTOGGLE, EJECT_ID);
//     //   ejecting = false;
//     // }
//   } else {
//     // digitalWrite(MOTOR_ENA_PIN, HIGH);
//   }

//   Serial.println("onConfigUpdated done");
// }

void PumpStateService::registerConfig()
{
    if (!_mqttClient->connected())
    {
        return;
    }
    String configTopic;
    String subTopic;
    String pubTopic;

    DynamicJsonDocument doc(256);
    _pumpSettingsService->read([&](PumpSettings &settings)
                                    {
    // configTopic = settings.mqttPath + "/config";
    // subTopic = settings.mqttPath + "/set";
    // pubTopic = settings.mqttPath + "/state";
    // doc["~"] = settings.mqttPath;
    doc["cum_time"] = settings.cumTime;
    doc["cum_size"] = settings.cumSize;
    doc["cum_accel"] = settings.cumAccel;
    doc["reverse"] = settings.reverse; });
    doc["cmd_t"] = "~/set";
    doc["stat_t"] = "~/state";
    doc["schema"] = "json";
    // doc["brightness"] = false;

    String payload;
    serializeJson(doc, payload);
    _mqttClient->publish(configTopic.c_str(), 0, false, payload.c_str());

    _mqttPubSub.configureTopics(pubTopic, subTopic);
}
