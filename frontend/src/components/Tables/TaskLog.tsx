import React, { useState, useEffect, useContext } from 'react';
import LogRow from './LogRow';
import { GlobalContext } from '../../context/GlobalState';
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  Box,
} from '@material-ui/core';

const TaskLog: React.FC<{
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setLoadingEditTask: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props): JSX.Element => {
  const [showLogBody, setShowLogBody] = useState(true);
  const currentLogs = useContext(GlobalContext).state.log.currentLogs;

  useEffect(() => {
    currentLogs.length ? setShowLogBody(true) : setShowLogBody(false);
  }, [currentLogs]);

  return (
    <Table size="small">
      {showLogBody ? (
        <>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Logged On</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Project Number</TableCell>
              <TableCell>Hours Permitted</TableCell>
              <TableCell>Hours Worked</TableCell>
              <TableCell>No. Reviews</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="action-cell">
            {currentLogs.map((row) => (
              <LogRow
                key={row.id}
                row={row}
                setLoading={props.setLoading}
                setLoadingEditTask={props.setLoadingEditTask}
              />
            ))}
          </TableBody>
        </>
      ) : (
        <Box>No logs to show for this task</Box>
      )}
    </Table>
  );
};

export default TaskLog;
