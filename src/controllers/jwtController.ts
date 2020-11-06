import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import { Get, Post, Controller, Middleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import { User } from '../models/models';
import { body, validationResult } from 'express-validator';
import { hash, compare } from 'bcrypt';
import sgMail = require('@sendgrid/mail');

const customJwtManager = new JwtManager(
  process.env.OVERNIGHT_JWT_SECRET as string,
  process.env.OVERNIGHT_JWT_EXP as string
);

@Controller('api/auth')
export class JWTController {
  private serverError = (res: Response) =>
    res.status(500).json('Internal Server Error');

  @Get('token')
  @Middleware(customJwtManager.middleware)
  private async checkToken(req: ISecureRequest, res: Response) {
    try {
      const user = await User.findOne({ where: { email: req.payload.email } });
      return res.status(200).json({
        message: 'Currently logged in',
        user: {
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
        },
      });
    } catch (error) {
      res.status(401).json({ isLoggedIn: false });
    }
  }

  @Get('verify')
  @Middleware(customJwtManager.middleware)
  private async verifyAccount(req: ISecureRequest, res: Response) {
    try {
      const user = await User.findOne({ where: { email: req.payload.email } });
      if (!user) return res.json({ message: 'User could not be verified' });

      await user.update({
        emailVerified: true,
      });

      res.json({ isVerified: true });
    } catch (error) {
      this.serverError(res);
    }
  }

  @Post('register')
  @Middleware([
    body('firstName').not().isEmpty().withMessage('Must include first name'),
    body('lastName').not().isEmpty().withMessage('Must include last name'),
    body('email').isEmail().withMessage('Invalid email'),
  ])
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
        emailVerified: false,
        password: hashPassword,
      });
      const jwtStr = customJwtManager.jwt({
        email: user.email,
      });

      sgMail.setApiKey(`${process.env.SENDGRID_API}`);

      const msg = {
        to: `${process.env.TEST_EMAIL}`,
        from: `${process.env.ETHEREAL_EMAIL}`,
        subject: 'Verify your account',
        html:
          '<p>Click the link to verify your account http://localhost:3000/verify</p>',
      };
      await sgMail.send(msg);
      res.status(200).json({
        success: true,
        jwt: jwtStr,
      });
    } catch (error) {
      this.serverError(res);
    }
  }

  @Post('login')
  private async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const existingUser = await User.findOne({ where: { email } });

      if (!existingUser)
        return res.status(400).json({ message: 'Invalid Credentials' });

      if (!existingUser.emailVerified)
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
      this.serverError(res);
    }
  }
}

export default customJwtManager;
