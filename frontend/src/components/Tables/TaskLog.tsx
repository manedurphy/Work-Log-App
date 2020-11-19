import React from 'react';
import Row from './Row';
import { ILog } from '../../type';
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
} from '@material-ui/core';

const TaskLog: React.FC<{
  showCompleted: boolean;
  taskLog: ILog[];
  handleAction: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    projectNumber: number,
    command: string
  ) => void;
}> = (props) => {
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell>Date</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Project Number</TableCell>
          <TableCell>Hours Permitted</TableCell>
          <TableCell>Hours Worked</TableCell>
          <TableCell>No. Reviews</TableCell>
          <TableCell>Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody className="action-cell">
        {props.taskLog &&
          props.taskLog.map((row) => (
            <Row
              key={row.id}
              row={row}
              showComplete={props.showCompleted}
              handleAction={props.handleAction}
            />
          ))}
      </TableBody>
    </Table>
  );
};

export default TaskLog;
