import * as bcrypt from 'bcrypt';
import prisma from '../../utils/prisma';
import AppError from '../../errors/AppError';
import httpStatus from 'http-status';
import { sendOtpEmail } from '../../utils/sendEmail';
import { generateOtp } from '../../utils/generateOTP';
import { deleteFile, getFileUrl } from '../../utils/uploadConfig';

const createUser = async (payload: {
  name: string;
  email: string;
  password: string;
}) => {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email already registered');
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  // Create new user
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      isActive: true,
    },
  });

  const { password: _password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

//=================Get Profile======================

const getProfile = async (email: string) => {
  const user = await prisma.user.findUnique({
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
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Add full URL if profile picture exists
  if (user.profilePicture) {
    user.profilePicture = getFileUrl(user.profilePicture);
  }

  return user;
};

//==========================Change Password====================

const requestPasswordOtp = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isActive: true,
    },
  });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }
  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiresAt },
  });
  await sendOtpEmail(email, otp);
};

const verifyPasswordOtp = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isActive: true,
    },
  });
  if (
    !user ||
    user.otp !== otp ||
    !user.otpExpiresAt ||
    user.otpExpiresAt < new Date()
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');
  }
  await prisma.user.update({
    where: { email },
    data: { otp: null, otpExpiresAt: null, canChangePassword: true },
  });
};

const changePassword = async (
  email: string,
  oldPassword: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isActive: true,
    },
  });
  if (!user || !user.canChangePassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Not authorized to change password',
    );
  }
  const isCorrectOldPassword = await bcrypt.compare(oldPassword, user.password);
  if (!isCorrectOldPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Old password is incorrect');
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword, canChangePassword: false },
  });
};

// ======================Reset Password====================

const requestResetPasswordOtp = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isActive: true,
    },
  });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }
  const otp = generateOtp();
  const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await prisma.user.update({
    where: { email },
    data: { otp, otpExpiresAt },
  });
  await sendOtpEmail(email, otp);
};

const verifyResetPasswordOtp = async (email: string, otp: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isActive: true,
    },
  });
  if (
    !user ||
    user.otp !== otp ||
    !user.otpExpiresAt ||
    user.otpExpiresAt < new Date()
  ) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid or expired OTP');
  }
  await prisma.user.update({
    where: { email },
    data: { otp: null, otpExpiresAt: null, canChangePassword: true },
  });
};

const resetPassword = async (email: string, newPassword: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isActive: true,
    },
  });
  if (!user || !user.canChangePassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Not authorized to reset password',
    );
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({
    where: { email },
    data: { password: hashedPassword, canChangePassword: false },
  });
};

//============Update Profile================
const updateProfile = async (
  email: string,
  payload: {
    name?: string;
  },
) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isActive: true,
    },
  });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const updatedUser = await prisma.user.update({
    where: { email },
    data: payload,
    select: {
      id: true,
      name: true,
      profilePicture: true,
      isEmailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  // Add full URL if profile picture exists
  if (updatedUser.profilePicture) {
    updatedUser.profilePicture = getFileUrl(updatedUser.profilePicture);
  }

  return updatedUser;
};

//===========Soft Delete User==============
const softDeleteUser = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      isActive: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!user.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is already deleted');
  }

  const deletedUser = await prisma.user.update({
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
};

//==================Update Profile Picture==============

const updateProfilePicture = async (email: string, filename: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isActive: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Delete old profile picture if exists
  if (user.profilePicture) {
    const oldFilePath = `public/uploads/profile-pictures/${user.profilePicture}`;
    deleteFile(oldFilePath);
  }

  const updatedUser = await prisma.user.update({
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
    updatedUser.profilePicture = getFileUrl(updatedUser.profilePicture);
  }

  return updatedUser;
};

const deleteProfilePicture = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
      isActive: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!user.profilePicture) {
    throw new AppError(httpStatus.BAD_REQUEST, 'No profile picture to delete');
  }

  // Delete file from filesystem
  const filePath = `public/uploads/profile-pictures/${user.profilePicture}`;
  deleteFile(filePath);

  const updatedUser = await prisma.user.update({
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
};

export const UserServices = {
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
