import React, { ChangeEvent, useContext, useState } from 'react';
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
import { AlertType, ITask } from '../type';
import { Checkbox, IconButton, Paper } from '@material-ui/core';
import { ChevronLeft, ChevronRight } from '@material-ui/icons';
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
  const [alerts, setAlert] = useState<{
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

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    projectNumber: number
  ) => {
    const token = getToken();
    axios
      .get(`api/task/${projectNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        dispatch({ type: Tasks.updateTask, payload: res.data });
      })
      .catch((err) => {
        setAlert({ ...alerts, error: err.response.data.message });
        setTimeout(() => {
          setAlert({ success: null, delete: null, error: null });
        }, 3000);
      });
  };

  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    projectNumber: number
  ) => {
    const token = getToken();
    axios
      .delete(`api/task/${projectNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAlert({ ...alerts, delete: res.data.message });
        setTimeout(() => {
          setAlert({ success: null, delete: null, error: null });
        }, 3000);
        getTasks();
      })
      .catch((err) => {
        setAlert({ ...alerts, error: err.response.data.message });
        setTimeout(() => {
          setAlert({ success: null, delete: null, error: null });
        }, 3000);
      });
  };

  const handleComplete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    projectNumber: number
  ) => {
    const token = getToken();
    axios
      .get(`api/task/${projectNumber}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        res.data.complete = true;
        axios
          .put(`api/task/${res.data.projectNumber}`, res.data, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            setAlert({ ...alerts, success: res.data.message });
            setTimeout(() => {
              setAlert({ success: null, delete: null, error: null });
            }, 3000);
            getTasks();
          });
      })
      .catch((err) => {
        setAlert({ ...alerts, error: err.response.data.message });
        setTimeout(() => {
          setAlert({ success: null, delete: null, error: null });
        }, 3000);
      });
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
            {/* {modify && (
              <>
                <TableCell>Task Complete</TableCell>
                <TableCell>Edit / Delete</TableCell>
              </>
            )}
            {!modify && <TableCell>More</TableCell>}
            {modify && <TableCell>Less</TableCell>} */}
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
                      onClick={(e) => handleClick(e, row.projectNumber)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={(e) => handleDelete(e, row.projectNumber)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      onClick={(e) => handleComplete(e, row.projectNumber)}
                    >
                      <CheckCircleOutlineIcon />
                    </IconButton>
                  </>
                )}
              </TableCell>

              {/* {modify && (
                <>
                  <TableCell>
                    <Checkbox
                      value={row.name}
                      color="primary"
                      onChange={handleComplete}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={(e) => handleClick(e, row.name)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={(e) => handleDelete(e, row.projectNumber)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </>
              )}
              {!modify && (
                <TableCell>
                  <IconButton onClick={() => setModify(!modify)}>
                    <ChevronRight />
                  </IconButton>
                </TableCell>
              )}
              {modify && (
                <TableCell>
                  <IconButton onClick={() => setModify(!modify)}>
                    <ChevronLeft />
                  </IconButton>
                </TableCell>
              )} */}
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
