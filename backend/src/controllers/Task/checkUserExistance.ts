import { UserAttributes } from 'src/interfaces/user';
import { User } from '../../models/models';

export class CheckUserExistance {
  public static async findUser(email: string): Promise<UserAttributes | null> {
    return await User.findOne({ where: { email } });
  }
}
