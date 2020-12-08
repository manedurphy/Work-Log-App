import { hash } from 'bcrypt';
import { ActivationPassword, User } from '../../models/models';
import { CreateUserType } from './types';

export class UserService {
  private primaryKey: number;
  private email: string;

  constructor(primaryKey: number, email: string = '') {
    this.primaryKey = primaryKey;
    this.email = email;
  }

  public findByPk(): Promise<User | null> {
    return User.findByPk(this.primaryKey);
  }

  public findByEmail(): Promise<User | null> {
    return User.findOne({ where: { email: this.email } });
  }

  public activateUser(
    user: User,
    activationPassword: ActivationPassword
  ): Promise<void> {
    user.update({ active: true });
    return activationPassword.destroy();
  }

  public create: CreateUserType = async (registerInput, salt) => {
    registerInput.password = await hash(registerInput.password, salt);
    return User.create(registerInput);
  };

  public createActivationPassword(userId: number): Promise<ActivationPassword> {
    const activationPassword = require('crypto')
      .randomBytes(80)
      .toString('hex');

    return ActivationPassword.create({
      password: activationPassword,
      UserId: userId,
    });
  }
}
