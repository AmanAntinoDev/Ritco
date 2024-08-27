const { UserLogin, verifyOtp, User_Details } = require("../controllers/user.controller");
const {login}=require("../controllers/admin.controller")
const {loginValidate}=require("../validation/authValidation")
const router=require("express").Router();
const bcrypt=require("bcrypt")
const {prisma}=require("../Db/db.config")

router.post('/adminLogin',loginValidate,login)

// router.post("/register", async (req, res) => {
//   try {
//     console.log("inside -api");
//     const { email, password } = req.body;
//     const hashpass = await bcrypt.hash(password, 5);
//     const insertedData = await prisma.admin.create({
//       data: {
//         email: email,
//         password: hashpass,
//       },
//     });
 
//     res.send({ code: 200, msg: "success", data: insertedData });
//   } catch (error) {
//     res.send(error.message);
//   }
// });




module.exports=router