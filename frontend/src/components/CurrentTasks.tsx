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
import { Checkbox } from '@material-ui/core';

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
  const [alert, setAlert] = useState<AlertType>(null);
  const { state, dispatch } = useContext(GlobalContext);
  const { currentTasks } = state.tasks;

  const handleClick = (
    e: React.MouseEvent<HTMLTableRowElement, MouseEvent>
  ) => {
    const token = localStorage.getItem('token');
    const children = e.currentTarget.childNodes;
    const task = children[1].textContent;
    axios
      .get(`api/task/${task}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        dispatch({ type: Tasks.updateTask, payload: res.data });
      })
      .catch((err) => {
        setAlert(err.response.data.message);
        setTimeout(() => {
          setAlert(null);
        }, 3000);
      });
  };

  const handleComplete = (e: ChangeEvent<HTMLInputElement>) => {
    const token = getToken();
    axios
      .get(`api/task/${e.target.value}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        res.data.complete = true;
        console.log(res.data);
        axios.put(`api/task/${res.data.projectNumber}`, res.data, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .catch((err) => {
        throw err;
      });
  };
  return (
    <React.Fragment>
      {alert && (
        <div className="alert alert-danger text-center" role="alert">
          {alert}
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
            <TableCell>Job Complete?</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentTasks.map((row) => (
            <TableRow
              key={row._id}
              onClick={handleClick}
              style={{ cursor: 'pointer' }}
              id="tableId"
            >
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
                <Checkbox
                  value={row.name}
                  color="primary"
                  onChange={handleComplete}
                />
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
