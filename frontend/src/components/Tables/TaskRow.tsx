import React, { useState } from 'react';
import TaskDropDown from './TaskDropDown';
import { ITask } from '../../global/types/type';
import { TableRow, TableCell, IconButton, makeStyles } from '@material-ui/core';
import {
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@material-ui/icons';

const useRowStyles = makeStyles({
  root: {
    '& > *': {
      borderBottom: 'unset',
    },
  },
});

const TaskRow: React.FC<{
  key: number;
  row: ITask;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingEditTask: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props): JSX.Element => {
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{props.row.dateAssigned.slice(0, 10)}</TableCell>
        <TableCell>{props.row.name}</TableCell>
        <TableCell>{props.row.projectNumber}</TableCell>
        <TableCell>{props.row.hoursAvailableToWork}</TableCell>
        <TableCell>{props.row.hoursWorked}</TableCell>
        <TableCell>{props.row.numberOfReviews}</TableCell>
      </TableRow>
      <TaskDropDown
        row={props.row}
        open={open}
        setLoading={props.setLoading}
        setLoadingEditTask={props.setLoadingEditTask}
      />
    </>
  );
};

export default TaskRow;
