# <div align="center" name="title">SDH-Time-Tracker</div> #

## <div align="center" name="contents">Table of Contents</div> ##

1. [ Title ](#title)
2. [ Table of Contents ](#contents)
3. [ About ](#about)
4. [ Installation ](#installation)
     1. [ Database ](#database)
     2. [ Environmental Variables ](#variables)
     3. [ Installation Process ](#process)
5. [ API ](#api)
     1. [ Get All Tasks ](#all-tasks)
     2. [ Get Task By ID ](#task-by-id)
     3. [ Get Tracked Task ](#tracked-task)
     4. [ Create Task ](#create-task)
     5. [ Update Task ](#update-task)
     6. [ Delete Task ](#delete-task)
6. [ Testing ](#testing)
7. [ Concerns and Expansion Possibilities ](#concerns)
8. [ License ](#license)

## <div align="center" name="about"></div>About ##
This is a straigh-forward time tracker backend API meant for a single user. It is able to create, update, delete and fetch tasks defined by the user.
As it is a time tracking application, it also keeps the task's creation time, when it was started, and the finish time.

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
**It is assumed that environmental variables are stored inside a .env file in a config direction inside the root directory.**

Firstly, open the command prompt in the root directory of the application. After this is done, use one of the following commands:

<div align="center">For development instance of the application:</div>

```
docker-compose -f docker-compose.yml -f docker-compose.dev.yml --env-file=./config/dev.env up -d
```

<div align="center">For test instance of the application:</div>

```
docker-compose -f docker-compose.yml -f docker-compose.test.yml --env-file=./config/test.env up -d
```

<div align="center">For production instance of the application:</div>

```
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file=./config/.env up -d
```

Entering one of these commands into the command prompt will create Docker containers for both the application and the database.

## <div align="center" name="api">API</div> ##

<div align="center">Endpoints work only with JSON data. The application uses ISO strings to work with dates.</div>

### <div align="center" name="all-tasks">Get All Tasks</div>
Returns a list of all tasks.

- **URL**: ``/v1/tasks``
- **Method**: `GET`
- **Request Body**: None.
- **Success Response**:
    - **Code**: 200

      **Example Response**: 

```
    {
        "tasks": [
            {
                "id": 1,
                "name": "take out trash",
                "tracked": false,
                "createdAt": "2021-08-07T22:56:21.243Z",
                "startedAt": null,
                "finishedAt": null
            }
        ]
    }
```

- **Error Response**: None.

------

### <div align="center" name="task-by-id">Get Task By ID</div>
Returns a task by its ID.

- **URL**: ``/v1/tasks/:id``
- **Method**: `GET`
- **Request Body**: None.
- **Success Response**:
    - **Code**: 200

      **Example Response**: 

```
    {
        "tasks": [
            {
                "id": 1,
                "name": "take out trash",
                "tracked": false,
                "createdAt": "2021-08-07T22:56:21.243Z",
                "startedAt": null,
                "finishedAt": null
            }
        ]
    }
```

- **Error Response**:
    - **Code**: 404 Not Found

      **Example Response**:

```
    {
        "statusCode": 404,
        "message": "Task not found"
    }
```

------

### <div align="center" name="tracked-task">Get Tracked Task</div>
Returns a currently tracked task.

- **URL**: ``/v1/tasks/current``
- **Method**: `GET`
- **Request Body**: None.
- **Success Response**:
    - **Code**: 200

      **Example Response**: 

```
    {
        "task": {
            "id": 1,
            "name": "pet THE cat",
            "tracked": true,
            "createdAt": "2021-08-07T22:56:21.243Z",
            "startedAt": "2021-08-07T23:09:30.679Z",
            "finishedAt": null
        }
    }
```

- **Error Response**:
    - **Code**: 404 Not Found

      **Example Response**:

```
    {
        "statusCode": 404,
        "message": "Task not found"
    }
```

------

### <div align="center" name="create-task">Create Task</div>
Creates a new task.

- **URL**: ``/v1/tasks``
- **Method**: `POST`
- **Request Body**:
    - **Parameters**:

        `name` - sets a taks's name (required)
        
        `tracked` - sets whether a task is tracked (optional)
- **Success Response**:
    - **Code**: 201

      **Example Response**: 

```
    {
        "task": {
            "name": "Take out trash",
            "startedAt": null,
            "finishedAt": null,
            "id": 2,
            "tracked": false,
            "createdAt": "2021-08-07T22:56:21.243Z"
        }
    }
```

- **Error Response**:
    - **Code**: 400

      **Example Response**:

```
    {
        "statusCode": 400,
        "message": "\"name\" must be a string"
    }
```

------

### <div align="center" name="update-task">Update Task</div>
Updates an existing task.

- **URL**: ``/v1/tasks/:id``
- **Method**: `PATCH`
- **Request Body**:
    - **Parameters**:

        `name` - updates a taks's name (optional)
        
        `tracked` - updates whether a task is tracked (optional)
- **Success Response**:
    - **Code**: 200

      **Example Response**: 

```
    {
        "task": {
            "id": 1,
            "name": "pet the cat",
            "tracked": "true",
            "createdAt": "2021-08-08T10:31:00.921Z",
            "startedAt": "2021-08-08T10:32:04.564Z",
            "finishedAt": null
        }
    }
```

- **Error Response**:
    - **Code**: 404

      **Example Response**:

```
    {
        "statusCode": 404,
        "message": "Task not found"
    }
```

- **Code**: 400

    **Example Response**:

```
    {
        "statusCode": 400,
        "message": "\"name\" must be a string"
    }
```

------

### <div align="center" name="delete-task">Delete Task</div>
Deletes an existing task.

- **URL**: ``/v1/tasks/:id``
- **Method**: `DELETE`
- **Request Body**: None.
- **Success Response**:
    - **Code**: 200

      **Example Response**: 

```
    {
        "message": "Task deleted successfully"
    }
```

- **Error Response**:
    - **Code**: 404
    - 
      **Example Response**:

```
    {
        "statusCode": 404,
        "message": "Task not found"
    }
```

## <div align="center" name="testing">Testing</div>
This application contains integration and unit tests. Every test is passing, which is additionally ensured by GitHub workflow.

To run tests yourself use one of the following commands in the root directory of the application:
<div align="center">Unit tests:</div>

```
npm run test
```

<div align="center">Integration tests (to run integration tests, you need to create application and database containers):</div>

```
npm run test:e2e
```

<div align="center">Unit test coverage:</div>

```
npm run test:cov
```

<div align="center">Screenshot of coverage tests ran by me:</div>

![Test coverage](https://i.imgur.com/jpab0LE.png "Test coverage")

## <div align="center" name="concerns">Concerns and Expansion Possibilities</div>
During the development of this application arose a few concerns and possibilities to expand the application.

Concerns:
- I was unable to create migrations for TypeORM inside NestJS
- Database container does not contain any volume, which means it's not persistent and any restart will erase saved data
- The application does not have any form of authentication, which means anyone can access tasks
- There are probably better ways to check whether a task exists or not (using pipes), but I'm not proficient enough with Nest to implement them

Expansion Possibilities:
- Authentication should be implemented
- Implementing authentication would make it possible to make the application multi-user
- There could be some sort of caching inserted to lessen response times
- Sorting could improve the accessability
- Paging could improve readability

## <div align="center" name="license">License</div>

Copyright 2021 Gracjan Pietruszyński

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.