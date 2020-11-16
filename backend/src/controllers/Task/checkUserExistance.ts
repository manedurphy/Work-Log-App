import { User } from '../../models/models';

export class CheckUserExistance {
  public static async findUser(email: string) {
    return await User.findOne({ where: { email } });
  }
}
