import { Optional } from 'sequelize';

export interface ProductivityAttributes {
  id: number;
  day: string;
  weekOf: Date;
  hours: number;
}

export interface ProductivityCreationAttributes
  extends Optional<ProductivityAttributes, 'id'> {}
