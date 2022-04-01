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

Qualquer modelo de arduino e sensor funcionará no projeto, sendo necessario ser feito apenas algumas alterações


## Começando a usar
Para começar a usar, basta inserir o endereço da sua estação em `middlewares/dataFetching.js`

```javascript
const API_URL = 'ENDEREÇO_DA_SUA_ESTAÇÃO';
```

