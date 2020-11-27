import React from 'react';
import { TaskAction, TaskStateType } from '../global/types/type';

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
    dateAssigned: new Date(),
    dueDate: new Date(),
    UserId: -1,
    createdAt: '',
    updatedAt: '',
  },
  currentTasks: [],
  edit: false,
  showForm: false,
  showCompleted: false,
};

export const TaskContext = React.createContext<{
  state: TaskStateType;
  dispatch: React.Dispatch<TaskAction>;
}>({
  state: initialTaskState,
  dispatch: () => null,
});
