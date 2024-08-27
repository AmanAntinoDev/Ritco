const Util=require("../utils/Util.js")
const responseCode = require("../utils/response/response.code");
const responseMessage = require("../utils/response/response.message");
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

