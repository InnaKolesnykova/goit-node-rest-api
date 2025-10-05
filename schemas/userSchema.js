import Joi from 'joi';
import { valEmail } from '../model/userModel';

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(valEmail).required(),
    password: Joi.string.required(),
})

const logInSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().pattern(valEmail).required(),
    password: Joi.string.required(),
})

const schemas = {
    registerSchema,
    logInSchema,
}

module.exports = {
    schemas
}