const { UserLogin, verifyOtp, User_Details } = require("../controllers/user.controller");
const {login,User_Admin,User_Admin_User_edit, DeactivateUser, Admin_User_login}=require("../controllers/admin.controller")
const {loginValidate, User_Admin_Update_Schema}=require("../validation/authValidation")
const router=require("express").Router();
const bcrypt=require("bcrypt")
const {prisma}=require("../Db/db.config")

router.post('/adminLogin',loginValidate)
router.post('/addUser',User_Admin)
router.post('/updateUser/:id',User_Admin_User_edit)
router.post('/deactivateUser/:id',DeactivateUser)
router.post('/Admin_User_login',Admin_User_login)




module.exports=router