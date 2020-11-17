import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import { Get, Post, Controller, Middleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import { User, ActivationPassword } from '../../models/models';
import { body, validationResult } from 'express-validator';
import { hash, compare } from 'bcrypt';
import sgMail = require('@sendgrid/mail');
import { CheckUserExistance } from './checkUserExistance';
import { HTTPResponse } from '../HTTP/httpResponses';
import { UserHttpResponseMessages } from '../HTTP/httpEnums';
import { JWTServices } from './jwtServices';
import { Uservalidation } from './userValidation';

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
          UserHttpResponseMessages.USER_NOT_FOUND
        );

      if (!user.active)
        return HTTPResponse.badRequest(
          res,
          UserHttpResponseMessages.USER_NOT_ACTIVE
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
          UserHttpResponseMessages.USER_NOT_ACTIVE
        );

      const user = await CheckUserExistance.findUserByPk(
        activationPassword.UserId
      );

      if (!user)
        return HTTPResponse.notFound(
          res,
          UserHttpResponseMessages.USER_NOT_FOUND
        );

      await JWTServices.activateUser(user, activationPassword);

      HTTPResponse.OK(res, JWTServices.getAccountVerifiedResponse());
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }

  @Post('register')
  @Middleware(Uservalidation.saveUserValidation)
  private async register(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ message: errors.array()[0].msg });

      const { firstName, lastName, email, password, password2 } = req.body;
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser)
        return res.status(400).json({ message: 'User already exists' });

      if (password !== password2)
        return res.status(400).json({ message: 'Passwords did not match' });

      const hashPassword = await hash(password, 12);
      if (!hashPassword)
        return res
          .status(400)
          .json({ message: 'Please try a different password' });

      const user = await User.create({
        firstName,
        lastName,
        email,
        active: false,
        password: hashPassword,
      });

      sgMail.setApiKey(process.env.SENDGRID_API as string);

      const activationPassword = require('crypto')
        .randomBytes(80)
        .toString('hex');

      await ActivationPassword.create({
        password: activationPassword,
        UserId: user.id,
      });

      const msg = {
        to: process.env.TEST_EMAIL as string,
        from: process.env.ETHEREAL_EMAIL as string,
        subject: 'Verify your account',
        html: `<p>Click the link to verify your account http://localhost:3000/verify/${activationPassword}</p>`,
      };
      await sgMail.send(msg);
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }

  @Post('login')
  private async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ where: { email } });

      if (!existingUser)
        return res.status(400).json({ message: 'Invalid Credentials' });

      if (!existingUser.active)
        return res.status(400).json({ message: 'Email has not been verified' });

      const existingPassword = existingUser.get('password');
      const passwordMatches = await compare(password, existingPassword);

      if (!passwordMatches)
        return res.status(400).json({ message: 'Invalid Credentials' });

      const jwtStr = customJwtManager.jwt({
        email,
        id: existingUser.id,
      });

      return res.status(200).json({
        jwt: jwtStr,
        user: {
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          email: existingUser.email,
        },
      });
    } catch (error) {
      HTTPResponse.serverError(res);
    }
  }
}

export default customJwtManager;
