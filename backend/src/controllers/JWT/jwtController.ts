import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import { Get, Post, Controller, Middleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import { CheckUserExistance } from './checkUserExistance';
import { HTTPResponse } from '../HTTP/httpResponses';
import { AlertResponse, UserHttpResponseMessages } from '../HTTP/httpEnums';
import { JWTServices } from './jwtServices';
import { UserValidation } from './userValidation';

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
      const user = await CheckUserExistance.findUser(req.payload.email);

      if (!user)
        return HTTPResponse.notFound(
          res,
          UserHttpResponseMessages.USER_NOT_FOUND,
          AlertResponse.ERROR
        );

      if (!JWTServices.verifyAccountIsActive(user))
        return HTTPResponse.badRequest(
          res,
          UserHttpResponseMessages.USER_NOT_ACTIVE,
          AlertResponse.ERROR
        );

      HTTPResponse.OK(res, JWTServices.tokenSuccess(user));
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }

  @Get('verify/:hash')
  private async verifyAccount(req: Request, res: Response) {
    try {
      const activationPassword = await JWTServices.getActivationPassword(req);

      if (!activationPassword)
        return HTTPResponse.badRequest(
          res,
          UserHttpResponseMessages.USER_NOT_ACTIVE,
          AlertResponse.ERROR
        );

      const user = await CheckUserExistance.findUserByPk(
        activationPassword.UserId
      );

      if (!user)
        return HTTPResponse.notFound(
          res,
          UserHttpResponseMessages.USER_NOT_FOUND,
          AlertResponse.ERROR
        );

      await JWTServices.activateUser(user, activationPassword);

      HTTPResponse.OK(res, JWTServices.getAccountVerifiedResponse());
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }

  @Post('register')
  @Middleware(UserValidation.saveUserValidation)
  private async register(req: Request, res: Response) {
    try {
      const userValidator = new UserValidation();

      if (!userValidator.validateInput(req))
        return HTTPResponse.badRequest(
          res,
          userValidator.errorMessage,
          AlertResponse.ERROR
        );

      const existingUser = await CheckUserExistance.findUser(req.body.email);
      if (existingUser)
        return HTTPResponse.badRequest(
          res,
          UserHttpResponseMessages.USER_EXISTS,
          AlertResponse.ERROR
        );

      if (!JWTServices.verifyPasswordsMatch(req.body))
        return HTTPResponse.badRequest(
          res,
          UserHttpResponseMessages.PASSWORD_NOT_MATCH,
          AlertResponse.ERROR
        );

      const user = await JWTServices.createNewUser(req.body, 12);
      if (!user)
        return HTTPResponse.badRequest(
          res,
          UserHttpResponseMessages.USER_NOT_CREATED,
          AlertResponse.ERROR
        );

      await JWTServices.createActivationPassword(user.id);

      HTTPResponse.OK(res, JWTServices.getRegisterUserSuccessResponse());
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }

  @Post('login')
  private async login(req: Request, res: Response) {
    try {
      const existingUser = await CheckUserExistance.findUser(req.body.email);

      if (!existingUser)
        return HTTPResponse.badRequest(
          res,
          UserHttpResponseMessages.INVALID_CREDENTIALS,
          AlertResponse.ERROR
        );

      if (!JWTServices.verifyAccountIsActive(existingUser))
        return HTTPResponse.badRequest(
          res,
          UserHttpResponseMessages.USER_NOT_ACTIVE,
          AlertResponse.ERROR
        );

      const passwordVerified = await JWTServices.verifyLoginPassword(
        req.body.password,
        existingUser.password
      );
      if (!passwordVerified)
        return HTTPResponse.badRequest(
          res,
          UserHttpResponseMessages.INVALID_CREDENTIALS,
          AlertResponse.ERROR
        );

      HTTPResponse.OK(res, JWTServices.loginSuccess(existingUser));
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }
}

export default customJwtManager;
