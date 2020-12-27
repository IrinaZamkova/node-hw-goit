const { Router } = require("express");
const ContactController = require("../controllers/contact.controller");
const router = Router();

router.get("/", ContactController.listContacts);
router.get(
  "/:id",
  ContactController.validateContactId,
  ContactController.getById
);

router.post(
  "/",
  ContactController.validateContact,
  ContactController.addContact
);
router.delete(
  "/:id",
  ContactController.validateContactId,
  ContactController.deleteContact
);
router.patch(
  "/:id",
  ContactController.validateUpdateContact,
  ContactController.validateContactId,
  ContactController.updateContact
);

module.exports = router;
