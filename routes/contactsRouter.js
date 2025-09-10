import express from "express";
import { 
  getAllContacts, 
  getOneContact, 
  deleteContact, 
  createContact, 
  updateContact, 
  validateCreateContact, 
  validateUpdateContact } from '../controllers/contactsControllers.js';

const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post('/', validateCreateContact, createContact);

contactsRouter.put('/:id', validateUpdateContact, updateContact);

export default contactsRouter;