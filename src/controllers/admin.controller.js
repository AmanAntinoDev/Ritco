const Util=require("../utils/Util.js")
const responseCode = require("../utils/response/response.code");
const responseMessage = require("../utils/response/response.message");


const authService = require("../services/authservices/auth.service");
const bcrypt = require("bcrypt");

const login = async (req, res) => {
    console.log("checking")
    try {
      const { email, password } = req.body;
      const loggedIn = await authService.login({ email, password });
      res.send(loggedIn);
    } catch (error) {
        console.log(error)
      console.log(error.message,"hey")
      res.send(
        Util.response({
          code: responseCode.INTERNAL_SERVER_ERROR,
          msg: responseMessage[responseCode.INTERNAL_SERVER_ERROR],
          data: {},
        })
      );
    }
  };
   
  module.exports = {
    login,
  };
   