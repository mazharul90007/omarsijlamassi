"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouters = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const uploadConfig_1 = require("../../utils/uploadConfig");
const router = express_1.default.Router();
//=============Create or Register User============
router.post('/register', (0, validateRequest_1.default)(user_validation_1.userValidation.registerUser), user_controller_1.UserControllers.registerUser);
// router.post('/verify-otp', UserControllers.verifyOtp);
//===============Get Profile====================
router.get('/profile', auth_1.default, user_controller_1.UserControllers.getProfile);
//===============Change Password==============
router.post('/verify-password-otp', user_controller_1.UserControllers.verifyPasswordOtp);
router.post('/request-password-otp', user_controller_1.UserControllers.requestPasswordOtp);
router.post('/change-password', user_controller_1.UserControllers.changePassword);
//================Reset Password===============
router.post('/request-reset-password-otp', user_controller_1.UserControllers.requestResetPasswordOtp);
router.post('/verify-reset-password-otp', user_controller_1.UserControllers.verifyResetPasswordOtp);
//============Update Profile==================
router.patch('/profile', auth_1.default, (0, validateRequest_1.default)(user_validation_1.userValidation.updateProfile), user_controller_1.UserControllers.updateProfile);
//============Soft Delete User==================
router.delete('/profile', auth_1.default, user_controller_1.UserControllers.softDeleteUser);
router.post('/reset-password', user_controller_1.UserControllers.resetPassword);
//=========Update & Delete profile picture=============
router.patch('/profile-picture', auth_1.default, uploadConfig_1.uploadProfilePicture.single('profilePicture'), user_controller_1.UserControllers.updateProfilePicture);
router.delete('/profile-picture', auth_1.default, user_controller_1.UserControllers.deleteProfilePicture);
exports.UserRouters = router;
