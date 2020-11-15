import { TaskStateType, TaskAction } from '../type';
import { Logs, Tasks, Users } from '../enums';

export const taskReducer = (
  taskState: TaskStateType,
  action: TaskAction
): TaskStateType => {
  switch (action.type) {
    case Tasks.updateTasks:
      return { ...taskState, currentTasks: action.payload, edit: false };
    case Tasks.updateTask:
      return { ...taskState, currentTask: action.payload, edit: true };
    default:
      return taskState;
  }
};

export const userReducer = (userState: any, action: any) => {
  switch (action.type) {
    case Users.clearUser:
    case Users.setUser:
      return action.payload;
    default:
      return userState;
  }
};

export const logReducer = (logState: any, action: any) => {
  switch (action.type) {
    case Logs.setLog:
      return { ...logState, currentLog: action.payload };
    default:
      return logState;
  }
};
