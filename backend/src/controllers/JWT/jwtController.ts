import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import { Get, Post, Controller, Middleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import { HTTPResponse } from '../HTTP/httpResponses';
import { AlertResponse, UserHttpResponseMessages } from '../HTTP/httpEnums';
import { UserValidation } from './userValidation';
import { UserService } from './userService';
import { AuthService } from './authService';
import { VerifyAccountService } from './verifyService';

const customJwtManager = new JwtManager(
  process.env.OVERNIGHT_JWT_SECRET as string,
  process.env.OVERNIGHT_JWT_EXP as string
);

@Controller('api/auth')
export class JWTController {
  @Get('token')
  @Middleware(customJwtManager.middleware)
  private async checkToken(req: ISecureRequest, res: Response) {
    try {
      const userService = new UserService(-1, req.payload.email);
      const user = await userService.findByEmail();

      if (!user)
        return HTTPResponse.notFound(
          res,
          UserHttpResponseMessages.USER_NOT_FOUND,
          AlertResponse.ERROR
        );

      if (!user.active)
        return HTTPResponse.badRequest(
          res,
          UserHttpResponseMessages.USER_NOT_ACTIVE,
          AlertResponse.ERROR
        );

      const authService = new AuthService(user);
      HTTPResponse.OK(res, authService.tokenSuccess());
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }

  @Get('verify/:hash')
  private async verifyAccount(req: Request, res: Response) {
    try {
      const verifyAccountService = new VerifyAccountService(req.params.hash);
      const activationPassword = await verifyAccountService.getActivationPassword();

      if (!activationPassword)
        return HTTPResponse.badRequest(
          res,
          UserHttpResponseMessages.USER_NOT_ACTIVE,
          AlertResponse.ERROR
        );

      const userService = new UserService(activationPassword.UserId);
      const user = await userService.findByPk();

      if (!user)
        return HTTPResponse.notFound(
          res,
          UserHttpResponseMessages.USER_NOT_FOUND,
          AlertResponse.ERROR
        );

      await userService.activateUser(user, activationPassword);

      HTTPResponse.OK(res, verifyAccountService.getAccountVerifiedResponse());
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }

  @Post('register')
  @Middleware(UserValidation.saveUserValidation)
  private async register(req: Request, res: Response) {
    try {
      const userValidator = new UserValidation(
        req.body.password,
        req.body.password2
      );

      if (!userValidator.validateInput(req))
        return HTTPResponse.badRequest(
          res,
          userValidator.errorMessage,
          AlertResponse.ERROR
        );

      const userService = new UserService(-1, req.body.email);
      const existingUser = await userService.findByEmail();

      if (existingUser)
        return HTTPResponse.badRequest(
          res,
          UserHttpResponseMessages.USER_EXISTS,
          AlertResponse.ERROR
        );

      if (!userValidator.verifyPasswordsMatch())
        return HTTPResponse.badRequest(
          res,
          UserHttpResponseMessages.PASSWORD_NOT_MATCH,
          AlertResponse.ERROR
        );

      const user = await userService.create(req.body, 12);
      if (!user)
        return HTTPResponse.badRequest(
          res,
          UserHttpResponseMessages.USER_NOT_CREATED,
          AlertResponse.ERROR
        );

      const authService = new AuthService(user);
      await authService.createActivationPassword();

      HTTPResponse.OK(res, authService.getRegisterUserSuccessResponse());
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }

  @Post('login')
  private async login(req: Request, res: Response) {
    try {
      const userService = new UserService(-1, req.body.email);
      const existingUser = await userService.findByEmail();

      if (!existingUser)
        return HTTPResponse.badRequest(
          res,
          UserHttpResponseMessages.INVALID_CREDENTIALS,
          AlertResponse.ERROR
        );

      if (!existingUser.active)
        return HTTPResponse.badRequest(
          res,
          UserHttpResponseMessages.USER_NOT_ACTIVE,
          AlertResponse.ERROR
        );

      const authService = new AuthService(existingUser);
      const passwordVerified = await authService.verifyLoginPassword(
        req.body.password
      );

      if (!passwordVerified)
        return HTTPResponse.badRequest(
          res,
          UserHttpResponseMessages.INVALID_CREDENTIALS,
          AlertResponse.ERROR
        );

      HTTPResponse.OK(res, authService.loginSuccess());
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }
}

export default customJwtManager;
