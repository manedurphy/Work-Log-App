import {
  DataTypes,
  Sequelize,
  Association,
  Model,
  HasManyAddAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
} from 'sequelize';
import { UserAttributes, UserCreationAttributes } from '../interfaces/user';
import { TaskAttributes, TaskCreationAttributes } from '../interfaces/task';

const sequelize = new Sequelize('workLogger', 'root', 'dane1234', {
  host: 'localhost',
  dialect: 'mysql',
});

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public emailVerified!: boolean;
  public password!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date | null;

  public getTasks!: HasManyGetAssociationsMixin<Task>;
  public addTask!: HasManyAddAssociationMixin<Task, number>;
  public hasTask!: HasManyHasAssociationMixin<Task, number>;
  public countTasks!: HasManyCountAssociationsMixin;
  public createTask!: HasManyCreateAssociationMixin<Task>;

  public readonly currentTasks!: Task[];
  public readonly completedTasks!: Task[];

  public static associations: {
    tasks: Association<User, Task>;
  };
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    paranoid: true,
    modelName: 'User',
  }
);

export class Task
  extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes {
  public id!: number;
  public name!: string;
  public projectNumber!: number;
  public hoursAvailableToWork!: number;
  public hoursWorked!: number;
  public hoursRemaining!: number;
  public notes!: string | null;
  public numberOfReviews!: number;
  public reviewHours!: number;
  public hoursRequiredByBim!: number;
  public complete!: boolean;
  public UserId!: number;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    projectNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hoursAvailableToWork: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hoursWorked: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hoursRemaining: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    numberOfReviews: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reviewHours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hoursRequiredByBim: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    complete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: 'Task',
  }
);

User.hasMany(Task);
Task.belongsTo(User);

(async () => {
  await User.sync();
  await Task.sync();
})();
