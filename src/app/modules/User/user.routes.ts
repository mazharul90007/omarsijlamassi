import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserControllers } from './user.controller';
import { userValidation } from './user.validation';
import auth from '../../middlewares/auth';
import { uploadProfilePicture } from '../../utils/uploadConfig';

const router = express.Router();

//=============Create or Register User============
router.post(
  '/register',
  validateRequest(userValidation.registerUser),
  UserControllers.registerUser,
);

// router.post('/verify-otp', UserControllers.verifyOtp);

//===============Get Profile====================

router.get('/profile', auth, UserControllers.getProfile);

//===============Change Password==============

router.post('/verify-password-otp', UserControllers.verifyPasswordOtp);

router.post('/request-password-otp', UserControllers.requestPasswordOtp);

router.post('/change-password', UserControllers.changePassword);

//================Reset Password===============
router.post(
  '/request-reset-password-otp',
  UserControllers.requestResetPasswordOtp,
);

router.post(
  '/verify-reset-password-otp',
  UserControllers.verifyResetPasswordOtp,
);

//============Update Profile==================
router.patch(
  '/profile',
  auth,
  validateRequest(userValidation.updateProfile),
  UserControllers.updateProfile,
);

//============Soft Delete User==================
router.delete('/profile', auth, UserControllers.softDeleteUser);

router.post('/reset-password', UserControllers.resetPassword);

//=========Update & Delete profile picture=============

router.patch(
  '/profile-picture',
  auth,
  uploadProfilePicture.single('profilePicture'),
  UserControllers.updateProfilePicture,
);

router.delete('/profile-picture', auth, UserControllers.deleteProfilePicture);

export const UserRouters = router;
