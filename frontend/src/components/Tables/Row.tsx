import React, { useState } from 'react';
import Title from '../Title';
import IncompleteTaskActions from '../Actions/IncompleteTasks';
import CompletedTaskActions from '../Actions/CompletedTasks';
import MoreVert from '../Actions/MoreVert';
import moment from 'moment';
import LogActions from '../Actions/Log';
import { ITask, SetAlertsAndHandleResponseType } from '../../type';
import {
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@material-ui/icons';
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  IconButton,
  Box,
  Collapse,
} from '@material-ui/core';
import { useContext } from 'react';
import { GlobalContext } from '../../context/GlobalState';

const Row: React.FC<{
  key: number;
  row: ITask;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertsAndHandleResponse: SetAlertsAndHandleResponseType;
}> = (props) => {
  const [open, setOpen] = useState(false);
  const [modify, setModify] = useState(false);
  const { log, tasks } = useContext(GlobalContext).state;

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
          {moment().format(props.row.createdAt).slice(0, 10)}
        </TableCell>
        <TableCell>{props.row.name}</TableCell>
        <TableCell>{props.row.projectNumber}</TableCell>
        <TableCell>{props.row.hoursAvailableToWork}</TableCell>
        <TableCell>{props.row.hoursWorked}</TableCell>
        <TableCell>{props.row.numberOfReviews}</TableCell>
        {log.showLog ? (
          <TableCell>
            {!modify ? (
              <MoreVert modify={modify} setModify={setModify} />
            ) : (
              <LogActions
                setAlertsAndHandleResponse={props.setAlertsAndHandleResponse}
                row={props.row}
              />
            )}
          </TableCell>
        ) : !tasks.showCompleted && !log.showLog ? (
          <TableCell>
            {!modify ? (
              <MoreVert modify={modify} setModify={setModify} />
            ) : (
              <IncompleteTaskActions
                setLoading={props.setLoading}
                setAlertsAndHandleResponse={props.setAlertsAndHandleResponse}
                row={props.row}
              />
            )}
          </TableCell>
        ) : (
          <TableCell>
            {!modify ? (
              <MoreVert modify={modify} setModify={setModify} />
            ) : (
              <CompletedTaskActions
                setLoading={props.setLoading}
                setAlertsAndHandleResponse={props.setAlertsAndHandleResponse}
                row={props.row}
              />
            )}
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Title>More Information</Title>
              <Table size="small" aria-label="more-information">
                <TableHead>
                  <TableRow>
                    <TableCell>Hours for BIM</TableCell>
                    <TableCell>Review Hours</TableCell>
                    <TableCell>Hours Remaining</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{props.row.hoursRequiredByBim}</TableCell>
                    <TableCell>{props.row.reviewHours}</TableCell>
                    <TableCell>{props.row.hoursRemaining}</TableCell>
                    <TableCell>{props.row.notes}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
