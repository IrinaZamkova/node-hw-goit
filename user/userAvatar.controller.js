const Avatar = require("avatar-builder");
const fs = require("fs");
const { Router } = require("express");
const userAvatarRouter = Router();
const { promises: fsPromises } = require("fs");
const multer = require("multer");
const path = require("path");
const express = require("express");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

const avatar = Avatar.builder(
  Avatar.Image.margin(
    Avatar.Image.roundedRectMask(
      Avatar.Image.compose(
        Avatar.Image.randomFillStyle(),
        Avatar.Image.shadow(Avatar.Image.margin(Avatar.Image.cat(), 8), {
          blur: 5,
          offsetX: 2.5,
          offsetY: -2.5,
          color: "rgba(0,0,0,0.75)",
        })
      ),
      32
    ),
    8
  ),
  128,
  128
);

async function createAvatar(req, res, next) {
  try {
    const avatarName = req.body.email;
    const buffer = await avatar.create(avatarName);
    const avatarPath = `public/images/${avatarName}.png`;
    fs.writeFileSync(avatarPath, buffer);

    req.body = {
      ...req.body,
      avatarUrl: avatarPath,
    };

    next();
  } catch (err) {
    next(err);
  }
}

const storage = multer.diskStorage({
  destination: "public/drafts",

  filename: function (req, file, cb) {
    const ext = path.parse(file.originalname).ext;
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

async function imageMinify(req, res, next) {
  const draftImagePath = req.file.path;

  await imagemin([draftImagePath.replace(/\\/g, "/")], {
    destination: "public/images",
    plugins: [
      imageminJpegtran(),
      imageminPngquant({
        quality: [0.6, 0.8],
      }),
    ],
  });
  const { filename } = req.file;
  req.file = {
    ...req.file,
    path: path.join("public/images", filename),
    avatarURL: path.join("public/images", filename).replace(/\\/g, "/"),
    destination: "public/images",
  };

  await fsPromises.unlink(draftImagePath);

  res.status(200).send(`avatarURL : ${req.file.avatarURL}`);
  next();
}

module.exports = {
  createAvatar,
  imageMinify,
  upload,
};
