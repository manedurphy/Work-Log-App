import { ActivationPassword } from '../../models/models';
import { VerifyAccountResponseGetterType } from '../User/types';

export class VerifyAccountService {
  private hash: string;

  constructor(hash: string) {
    this.hash = hash;
  }

  public getAccountVerifiedResponse: VerifyAccountResponseGetterType = () => {
    return { isVerified: true };
  };

  public getActivationPassword(): Promise<ActivationPassword | null> {
    return ActivationPassword.findOne({
      where: { password: this.hash },
    });
  }
}
