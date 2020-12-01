import React from 'react';
import { DateAction, DateStateType } from '../global/types/type';
import { getDispatchDate } from '../global/functions/helpers';

export const initialDateState: DateStateType = {
  dueDate: getDispatchDate(),
  tasksDue: [],
};

export const AlertContext = React.createContext<{
  state: DateStateType;
  dispatch: React.Dispatch<DateAction>;
}>({
  state: initialDateState,
  dispatch: () => null,
});
