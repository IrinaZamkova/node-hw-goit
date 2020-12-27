const contacts = require("../models/contacts.json");
const Joi = require("joi");


class ContactController {
  listContacts(req, res) {
    res.json(contacts);
  }

  getById = (req, res) => {
    const {
      params: { id },
    } = req;
    const contactIndex = this.getContactIndex(id);
    return res.status(200).send(contacts[contactIndex]);
  }

  addContact(req, res, next) {
    const { body } = req;
    const newContacts = {
      id: contacts.length + 1,
      ...body,
    };
    contacts.push(newContacts);
    return res.status(201).send(newContacts);
  }

  validateContact(req, res, next) {
    const validationRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });
    const validationResult = validationRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send("missing required name field");
    }
    next();
  }

  updateContact = (req, res, next) => {
    const { id } = req.params;
    const contactIndex = this.getContactIndex(id);
    const updateContact = {
      ...contacts[contactIndex],
      ...req.body,
    };
    contacts[contactIndex] = updateContact;

    res.status(200).send(updateContact);
  }

  validateUpdateContact(req, res, next) {
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

  deleteContact = (req, res) => {
    const { id } = req.params;
    const contactIndex = this.getContactIndex(id);
    contacts.splice(contactIndex, 1);
    res.status(200).send("contact deleted");
  }

  getContactIndex(id) {
    const contactId = parseInt(id);
    return contacts.findIndex(({ id }) => id === contactId);
  }

  validateContactId = (req, res, next) => {
    const { id } = req.params;
    const contactIndex = this.getContactIndex(id);

    if (contactIndex === -1) {
      return res.status(404).send("contact not found");
    }
    next();
  }
}

module.exports = new ContactController();
