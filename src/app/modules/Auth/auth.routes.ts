import express from 'express';
import { AuthControllers } from './auth.controller';
import { authValidation } from './auth.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
const router = express.Router();

router.post(
  '/login',
  validateRequest(authValidation.loginUser),
  AuthControllers.loginUser,
);

router.post('/logout', auth, AuthControllers.logoutUser);

router.post('/refresh-token', AuthControllers.refreshAccessToken);

export const AuthRouters = router;
