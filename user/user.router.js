const { Router } = require("express");
const userRouter = Router();
const UserController = require("./user.controller");

userRouter.post(
  "/auth/register",
  UserController.validateAutorization,
  UserController.singUp
);
userRouter.get(
  "/users/current",
  UserController.authorize,
  UserController.getCurrentUser
);
userRouter.post(
  "/auth/logout",
  UserController.authorize,
  UserController.logOut
);
userRouter.post(
  "/auth/login",
  UserController.validateAutorization,
  UserController.singIn
);

module.exports = userRouter;
