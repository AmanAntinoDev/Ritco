const Joi=require("joi")
module.exports.otpRequestSchema = Joi.object({
    phoneNumber: Joi.string().length(10).pattern(/^[0-9]+$/).required(),
});
