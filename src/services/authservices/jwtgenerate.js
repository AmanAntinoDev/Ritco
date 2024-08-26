const jwt=require("jsonwebtoken")

const generateJWT = (admin) => {
    const payload = {
        id: admin.id,
    };
    return jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '2 days' });
};
module.exports=generateJWT
