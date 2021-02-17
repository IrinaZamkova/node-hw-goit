const { Router } = require("express");
const userRouter = Router();
const UserController = require("./user.controller");
const UserAvatarController = require("./userAvatar.controller");
const multer = require("multer");

userRouter.post(
  "/auth/register",
  UserController.validateAutorization,
  UserAvatarController.createAvatar,
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
userRouter.patch(
  "/users",
  UserController.authorize,
  UserController.validateUpdateSubscription,
  UserController.updateSubscription
);
userRouter.patch(
  "/users/avatars",
  UserController.authorize,
  UserAvatarController.upload.single("avatar"),
  UserAvatarController.imageMinify
);

module.exports = userRouter;
