import { Optional } from 'sequelize';

export interface ProductivityAttributes {
  id: number;
  day: number;
  weekOf: string;
  hours: number;
  UserId: number;
}

export interface ProductivityCreationAttributes
  extends Optional<ProductivityAttributes, 'id'> {}
