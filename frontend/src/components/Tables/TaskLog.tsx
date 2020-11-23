import React, { useState, useEffect, useContext } from 'react';
import Row from './Row';
import { SetAlertsAndHandleResponseType } from '../../type';
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
  setAlertsAndHandleResponse: SetAlertsAndHandleResponseType;
}> = (props) => {
  const [showLogBody, setShowLogBody] = useState(true);
  const currentLog = useContext(GlobalContext).state.log.currentLog;

  useEffect(() => {
    currentLog.length ? setShowLogBody(true) : setShowLogBody(false);
  }, [currentLog]);

  return (
    <Table size="small">
      {showLogBody ? (
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
            {currentLog &&
              currentLog.map((row) => (
                <Row
                  key={row.id}
                  row={row}
                  setLoading={props.setLoading}
                  setAlertsAndHandleResponse={props.setAlertsAndHandleResponse}
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
