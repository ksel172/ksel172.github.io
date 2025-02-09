---
layout: post
title: Meduza v0.3 Demo
author: ksel172, dumbldoor, mochi
category: Software Development
tags:
  - Golang
  - MeduzaC2
  - Meduza
  - CommandAndControl
  - ReactJS
  - Typescript
  - Demo
  - WIP
---

## Project Background

### Description

Meduza C2 is modularity focused, collaborative Command and Control framework coded in Golang (server), C# (agent) and ReactJS (client). The project has been in development for a relatively short time and the initial goal was to rewrite an older C2 project made by ksel172 in C# and Blazor. 

### Features

The project consists of 3 main components and is aiming to the implementation of the following features:
	- Containerized and easy to deploy framework with lots of customizability.
	- Multiplayer command and control with teams and roles for users.
	- Payload compilation using the dotnet framework.
	- Dynamic module loading for agents with dependency resolution and quick development using the ModuleBase Nuget package - https://github.com/ksel172/Meduza.Agent.ModuleBase.
	- Different listener types including support for external listener implementation.
	- Support for external agents.
	- Intuitive and easy to navigate user interface coded in ReactJS.
	- Integrated MITRE graph providing easily accessible adversary tactics and techniques.
	- Multi-platform support for usage across different operating systems.
	- Encrypted communication using AES 256 bit with message integrity verification and TLS/SSL support.

## Demo


> [!NOTE] Note
> The functionality will be previewed using postman to contact the teamserver API due to the client-server communication not being entirely finished in this milestone (v0.3).

### Startup

Requirements:
- Docker
- .NET 8 Runtime
- npm
#### Starting the Server

The server docker compose currently features four containers and a volume:
 - teamserver - Main server docker container.
 - postgres - Database.
 - redis - Used for caching and pubsub functionality.
 - pgadmin - Used for querying and database management.

The server can be ran using a docker command with a `.env` file containing the server configuration:

```shell
docker compose --env-file .env.dev up --force-recreate --build
```
![running the docker compose command](/assets/img/blogs/2025-2-9-meduza-version-0.3-demo/teamserver-build.png)


Currently the following arguments can be configured in the server `.env` file:

``` shell
# teamserver conf
TEAMSERVER_HOSTNAME=teamserver
TEAMSERVER_PORT=8080

# Possible values: dev || debug
TEAMSERVER_MODE=dev

# golang debug
DLV_PORT=2345

# listener exposed port range
LISTENER_PORT_RANGE_START=8000
LISTENER_PORT_RANGE_END=8010

# postgres
POSTGRES_HOST=meduza-db
POSTGRES_PORT=5432
POSTGRES_NAME=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_USER=postgres
POSTGRES_DB=meduza-db
POSTGRES_SCHEMA=meduza_schema

# redis
REDIS_HOST=meduza-redis
REDIS_PORT=6379
REDIS_PASSWORD=redis

# pgadmin
PGADMIN_DEFAULT_EMAIL=admin@meduza.dev
PGADMIN_DEFAULT_PASSWORD=10tacles

# jwt secret
JWT_SECRET=<some_secret>

# refresh token cookie 
COOKIE_PATH=/

COOKIE_DOMAIN=localhost 

REFRESH_SECURE=false

REFRESH_HTTP=true

MODULE_UPLOAD_PATH=./teamserver/modules
```
#### Starting the Client

Navigate to the client folder and run:

```shell
npm run dev
#or
yarn dev
#or
pnpm dev
#or
bun dev
```

#### Running an Agent

After a payload is compiled (as will be shown in Usage) the executable can be downloaded and transported to the target or it can be used in combination with a loader to stage the payload. After it is executed, an agent is registered along with agent_info, agent_config (inheriting the payload_config) and agent_task.

### Usage

#### Authenticating as a User

In the image below, I authenticate as the default admin user `Meduza:Meduza`, and obtain the auth token which I set across my postman requests as the Bearer.
![authentication using the default admin](/assets/img/blogs/2025-2-9-meduza-version-0.3-demo/teamserver-auth.png)

The user interface (already functional sign-in during v0.3):
![authentication user interface](/assets/img/blogs/2025-2-9-meduza-version-0.3-demo/auth-ui.png)
#### Starting a Listener

To start a listener, we first need to create it. Based on the listener type we get a different configuration options for listener-agent communication. In this case, v0.3 only supports http listeners. However, the logic has been written for resolving other listener types and will be completed in the next version.

Below I created an http listener with a basic configuration:
![creation of an http listener](/assets/img/blogs/2025-2-9-meduza-version-0.3-demo/listener-create.png)

After creating the listener, we can get its ID and start it:
![get listeners](/assets/img/blogs/2025-2-9-meduza-version-0.3-demo/get-listeners.png)

![starting a listener](/assets/img/blogs/2025-2-9-meduza-version-0.3-demo/start-listener.png)
Which looks like this in the server log:
![logger showing listener starting](/assets/img/blogs/2025-2-9-meduza-version-0.3-demo/listener-start-cli.png)

Listener creation also works in the user interface in v0.3:
![listener creation user interface](/assets/img/blogs/2025-2-9-meduza-version-0.3-demo/listener-ui.png)
#### Running Shell Commands

#### Uploading Modules

#### Running Module Commands



## Module Development