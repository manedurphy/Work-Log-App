import { Optional } from 'sequelize';

export interface ProductivityAttributes {
  id: number;
  day: number;
  weekOf: Date;
  hours: number;
  UserId: number;
}

export interface ProductivityCreationAttributes
  extends Optional<ProductivityAttributes, 'id'> {}
