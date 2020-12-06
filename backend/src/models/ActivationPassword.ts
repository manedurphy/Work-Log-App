import { Model } from 'sequelize';
import {
  ActivationPasswordAttributes,
  ActivationPasswordCreationAttributes,
} from '../interfaces/activationPassword';

export class ActivationPassword
  extends Model<
    ActivationPasswordAttributes,
    ActivationPasswordCreationAttributes
  >
  implements ActivationPasswordAttributes {
  public id!: number;
  public password!: string;
  public UserId!: number;
}
