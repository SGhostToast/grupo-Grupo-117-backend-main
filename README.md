# Web_backend

Se ne cesita anadir a yarn : 
- koa-logger 
- koa-body 
- koa-router
- postgresql 
- postgresql-contrib
- sequelize
- sequelize-cli
- pg : postgre
- dotenv : variables de entorno que son globales pero que no subimos

Para empezar la db:
- sudo service postgresql start
Para conectar a la db:
- sudo -u postgres psql

Para configurar localmente : 
En el archivo .env, anadir DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOTS