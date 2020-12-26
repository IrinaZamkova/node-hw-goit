const argv = require("yargs").argv;
const contactsTransitions = require("./contacts");

function invokeAction({ action, id, name, email, phone }) {
  switch (action) {
    case "list":
      contactsTransitions.listContacts().then(console.table);
      break;

    case "get":
      contactsTransitions.getContactById(id).then(console.log);
      break;

    case "add":
      contactsTransitions.addContact(name, email, phone).then(console.table);
      break;

    case "remove":
      contactsTransitions.removeContact(id).then(console.table);
      break;

    default:
      console.warn("\x1B[31m Unknown action type!");
  }
}

invokeAction(argv);
