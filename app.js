const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const contactRouter = require("./contact/contact.ruoter");

dotenv.config();
const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const MONGO_URL = `mongodb+srv://admin:QbbhFYg3tEoFnp7X@cluster0.tnqp4.mongodb.net/db-contacts?retryWrites=true&w=majority`;

const PORT = process.env.PORT || 3000;
let contacts;
let server;

start();
function start() {
  initServer();
  initMiddlewares();
  declareRoutes();
  connectDatabase();
  listen();
}

function initServer() {
  server = express();
}
function declareRoutes() {
  server.use("/contacts", contactRouter);
}
function initMiddlewares() {
  server.use(express.json());
}
async function connectDatabase() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connection successful");
  } catch (arror) {
    console.log(error);
    process.exit(1);
  }
}

function listen() {
  server.listen(PORT, () => {
    console.log("server is listening on port:", PORT);
  });
}
