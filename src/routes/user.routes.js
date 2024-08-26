const { UserLogin, verifyOtp } = require("../controllers/user.controller");
const router=require("express").Router();

router.post('/userlogin',UserLogin)
router.post('/verifyOtp',verifyOtp)


module.exports=router