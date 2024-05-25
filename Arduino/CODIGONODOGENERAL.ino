#include <SPI.h>
#include <LoRa.h> // Libreria de SandepMistry - P2P Default arduino
#include <dht11.h>
#include <hp_BH1750.h>
#include <ModbusRtu.h> //libreria Modbus


#define DHT11PIN 6
//#define DHT12PIN 11

dht11 DHT11;
//dht11 DHT12;
hp_BH1750 BH1750;

int counter = 0;
float voltaje;
int Velocidadviento;
float datos[12];
char* myStr = "";
uint16_t Voltaje[12]; //Vector de Voltajes
uint16_t Potencia[6]; //Vector de Potencias
uint16_t Corriente[6]; //Vector de Corrientes
uint8_t u8state; //maquina de estado
uint8_t u8query; //puntero maquina de estado
bool estado = true;
int cont = 0;
int cont_millis = 0;
int cont_u32wait = 0;
int contlectura = 1;
String datosConcatenados2 = "";
String mensajenodo1 = "";
bool mensajeRecibido = false;

Modbus master(0, Serial1, 9); //declaracion de maestro 0 y slave puerto 2
modbus_t telegram[24]; // comando de Modbus para declarar el numero de extracciones
void informacionextraccion() {
  
  telegram[0].u8id = 106; // Dirreccion del esclavo 
  telegram[0].u8fct = 3; // Funcion del codigo  3 = leer registro
  telegram[0].u16RegAdd = 3027; // Donde se empiezan a leer registros
  telegram[0].u16CoilsNo = 6; //Numeros de registros que se van a leer
  telegram[0].au16reg = Voltaje; //donde se empiezan a almacenar

  telegram[1].u8id = 106;
  telegram[1].u8fct = 3;
  telegram[1].u16RegAdd = 3019;
  telegram[1].u16CoilsNo = 6;
  telegram[1].au16reg = Voltaje + 6;

  telegram[2].u8id = 106;
  telegram[2].u8fct = 3;
  telegram[2].u16RegAdd = 3053;
  telegram[2].u16CoilsNo = 6;
  telegram[2].au16reg = Potencia;

  telegram[3].u8id = 106;
  telegram[3].u8fct = 3;
  telegram[3].u16RegAdd = 2999;
  telegram[3].u16CoilsNo = 6;
  telegram[3].au16reg = Corriente;
      

  master.start();
  cont_millis = 1;
  cont_u32wait = 0;
  u8state = 0;
  u8query = 0;

}
void setup() {
  Serial1.begin(9600);
  //while (!Serial);

  LoRa.setPins(8, 4, 7);

  Serial.println("LoRa Sender");

  if (!LoRa.begin(915E6)) {
    Serial.println("Starting LoRa failed!");
    while (1);
  }
  bool avail = BH1750.begin(BH1750_TO_GROUND);
   if (!avail) {
    delay(2800);
    Serial.println("No BH1750 sensor found!");
    //while (true) {}; 
  }    
}

void funcionmaster() {
  while (estado == true) {
    switch ( u8state ) {
      case 0:
        if (cont_millis > cont_u32wait) u8state++;
        break;
      case 1:
        master.query( telegram[u8query] );
        u8state++;
        u8query++;
        if (u8query > 5) u8query = 0;
        break;
      case 2:
        master.poll();
        if (master.getState() == COM_IDLE) {

          //__________________Voltajes de Lineas____________________________
          long int VLa = (((unsigned long)Voltaje[0] << 16) | Voltaje[1]);
          float PVLa;
          memcpy(&PVLa, &VLa, 4);
          String FVLa = String(float(PVLa));
          datos[0] = PVLa;

          long int VLb = (((unsigned long)Voltaje[2] << 16) | Voltaje[3]);
          float PVLb;
          memcpy(&PVLb, &VLb, 4);
          String FVLb = String(float(PVLb));
          datos[1] = PVLb;

          long int VLc = (((unsigned long)Voltaje[4] << 16) | Voltaje[5]);
          float PVLc;
          memcpy(&PVLc, &VLc, 4);
          String FVLc = String(float(PVLc));
          datos[2] = PVLc;

          //__________________Voltajes de Fases_____________________________
          long int VolAB = (((unsigned long)Voltaje[6] << 16) | Voltaje[7]);
          float PVolAB;
          memcpy(&PVolAB, &VolAB, 4);
          String FVolAB = String(float(PVolAB));
          datos[3] = PVolAB;

          long int VolBC = (((unsigned long)Voltaje[8] << 16) | Voltaje[9]);
          float PVolBC;
          memcpy(&PVolBC, &VolBC, 4);
          String FVolBC = String(float(PVolBC));
          datos[4] = PVolBC;

          long int VolCA = (((unsigned long)Voltaje[10] << 16) | Voltaje[11]);
          float PVolCA;
          memcpy(&PVolCA, &VolCA, 4);
          String FVolCA = String(float(PVolCA));
          datos[5] = PVolCA;

          //__________________Potencias_______________________________________
          long int PWa = (((unsigned long)Potencia[0] << 16) | Potencia[1]);
          float PPWa;
          memcpy(&PPWa, &PWa, 4);
          String FPWa = String(float(PPWa));
          datos[6] = PPWa;

          long int PWb = (((unsigned long)Potencia[2] << 16) | Potencia[3]);
          float PPWb;
          memcpy(&PPWb, &PWb, 4);
          String FPWb = String(float(PPWb));
          datos[7] = PPWb;

          long int PWc = (((unsigned long)Potencia[4] << 16) | Potencia[5]);
          float PPWc;
          memcpy(&PPWc, &PWc, 4);
          String FPWc = String(float(PPWc));
          datos[8] = PPWc;

          //__________________Corrientes_______________________________________
          long int CuA = (((unsigned long)Corriente[0] << 16) | Corriente[1]);
          float PCuA;
          memcpy(&PCuA, &CuA, 4);
          String FCuA = String(float(PCuA));
          datos[9] = PCuA;

          long int CuB = (((unsigned long)Corriente[2] << 16) | Corriente[3]);
          float PCuB;
          memcpy(&PCuB, &CuB, 4);
          String FCuB = String(float(PCuB));
          datos[10] = PCuB;

          long int CuC = (((unsigned long)Corriente[4] << 16) | Corriente[5]);
          float PCuC;
          memcpy(&PCuC, &CuC, 4);
          String FCuC = String(float(PCuC));
          datos[11] = PCuC;

          //____________________________________________________________________

          if (u8query == 5) {
            String data = "(" + FVLa + "!" + FVLb + "!" + FVLc + "¡" + FVolAB + "¡" + FVolBC + "¡" + FVolCA + "¡" + FPWa + "!" + FPWb + "!" + FPWc + "¡" + FCuA + "¡" + FCuB + "!" + FCuC   + ")";
            int string_len = data.length() + 1;
            char myStr[string_len];
            data.toCharArray(myStr, string_len);
            Serial.println();
            Serial.println("Recibiendo lectura numero: ");
            Serial.print(contlectura);
            contlectura++;
            for (int i = 0; i < 12; i++) {
              
              Serial.println( );
              switch (i) {
                case 0:
                  Serial.println("Voltaje A: ");
                  break;
                case 1:
                  Serial.println("Voltaje B: ");
                  break;  
                case 2:
                  Serial.println("Voltaje C: ");
                  break;
                case 3:
                  Serial.println("Voltaje A-B: ");
                  break;
                case 4:
                  Serial.println("Voltaje B-C: ");
                  break;
                case 5:
                  Serial.println("Voltaje C-A: ");                  
                  break;
                case 6:
                  Serial.println("Potencia A: ");
                  break;
                case 7:
                  Serial.println("Potencia B: ");
                  break;
                case 8:
                  Serial.println("Potencia C: ");
                  break;
                case 9:
                  Serial.println("Corriente A: ");
                  break;
                case 10:
                  Serial.println("Corriente B: ");
                  break;
                case 11:
                  Serial.println("Corriente C: ");
                  break;
              }
              
              Serial.print(datos[i]);
            }
            String datosConcatenados = "";
            Serial.println( );
            Serial.println("Se Envia: ");
              for (int i = 0; i < 3; i++) {
        datosConcatenados += String(datos[i]); // Convertir el dato a String y concatenarlo
        if (i < 3) { // Add space after each voltage value except the last one
            datosConcatenados += " ";
               }
                    }

    // Then concatenate currents
          for (int i = 9; i < 12; i++) {
             datosConcatenados += String(datos[i]); // Convertir el dato a String y concatenarlo
               if (i < 12) { // Add space after each current value except the last one
            datosConcatenados += " ";
            }
             }

    // Finally concatenate powers
             for (int i = 6; i < 9; i++) {
                 datosConcatenados += String(datos[i]); // Convertir el dato a String y concatenarlo
                  if (i < 8) { // Añadir un espacio después de cada dato excepto el último
            datosConcatenados += " ";
               }
                  }
            
            datosConcatenados2 = datosConcatenados;

            Serial.print(datosConcatenados);
              Serial.println( );            
              digitalWrite(LED_BUILTIN, HIGH);
            digitalWrite(LED_BUILTIN, LOW);
            cont = cont + 1 ;

            if (cont == 1) {
              estado = false;
            }
            //return datosConcatenados;
          }
          u8state = 0;
          cont_u32wait = 0;
        }
        break;
    }
  }
}

void loop() {
  estado = true;
  cont = 0;
  
  if (!mensajeRecibido) { // Solo ejecutar si no se ha recibido un mensaje del nodo 1
    int packetSize = LoRa.parsePacket();
    if (packetSize){    
      String receivedP2PMessage = "";  

      while (LoRa.available()) {
          char receivedChar = (char)LoRa.read();
          receivedP2PMessage += receivedChar;
      }

      Serial.print("Paquete recibido del nodo 1");
      Serial.println(receivedP2PMessage);
      mensajenodo1 = receivedP2PMessage;
      
      mensajeRecibido = true; // Se ha recibido un mensaje del nodo 1, establece la bandera en verdadero
    }
  }
  else { // Ejecutar solo si se ha recibido un mensaje del nodo 1
    informacionextraccion();
    funcionmaster();
    BH1750.start();   // Inicia una medición de luz
    delay(1600);
    float lux = BH1750.getLux();
    delay(1000);
    int valorAnemometro = analogRead(A1);
    voltaje = valorAnemometro * (5.0 / 1023.0);
    Velocidadviento = 6*voltaje;

    Serial.print("Mensajes recibidos nodo 1: ");
    Serial.println(mensajenodo1);

    Serial.print("Lumx: ");
    Serial.println(lux);
    int chk = DHT11.read(DHT11PIN);
    Serial.print("Humidity (%): ");
    Serial.println((float)DHT11.humidity, 1);

    Serial.print("Temperature  (C): ");
    Serial.println((float)DHT11.temperature, 1);

    Serial.print("Velocidad Viento: ");
    Serial.println(Velocidadviento);

    Serial.print("Datos Medidor: ");
    Serial.println(datosConcatenados2);

    delay(2000);
    Serial.print("Sending packet: ");
    Serial.println(counter);

    LoRa.beginPacket();
    LoRa.print(mensajenodo1);
    LoRa.print(" ");
    LoRa.print(lux);
    LoRa.print(" ");
    LoRa.print((float)DHT11.temperature, 1);
    LoRa.print(" ");
    LoRa.print((float)DHT11.humidity, 1);
    LoRa.print(" ");
    LoRa.print(Velocidadviento);
    LoRa.print(" ");
    LoRa.print(datosConcatenados2);

    LoRa.endPacket();

    counter++;r
    mensajeRecibido = false;
  
    delay(4000);
  }
}