const router = require("express").Router();
const user = require("./user.routes.js");
const admin=require('./admin.routes.js')

router.use("/v1/user", user);  
router.use("/v1/admin",admin)

module.exports = router; 
 