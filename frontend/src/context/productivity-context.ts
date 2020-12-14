import React from 'react';
import { ProductivityStateType } from '../global/types/type';

export const initialProductivityState: ProductivityStateType = {
  percent: 0,
  status: 'unavailable',
  color: 'red',
};

export const LogContext = React.createContext<{
  state: ProductivityStateType;
  dispatch: React.Dispatch<ProductivityStateType>;
}>({
  state: initialProductivityState,
  dispatch: () => null,
});
