import { Model } from 'sequelize';
import {
  ProductivityAttributes,
  ProductivityCreationAttributes,
} from '../interfaces/productivity';

export class Productivity extends Model<
  ProductivityAttributes,
  ProductivityCreationAttributes
> {
  public id!: number;
  public day!: string;
  public weekOf!: Date;
  public hours!: number;
}
