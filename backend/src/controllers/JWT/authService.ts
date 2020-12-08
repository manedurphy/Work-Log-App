import sgMail = require('@sendgrid/mail');
import { compare } from 'bcrypt';
import { ActivationPassword, User } from '../../models/models';
import customJwtManager from './jwtController';
import { LoginSuccessType, TokenSuccessReturnType } from './types';

export class AuthService {
  private user: User;

  constructor(user: User) {
    this.user = user;
  }

  private sendVerificationEmail(activationPassword: string) {
    sgMail.setApiKey(process.env.SENDGRID_API as string);
    const msg = {
      to: process.env.TEST_EMAIL as string,
      from: process.env.ETHEREAL_EMAIL as string,
      subject: 'Verify your account',
      html: `<p>Click the link to verify your account http://localhost:3000/verify/${activationPassword}</p>`,
    };
    return sgMail.send(msg);
  }

  public tokenSuccess(): TokenSuccessReturnType {
    return {
      message: 'Currently logged in',
      user: {
        id: this.user.id,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
      },
    };
  }

  public getRegisterUserSuccessResponse = () => {
    return { success: true };
  };

  public verifyLoginPassword(passwordInput: string) {
    return compare(passwordInput, this.user.password);
  }

  public loginSuccess: LoginSuccessType = () => {
    return {
      jwt: customJwtManager.jwt({ email: this.user.email, id: this.user.id }),
      user: {
        id: this.user.id,
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
      },
    };
  };

  public async createActivationPassword(): Promise<void> {
    const activationPassword = require('crypto')
      .randomBytes(80)
      .toString('hex');

    await ActivationPassword.create({
      password: activationPassword,
      UserId: this.user.id,
    });

    await this.sendVerificationEmail(activationPassword);
  }

  public static getActivationPassword(
    hash: string
  ): Promise<ActivationPassword | null> {
    return ActivationPassword.findOne({
      where: { password: hash },
    });
  }
}
