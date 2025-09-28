import Contact from '../model/contactsModel.js';

export async function listContacts(userId) {
  return Contact.find({ owner: userId }).exec(); 
}

export async function getContactById(contactId, userId) {
  return Contact.findOne({ _id: contactId, owner: userId }).exec(); 
}

export async function removeContact(contactId, userId) {
  return Contact.findOneAndDelete({ _id: contactId, owner: userId }).exec(); 
}

export async function addContact(name, email, phone, userId) {
  const newContact = new Contact({ name, email, phone, owner: userId }); // Associate contact with the user
  return newContact.save();
}

export async function updateContactById(contactId, body, userId) {
  return Contact.findOneAndUpdate(
    { _id: contactId, owner: userId },
    body,
    { new: true }
  ).exec();
}

export async function updateStatusContact(contactId, body, userId) {
  return Contact.findOneAndUpdate(
    { _id: contactId, owner: userId }, 
    { favorite: body.favorite },
    { new: true }
  ).exec();
}