const Joi=require("joi")
module.exports.otpRequestSchema = Joi.object({
    phoneNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
});
module.exports.otpVerifySchema = Joi.object({
    phoneNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
    Otp: Joi.string().length(6).pattern(/^[0-9]+$/).required(),
});
module.exports.User_Information = Joi.object({
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    email: Joi.string().email().required(),
});