const { Router } = require("express");
const fileRouter = Router();
const { promises: fsPromises } = require("fs");
const multer = require("multer");
const path = require("path");
const express = require("express");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");

const storage = multer.diskStorage({
  destination: "public/drafts",

  filename: function (req, file, cb) {
    const ext = path.parse(file.originalname).ext;
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage: storage });

// fileRouter.use(express.static("public/images"));
fileRouter.post(
  "/images",
  upload.single("image"),
  imageMinify,
  (req, res, next) => {
    res.status(200).send(req.file);
  }
);

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
    destination: "public/images",
  };
  await fsPromises.unlink(draftImagePath);

  next();
}

module.exports = fileRouter;
