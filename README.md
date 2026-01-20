# ise_project
The project for MS2 WS2025

The project does not use a Docker-based infrastructure; therefore, the application must be started manually. Before startup, the .env file must be configured with the database connection parameters as follows:
.env should be setup as 
DB_HOST=// host
DB_USER=// database username
DB_PASSWORD=// database password
DB_NAME=// database name
DB_PORT=// database port

In the mongoDB.js file, the MongoDB connection string must be configured, for example
const url = "mongodb+srv://user:password@cluster0.5j4quiy.mongodb.net/?appName=Cluster0"

After the configuration is complete, the application can be started by executing npm start in the frontend directory and npm start in the backend directory