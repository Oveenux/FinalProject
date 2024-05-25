#include <SPI.h>
#include <LoRa.h> // Libreria de SandepMistry - P2P Default arduino
#include <dht11.h>
#include <hp_BH1750.h>

#define DHT11PIN 6
int id = 1;
dht11 DHT11;
void setup() {
  Serial.begin(9600);
  //while (!Serial);
  LoRa.setPins(8, 4, 7);

  Serial.println("LoRa Receiver");

  if (!LoRa.begin(915E6)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
   
}

void loop() {
  // try to parse packet
  delay(500);
  int chk = DHT11.read(DHT11PIN);
  

    // received a packet
    
  

    // read packet as a string

      // Print the received string

      Serial.print("Temperatura Nevera: ");
      Serial.println((int)DHT11.temperature, 1);

      Serial.print("Humedad Nevera: ");
      Serial.println((int)DHT11.humidity, 1);


      
      // Transmit the received string along with other sensor data
      LoRa.beginPacket();
      LoRa.print((int)DHT11.temperature, 1);
      LoRa.print(" ");
      LoRa.print((int)DHT11.humidity, 1);

      LoRa.endPacket();
      
      Serial.println("Paquetes enviados al nodo general");
      delay(5000);
    
}