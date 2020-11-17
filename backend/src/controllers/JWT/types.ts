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

export type ActivateUserType = (
  user: User,
  activationPassword: ActivationPassword
) => Promise<void>;
