export enum TaskHttpResponseMessages {
  TASK_NOT_FOUND = 'Task could not be found',
  TASK_EXISTS = 'Task with that project number already exists',
  TASK_CREATED = 'Task Created!',
  TASK_DELETED = 'Task Deleted!',
  TASK_COMPLETED = 'Task Completed!',
  TASK_UPDATED = 'Task Updated!',
  TASK_LOG_ITEM_DELETED = 'Log Deleted!',
}

export enum UserHttpResponseMessages {
  USER_NOT_FOUND = 'User could not be found',
  USER_NOT_ACTIVE = 'Account has not been verified',
  ACTIVATION_PASSWORD_NOT_FOUND = 'User could not be verified',
  USER_EXISTS = 'User already exists',
  PASSWORD_NOT_MATCH = 'Passwords did not match',
  BAD_PASSWORD = 'Please try a different password',
  USER_NOT_CREATED = 'User could not be registerd. Please try again',
  INVALID_CREDENTIALS = 'Invalid Credentials',
}
