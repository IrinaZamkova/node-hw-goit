const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const contactRouter = require("./contact/contact.router");
const userRouter = require("./user/user.router");

dotenv.config();

const DB_NAME = process.env.DB_NAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const MONGO_URL = `mongodb+srv://admin:${DB_PASSWORD}@cluster0.tnqp4.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

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
  server.use("/", userRouter);
}
function initMiddlewares() {
  server.use(express.json());
}
async function connectDatabase() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log("Database connection successful");
  } catch (arror) {
    process.exit(1);
  }
}

function listen() {
  server.listen(PORT, () => {
    console.log("server is listening on port:", PORT);
  });
}
