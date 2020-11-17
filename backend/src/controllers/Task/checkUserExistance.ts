import { User } from '../../models/models';

export class CheckUserExistance {
  public static async findUser(email: string): Promise<User | null> {
    return await User.findOne({ where: { email } });
  }

  public static async findUserByPk(userId: number): Promise<User | null> {
    return await User.findByPk(userId);
  }
}
