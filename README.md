# <div align="center" name="title">SDH-Time-Tracker</div> #

------------

## <div align="center" name="contents">Table of Contents</div> ##
<div align="center">

1. [ Title ](#title)
2. [ Table of Contents ](#contents)
3. [ About ](#about)
4. [ Installation ](#installation)
  1. [ Database ](#database)
  2. [ Environmental Variables ](#variables)
  3. [ Installation Process ](#process)
5. [ API ](#api)

</div>

------------

## <div align="center" name="about"></div>About ##
This is a straigh-forward time tracker backend API meant for a single user. It is not meant for use in a production environment.

------------

## <div align="center" name="installation">Installation</div> ##

<div align="center">

**Docker is required for these installation instructions.**

</div>

### <div align="center" name="database">Database:</div> ###
SDH-Time-Tracker uses Postgres to store tasks.

### <div align="center" name="variables">Environmental Variables:</div> ###
This application uses the following environmental variables:
- **APP_PORT** - Determines which port the application will run on.
- **POSTGRES_HOSTNAME** - Hostname for Postgres connection.
- **POSTGRES_PORT** - Port under which Postgres accepts connections.
- **POSTGRES_USER** - A valid username under which the application can connect to Postgres.
- **POSTGRES_PASSWORD** - A valid password belonging to the above username.
- **POSTGRES_DATABASE** - Name of the database in which to store application data.

**The application undergoes an environmental variable check during startup, which means that if these variables are not provided, it will not start.**

Environmental variables can be passed in the command line when creating the Docker containers or inside a .env file.

### <div align="center" name="process">Installation Process:</div> ###
* It is assumed that environmental variables are stored inside a .env file in a config direction inside the root directory.
Firstly, open the command prompt in the root directory of the application. After this is done, use one of the following commands:

<div align="center">For development instance of the application:</div>

```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml --env-file=./config/.env up -d
```

<div align="center">For production instance of the application:</div>

```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file=./config/.env up -d
```

Entering one of these commands into the command prompt will create Docker containers for both the application and the database.

------------

## <div align="center" name="api">API</div> ##
