# UBU-ContractMe

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
2. Crear una cuenta en MetaMask y importar las cuentas de ganache.
3. Con truffle desplegar el contrato y actualizar web3.js con la nueva dirección del contrato. "truffle migrate"
4. Sustituir el archivo MyContract.json de la carpeta AppContract/ether por el nuevo archivo MyContract.json que se ha generado al desplegar el contrato, ubicado en SmartContract/build.
5. Iniciar la aplicación con expo. "npx expo start"

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
