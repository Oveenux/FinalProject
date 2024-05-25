#include <SPI.h>
#include <LoRa.h>
#include <lorawan.h>

const char *devAddr = "4D3E3234";
const char *nwkSKey = "23E28E23E28E23E8923E893289ED3209";
const char *appSKey = "4354354656545494F94023E3E93D934D";
unsigned long previousMillis = 0;

const unsigned long interval = 8000; // Intervalo de 8 segundos para enviar el mensaje

unsigned int counter = 0;

char myStr[50];
char outStr[255];
byte recvStatus = 0;

bool isP2PMessageReceived = false;
String p2pMessages[2]; // Array para almacenar los tres primeros mensajes P2P
//int p2pMessagesReceived = 0;

const sRFM_pins RFM_pins = {
    .CS = 8,
    .RST = 4,
    .DIO0 = 7,
    .DIO1 = 1,
    .DIO2 = 2,
    .DIO5 = 15,
};

char receivedChar; 
String receivedP2PMessage;
void setup() {
  Serial.begin(9600);
  //while (!Serial);
    
 // Iniciando P2P
 int p2pMessagesReceived = 0;
  Serial.println("LoRa Receiver");
  LoRa.setPins(8, 4, 7);

  if (!LoRa.begin(915E6)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }

delay(1000);

while (p2pMessagesReceived < 2) {
    int packetSize = LoRa.parsePacket();
    if (packetSize) {
      Serial.print("Received packet P2P: ");
      String receivedP2PMessage = "";  
 

      while (LoRa.available()) {
        char receivedChar = (char)LoRa.read();
        //Serial.print(receivedChar);
        receivedP2PMessage += receivedChar;
        //Serial.print(receivedP2PMessage);
      }
      Serial.println(receivedP2PMessage);

      //Serial.println("'");
      p2pMessages[p2pMessagesReceived] = receivedP2PMessage;
      p2pMessagesReceived++;
    }
    isP2PMessageReceived = true;
}

}




void lorawaninit()
{
    delay(500);
    lora.init();
    lora.setDeviceClass(CLASS_A);
    lora.setDataRate(SF9BW125);
    lora.setChannel(MULTI);
    lora.setNwkSKey(nwkSKey);
    lora.setAppSKey(appSKey);
    lora.setDevAddr(devAddr);
    
}


void loop() {

    setup();

    // Reenviar el mensaje P2P a Lorawan si hay uno almacenado
    if (isP2PMessageReceived) {
      Serial.println("Reenviando mensaje P2P a LoRaWAN");
      
      lorawaninit(); //Inicia LoRaWAN
      
    
      
     
      
      
      
      for (int i = 0; i < 2; i++) {
    if (p2pMessages[i] != "") {
      Serial.print("Enviando paquete # : ");
      Serial.println(i+1);
      delay(1000);
      lora.sendUplink(p2pMessages[i].c_str(), p2pMessages[i].length(), 1, 1);
      
      lora.update();
      //delay(2000);
     
  } 
  
  isP2PMessageReceived = false;
  }

      

      delay(350);
      
      //LoRa.begin(915E6);
        // Reinicia P2P
      
    }
  
}

