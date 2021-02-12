const { Router } = require("express");
const router = Router();
const ContactController = require("./contact.controller");

router.get("/", ContactController.getContacts);

router.get(
  "/:id",
  ContactController.validateContactId,
  ContactController.getContactById
);

router.post(
  "/",
  ContactController.validateContact,
  ContactController.createContact
);
router.delete(
  "/:id",
  ContactController.validateContactId,
  ContactController.deleteContact
);
router.put(
  "/:id",
  ContactController.validateUpdateContact,
  ContactController.validateContactId,
  ContactController.updateContact
);

module.exports = router;
