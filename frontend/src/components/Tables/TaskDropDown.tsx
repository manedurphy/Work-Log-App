import React, { useContext } from 'react';
import { ITask } from '../../global/types/type';
import IncompleteTaskActions from '../Actions/IncompleteTasks';
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Box,
  Collapse,
} from '@material-ui/core';
import { GlobalContext } from '../../context/GlobalState';
import CompletedTasks from '../Actions/CompletedTasks';

const TaskDropDown: React.FC<{
  row: ITask;
  open: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingEditTask: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props): JSX.Element => {
  const { showCompleted } = useContext(GlobalContext).state.tasks;
  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
        <Collapse in={props.open} timeout="auto" unmountOnExit>
          <Box margin={1}>
            <Table size="small" aria-label="more-information">
              <TableHead>
                <TableRow>
                  <TableCell>Hours for BIM</TableCell>
                  <TableCell>Review Hours</TableCell>
                  <TableCell>Hours Remaining</TableCell>
                  <TableCell>Due Date</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{props.row.hoursRequiredByBim}</TableCell>
                  <TableCell>{props.row.reviewHours}</TableCell>
                  <TableCell>{props.row.hoursRemaining}</TableCell>
                  <TableCell>
                    {props.row.dueDate.toString().slice(0, 10)}
                  </TableCell>
                  <TableCell>{props.row.notes}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            {showCompleted ? (
              <CompletedTasks
                row={props.row}
                setLoading={props.setLoading}
                setLoadingEditTask={props.setLoadingEditTask}
              />
            ) : (
              <IncompleteTaskActions
                row={props.row}
                setLoading={props.setLoading}
                setLoadingEditTask={props.setLoadingEditTask}
              />
            )}
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

export default TaskDropDown;
