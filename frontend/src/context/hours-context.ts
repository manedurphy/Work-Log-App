import React from 'react';
import { HoursStateType, HoursWorkedAction } from '../global/types/type';

export const initialHoursWorked: HoursStateType = 0;

export const LogContext = React.createContext<{
  state: HoursStateType;
  dispatch: React.Dispatch<HoursWorkedAction>;
}>({
  state: initialHoursWorked,
  dispatch: () => null,
});
