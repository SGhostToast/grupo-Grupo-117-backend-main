# Web_backend

## Installations

Need to be installed in yarn (yarn add …) :

### For the app server : 
- **koa-logger** : middleware for the Koa framework that logs HTTP request and response details, such as the method, URL, status code, and response time, to the console or a specified output stream
- **koa-body** : middleware for the Koa framework that parses and extracts the request body data
- **koa-router** : routing middleware for the Koa framework that handles HTTP request routing and URL pattern matching

### For the database :
- **postgresql** : open-source relational database management system that provides data storage, retrieval, and advanced features for managing structured data
- **postgresql-contrib** : collection of additional extensions and plugins that enhance the functionality of PostgreSQL
- **sequelize** : ORM (Object-Relational Mapping) library for Node.js that simplifies database operations by providing an abstraction layer for interacting with SQL databases, including PostgreSQL
- **sequelize-cli** : command-line interface tool for Sequelize that provides commands to generate models, migrations, and other database-related artifacts, making it easier to work with Sequelize in a development environment
- **pg** : Node.js library that provides a PostgreSQL client for interacting with a PostgreSQL database, allowing you to execute SQL queries, manage transactions, and handle database connections

### For Swagger, the documentation : 
- **koa2-swagger-ui** :  integration between Koa and Swagger UI. It allows you to easily serve and display Swagger API documentation within the Koa application
- **yamljs** : YAML parser and serializer for JavaScript

Other tools :
- **dotenv** :  Node.js module that loads environment variables from a .env file into process.env, making it easier to manage and configure application-specific settings such as API keys, database credentials, and other environment-dependent configurations
- **koa-json** : Helps displaying beautiful json objects on a web page. Helps to manually check the endpoints



## Launching the database

### Inistallation and connection to postgres

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

### Configuration for the project

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


## Launching the project

Finally, to launch the app, use :
```bash
>>> yarn dev
```
