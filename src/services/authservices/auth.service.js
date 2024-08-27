const { prisma } = require("../../Db/db.config");
const bcrypt = require("bcrypt");
const Util = require("../../utils/Util")
const generateJWT = require("../authservices/jwtgenerate");
const responseCode = require("../../utils/response/response.code");
const responseMessage = require("../../utils/response/response.message");
 
const login = async ({ email, password }) => {
  try {
    const user = await prisma.admin.findUnique({
      where: { email },
    });
 
    if (!user) {
      return Util.responseFormat({
        code: responseCode.INVALID_EMAIL,
        msg: responseMessage[responseCode.INVALID_EMAIL],
        data: {},
      });
    }
 
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword)
      return Util.responseFormat({
        code: responseCode.INCORRECT_PASSWORD,
        msg: responseMessage[responseCode.INCORRECT_PASSWORD],
      });
 
    const payload = { id: user.id };
    const token = generateJWT(payload);
 
    return Util.responseFormat({
      code: responseCode.SUCCESS,
      msg: responseMessage[responseCode.SUCCESS],
      data: { token },
    });
  } catch (error) {
    console.log(error.message);
    return Util.responseFormat({
      code: responseCode.INTERNAL_SERVER_ERROR,
      msg: responseMessage[responseCode.INTERNAL_SERVER_ERROR],
      data: {},
    });
  }
};
 
module.exports = {
  login,
};
 
