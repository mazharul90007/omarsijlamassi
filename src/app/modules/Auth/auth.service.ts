import * as bcrypt from 'bcrypt';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import AppError from '../../errors/AppError';
import prisma from '../../utils/prisma';
import { generateToken } from '../../utils/generateToken';
import * as jwt from 'jsonwebtoken';

//==========================Login User=========================
const loginUserFromDB = async (payload: {
  email: string;
  password: string;
}) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      isActive: true,
    },
  });
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password,
  );

  if (!isCorrectPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password incorrect');
  }
  // if (!userData.isEmailVerified) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     'Email is not verified, Please check your email for the verification link.',
  //   );
  // }

  const accessToken = await generateToken(
    { id: userData.id, email: userData.email },
    config.jwt.access_secret,
    config.jwt.access_expires_in,
  );

  const refreshToken = await generateToken(
    { id: userData.id },
    config.jwt.refresh_secret,
    config.jwt.refresh_expires_in,
  );

  await prisma.user.update({
    where: { id: userData.id },
    data: { refreshToken },
  });

  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    accessToken,
    refreshToken,
  };
};

//====================Refresh Access Token===================

const refreshAccessToken = async (refreshToken: string) => {
  const decoded = jwt.verify(refreshToken, config.jwt.refresh_secret) as any;

  const user = await prisma.user.findFirst({
    where: {
      id: decoded.id,
      refreshToken: refreshToken,
      isActive: true,
    },
  });

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid refresh token');
  }

  const newAccessToken = await generateToken(
    { id: user.id, email: user.email },
    config.jwt.access_secret,
    config.jwt.access_expires_in,
  );

  return { accessToken: newAccessToken };
};

//================Logout User========================

const logoutUser = async (userId: string) => {
  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  return { message: 'Logged out successfully' };
};

export const AuthServices = { loginUserFromDB, refreshAccessToken, logoutUser };
