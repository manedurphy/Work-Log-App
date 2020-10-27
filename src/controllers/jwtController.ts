import { JwtManager, ISecureRequest } from '@overnightjs/jwt';
import { Get, Post, Controller, Middleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import User from '../models/user';
import { IUserModel } from '../interfaces/user';
import { config } from 'dotenv';
config();

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
      const user = await User.findOne({ email: req.payload.email });

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

  @Post('register')
  private async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password, password2 } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser)
        return res.status(400).json({ message: 'User already exists' });

      if (password !== password2)
        return res.status(400).json({ message: 'Passwords did not match' });

      const user: IUserModel = new User({
        firstName,
        lastName,
        email,
        password,
      });

      await user.save();

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  @Post('login')
  private async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (!existingUser)
        return res.status(400).json({ message: 'Invalid Credentials' });

      const existingPassword = existingUser.get('password');

      if (password !== existingPassword)
        return res.status(400).json({ message: 'Invalid Credentials' });

      const jwtStr = customJwtManager.jwt({
        email,
        _id: existingUser._id,
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
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default customJwtManager;
