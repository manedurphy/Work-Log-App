import React, { useState } from 'react';
import MoreVert from '../Actions/MoreVert';
import LogDropDown from './LogDropDown';
import moment from 'moment';
import LogActions from '../Actions/Log';
import { ILog } from '../../global/types/type';
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

const Row: React.FC<{
  key: number;
  row: ILog;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingEditTask: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props) => {
  const [open, setOpen] = useState(false);
  const [modify, setModify] = useState(false);
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
        <TableCell>
          {moment().format(props.row.loggedAt).slice(0, 10)}
        </TableCell>
        <TableCell>{props.row.name}</TableCell>
        <TableCell>{props.row.projectNumber}</TableCell>
        <TableCell>{props.row.hoursAvailableToWork}</TableCell>
        <TableCell>{props.row.hoursWorked}</TableCell>
        <TableCell>{props.row.numberOfReviews}</TableCell>
        <TableCell>
          {!modify ? (
            <MoreVert modify={modify} setModify={setModify} />
          ) : (
            <LogActions
              row={props.row}
              setModify={setModify}
              setLoadingEditTask={props.setLoadingEditTask}
            />
          )}
        </TableCell>
      </TableRow>
      <LogDropDown row={props.row} open={open} />
    </>
  );
};

export default Row;
