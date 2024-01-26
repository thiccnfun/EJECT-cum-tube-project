#include <Arduino.h>          // Basic Needs

// Include the Stepper library:
#include "FastAccelStepper.h"
#include <ESP32SvelteKit.h>
#include <PumpSettingsService.h>
#include <PumpStateService.h>

// IO pin assignments
const int MOTOR_STEP_PIN = 25;
const int MOTOR_DIRECTION_PIN = 26;
const int MOTOR_ENA_PIN = 27;

uint8_t M5_Remote_Address[] = {0x08, 0x3A, 0xF2, 0x68, 0x1E, 0x74};

// create the stepper motor object
FastAccelStepperEngine engine = FastAccelStepperEngine();
FastAccelStepper *stepper = NULL;

///////////////////////////////////////////
////
////  To Debug or not to Debug
////
///////////////////////////////////////////

// Uncomment the following line if you wish to print DEBUG info
#define DEBUG 

#ifdef DEBUG
#define LogDebug(...) Serial.println(__VA_ARGS__)
#define LogDebugFormatted(...) Serial.printf(__VA_ARGS__)
#else
#define LogDebug(...) ((void)0)
#define LogDebugFormatted(...) ((void)0)
#endif

// float cum_time = 1.0;
// float cum_size = 1.0;
// float cum_accel = 1.0;
// bool continuous = false;
// bool ejecting = false;
// bool reverse = false;

// float steps_per_second = 800;

bool ejectionStarted = false;

// max rpm = 500
// 6400 steps per revolution
float MAX_STEPS_PER_SECOND = 500 * 6400 / 60;

PsychicHttpServer server;

ESP32SvelteKit esp32sveltekit(&server, 115);

PumpSettingsService pumpSettingsService =
    PumpSettingsService(&server, esp32sveltekit.getFS(), esp32sveltekit.getSecurityManager());

PumpStateService pumpStateService = PumpStateService(&server,
                                                        esp32sveltekit.getSecurityManager(),
                                                        esp32sveltekit.getMqttClient(),
                                                        &pumpSettingsService,
                                                        esp32sveltekit.getNotificationEvents());

void turnOffPump() {
  LogDebug("turnOffPump");

  ejectionStarted = false;
  pumpStateService.update([&](PumpState& state) {
    if (!state.ejecting) {
      return StateUpdateResult::UNCHANGED;
    }
    state.ejecting = false;
    return StateUpdateResult::CHANGED;
  }, "ejecting");
}

void handleEjection() {
  LogDebug("handleEjection");

  pumpSettingsService.read([&](PumpSettings& state) {
    LogDebug("cum_time: " + String(state.cumTime));
    LogDebug("cum_size: " + String(state.cumSize));
    LogDebug("cum_accel: " + String(state.cumAccel));
    LogDebug("reverse: " + String(state.reverse));
    LogDebug("continuous: " + String(state.continuous));

    // stepper.setSpeedInStepsPerSecond(min(MAX_STEPS_PER_SECOND, state.cumSize / state.cumTime));
    // stepper.setAccelerationInStepsPerSecondPerSecond(state.cumAccel);
    // stepper.setDecelerationInStepsPerSecondPerSecond(state.continuous ? 0 : state.cumAccel);
  
    stepper->setSpeedInHz(min(MAX_STEPS_PER_SECOND, state.cumSize / state.cumTime));  // steps/s
    stepper->setAcceleration(state.cumAccel);  // steps/s²

    if (state.cumSize > 0) {
      ejectionStarted = true;
      stepper->move(state.reverse ? -state.cumSize : state.cumSize);
    } else {
      turnOffPump();
    }
    
  });
}

void setup()
{  
  Serial.begin(115200);

  esp32sveltekit.setMDNSAppName(APP_NAME);

  esp32sveltekit.begin();

  pumpStateService.begin();
  pumpSettingsService.begin();

   engine.init();
   stepper = engine.stepperConnectToPin(MOTOR_STEP_PIN);
   if (stepper) {
      stepper->setDirectionPin(MOTOR_DIRECTION_PIN);
      stepper->setEnablePin(MOTOR_ENA_PIN);
      stepper->setAutoEnable(true);


   }

  // digitalWrite(MOTOR_ENA_PIN, LOW);
  // stepper.connectToPins(MOTOR_STEP_PIN, MOTOR_DIRECTION_PIN);
}

void loop()
{
  pumpStateService.read([&](PumpState& state) {
    if (state.ejecting) {

      // if ejecting and no longer running, set pumpState.ejecting to false
      if (ejectionStarted && !stepper->isRunning()) {
        turnOffPump();
      } else if (!ejectionStarted) {
        handleEjection();
      }
    } else if (stepper->isRunning()) {
      stepper->stopMove();
      turnOffPump();
    }
  });

  delay(500);
}
