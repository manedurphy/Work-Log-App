import sgMail = require('@sendgrid/mail');
import { compare, hash } from 'bcrypt';
import { ActivationPassword, User } from '../../models/models';
import customJwtManager from './jwtController';
import {
  TokenSuccessType,
  VerifyAccountResponseGetterType,
  ActivateUserType,
  GetActivationPasswordType,
  CreateUserType,
  CreateActivationPasswordType,
  SendVerificationEmailType,
  VerifyPasswordsMatchType,
  VerifyAccountIsActiveType,
  VerifyLoginPasswordType,
  LoginSuccessType,
} from './types';

export class JWTServices {
  private static sendVerificationEmail: SendVerificationEmailType = async (
    activationPassword
  ) => {
    sgMail.setApiKey(process.env.SENDGRID_API as string);
    const msg = {
      to: process.env.TEST_EMAIL as string,
      from: process.env.ETHEREAL_EMAIL as string,
      subject: 'Verify your account',
      html: `<p>Click the link to verify your account http://localhost:3000/verify/${activationPassword}</p>`,
    };
    await sgMail.send(msg);
  };

  public static getAccountVerifiedResponse: VerifyAccountResponseGetterType = () => {
    return { isVerified: true };
  };

  public static tokenSuccess: TokenSuccessType = (user) => {
    return {
      message: 'Currently logged in',
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  };

  public static getActivationPassword: GetActivationPasswordType = async (
    req
  ) => {
    return await ActivationPassword.findOne({
      where: { password: req.params.hash },
    });
  };

  public static activateUser: ActivateUserType = async (
    user,
    activationPassword
  ) => {
    await user.update({ active: true });
    await activationPassword.destroy();
  };

  public static verifyPasswordsMatch: VerifyPasswordsMatchType = (
    registerInput
  ) => {
    return registerInput.password === registerInput.password2;
  };

  public static createNewUser: CreateUserType = async (registerInput, salt) => {
    registerInput.password = await hash(registerInput.password, salt);
    return await User.create(registerInput);
  };

  public static createActivationPassword: CreateActivationPasswordType = async (
    userId
  ) => {
    const activationPassword = require('crypto')
      .randomBytes(80)
      .toString('hex');

    await ActivationPassword.create({
      password: activationPassword,
      UserId: userId,
    });

    JWTServices.sendVerificationEmail(activationPassword);
  };

  public static getRegisterUserSuccessResponse = () => {
    return { success: true };
  };

  public static verifyAccountIsActive: VerifyAccountIsActiveType = (user) => {
    return user.active;
  };

  public static verifyLoginPassword: VerifyLoginPasswordType = async (
    passwordInput,
    existingPassword
  ) => {
    return await compare(passwordInput, existingPassword);
  };

  public static loginSuccess: LoginSuccessType = (user) => {
    return {
      jwt: customJwtManager.jwt({ email: user.email, id: user.id }),
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    };
  };
}
