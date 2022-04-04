# Mini estação meteorológica
## O que é?

Você já se deparou com aqueles noites que aparentam estar mais frias ou quentes do que constam nos aplicativos de monitoramento de temperatura?

Eu sempre quis saber a real temperatura da minha rua/bairro. Pensando nisso, criei a MEM (Mini estação meteorológica), uma solução simples para essa dúvida, tão simples que você também pode executar na sua casa.

![image](https://user-images.githubusercontent.com/20456307/161154661-d00180cd-a9b3-44ff-a9f8-1f31a6b6e36b.png)

## O que é preciso?

- Arduino
- Shield Ethernet
- Sensor de temperatura


No projeto, foram usados: 

- Arduino UNO
- Sensor BMP180
- Shield Ethernet w5100

Também foi usado para teste o sensor de temperatura `ds18b20`. Que por sinal, mostrou maior precisão que o `BMP180`.

Qualquer modelo de arduino, ethernet shield e sensor funcionará no projeto, é necessário apenas que a estação responda ao request do server com um `JSON` com o seguinte formato:

```JSON
{
  "data": {
    "altitude": 879.00,
    "pressure": 928.00,
    "temperature": 23.00
  },
  "firmwareVersion":"1.0.0.0"
}
```


## Começando a usar
Para começar a usar, basta inserir o endereço da sua estação em `middlewares/dataFetching.js`

```javascript
const API_URL = 'ENDEREÇO_DA_SUA_ESTAÇÃO';
```

Aqui está o código do arduino, este código foi feito para o sensor `BMP180`
```C
#include <SPI.h>
#include <Ethernet.h>
#include <Adafruit_BMP085.h>

#define FIRMWARE_VERSION "1.0.0.0"

Adafruit_BMP085 bmp;

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };
byte ip[] = { 192, 168, 0, 175 };
byte gateway[] = {192, 168, 0, 1};
byte subnet[] = {255, 255, 255, 0};

EthernetServer server(80);

String readString = String(30);

void setup(){
  Ethernet.begin(mac, ip, gateway, subnet);
  server.begin();
  bmp.begin();
}

float getAltitude(){
  return bmp.readAltitude();
}

float getPressure(){
  return bmp.readPressure() / 100;
}

float getTemperature(){
  return bmp.readTemperature();
}

bool sensorIsWorking(){
 return bmp.begin();
}

void loop(){
EthernetClient client = server.available();
  if (client) {
    while (client.connected()) {
      if (client.available()) {
        char c = client.read(); 
        if (readString.length() < 50) { readString += c; } 
        if (c == '\n') { 
          client.println("HTTP/1.1 200 OK"); 
          client.println("Content-Type: application/json; charset=utf-8"); 
          client.println("Server: MEM");
          client.println();
          if(sensorIsWorking()){
            client.println("{");
            client.println("  \"data\": {");
            client.print("    \"altitude\": ");
            client.print(getAltitude());
            client.println(",");
            client.print("    \"pressure\": ");
            client.print(getPressure());
            client.println(",");
            client.print("    \"temperature\": ");
            client.println(getTemperature());
            client.println("  },");
            client.print("  \"firmwareVersion\":");
            client.println("\""FIRMWARE_VERSION"\"");
            client.print("}");
          }else{
            client.println("Sensor fail");
          }
          delay(1);
          client.stop();
          readString="";
        } 
      }
    }
  }
}
```

