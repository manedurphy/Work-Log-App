import React from 'react';
import { TaskAction, TaskStateType } from '../type';

export const initialTaskState: TaskStateType = {
  currentTask: {
    id: 0,
    name: '',
    projectNumber: 0,
    hoursAvailableToWork: 0,
    hoursWorked: 0,
    hoursRemaining: 0,
    notes: '',
    numberOfReviews: 0,
    reviewHours: 0,
    hoursRequiredByBim: 0,
    complete: false,
    UserId: -1,
    createdAt: '',
    updatedAt: '',
  },
  currentTasks: [],
  edit: false,
};

export const TaskContext = React.createContext<{
  state: TaskStateType;
  dispatch: React.Dispatch<TaskAction>;
}>({
  state: initialTaskState,
  dispatch: () => null,
});
