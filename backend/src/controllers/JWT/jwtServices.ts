import { ActivationPassword } from '../../models/models';
import {
  TokenSuccessType,
  VerifyAccountResponseGetterType,
  ActivateUserType,
  GetActivationPasswordType,
} from './types';

export class JWTServices {
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
}
