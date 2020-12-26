const fs = require("fs");
const { promises: fsPromises } = fs;
const path = require("path");

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
  const data = await fsPromises.readFile(contactsPath, "utf-8");
  return JSON.parse(data);
}
async function getContactById(contactId) {
  const contacts = await listContacts();
  const findContactById = contacts.find((contact) => contact.id === contactId);
  return findContactById;
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const newContactsList = contacts.filter(
    (contact) => contact.id !== contactId
  );
  const newContactsListJson = JSON.stringify(newContactsList);
  fsPromises.writeFile(contactsPath, newContactsListJson);
  return newContactsList;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const checkSameContact = contacts.find(
    (contact) =>
      name === contact.name &&
      email === contact.email &&
      phone === contact.phone
  );
  if (!checkSameContact) {
    let maxId = 0;
    const createNewId = contacts.forEach((contact) => {
      if (contact.id > maxId) {
        maxId = contact.id;
      }
    });
    const newContactForAdd = {
      id: maxId + 1,
      name,
      email,
      phone,
    };
    const newContactsList = [...contacts, newContactForAdd];
    const newContactsListJson = JSON.stringify(newContactsList);
    fsPromises.writeFile(contactsPath, newContactsListJson);
    console.table(newContactsList);
  } else console.log("contact already in list");
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};
