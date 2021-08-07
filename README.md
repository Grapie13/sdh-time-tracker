# <p align="center">SDH-Time-Tracker</p>

------------

## <p align="center"></p>About
This is a straigh-forward time tracker backend API meant for a single user. It is not meant for use in a production environment.

------------

## <p align="center">Installation</p>

<div align="center">

**Docker is required for these installation instructions.**

</div>

### <p align="center">Database:</p>
SDH-Time-Tracker uses Postgres to store tasks.

### <p align="center">Environmental variables:</p>
This application uses the following environmental variables:
- **APP_PORT** - Determines which port the application will run on.
- **POSTGRES_HOSTNAME** - Hostname for Postgres connection.
- **POSTGRES_PORT** - Port under which Postgres accepts connections.
- **POSTGRES_USER** - A valid username under which the application can connect to Postgres.
- **POSTGRES_PASSWORD** - A valid password belonging to the above username.
- **POSTGRES_DATABASE** - Name of the database in which to store application data.

**The application undergoes an environmental variable check during startup, which means that if these variables are not provided, it will not start.**

Environmental variables can be passed in the command line when creating the Docker containers or inside a .env file.

### <p align="center">Installation process:</p>
* It is assumed that environmental variables are stored inside a .env file in a config direction inside the root directory.
Firstly, open the command prompt in the root directory of the application. After this is done, use one of the following commands:

<p align="center">For development instance of the application:</p>

```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml --env-file=./config/.env up -d
```

<p align="center">For production instance of the application:</p>

```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file=./config/.env up -d
```

Entering one of these commands into the command prompt will create Docker containers for both the application and the database.

------------

## <p align="center">API</p>
