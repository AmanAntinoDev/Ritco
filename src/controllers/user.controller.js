const { prisma } = require("../Db/db.config");
const {otpRequestSchema,otpVerifySchema, User_Information}=require("../validation/authValidation")
const httpStatus = require('http-status-codes');
const responseManagement = require('../utils/responseManagement');
const generateJWT=require("../services/authservices/jwtgenerate")
const axios=require("axios")
module.exports.UserLogin = async (req, res) => {
    console.log(req.body);
    
    const{phoneNumber}=req.body 
        const { error } = otpRequestSchema.validate(req.body);
    if (error) {
        return responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'internal error', error);
    }
    const phoneNumber_converted = parseInt(req.body.phoneNumber, 10);
    var check=false;

    try {
        let user = await prisma.user.findUnique({
            where: { phoneNumber },
        });
        if (!user) {
            check=true;
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
            otp_details:response.data,
            check:check
        }

        return responseManagement.sendResponse(res, httpStatus.OK, 'user registered successfully',data);

    } catch (error) {
        console.error('Error sending OTP:', error);
        return responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error', error);
    }
};
module.exports.verifyOtp = async (req, res) => {
    try {
        const { Otp, phoneNumber } = req.body;
        const { error } = otpVerifySchema.validate(req.body);
        if (error) {
            return responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, 'Invalid input', error);
        }
        const user = await prisma.user.findUnique({
            where: { phoneNumber },
        });
        console.log("shi chal raa h")
        if (!user) {
            return responseManagement.sendResponse(res, httpStatus.NOT_FOUND, 'User not found');
        }
        const phoneNumber_converted = parseInt(req.body.phoneNumber, 10);
        const response = await axios.get(`https://2factor.in/API/V1/28f37d6a-6134-11ef-8b60-0200cd936042/SMS/VERIFY3/+91${phoneNumber_converted}/${Otp}`);
        console.log(response.data.Status,"shi gh")
        if (response.data.Status === "Success") {
            if (new Date() > new Date(user.otpExpiresAt)) {
                return responseManagement.sendResponse(res, httpStatus.UNAUTHORIZED, 'OTP expired');
            }

            const token = generateJWT(user);
            await prisma.user.update({
                where: { phoneNumber },
                data: {
                    otp: null,
                    otpExpiresAt: null,
                },
            });

            return responseManagement.sendResponse(res, httpStatus.OK, 'OTP verified successfully', { token });

        } else {
            return responseManagement.sendResponse(res, httpStatus.UNAUTHORIZED, 'Invalid OTP');
        }

    } catch (error) {
        console.error('Error verifying OTP:', error);
        return responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error', error);
    }
};
module.exports.User_Details = async (req, res) => {
    try {
        const { id } = req.user;

        const { error } = User_Information.validate(req.body);
        if (error) {
            return responseManagement.sendResponse(res, httpStatus.BAD_REQUEST, 'Validation error', error.details);
        }
        const user = await prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            return responseManagement.sendResponse(res, httpStatus.NOT_FOUND, 'User not found');
        }
        const updated_user = await prisma.user.update({
            where: { id },
            data: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
            },
        });
        return responseManagement.sendResponse(res, httpStatus.OK, 'User details updated successfully', updated_user);

    } catch (error) {
        console.error('Error updating user details:', error);
        return responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error', error);
    }
}

