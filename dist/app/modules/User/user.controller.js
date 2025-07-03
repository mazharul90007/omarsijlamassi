"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const user_service_1 = require("./user.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const uploadConfig_1 = require("../../utils/uploadConfig");
const registerUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.UserServices.createUser(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        message: 'User registered successfully',
        data: result,
    });
}));
// const verifyOtp = catchAsync(async (req, res) => {
//   const { email, otp } = req.body;
//   await UserServices.verifyUserOtp(email, otp);
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     message: 'Email verified successfully',
//     data: '',
//   });
// });
//====================Get User Profile=======================
const getProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // You can get the user email from req.user if using auth middleware, or from query/body for now
    const email = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) || req.query.email || req.body.email;
    const profile = yield user_service_1.UserServices.getProfile(email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: 'User profile fetched successfully',
        data: profile,
    });
}));
//=======================Change Password=======================
const requestPasswordOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield user_service_1.UserServices.requestPasswordOtp(email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: 'OTP sent to your email',
        data: '',
    });
}));
const verifyPasswordOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    yield user_service_1.UserServices.verifyPasswordOtp(email, otp);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: 'OTP verified, you can now change your password',
        data: '',
    });
}));
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, oldPassword, newPassword } = req.body;
    yield user_service_1.UserServices.changePassword(email, oldPassword, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: 'Password changed successfully',
        data: '',
    });
}));
//==================Reset Password====================
const requestResetPasswordOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    yield user_service_1.UserServices.requestResetPasswordOtp(email);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: 'OTP sent to your email',
        data: '',
    });
}));
const verifyResetPasswordOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    yield user_service_1.UserServices.verifyResetPasswordOtp(email, otp);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: 'OTP verified, you can now reset your password',
        data: '',
    });
}));
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, newPassword } = req.body;
    yield user_service_1.UserServices.resetPassword(email, newPassword);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        message: 'Password reset successfully',
        data: '',
    });
}));
//===============Update Profile==============
const updateProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const result = yield user_service_1.UserServices.updateProfile(email, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Profile updated successfully',
        data: result,
    });
}));
//===============Soft Delete User==============
const softDeleteUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const result = yield user_service_1.UserServices.softDeleteUser(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'User soft deleted successfully',
        data: result,
    });
}));
//============Update Profile Picture==============
const updateProfilePicture = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    if (!req.file) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'No image file provided');
    }
    // Compress and save the image
    const filename = yield (0, uploadConfig_1.compressAndSaveImage)(req.file);
    const result = yield user_service_1.UserServices.updateProfilePicture(email, filename);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Profile picture updated successfully',
        data: result,
    });
}));
const deleteProfilePicture = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const email = (_a = req.user) === null || _a === void 0 ? void 0 : _a.email;
    const result = yield user_service_1.UserServices.deleteProfilePicture(email);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        message: 'Profile picture deleted successfully',
        data: result,
    });
}));
exports.UserControllers = {
    registerUser,
    // verifyOtp,
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
