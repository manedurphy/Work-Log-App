import { Request } from 'express';
import { ActivationPassword, User } from 'src/models/models';

export type TokenSuccessType = (
  user: User
) => {
  message: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

export type GetActivationPasswordType = (
  req: Request
) => Promise<ActivationPassword | null>;

export type VerifyAccountResponseGetterType = () => {
  isVerified: boolean;
};

export type VerifyPasswordsMatchType = (
  registerInput: RegisterUserInputType
) => boolean;

export type ActivateUserType = (
  user: User,
  activationPassword: ActivationPassword
) => Promise<void>;

type RegisterUserInputType = {
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
  password: string;
  password2: string;
};

export type CreateUserType = (
  registerInput: RegisterUserInputType,
  salt: number
) => Promise<User>;

export type CreateActivationPasswordType = (userId: number) => Promise<void>;

export type SendVerificationEmailType = (
  activationPassword: string
) => Promise<void>;

export type VerifyAccountIsActiveType = (user: User) => boolean;

export type VerifyLoginPasswordType = (
  passwordInput: string,
  existingPassword: string
) => Promise<boolean>;

export type LoginSuccessType = (
  user: User
) => {
  jwt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
};
