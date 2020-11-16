import { Optional } from 'sequelize';

export interface UserAttributes {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  active: boolean;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, 'id'> {}
