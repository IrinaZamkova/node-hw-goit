const Contact = require("./Contact");
const {
  Types: { ObjectId },
} = require("mongoose");
const Joi = require("joi");

async function getContacts(req, res) {
  const data = await Contact.find();
  res.json(data);
}

function validateContactId(req, res, next) {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(404).send("Id is not found");
  }
  next();
}

async function getContactById(req, res) {
  const { id } = req.params;
  const data = await Contact.findById(id);
  if (!data) {
    return res.status(404).send("Contact is not found");
  }
  res.json(data);
}

function validateContact(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    subscription: Joi.string(),
    password: Joi.string().required(),
  });
  const validationResult = validationRules.validate(req.body);
  if (validationResult.error) {
    return res.status(400).send("missing required name field");
  }
  next();
}

async function createContact(req, res) {
  try {
    const data = await Contact.create(req.body);
    res.json(data);
  } catch (error) {
    if (error.code === 11000) {
      res.status(400).send("Email is duplicated");
    }
  }
}

async function updateContact(req, res, next) {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(
    id,
    {
      $set: req.body,
    },
    { new: true }
  );
  if (!result) {
    return res.status(400).send("contact not found");
  }

  res.json(result);
  next();
}

function validateUpdateContact(req, res, next) {
  const validationRules = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string(),
  }).or("name", "email", "phone");

  const validationResult = validationRules.validate(req.body);

  if (validationResult.error) {
    return res.status(400).send("missing  fields");
  }
  next();
}
async function deleteContact(req, res) {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    return res.status(400).send("contact not found");
  }
  res.json(result);
}
module.exports = {
  getContacts,
  getContactById,
  validateContactId,
  createContact,
  validateContact,
  updateContact,
  validateUpdateContact,
  deleteContact,
};
