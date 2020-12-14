import { DataTypes, Sequelize } from 'sequelize';
import { Productivity } from './Productivity';
import * as Models from './index';

const sequelize = new Sequelize(
  'workLogger',
  process.env.MySQL_USERNAME as string,
  process.env.MySQL_PASSWORD as string,
  {
    host: 'localhost',
    dialect: 'mysql',
  }
);

Models.User.init(
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

Models.Task.init(
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
    dateAssigned: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATE,
      allowNull: true,
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

Models.Log.init(
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
    loggedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    TaskId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserId: {
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

Models.ActivationPassword.init(
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

Productivity.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    day: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    weekOf: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    LogId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
  }
);

Models.User.hasMany(Models.Task);
Models.User.hasMany(Models.Log);
Models.User.hasMany(Models.Productivity);
Models.Log.hasOne(Productivity);
Models.User.hasOne(Models.ActivationPassword);
Models.ActivationPassword.belongsTo(Models.User);
Models.Productivity.belongsTo(Models.Log);
Models.Productivity.belongsTo(Models.User);
Models.Task.hasMany(Models.Log);
Models.Task.belongsTo(Models.User);
Models.Log.belongsTo(Models.User);
Models.Log.belongsTo(Models.Task);

(async () => {
  await Models.User.sync();
  await Models.ActivationPassword.sync();
  await Models.Task.sync();
  await Models.Log.sync();
  await Models.Productivity.sync();
})();

export * from './index';
export default sequelize;
