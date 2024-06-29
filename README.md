# UBU-ContractMe

<<<<<<< HEAD
## Descripción

UBU-ContractMe es una aplicación innovadora que se enfoca en la creación de una solución innovadora para la contratación laboral,aprovechando la tecnología blockchain y los contratos inteligentes. 
Se busca agilizar el proceso de contratación en sectores como la agricultura y servicios domésticos mediante la automatización de la gestión de contratos desde su inició hasta su final. 

El proyecto incorpora métodos de autenticación biométrica y escaneo de códigos QR, apoyándose en soluciones de identidad
descentralizadas para proteger la privacidad de los usuarios. El objetivo final es proporcionar una herramienta que promueva
prácticas de empleo transparentes y legales, optimizando los procesos de contratación y verificación para empleadores y trabajadores
garantizando la seguridad de todos los trámites.


## Requisitos

- Node.js: Asegúrate de tener Node.js instalado en tu sistema.
- Truffle: Herramienta necesaria para el despliegue de contratos inteligentes.
- Ganache: Herramienta necesaria para la simulación de la blockchain.
- Expo: Necesario para el despliegue de la aplicación móvil.

## Instalación

- Clonar el repositorio: `git clone https://gitlab.com/HP-SCDS/Observatorio/2023-2024/contractme/ubu-contractme.git`.
- Instalar `Expo: npm install -g expo-cli`.
- Instalar Ganache: `npm install -g ganache-cli`.
- Instalar dependencias: 
    1. Ir al directorio: ubu-contractme\Code\AppContractMe.
    2. Ejecutar `npx expo install`.
- Instalar la aplicación Expo Go en un móvil android.

## Inicialización

- Configurar proveedor: 
    1. Ir al archivo: ubu-contractme\Code\AppContractMe\src\ContractConexion\EtherProvider.js.
    2. Sustituir la variable _Url_ por la IP de tu ordenador.
- Iniciar Ganache: 
    1. ir al directorio: ubu-contractme\Code.
    2. ejecutar `ganache-cli --host sustituir_tu_ip -d --db ganache_db`.
- Desplegar aplicación:
    1. Ir al directorio: ubu-contractme\Code\AppContractMe.
    2. Ejecutar `npx expo start`.
    3. Asegurar que el modo activo es 'Expo Go' y no 'development build'.
    4. Escanear el código QR desde la aplicación móvil Expo Go.

## Contacto

Email [dmb1004@alu.ubu.es](mailto:dbm1004@alu.ubu.es)

## Autores y agradecimientos

En colaboración con la [Universidad de Burgos](https://www.ubu.es/) y [HP SCDS](https://hpscds.com/innovacion/observatorio-tecnologico/)

## Licencia

Este proyecto esta bajo la [Licencia MIT](https://gitlab.com/HP-SCDS/Observatorio/2023-2024/contractme/ubu-contractme/-/blob/main/LICENSE)

=======
## Description

UBU-ContractMe es una aplicación innovadora basada en blockchain que simplifica el proceso de contratación y verificación. Utilizando contratos inteligentes, seguimiento por GPS y autenticación segura a través de smartphones, esta aplicación está diseñada para brindar una solución eficiente y segura en el ámbito de los contratos digitales.

## Visuals

Implementación visual en desarrollo.

## Requisites

- Node.js: Asegúrate de tener Node.js instalado en tu sistema.
- Truffle: Herramienta necesaria para el despliegue de contratos inteligentes.
- Ganache: Herramienta necesaria para la simulación de la blockChain
- Expo: Para la gestión de la aplicación móvil.
- MetaMask: Wallet necesaría para la interacción con la blockChain.

## Installation

Clonar el repositorio:
`git clone https://gitlab.com/HP-SCDS/Observatorio/2023-2024/contractme/ubu-contractme.git`

Instalar dependencias de React y Expo:
```
npm install expo-local-authentication
npm install @react-navigation/native
npm install @react-navigation/bottom-tabs
npm install @react-navigation/native-stack
npm install @react-navigation/drawer
npm install @react-navigation/material-top-tabs
npm install react-native-tab-view
npm install react-native-collapsible
npm install react-native-chart-kit
npm install @babel/plugin-transform-private-methods
npm install web3
npm install ethers
npm install @walletconnect/react-native-dapp
npm install @metamask/sdk

npx expo install react-native-svg
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-gesture-handler
npx expo install react-native-reanimated
npx expo install expo-system-ui
npx expo install expo-crypto @metamask/sdk-react ethers@5.7.2 @react-native-async-storage/async-storage node-libs-expo react-native-background-timer react-native-randombytes react-native-url-polyfill react-native-get-random-values@1.8.0
```

Instalar dependencias ERC721:
`npm install @openzeppelin/contracts`

## Initialization

1. Iniciar ganacle-cli con la ip de tu ordenador, y actualizar web3.js con dicha dirección. "ganache --host 192.168.1.33"
2. Crear una cuenta en MetaMask y añadir una nueva red con la nueva dirección del RPC. "http://192.168.1.33:8545"
3. Añadir una billetera desde la sección "importar cuenta" a través de la clave privada proporcionada en ganache.
4. Con truffle desplegar el contrato y actualizar web3.js con la nueva dirección del contrato. "truffle migrate"
5. Sustituir el archivo MyContract.json de la carpeta AppContract/ether por el nuevo archivo MyContract.json que se ha generado al desplegar el contrato, ubicado en SmartContract/build.
6. Iniciar la aplicación con expo. "npx expo start"

## Usage

Sin datos hasta la implementación final.

## Contact

Email [dmb1004@alu.ubu.es](mailto:dbm1004@alu.ubu.es)

## Authors and acknowledgment

En colaboración con la [Universidad de Burgos](https://www.ubu.es/) y [HP SCDS](https://hpscds.com/innovacion/observatorio-tecnologico/)

## License

Este proyecto esta bajo la [Licencia MIT](https://gitlab.com/HP-SCDS/Observatorio/2023-2024/contractme/ubu-contractme/-/blob/main/LICENSE)

## Project status

UBU-ContractMe está actualmente en desarrollo activo. Se publicarán actualizaciones y nuevas versiones periódicamente.
>>>>>>> develop
