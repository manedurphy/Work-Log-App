export enum Tasks {
  updateTask = 'UPDATE_TASK',
  updateTasks = 'UPDATE_TASKS',
  setShowCompleted = 'SET_SHOW_COMPLETED',
  setShowForm = 'SET_SHOW_FORM',
}

export enum Users {
  setUser = 'SET_USER',
  clearUser = 'CLEAR_USER',
}

export enum Logs {
  setLog = 'SET_LOG',
  setLogs = 'SET_LOGS',
  setShowLog = 'SET_SHOW_LOG',
}

export enum Alerts {
  setAlerts = 'SET_ALERTS',
  removeAlerts = 'REMOVE_ALERTS',
}

export enum Commands {
  SUCCESS = 'success',
  UPDATE = 'update',
  DELETE = 'delete',
  EDIT = 'edit',
  LOG = 'log',
}

export enum Dates {
  setDateAndTasksDue = 'SET_DATE_AND_TASKS_DUE',
  DAYS = 'days',
  ADD = 'add',
  SUBTRACT = 'subtract',
}
