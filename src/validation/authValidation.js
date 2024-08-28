const Util=require("../utils/Util.js")
const responseCode = require("../utils/response/response.code");
const responseMessage = require("../utils/response/response.message");
const {allowedRoles}=require("../config/config.js")
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
const loginSchema = Joi.object({
    email: Joi
      .string()
      .pattern(/^[^\s@]+@gmail\.com$/)
      .required()
      .messages({
        "string.pattern.base": "Please provide a valid email address.",
        "any.required": "Email is required.",
      }),
    password: Joi
      .string()
      .min(8)
      .pattern(new RegExp("^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])"))
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long.",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one number, and one special character.",
        "any.required": "Password is required.",
      }),
  });
   
module.exports.loginValidate = async (req, res, next) => {
    try {
      const response = loginSchema.validate(req.body);
   
      if (response?.error) {
        res.send(
          Util.responseFormat({
            code: responseCode.BAD_REQUEST,
            msg: response?.error?.message,
            data: {},
          })
        );
      } else {
        req.body = response?.value;
        next();
      }
    } catch (error) {
      res.send(
        Util.responseFormat({
          code: responseCode.INTERNAL_SERVER_ERROR,
          msg: responseMessage[responseCode.INTERNAL_SERVER_ERROR],
          data: {},
        })
      );
    }
  };
  module.exports.User_Admin_Schema= Joi.object({
    phoneNumber: Joi.string().pattern(/^[0-9]{10,15}$/).required().messages({
        'string.pattern.base': 'Phone number must be a valid number with 10-15 digits',
        'any.required': 'Phone number is required',
    }),
    Name: Joi.string().min(3).max(50).required().messages({
        'string.min': 'Name must be at least 3 characters long',
        'string.max': 'Name must not exceed 50 characters',
        'any.required': 'Name is required',
    }),
    role: Joi.string().valid('ADMIN', 'FINANCE', 'SUPPORT', 'OPERATION').required().messages({
        'any.only': 'Role must be one of ADMIN, FINANCE, SUPPORT, or OPERATION',
        'any.required': 'Role is required',
    }),
    email:Joi.string().email().required()

});

module.exports.User_Admin_Update_Schema = Joi.object({
    phoneNumber: Joi.string().optional(),
    Name: Joi.string().optional(),
    email: Joi.string().email().optional(),
    role: Joi.string().valid(...allowedRoles).optional(),
});
module.exports.Admin_User_Schema=Joi.object({
  email: Joi.string().email().required(),
  password:Joi.string().required()
})