const Joi = require('joi');

const createUser = Joi.object({
    fullName: Joi.string().min(3).max(30).required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    phoneNumber: Joi.string().optional().trim().required(),
    walletPublicKey: Joi.string().trim(),
    password: Joi.string().required(),
    resetPasswordToken: Joi.string().optional(),
    resetPasswordExpires: Joi.date().optional(),
})

module.exports = { createUser };