"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
const bcrypt = __importStar(require("bcrypt"));
const prisma_1 = __importDefault(require("../../utils/prisma"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const sendEmail_1 = require("../../utils/sendEmail");
const generateOTP_1 = require("../../utils/generateOTP");
const uploadConfig_1 = require("../../utils/uploadConfig");
const createUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if email already exists
    const existingUser = yield prisma_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (existingUser) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Email already registered');
    }
    const hashedPassword = yield bcrypt.hash(payload.password, 10);
    // Create new user
    const user = yield prisma_1.default.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
            isActive: true,
        },
    });
    const { password: _password } = user, userWithoutPassword = __rest(user, ["password"]);
    return userWithoutPassword;
});
//=================Get Profile======================
const getProfile = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true,
        },
        select: {
            id: true,
            email: true,
            profilePicture: true,
            isEmailVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Add full URL if profile picture exists
    if (user.profilePicture) {
        user.profilePicture = (0, uploadConfig_1.getFileUrl)(user.profilePicture);
    }
    return user;
});
//==========================Change Password====================
const requestPasswordOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    const otp = (0, generateOTP_1.generateOtp)();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    yield prisma_1.default.user.update({
        where: { email },
        data: { otp, otpExpiresAt },
    });
    yield (0, sendEmail_1.sendOtpEmail)(email, otp);
});
const verifyPasswordOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true,
        },
    });
    if (!user ||
        user.otp !== otp ||
        !user.otpExpiresAt ||
        user.otpExpiresAt < new Date()) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid or expired OTP');
    }
    yield prisma_1.default.user.update({
        where: { email },
        data: { otp: null, otpExpiresAt: null, canChangePassword: true },
    });
});
const changePassword = (email, oldPassword, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true,
        },
    });
    if (!user || !user.canChangePassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Not authorized to change password');
    }
    const isCorrectOldPassword = yield bcrypt.compare(oldPassword, user.password);
    if (!isCorrectOldPassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Old password is incorrect');
    }
    const hashedPassword = yield bcrypt.hash(newPassword, 10);
    yield prisma_1.default.user.update({
        where: { email },
        data: { password: hashedPassword, canChangePassword: false },
    });
});
// ======================Reset Password====================
const requestResetPasswordOtp = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User not found');
    }
    const otp = (0, generateOTP_1.generateOtp)();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    yield prisma_1.default.user.update({
        where: { email },
        data: { otp, otpExpiresAt },
    });
    yield (0, sendEmail_1.sendOtpEmail)(email, otp);
});
const verifyResetPasswordOtp = (email, otp) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true,
        },
    });
    if (!user ||
        user.otp !== otp ||
        !user.otpExpiresAt ||
        user.otpExpiresAt < new Date()) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid or expired OTP');
    }
    yield prisma_1.default.user.update({
        where: { email },
        data: { otp: null, otpExpiresAt: null, canChangePassword: true },
    });
});
const resetPassword = (email, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true,
        },
    });
    if (!user || !user.canChangePassword) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Not authorized to reset password');
    }
    const hashedPassword = yield bcrypt.hash(newPassword, 10);
    yield prisma_1.default.user.update({
        where: { email },
        data: { password: hashedPassword, canChangePassword: false },
    });
});
//============Update Profile================
const updateProfile = (email, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const updatedUser = yield prisma_1.default.user.update({
        where: { email },
        data: payload,
        select: {
            id: true,
            profilePicture: true,
            isEmailVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    // Add full URL if profile picture exists
    if (updatedUser.profilePicture) {
        updatedUser.profilePicture = (0, uploadConfig_1.getFileUrl)(updatedUser.profilePicture);
    }
    return updatedUser;
});
//===========Soft Delete User==============
const softDeleteUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email },
        select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (!user.isActive) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'User is already deleted');
    }
    const deletedUser = yield prisma_1.default.user.update({
        where: { email },
        data: { isActive: false },
        select: {
            id: true,
            name: true,
            email: true,
            isActive: true,
        },
    });
    return deletedUser;
});
//==================Update Profile Picture==============
const updateProfilePicture = (email, filename) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // Delete old profile picture if exists
    if (user.profilePicture) {
        const oldFilePath = `public/uploads/profile-pictures/${user.profilePicture}`;
        (0, uploadConfig_1.deleteFile)(oldFilePath);
    }
    const updatedUser = yield prisma_1.default.user.update({
        where: { email },
        data: { profilePicture: filename },
        select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
            isEmailVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    // Add full URL to response
    if (updatedUser.profilePicture) {
        updatedUser.profilePicture = (0, uploadConfig_1.getFileUrl)(updatedUser.profilePicture);
    }
    return updatedUser;
});
const deleteProfilePicture = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: {
            email,
            isActive: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (!user.profilePicture) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'No profile picture to delete');
    }
    // Delete file from filesystem
    const filePath = `public/uploads/profile-pictures/${user.profilePicture}`;
    (0, uploadConfig_1.deleteFile)(filePath);
    const updatedUser = yield prisma_1.default.user.update({
        where: { email },
        data: { profilePicture: null },
        select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
            isEmailVerified: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updatedUser;
});
exports.UserServices = {
    createUser,
    requestPasswordOtp,
    verifyPasswordOtp,
    changePassword,
    requestResetPasswordOtp,
    verifyResetPasswordOtp,
    resetPassword,
    getProfile,
    updateProfile,
    softDeleteUser,
    updateProfilePicture,
    deleteProfilePicture,
};
