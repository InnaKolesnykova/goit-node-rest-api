import { listContacts, getContactById, removeContact, addContact, updateContactById, updateStatusContact } from '../services/contactsServices.js';
import HttpError from "../helpers/HttpError.js";
import { createContactSchema, updateContactSchema, updateStatusSchema } from "../schemas/contactsSchemas.js";
import mongoose from 'mongoose';

const validateObjectId = (id) => {
  if (!mongoose.isValidObjectId(id)) {
    throw HttpError(400, 'Invalid ID format');
  }
};

export const getAllContacts = async (req, res) => {
  try {
    const contacts = await listContacts();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    validateObjectId(id);
    const contact = await getContactById(id);
    if (!contact) {
      throw HttpError(404, 'Contact not found');
    }
    res.status(200).json(contact);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    validateObjectId(id);
    const contact = await removeContact(id);
    if (!contact) {
      throw HttpError(404, 'Contact not found');
    }
    res.status(200).json({ message: 'Contact successfully deleted', contact });
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const createContact = async (req, res) => {
  try {
    const { error } = createContactSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const { name, email, phone } = req.body;
    const newContact = await addContact(name, email, phone);
    res.status(201).json(newContact);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    validateObjectId(id);
    const body = req.body;
  
    if (Object.keys(body).length === 0) {
      return res.status(400).json({ message: "Body must have at least one field" });
    }
  
    const { error } = updateContactSchema.validate(body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
  
    const result = await updateContactById(id, body);
    if (!result) {
      throw HttpError(404, 'Contact not found');
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};

export const updateFavoriteStatus = async (req, res) => {
  try {
    const { id: contactId } = req.params;
    validateObjectId(contactId);

    const { error } = updateStatusSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const { favorite } = req.body;
    const result = await updateStatusContact(contactId, { favorite });
    if (!result) {
      throw HttpError(404, 'Contact not found');
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ message: error.message || 'Server error' });
  }
};