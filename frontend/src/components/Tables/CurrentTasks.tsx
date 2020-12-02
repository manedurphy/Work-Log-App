import React, { useState, useContext, useEffect } from 'react';
import TaskRow from './TaskRow';
import { GlobalContext } from '../../context/GlobalState';
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Box,
} from '@material-ui/core';

const CurrentTasks: React.FC<{
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingEditTask: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props): JSX.Element => {
  const [showTaskBody, setShowTaskBody] = useState(false);
  const tasks = useContext(GlobalContext).state.tasks.currentTasks;

  useEffect(() => {
    tasks.length ? setShowTaskBody(true) : setShowTaskBody(false);
  }, [tasks]);

  return showTaskBody ? (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell />
          <TableCell>Assigned On</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Project Number</TableCell>
          <TableCell>Hours Permitted</TableCell>
          <TableCell>Hours Worked</TableCell>
          <TableCell>No. Reviews</TableCell>
        </TableRow>
      </TableHead>
      <TableBody className="action-cell">
        {tasks.map((row) => (
          <TaskRow
            key={row.id}
            row={row}
            setLoading={props.setLoading}
            setLoadingEditTask={props.setLoadingEditTask}
          />
        ))}
      </TableBody>
    </Table>
  ) : (
    <Box>No tasks to display</Box>
  );
};

export default CurrentTasks;
