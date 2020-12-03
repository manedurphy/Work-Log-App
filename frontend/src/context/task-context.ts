import React from 'react';
import { TaskAction, TaskStateType } from '../global/types/type';
import { getFormDate } from '../global/functions/helpers';

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
    dateAssigned: getFormDate(),
    dueDate: getFormDate(),
    UserId: -1,
    createdAt: '',
    updatedAt: '',
  },
  currentTasks: [],
  displayTasks: [],
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
