import React from 'react';
import { TaskAction, TaskStateType } from '../type';

export const initialTaskState: TaskStateType = {
  currentTask: {
    _id: '',
    __v: 0,
    name: '',
    projectNumber: 0,
    hours: {
      hoursAvailableToWork: 0,
      hoursWorked: 0,
      hoursRemaining: 0,
    },
    description: '',
    reviews: {
      numberOfReviews: 0,
      reviewHours: 0,
      hoursRequiredByBim: 0,
    },
    complete: false,
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