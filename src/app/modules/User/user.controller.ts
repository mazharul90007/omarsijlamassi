import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../errors/AppError';
import { compressAndSaveImage } from '../../utils/uploadConfig';

const registerUser = catchAsync(async (req, res) => {
  const result = await UserServices.createUser(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    message: 'User registered successfully',
    data: result,
  });
});

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

const getProfile = catchAsync(async (req, res) => {
  // You can get the user email from req.user if using auth middleware, or from query/body for now
  const email = req.user?.email || req.query.email || req.body.email;
  const profile = await UserServices.getProfile(email);
  sendResponse(res, {
    statusCode: 200,
    message: 'User profile fetched successfully',
    data: profile,
  });
});

//=======================Change Password=======================

const requestPasswordOtp = catchAsync(async (req, res) => {
  const { email } = req.body;
  await UserServices.requestPasswordOtp(email);
  sendResponse(res, {
    statusCode: 200,
    message: 'OTP sent to your email',
    data: '',
  });
});

const verifyPasswordOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  await UserServices.verifyPasswordOtp(email, otp);
  sendResponse(res, {
    statusCode: 200,
    message: 'OTP verified, you can now change your password',
    data: '',
  });
});

const changePassword = catchAsync(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  await UserServices.changePassword(email, oldPassword, newPassword);
  sendResponse(res, {
    statusCode: 200,
    message: 'Password changed successfully',
    data: '',
  });
});

//==================Reset Password====================

const requestResetPasswordOtp = catchAsync(async (req, res) => {
  const { email } = req.body;
  await UserServices.requestResetPasswordOtp(email);
  sendResponse(res, {
    statusCode: 200,
    message: 'OTP sent to your email',
    data: '',
  });
});

const verifyResetPasswordOtp = catchAsync(async (req, res) => {
  const { email, otp } = req.body;
  await UserServices.verifyResetPasswordOtp(email, otp);
  sendResponse(res, {
    statusCode: 200,
    message: 'OTP verified, you can now reset your password',
    data: '',
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { email, newPassword } = req.body;
  await UserServices.resetPassword(email, newPassword);
  sendResponse(res, {
    statusCode: 200,
    message: 'Password reset successfully',
    data: '',
  });
});

//===============Update Profile==============
const updateProfile = catchAsync(async (req, res) => {
  const email = req.user?.email;
  const result = await UserServices.updateProfile(email, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Profile updated successfully',
    data: result,
  });
});

//===============Soft Delete User==============
const softDeleteUser = catchAsync(async (req, res) => {
  const email = req.user?.email;
  const result = await UserServices.softDeleteUser(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'User soft deleted successfully',
    data: result,
  });
});

//============Update Profile Picture==============
const updateProfilePicture = catchAsync(async (req, res) => {
  const email = req.user?.email;

  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No image file provided');
  }

  // Compress and save the image
  const filename = await compressAndSaveImage(req.file);
  const result = await UserServices.updateProfilePicture(email, filename);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Profile picture updated successfully',
    data: result,
  });
});

const deleteProfilePicture = catchAsync(async (req, res) => {
  const email = req.user?.email;
  const result = await UserServices.deleteProfilePicture(email);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    message: 'Profile picture deleted successfully',
    data: result,
  });
});

export const UserControllers = {
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
