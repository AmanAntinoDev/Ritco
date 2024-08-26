const router = require("express").Router();
const user = require("./user.routes.js");

router.use("/v1/user", user);  

module.exports = router; 
 