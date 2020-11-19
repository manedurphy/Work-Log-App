import React from 'react';
import Row from './Row';
import { ITask } from '../../type';
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Box,
} from '@material-ui/core';

const CurrentTasks: React.FC<{
  showBody: boolean;
  showCompleted: boolean;
  currentTasks: ITask[];
  handleAction: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    projectNumber: number,
    command: string
  ) => void;
}> = (props) => {
  return (
    <Table size="small">
      {props.showBody ? (
        <>
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
            {props.currentTasks.map((row) => (
              <Row
                key={row.id}
                row={row}
                showCompleted={props.showCompleted}
                handleAction={props.handleAction}
              />
            ))}
          </TableBody>
        </>
      ) : (
        <Box>No tasks to display</Box>
      )}
    </Table>
  );
};

export default CurrentTasks;
