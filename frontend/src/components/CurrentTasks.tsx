import React, { useContext, useState } from 'react';
import Link from '@material-ui/core/Link';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Title from './Title';
import moment from 'moment';
import axios, { AxiosResponse } from 'axios';
import { Tasks } from '../enums';
import { getToken, GlobalContext } from '../context/GlobalState';
import { AlertType, MessageType } from '../type';
import { IconButton } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

function preventDefault(event: any) {
  event.preventDefault();
}

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

const CurrentTasks: React.FC = () => {
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

  const getTasks = async (): Promise<void> => {
    const token = getToken();
    const res = await axios.get('/api/task', {
      headers: { Authorization: `Bearer ${token}` },
    });
    dispatch({ type: Tasks.updateTasks, payload: res.data });
  };

  const setAlertsAndGetTasks = (
    command: string,
    message: string,
    err: Error | null = null
  ) => {
    if (!err) getTasks();

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
        const task = await axios.get(`api/task/${projectNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
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
        <div className="alert alert-danger text-center" role="alert">
          {alerts.error}
        </div>
      )}
      {alerts.success && (
        <div className="alert alert-success text-center" role="alert">
          {alerts.success}
        </div>
      )}
      {alerts.delete && (
        <div className="alert alert-warning text-center" role="alert">
          {alerts.delete}
        </div>
      )}

      <Title>Current Tasks</Title>
      <Table size="small">
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
            <TableRow key={row._id} style={{ cursor: 'pointer' }} id="tableId">
              <TableCell>
                {moment().format(row.createdAt).slice(0, 10)}
              </TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.hours.hoursAvailableToWork}</TableCell>
              <TableCell>{row.hours.hoursWorked}</TableCell>
              <TableCell>{row.hours.hoursRemaining}</TableCell>
              <TableCell>{row.reviews.numberOfReviews}</TableCell>
              <TableCell>{row.reviews.hoursRequiredByBim}</TableCell>
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
