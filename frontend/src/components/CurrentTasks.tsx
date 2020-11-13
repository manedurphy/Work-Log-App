import React, { useContext, useState, useEffect } from 'react';
import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  makeStyles,
  IconButton,
  Box,
} from '@material-ui/core';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  CheckCircleOutline as CheckCircleOutlineIcon,
} from '@material-ui/icons';
import { Alert } from '@material-ui/lab';
import Title from './Title';
import moment from 'moment';
import axios, { AxiosResponse } from 'axios';
import { Tasks } from '../enums';
import { getToken, GlobalContext } from '../context/GlobalState';
import { AlertType, ITask, MessageType } from '../type';

function preventDefault(event: any) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

const CurrentTasks: React.FC<{
  getTasks: () => void;
  showCompleted: boolean;
}> = (props): JSX.Element => {
  const classes = useStyles();
  const [alerts, setAlerts] = useState<{
    success: AlertType;
    delete: AlertType;
    error: AlertType;
  }>({
    success: null,
    delete: null,
    error: null,
  });
  const { state, dispatch } = useContext(GlobalContext);
  const { currentTasks } = state.tasks;
  const [modify, setModify] = useState(false);
  const [showBody, setShowBody] = useState(false);

  useEffect(() => {
    currentTasks.length ? setShowBody(true) : setShowBody(false);
  }, [currentTasks]);

  const setAlertsAndGetTasks = (
    command: string,
    message: string,
    err: Error | null = null
  ) => {
    if (!err) props.getTasks();

    setAlerts({ ...alerts, [command]: message });
    setTimeout(() => {
      setAlerts({ success: null, delete: null, error: null });
    }, 3000);
  };

  const handleAction = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    projectNumber: number,
    command: string
  ) => {
    e.preventDefault();
    let res: AxiosResponse<MessageType>;
    const token = getToken();

    try {
      if (command === 'success') {
        const task: AxiosResponse<ITask> = await axios.get(
          `api/task/${projectNumber}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        task.data.complete = true;

        res = await axios.put(
          `api/task/${task.data.projectNumber}`,
          task.data,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAlertsAndGetTasks(command, res.data.message);
      } else if (command === 'delete') {
        res = await axios.delete(`api/task/${projectNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAlertsAndGetTasks(command, res.data.message);
      } else {
        const task = await axios.get(`api/task/${projectNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        dispatch({ type: Tasks.updateTask, payload: task.data });
      }
    } catch (err) {
      setAlertsAndGetTasks('error', err.response.data.message, err);
    }
  };

  return (
    <React.Fragment>
      {alerts.error && (
        <Alert severity="error" role="alert">
          {alerts.error}
        </Alert>
      )}
      {alerts.success && (
        <Alert severity="success" role="alert">
          {alerts.success}
        </Alert>
      )}
      {alerts.delete && (
        <Alert severity="warning" role="alert">
          {alerts.delete}
        </Alert>
      )}

      <Title>{props.showCompleted ? 'Archive' : 'Current Tasks'}</Title>
      <Table size="small">
        {showBody ? (
          <>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Hours Permitted</TableCell>
                <TableCell>Hours Worked</TableCell>
                <TableCell>Hours Remaining</TableCell>
                <TableCell>Reviews</TableCell>
                <TableCell>Hours for BIM</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody className="action-cell">
              {currentTasks.map((row) => (
                <TableRow
                  key={row.id}
                  style={{ cursor: 'pointer' }}
                  id="tableId"
                >
                  <TableCell>
                    {moment().format(row.createdAt).slice(0, 10)}
                  </TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.hoursAvailableToWork}</TableCell>
                  <TableCell>{row.hoursWorked}</TableCell>
                  <TableCell>{row.hoursRemaining}</TableCell>
                  <TableCell>{row.numberOfReviews}</TableCell>
                  <TableCell>{row.hoursRequiredByBim}</TableCell>
                  <TableCell>
                    {!modify ? (
                      <IconButton onClick={() => setModify(!modify)}>
                        <MoreVertIcon />
                      </IconButton>
                    ) : (
                      <>
                        <IconButton
                          onClick={(e) =>
                            handleAction(e, row.projectNumber, 'edit')
                          }
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={(e) =>
                            handleAction(e, row.projectNumber, 'delete')
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                        <IconButton
                          onClick={(e) =>
                            handleAction(e, row.projectNumber, 'success')
                          }
                        >
                          <CheckCircleOutlineIcon />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </>
        ) : (
          <Box>No tasks to display</Box>
        )}
      </Table>
      <div className={classes.seeMore}>
        <Link color="primary" href="#" onClick={preventDefault}>
          See more tasks
        </Link>
      </div>
    </React.Fragment>
  );
};

export default CurrentTasks;
