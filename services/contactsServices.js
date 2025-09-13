import { Contact } from '../model/contactsModel.js';

export async function listContacts() {
  return Contact.find().exec();
}

export async function getContactById(contactId) {
  return Contact.findById(contactId).exec();
}

export async function removeContact(contactId) {
  return Contact.findByIdAndDelete(contactId).exec();
}

export async function addContact(name, email, phone) {
  const newContact = new Contact({ name, email, phone });
  return newContact.save();
}

export async function updateContactById(contactId, body) {
  return Contact.findByIdAndUpdate(contactId, body, { new: true }).exec();
}

export async function updateStatusContact(contactId, body) {
  return Contact.findByIdAndUpdate(contactId, { favorite: body.favorite }, { new: true }).exec();
}