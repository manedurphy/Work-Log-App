import React, { useState, useContext } from 'react';
import DropDown from './DropDown';
import IncompleteTaskActions from '../Actions/IncompleteTasks';
import CompletedTaskActions from '../Actions/CompletedTasks';
import MoreVert from '../Actions/MoreVert';
import moment from 'moment';
import { GlobalContext } from '../../context/GlobalState';
import { ITask } from '../../type';
import { TableRow, TableCell, IconButton } from '@material-ui/core';
import {
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@material-ui/icons';

const Row: React.FC<{
  key: number;
  row: ITask;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props) => {
  const [open, setOpen] = useState(false);
  const [modify, setModify] = useState(false);
  const { tasks } = useContext(GlobalContext).state;

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          {moment().format(props.row.dateAssigned).slice(0, 10)}
        </TableCell>
        <TableCell>{props.row.name}</TableCell>
        <TableCell>{props.row.projectNumber}</TableCell>
        <TableCell>{props.row.hoursAvailableToWork}</TableCell>
        <TableCell>{props.row.hoursWorked}</TableCell>
        <TableCell>{props.row.numberOfReviews}</TableCell>
        {tasks.showCompleted && modify ? (
          <CompletedTaskActions
            setLoading={props.setLoading}
            row={props.row}
            setModify={setModify}
          />
        ) : !tasks.showCompleted && modify ? (
          <IncompleteTaskActions
            setLoading={props.setLoading}
            row={props.row}
            setModify={setModify}
          />
        ) : (
          <MoreVert modify={modify} setModify={setModify} />
        )}
      </TableRow>
      <DropDown row={props.row} open={open} />
    </>
  );
};

export default Row;
