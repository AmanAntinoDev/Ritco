const { prisma } = require("../Db/db.config");
const {otpRequestSchema}=require("../validation/authValidation")
const httpStatus = require('http-status-codes');
const responseManagement = require('../utils/responseManagement');
const axios=require("axios")
module.exports.UserLogin = async (req, res) => {
    console.log(req.body);
    const{phoneNumber}=req.body 
        const { error } = otpRequestSchema.validate(req.body);
    if (error) {
        return responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'internal error', error);
    }
    const phoneNumber_converted = parseInt(req.body.phoneNumber, 10);

    try {
        let user = await prisma.user.findUnique({
            where: { phoneNumber },
        });
        if (!user) {
            user = await prisma.user.create({
                data: {
                    phoneNumber,
                },
            });
        }
        const response = await axios.get(
            `https://2factor.in/API/V1/28f37d6a-6134-11ef-8b60-0200cd936042/SMS/+91${phoneNumber_converted}/AUTOGEN/OTP1`
        );

        if (response.data.Status === "Success") {
            const otpIdentifier = response.data.Details;

            await prisma.user.update({
                where: { phoneNumber },
                data: {
                    otp: otpIdentifier,
                    otpExpiresAt: new Date(new Date().getTime() + 10 * 60000), 
                },
            });
        }
        const data={
            phoneNumber:phoneNumber,
            otp_details:response.data
        }

        return responseManagement.sendResponse(res, httpStatus.OK, 'user registered successfully',data);

    } catch (error) {
        console.error('Error sending OTP:', error);
        return responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error', error);
    }
};
module.exports.verifyOtp=async(req,res)=>{
    try {
        const {Otp}=req.body;

 } catch (error) {
        
    }
}