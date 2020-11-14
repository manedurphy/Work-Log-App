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
import { LogAttributes, LogCreationAttributes } from '../interfaces/log';
import {
  ActivationPasswordAttributes,
  ActivationPasswordCreationAttributes,
} from '../interfaces/activationPassword';

const sequelize = new Sequelize(
  'workLogger',
  process.env.MySQL_USERNAME as string,
  process.env.MySQL_PASSWORD as string,
  {
    host: 'localhost',
    dialect: 'mysql',
  }
);

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  public email!: string;
  public active!: boolean;
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
    active: {
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

export class Log
  extends Model<LogAttributes, LogCreationAttributes>
  implements LogAttributes {
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
  public TaskId!: number;

  public readonly createdAt!: Date;
}

Log.init(
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
    TaskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    createdAt: true,
    updatedAt: false,
    modelName: 'Log',
  }
);

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

ActivationPassword.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    timestamps: false,
  }
);

User.hasMany(Task);
User.hasOne(ActivationPassword);
ActivationPassword.belongsTo(User);
Task.hasMany(Log);
Task.belongsTo(User);

(async () => {
  await User.sync();
  await ActivationPassword.sync();
  await Task.sync();
  await Log.sync();
})();
