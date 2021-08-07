# <center>SDH-Time-Tracker</center>

------------

## <center>About</center>
This is a straigh-forward time tracker backend API meant for a single user. It is not meant for use in a production environment.

------------

## <center>Installation</center>
<center>*** Docker is required for these installation instructions.**</center>

#### <center>Database:</center>
SDH-Time-Tracker uses Postgres to store tasks.

#### <center>Environmental variables:</center>
This application uses the following environmental variables:
- **APP_PORT** - Determines which port the application will run on.
- **POSTGRES_HOSTNAME** - Hostname for Postgres connection.
- **POSTGRES_PORT** - Port under which Postgres accepts connections.
- **POSTGRES_USER** - A valid username under which the application can connect to Postgres.
- **POSTGRES_PASSWORD** - A valid password belonging to the above username.
- **POSTGRES_DATABASE** - Name of the database in which to store application data.

**The application undergoes an environmental variable check during startup, which means that if these variables are not provided, it will not start.**

Environmental variables can be passed in the command line when creating the Docker containers or inside a .env file.

#### <center>Installation process:</center>
<center>* It is assumed that environmental variables are stored inside a .env file in a config direction inside the root directory.</center>
Firstly, open the command prompt in the root directory of the application. After this is done, use one of the following commands:

<center>For development instance of the application:</center>
```shell
docker-compose -f docker-compose.yml -f docker-compose.dev.yml --env-file=./config/.env up -d
```

<center>For production instance of the application:</center>
```shell
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file=./config/.env up -d
```

Entering one of these commands into the command prompt will create Docker containers for both the application and the database.

------------

## <center>API</center>
