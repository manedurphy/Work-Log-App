import React, { useState, useContext, useEffect } from 'react';
import Row from './Row';
import { setAlertsAndGetTasksType } from '../../type';
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Box,
} from '@material-ui/core';
import { GlobalContext } from '../../context/GlobalState';

const CurrentTasks: React.FC<{
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertsAndGetTasks: setAlertsAndGetTasksType;
}> = (props) => {
  const [showTaskBody, setShowTaskBody] = useState(false);
  const tasks = useContext(GlobalContext).state.tasks.currentTasks;

  useEffect(() => {
    tasks.length ? setShowTaskBody(true) : setShowTaskBody(false);
  }, [tasks]);

  return (
    <Table size="small">
      {showTaskBody ? (
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
            {tasks.map((row) => (
              <Row
                key={row.id}
                row={row}
                setLoading={props.setLoading}
                setAlertsAndGetTasks={props.setAlertsAndGetTasks}
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
