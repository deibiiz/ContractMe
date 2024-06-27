# UBU-ContractMe

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

## Contact

Email [dmb1004@alu.ubu.es](mailto:dbm1004@alu.ubu.es)

## Authors and acknowledgment

En colaboración con la [Universidad de Burgos](https://www.ubu.es/) y [HP SCDS](https://hpscds.com/innovacion/observatorio-tecnologico/)

## License

Este proyecto esta bajo la [Licencia MIT](https://gitlab.com/HP-SCDS/Observatorio/2023-2024/contractme/ubu-contractme/-/blob/main/LICENSE)

