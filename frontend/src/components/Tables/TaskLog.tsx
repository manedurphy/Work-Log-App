import React, { useState } from 'react';
import moment from 'moment';
import { ILog } from '../../type';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
  LibraryBooks,
} from '@material-ui/icons';
import {
  Table,
  TableRow,
  TableCell,
  TableBody,
  TableHead,
  IconButton,
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
  const [modify, setModify] = useState(false);
  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Date</TableCell>
          <TableCell>Name</TableCell>
          <TableCell>Project Number</TableCell>
          <TableCell>Hours Permitted</TableCell>
          <TableCell>Hours Worked</TableCell>
          <TableCell>Review Hours</TableCell>
          <TableCell>Hours for BIM</TableCell>
          <TableCell>Hours Remaining</TableCell>
          {!props.showCompleted && <TableCell>Actions</TableCell>}
        </TableRow>
      </TableHead>
      <TableBody className="action-cell">
        {props.taskLog &&
          props.taskLog.map((row) => (
            <TableRow key={row.id} style={{ cursor: 'pointer' }} id="tableId">
              <TableCell>
                {moment().format(row.createdAt).slice(0, 10)}
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.projectNumber}</TableCell>
              <TableCell>{row.hoursAvailableToWork}</TableCell>
              <TableCell>{row.hoursWorked}</TableCell>
              <TableCell>{row.numberOfReviews}</TableCell>
              <TableCell>{row.hoursRequiredByBim}</TableCell>
              <TableCell>{row.hoursRemaining}</TableCell>
              {!props.showCompleted && (
                <TableCell>
                  {!modify ? (
                    <IconButton onClick={() => setModify(!modify)}>
                      <MoreVertIcon />
                    </IconButton>
                  ) : (
                    <>
                      <IconButton
                        onClick={(e) =>
                          props.handleAction(e, row.projectNumber, 'edit')
                        }
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={(e) =>
                          props.handleAction(e, row.projectNumber, 'delete')
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                      <IconButton
                        onClick={(e) =>
                          props.handleAction(e, row.projectNumber, 'success')
                        }
                      >
                        <CheckCircleOutlineIcon />
                      </IconButton>
                      <IconButton
                        onClick={(e) =>
                          props.handleAction(e, row.projectNumber, 'log')
                        }
                      >
                        <LibraryBooks />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
};

export default TaskLog;
