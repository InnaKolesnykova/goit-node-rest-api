import { listContacts, getContactById, removeContact, addContact, updateContactById } from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";

export const validateCreateContact = validateBody(createContactSchema);
export const validateUpdateContact = validateBody(updateContactSchema);

export const getAllContacts = async (req, res) => {
    try {
        const result = await listContacts();
        res.status(200).json(result);
    } catch(error) {
        res.status(500).json({
            message: 'Server error'
        });
    }
};

export const getOneContact = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await getContactById(id);
        if (!result) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json(result);
    } catch(error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({
                message: 'Server error'
            });
        }
    }
};

export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await removeContact(id);
        if (!result) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json(result);
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({
                message: 'Server error'
            });
        }
    }
};

export const createContact = async (req, res) => {
    try {
        const { name, email, phone } = req.body;
        const newContact = await addContact(name, email, phone);
        res.status(201).json(newContact);
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({
                message: 'Server error'
            });
        }
    }
};

export const updateContact = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;

        const { error } = updateContactSchema.validate(body);
        if (error) {
            return res.status(400).json({ message: error.message });
        }

        const result = await updateContactById(id, body);
        if (!result) {
            throw HttpError(404, "Not found");
        }
        res.status(200).json(result);
    } catch (error) {
        if (error.status) {
            res.status(error.status).json({ message: error.message });
        } else {
            res.status(500).json({
                message: 'Server error'
            });
        }
    }
};