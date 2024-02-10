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

#ifndef MOTOR_STEP_PIN
#define MOTOR_STEP_PIN 4
#endif

#ifndef MOTOR_DIRECTION_PIN
#define MOTOR_DIRECTION_PIN 5
#endif

#ifndef MOTOR_ENA_PIN
#define MOTOR_ENA_PIN 6
#endif

#include <FastAccelStepper.h>
#include <PumpStateService.h>

// max rpm = 500
// 6400 steps per revolution
float MAX_STEPS_PER_SECOND = 500 * 6400 / 60;

StaticJsonDocument<128> responseDoc;

PumpStateService::PumpStateService(
  PsychicHttpServer *server,
  SecurityManager *securityManager,
  AsyncMqttClient *mqttClient,
  PumpSettingsService *pumpSettingsService,
  NotificationEvents *notificationEvents) : 
    _httpEndpoint(PumpState::read,
                  PumpState::update,
                  this,
                  server,
                  PUMP_STATE_ENDPOINT_PATH,
                  securityManager,
                  AuthenticationPredicates::IS_AUTHENTICATED),
    _mqttPubSub(PumpState::mqttRead, PumpState::mqttUpdate, this, mqttClient),
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
{
    engine = FastAccelStepperEngine();
    stepper = NULL;

    // configure settings service update handler to update LED state
    addUpdateHandler([&](const String &originId)
                     { onConfigUpdated(); },
                     false);
}

void PumpStateService::begin()
{
  _httpEndpoint.begin();
  _webSocketServer.begin();
  _state.ejecting = false;

  engine.init();
  stepper = engine.stepperConnectToPin(MOTOR_STEP_PIN);
  if (stepper) {
    stepper->setDirectionPin(MOTOR_DIRECTION_PIN);
    stepper->setEnablePin(MOTOR_ENA_PIN);
    stepper->setAutoEnable(true);
  } else {
#ifdef SERIAL_INFO
    Serial.println("unable to connect to stepper");
#endif
  }

  xTaskCreatePinnedToCore(
    this->_loopImpl,            // Function that should be called
    "Pump State Service",       // Name of the task (for debugging)
    4096,                       // Stack size (bytes)
    this,                       // Pass reference to this class instance
    (tskIDLE_PRIORITY),         // task priority
    NULL,                       // Task handle
    ESP32SVELTEKIT_RUNNING_CORE // Pin to application core
  );
}

void PumpStateService::updatePumpState(bool ejecting)
{
  update([&](PumpState& state) {
    if (state.ejecting == ejecting) {
      return StateUpdateResult::UNCHANGED;
    }
    state.ejecting = ejecting;
    return StateUpdateResult::CHANGED;
  }, "ejecting");
}

void PumpStateService::onConfigUpdated()
{
  if (_state.ejecting) {
    _pumpSettingsService->read([&](PumpSettings& settings) {
      stepper->setSpeedInHz(min(MAX_STEPS_PER_SECOND, settings.cumSize / settings.cumTime));  // steps/s
      stepper->setAcceleration(settings.cumAccel);  // steps/s²

      if (settings.cumSize > 0) {
        stepper->move(settings.reverse ? -settings.cumSize : settings.cumSize);
      } else {
        updatePumpState(false);
      }
    });
  } else if (stepper->isRunning()) {
    stepper->stopMove();
  }
}
