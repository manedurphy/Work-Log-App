export enum TaskHttpResponseMessages {
  TASK_NOT_FOUND = 'Task could not be found',
  TASK_EXISTS = 'Task with that project number already exists',
  TASK_CREATED = 'Task Created!',
  TASK_DELETED = 'Task Deleted!',
  TASK_COMPLETED = 'Task Completed!',
  TASK_UPDATED = 'Task Updated!',
}

export enum UserHttpResponseMessages {
  USER_NOT_FOUND = 'User could not be found',
  USER_NOT_ACTIVE = 'Account has not been verified',
  ACTIVATION_PASSWORD_NOT_FOUND = 'User could not be verified',
}
