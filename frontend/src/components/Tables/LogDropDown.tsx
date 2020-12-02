import React from 'react';
import LogActions from '../Actions/Log';
import { ILog } from '../../global/types/type';
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Box,
  Collapse,
} from '@material-ui/core';

const TaskDropDown: React.FC<{
  row: ILog;
  open: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingEditTask: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props): JSX.Element => {
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
                  <TableCell>Status</TableCell>
                  <TableCell>Notes</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>{props.row.hoursRequiredByBim}</TableCell>
                  <TableCell>{props.row.reviewHours}</TableCell>
                  <TableCell>{props.row.hoursRemaining}</TableCell>
                  <TableCell>
                    {props.row.complete ? 'Complete' : 'In progress'}
                  </TableCell>
                  <TableCell>{props.row.notes}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          <Box display="flex" justifyContent="flex-end">
            <LogActions
              row={props.row}
              setLoading={props.setLoading}
              setLoadingEditTask={props.setLoadingEditTask}
            />
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

export default TaskDropDown;
