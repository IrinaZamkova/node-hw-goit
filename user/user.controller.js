const {
  Types: { ObjectId },
} = require("mongoose");
const Joi = require("joi");
const bcrypts = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./User");

async function getCurrentUser(req, res) {
  res.json(req.user);
}

function validateAutorization(req, res, next) {
  const validationRules = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  const validationResult = validationRules.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send("missing  fields");
  }
  next();
}

async function singUp(req, res) {
  try {
    const {
      body: { password, email },
    } = req;

    const user = await User.findOne({
      email,
    });
    if (user) {
      return res.status(401).send("Email in use");
    }
    const hashedPassword = await bcrypts.hash(password, 10);

    const data = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    return res.status(201).json(req.body);
  } catch (error) {
    return res.status(400);
  }
}

async function singIn(req, res) {
  const {
    body: { email, password },
  } = req;

  const user = await User.findOne({
    email,
  });
  if (!user) {
    return res.status(401).send("Email or password is wrong");
  }

  const passwordResult = await bcrypts.compare(password, user.password);
  if (!passwordResult) {
    return res.status(401).send("Email or password is wrong");
  }

  const token = await jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET
  );

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { token },
    { new: true }
  );

  res.status(201).send({ token });
}

async function authorize(req, res, next) {
  try {
    const authorizationHeader = req.get("Authorization");
    const token = authorizationHeader.replace("Bearer ", "");
    const { userId } = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId);
    req.user = user;

    next();
  } catch (error) {
    return res.status(403).send("Not authorized");
  }
}

async function logOut(req, res) {
  try {
    const { useriD } = req.user;
    await User.findByIdAndUpdate(useriD, { token: null });
    return res.status(204).send("No Content");
  } catch (error) {
    return res.status(404).send("Contact is not found");
  }
}

async function validateUpdateSubscription(req, res, next) {
  const validationRules = Joi.object({
    subscription: Joi.string().valid("free", "pro", "premium").required(),
  });

  const validationResult = validationRules.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send("bed request");
  }

  next();
}

async function updateSubscription(req, res) {
  try {
    const { userId } = req.user;
    await User.findByIdAndUpdate(
      userId,
      {
        $set: req.body,
      },
      {
        new: true,
      }
    );

    return res.status(200).send("subscription update");
  } catch (error) {
    return res.status(404).send("error");
  }
}
module.exports = {
  getCurrentUser,
  logOut,
  singUp,
  singIn,
  validateAutorization,
  validateUpdateSubscription,
  authorize,
  updateSubscription,
};
