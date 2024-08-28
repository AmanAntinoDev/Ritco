const Util=require("../utils/Util.js")
const responseCode = require("../utils/response/response.code");
const responseMessage = require("../utils/response/response.message");
const authService = require("../services/authservices/auth.service");
const {User_Admin_Schema,User_Admin_Update_Schema,Admin_User_Schema}=require("../validation/authValidation.js")
const {sendPasswordEmail,generateRandomPassword}=require("../services/authservices/services.js")
const responseManagement = require('../utils/responseManagement');
const httpStatus = require('http-status-codes');
const bcrypt = require("bcrypt");
const { prisma } = require("../Db/db.config");
const nodemailer = require("nodemailer");
const {allowedRoles}=require("../config/config.js");
const generateJWT = require("../services/authservices/jwtgenerate.js");
module.exports.Admin_User_login = async (req, res) => {
    try {
        const { error, value } = Admin_User_Schema.validate(req.body);
        if (error) {
            return responseManagement.sendResponse(
                res,
                httpStatus.INTERNAL_SERVER_ERROR,
                'error',
                error.details[0].message
            );
        }

        const { email, password } = value;

        let user;
        user = await prisma.admin.findFirst({
            where: { email: email },
        });
        if (!user) {
            user = await prisma.user_Admin.findFirst({
                where: { email: email },
            });
        }
        if (!user) {
            return responseManagement.sendResponse(
                res,
                httpStatus.UNAUTHORIZED,
                'error',
                'Invalid email or password'
            );
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return responseManagement.sendResponse(
                res,
                httpStatus.UNAUTHORIZED,
                'error',
                'Invalid email or password'
            );
        }
        const token = generateJWT(user);
        return responseManagement.sendResponse(
            res,
            httpStatus.OK,
            'Login successful',
            { token }
        );

    } catch (error) {
        console.log(error);
        return responseManagement.sendResponse(
            res,
            httpStatus.INTERNAL_SERVER_ERROR,
            'error',
            'An unexpected error occurred'
        );
    }
};
module.exports.User_Admin = async (req, res) => {
    try {
        console.log(req.body);
        const { error, value } = User_Admin_Schema.validate(req.body);
        if (error) {
            return responseManagement.sendResponse(
                res,
                httpStatus.INTERNAL_SERVER_ERROR,
                'error',
                error.details[0].message
            );
        }

        const { phoneNumber, Name, role, email } = value;
        const existingUser = await prisma.user_Admin.findFirst({
            where: {
                OR: [
                    { phoneNumber: phoneNumber },
                    { email: email },
                ],
            },
        });

        if (existingUser) {
            return responseManagement.sendResponse(
                res,
                httpStatus.CONFLICT,
                'error',
                'Phone number or email already exists'
            );
        }
        const password = generateRandomPassword();
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user_Admin.create({
            data: {
                phoneNumber: phoneNumber,
                Name: Name,
                role: role,
                password: hashedPassword,
                email: email,
            },
        });
        sendPasswordEmail(Name, email, password);

        const user = {
            id: newUser.id,
            phoneNumber: newUser.phoneNumber,
            Name: newUser.Name,
            role: newUser.role,
        };

        return responseManagement.sendResponse(res, httpStatus.OK, 'created successfully', user);

    } catch (error) {
        console.log(error);
        return responseManagement.sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, 'error', error);
    }
};
module.exports.User_Admin_User_edit = async (req, res) => {
    try {
        const { error, value } = User_Admin_Update_Schema.validate(req.body);
        if (error) {
            return responseManagement.sendResponse(
                res,
                httpStatus.BAD_REQUEST,
                'error',
                error.details[0].message
            );
        }

        const { phoneNumber, Name, email, role } = value;
        const { id } = req.params;

        const existingUser = await prisma.user_Admin.findUnique({
            where: { id: parseInt(id, 10) }, 
        });

        if (!existingUser) {
            return responseManagement.sendResponse(
                res,
                httpStatus.NOT_FOUND,
                'error',
                'User not found'
            );
        }  
        const updateData = {};
        if (Name) updateData.Name = Name;
        if (phoneNumber) updateData.phoneNumber = phoneNumber;
        if (email) updateData.email = email;
        if (role) {
            if (allowedRoles.includes(role)) {
                updateData.role = role;
            } else {
                return responseManagement.sendResponse(
                    res,
                    httpStatus.BAD_REQUEST,
                    'error',
                    'Invalid role value'
                );
            }
        }
        const updatedUser = await prisma.user_Admin.update({
            where: { id: parseInt(id, 10) },
            data: updateData,
        });

        if (email && email !== existingUser.email) {
            sendPasswordEmail(Name, email, existingUser.password);
        }
        return responseManagement.sendResponse(
            res,
            httpStatus.OK,
            'updated successfully',
            {
                id: updatedUser.id,
                phoneNumber: updatedUser.phoneNumber,
                Name: updatedUser.Name,
                email: updatedUser.email,
                role: updatedUser.role,
            }
        );

    } catch (error) {
        console.log(error);
        return responseManagement.sendResponse(
            res,
            httpStatus.INTERNAL_SERVER_ERROR,
            'error',
            'An unexpected error occurred'
        );
    }
};
module.exports.DeactivateUser = async (req, res) => {
    try {
        const { id } = req.params; 
        const existingUser = await prisma.user_Admin.findUnique({
            where: { id: parseInt(id, 10) }, 
        });

        if (!existingUser) {
            return responseManagement.sendResponse(
                res,
                httpStatus.NOT_FOUND,
                'error',
                'User not found'
            );
        }
        const updatedUser = await prisma.user_Admin.update({
            where: { id: parseInt(id, 10) },
            data: { status: 'inactive' },
        });
        return responseManagement.sendResponse(
            res,
            httpStatus.OK,
            'User deactivated successfully',
            {
                id: updatedUser.id,
                phoneNumber: updatedUser.phoneNumber,
                Name: updatedUser.Name,
                email: updatedUser.email,
                status: updatedUser.status,
            }
        );

    } catch (error) {
        console.log(error);
        return responseManagement.sendResponse(
            res,
            httpStatus.INTERNAL_SERVER_ERROR,
            'error',
            'An unexpected error occurred'
        );
    }
};