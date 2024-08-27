const { UserLogin, verifyOtp, User_Details } = require("../controllers/user.controller");
const router=require("express").Router();
const auth=require("../middleware/auth_token")

router.post('/userlogin',UserLogin)
router.post('/verifyOtp',verifyOtp)
router.post('/updateUser',auth,User_Details)


module.exports=router