<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

API Gateway para Douremember. Este servicio actúa como punto de entrada único para todas las peticiones HTTP del sistema, enrutando las solicitudes a los microservicios correspondientes a través de NATS.

## Características

- 🚪 Gateway REST API para todos los microservicios
- 🔌 Comunicación con microservicios mediante NATS
- 🛡️ Manejo centralizado de excepciones
- ✅ Validación de datos con class-validator
- 📤 Carga de archivos (imágenes)
- 🔄 Enrutamiento a: usuarios-autenticacion-ms, descripciones-imagenes-ms, alertas-reportes-ms

## Variables de Entorno

Crea un archivo `.env` basado en `.env.template`:

```bash
PORT=3000

# NATS Configuration
NATS_SERVERS=nats://localhost:4222
```

## Requisitos Previos

### Servidor NATS

Es **importante** tener un servidor NATS corriendo en Docker:

```bash
docker run -d --name nats-main -p 4222:4222 -p 8222:8222 nats
```

Este comando levanta un contenedor NATS que expone:
- Puerto `4222`: Para conexiones de clientes
- Puerto `8222`: Para monitoreo HTTP

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
$ npm run start:dev
```

## Estructura del Proyecto

```
src/
├── usuarios-autenticacion/
│   ├── dto/                    # DTOs de autenticación y usuarios
│   └── usuarios-autenticacion.controller.ts
├── descripciones-imagenes/
│   ├── dto/                    # DTOs de imágenes y descripciones
│   └── descripciones-imagenes.controller.ts
├── alertas-reportes/
│   ├── dto/                    # DTOs de alertas y reportes
│   └── alertas-reportes.controller.ts
├── health-check/
│   └── health-check.controller.ts  # Endpoint de salud
├── common/
│   ├── exceptions/             # Filtros de excepciones RPC
│   └── pipes/                  # Pipes de validación
├── config/
│   └── envs.ts                 # Configuración de variables de entorno
└── transports/
    └── nats.module.ts          # Configuración de NATS
```
