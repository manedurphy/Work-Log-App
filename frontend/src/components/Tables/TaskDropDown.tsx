import React from 'react';
import Title from '../Title';
import { ITask } from '../../global/types/type';
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
  row: ITask;
  open: boolean;
}> = (props) => {
  return (
    <TableRow>
      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
        <Collapse in={props.open} timeout="auto" unmountOnExit>
          <Box margin={1}>
            <Title>More Information</Title>
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
                  <TableCell>{props.row.dueDate.slice(0, 10)}</TableCell>
                  <TableCell>{props.row.notes}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  );
};

export default TaskDropDown;
