import Joi from "joi";



export const adminsignupValidator = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().alphanum().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('user', 'Admin').optional()
});



export const adminloginValidator = Joi.object({
    username: Joi.string().alphanum(),
    email: Joi.string().email(),
    password: Joi.string().required(),
});