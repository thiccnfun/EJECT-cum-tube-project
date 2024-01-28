#include <Arduino.h>
#include <FastAccelStepper.h>
#include <ESP32SvelteKit.h>
#include <PumpSettingsService.h>
#include <PumpStateService.h>

PsychicHttpServer server;

ESP32SvelteKit esp32sveltekit(&server, 115);

PumpSettingsService pumpSettingsService =
    PumpSettingsService(&server, esp32sveltekit.getFS(), esp32sveltekit.getSecurityManager());

PumpStateService pumpStateService = PumpStateService(&server,
                                                        esp32sveltekit.getSecurityManager(),
                                                        esp32sveltekit.getMqttClient(),
                                                        &pumpSettingsService,
                                                        esp32sveltekit.getNotificationEvents());

void setup()
{  
  Serial.begin(115200);

  esp32sveltekit.setMDNSAppName(APP_NAME);

  esp32sveltekit.begin();
  pumpStateService.begin();
  pumpSettingsService.begin();
}

void loop()
{
  vTaskDelete(NULL);
}