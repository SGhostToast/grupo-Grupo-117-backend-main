# Installations

Need to be installed in yarn (yarn add …) :

## For the app server : 
- **koa-logger** : middleware for the Koa framework that logs HTTP request and response details, such as the method, URL, status code, and response time, to the console or a specified output stream
- **koa-body** : middleware for the Koa framework that parses and extracts the request body data
- **koa-router** : routing middleware for the Koa framework that handles HTTP request routing and URL pattern matching
- **koa-json** : Helps displaying beautiful json objects on a web page. Helps to manually check the endpoints
- **@koa/cors** : middleware that provides Cross-Origin Resource Sharing (CORS) support. Allows acceding to the backend endpoints from the frontend

## For the database :
- **postgresql** : open-source relational database management system that provides data storage, retrieval, and advanced features for managing structured data
- **postgresql-contrib** : collection of additional extensions and plugins that enhance the functionality of PostgreSQL
- **sequelize** : ORM (Object-Relational Mapping) library for Node.js that simplifies database operations by providing an abstraction layer for interacting with SQL databases, including PostgreSQL
- **sequelize-cli** : command-line interface tool for Sequelize that provides commands to generate models, migrations, and other database-related artifacts, making it easier to work with Sequelize in a development environment
- **pg** : Node.js library that provides a PostgreSQL client for interacting with a PostgreSQL database, allowing you to execute SQL queries, manage transactions, and handle database connections

## For Swagger, the documentation : 
- **koa2-swagger-ui** :  integration between Koa and Swagger UI. It allows you to easily serve and display Swagger API documentation within the Koa application
- **yamljs** : YAML parser and serializer for JavaScript

## Other tools :
- **dotenv** :  Node.js module that loads environment variables from a .env file into process.env, making it easier to manage and configure application-specific settings such as API keys, database credentials, and other environment-dependent configurations
- **eslint** : avaScript linter that analyzes code for errors, enforces coding conventions, and helps maintain consistent code quality



# Launching the database

## Inistallation and connection to postgres

To launch the database:
```bash
>>> sudo service postgresql start
```
To connect to postgres :
```bash
>>> sudo -u <user> psql
```
By default, you can connect to the database with the user « postgres ».

You can eventually create a new superuser, you can get out of  the postgres environment and run the following command : 

```bash 
>>> sudo -u postgres createuser –superuser user_name
```

To give it a proper password, connect to the postgres environment with an initialized supersuer and run the following command : 

```bash 
postgres> ALTER USER user_name WITH PASSWORD ‘password’ ;
```

To connect to the database with the superuser : 

```bash 
>>> psql – U user_name -d db_name -h 127.0.0.1
```

## Specific configuration of the database for the project

To configure locally the database, everything is written in a .env file, having the following informations : 
- DB_USERNAME
- DB_PASSWORD
- DB_NAME
- DB_HOST

These informations will be the ones used to connect to the database.

After giving these informations, you will need to create the relative databases in postgres. You will need three of them, having the following names : 
```bash
DB_NAME + [‘_development’, ‘_test’, ‘_production’]
```

To create the databases, two ways : 
- once in the postgres environmente, run :
```bash
postgres> CREATE DATABASE db_name ; 
```
- out of the postgres environment : 
```bash
>>> sudo -u postgres createdb db_name
```

# Database model

## `Tables`

| `Name`     | `Comment`             | 
| ---------- | --------------------- | 
| User       | Users of the app                                                   | 
| Player     | Players: controlled by users, they are the ones who play           | 
| Friends    | Relation table to store the friendship between two users           | 
| Game       | Global informations of a game                                      | 
| CommonMaze | Informations of what is going on at a the current moment in a game | 
| Card       | Stores all different cards of the game                             | 



### `User`

| `Property`     | `Type`     | `Key`        | `Nullable` | `Default` | `Comment`       |
| -------------- | ---------- | ------------ | ---------- | --------- | --------------- |
| id             | integer    | Primary key  |            |           |                 |
| username       | string     | -            |            |           | `/^[a-zA-Z0-9._\-!¡?¿$&@]+$/` |
| password       | string     | -            |            |           | Confidential                  |
| mail           | string     | -            |            |           | UNIQUE                        |
| played_matches | integer    | -            |            |           | Statistics of the user                |
| won_matches    | integer    | -            |            |           | Statistics of the user                |
| max_score      | integer    | -            |            |           | Statistics of the user                |
| total_score    | integer    | -            |            |           | Statistics of the user                |
| status         | integer    | -            |            |           | 'OFFLINE', 'ONLINE', 'PLAYING'        |

### `Friends`

| `Property`     | `Type`     | `Key`        | `Nullable` | `Default` | `Comment`       |
| -------------- | ---------- | ------------ | ---------- | --------- | --------------- |
| id             | integer    | Primary key  |            |           |                 |
| frienderid     | integer    | Foreign key  |            |           | One member of the friendship |
| befriendedid   | integer    | Foreign key  |            |           | The other                    |
| status         | string     | -            |            |           | 'PENDING', 'FRENS'           |


### `Player`

| `Property`     | `Type`     | `Key`        | `Nullable` | `Default` | `Comment`       |
| -------------- | ---------- | ------------ | ---------- | --------- | --------------- |
| id             | integer    | Primary kay  |            |           |                 |
| name           | string     | -            |            |           |                 |
| userid         | integer    | Foreign key  |            |           | The user currently controlling the player |
| gameid         | integer    | Foreign key  |            |           | The game in which it currently plays      |
| score          | integer    | -            |            |           | It's curent score                         |
| insideid       | integer    | -            |            |           |                 |
| status         | string     | -            |            |           |                 |


### `Game`

| `Property`     | `Type`     | `Key`        | `Nullable` | `Default` | `Comment`       |
| -------------- | ---------- | ------------ | ---------- | --------- | --------------- |
| id             | integer    | Primary key  |            |           |                 |
| clockwise      | boolean    | -            |            |           | To know who plays next  |
| turns          | integer    | -            |            |           | Number of turns         |
| winner         | string     | -            |            |           | Only at the end         |
| date           | dateonly   | -            |            |           | Date of creation        |


### `CommonMaze`

| `Property`| `Type`     | `Key`        | `Nullable` | `Default` | `Comment`       |
| --------- | ---------- | ------------ | ---------- | --------- | --------------- |
| id        | integer    | Primary key  |            |           |                 |
| gameid    | integer    | Foreign key  |            |           | The game in play                |
| cardid    | integer    | Foreign key  |            |           | The card on the table           |
| holderid  | integer    | -            |            |           | The player who can play         |
| order     | integer    | -            |            |           |                                 |


### `Card`

| `Property`| `Type`     | `Key`        | `Nullable` | `Default` | `Comment`       |
| --------- | ---------- | ------------ | ---------- | --------- | --------------- |
| id        | string     | Primary key  |            |           |                 |
| color     | string     | -            |            |           |                 |
| symbol    | string     | -            |            |           |                 |


# Documentation with Swagger

The documentation of the API is disponible on the endpoint "swagger/".

Swagger is a tool that helps you visualize and test the design of a web app. In this page, you will be able to see the implemented models and the different endpoints. 
You can see with what type of verb (GET, POST) the endpoint works. 
You can also see the parameters and the output of the request.
Finally, Swagger allows you to test all of this by giving it your own input.

Here are two examples of endpoints you can visit. 

## List of users

Working with the GET verb, the list of users is disponible on /users. 

Swagger will tell you the following : 
- Parameters : No parameters 
- Responses : 
    * 400 : Bad Request
    * 200, Successful response. Example value : 
```json
[
  {
    "username": "username",
    "password": "user_password",
    "mail": "user@example.com",
    "played_matches": 0,
    "won_matches": 0,
    "max_score": 0,
    "total_score": 0,
    "status": "OFFLINE"
  }
] 
```

## Login

Working with the POST verb, the login of user is disponible on /users/login. 

Swagger will tell you the following : 
- Parameters : 

| `Name`    | `Description`| 
| --------- | ---------- | 
| username  _string_        | username     |
| mail  _string_            | user@example.com     | 
| password<sup><span style="color:red;">* required</span></sup>  _string_    | user_password     | 

- Responses : 
    * 400: Either the username/mail does not exist or the password does not correspond.
    * 200, Your are logged as user ! Example Value :
```json
  {
    "username": "username",
    "password": "user_password",
    "mail": "user@example.com",
    "played_matches": 0,
    "won_matches": 0,
    "max_score": 0,
    "total_score": 0,
    "status": "OFFLINE"
  }
```


# Launching the project

Finally, to launch the app, use :
```bash
>>> yarn dev
```