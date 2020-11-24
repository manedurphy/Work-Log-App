import React, {
  useState,
  useContext,
  ChangeEvent,
  FormEvent,
  useEffect,
} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios, { AxiosResponse } from 'axios';
import Title from './Title';
import { Tasks } from '../enums';
import { getToken, GlobalContext } from '../context/GlobalState';
import { Alert } from '@material-ui/lab';
import { AlertType, ITaskForm, MessageType, ITask } from '../type';
import {
  Paper,
  FormHelperText,
  Grid,
  TextField,
  makeStyles,
  Button,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  form: {
    width: '97%',
    marginTop: theme.spacing(3),
    margin: 'auto',
  },
}));

const JobForm: React.FC = () => {
  const classes = useStyles();
  const { state, dispatch } = useContext(GlobalContext);
  const { edit, currentTask } = state.tasks;
  const [deleteMode, setDeleteMode] = useState(false);
  const [alerts, setAlerts] = useState<{
    success: AlertType;
    update: AlertType;
    delete: AlertType;
    error: AlertType;
  }>({
    success: null,
    update: null,
    delete: null,
    error: null,
  });

  const [formData, setFormData] = useState<ITaskForm>({
    name: '',
    projectNumber: '',
    hoursAvailableToWork: '',
    hoursWorked: '',
    notes: '',
    numberOfReviews: '',
    reviewHours: '',
    hoursRequiredByBim: '',
    dateAssigned: null,
    dueDate: null,
  });

  useEffect((): void => {
    edit &&
      setFormData({
        name: currentTask.name,
        projectNumber: currentTask.projectNumber.toString(),
        hoursAvailableToWork: currentTask.hoursAvailableToWork.toString(),
        hoursWorked: currentTask.hoursWorked.toString(),
        notes: currentTask.notes || '',
        numberOfReviews: currentTask.numberOfReviews.toString(),
        reviewHours: currentTask.reviewHours.toString(),
        hoursRequiredByBim: currentTask.hoursRequiredByBim.toString(),
        dateAssigned: new Date(currentTask.dateAssigned),
        dueDate: new Date(currentTask.dueDate),
      });

    !edit &&
      setFormData({
        name: '',
        projectNumber: '',
        hoursAvailableToWork: '',
        hoursWorked: '',
        notes: '',
        numberOfReviews: '',
        reviewHours: '',
        hoursRequiredByBim: '',
        dateAssigned: new Date(),
        dueDate: new Date(),
      });
  }, [edit]);

  const getTasks = async (): Promise<void> => {
    const token = getToken();
    const res: AxiosResponse<ITask[]> = await axios.get('/api/task', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFormData({
      name: '',
      projectNumber: '',
      hoursAvailableToWork: '',
      hoursWorked: '',
      notes: '',
      numberOfReviews: '',
      reviewHours: '',
      hoursRequiredByBim: '',
      dateAssigned: new Date(),
      dueDate: new Date(),
    });
    dispatch({ type: Tasks.updateTasks, payload: res.data });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const setAlertsAndGetTasks = (
    command: string,
    message: string,
    err: Error | null = null
  ) => {
    if (!err) getTasks();

    setAlerts({ ...alerts, [command]: message });
    setTimeout(() => {
      setAlerts({ success: null, update: null, delete: null, error: null });
    }, 3000);
  };

  const handleForm = async (e: FormEvent<HTMLFormElement>, command: string) => {
    e.preventDefault();
    let res: AxiosResponse<MessageType>;
    const token = getToken();

    try {
      if (command === 'success') {
        res = await axios.post('api/task', formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else if (command === 'update') {
        res = await axios.put(`api/task/${formData.projectNumber}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        res = await axios.delete(`api/task/${formData.projectNumber}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setAlertsAndGetTasks(command, res.data.message);
    } catch (err) {
      setAlertsAndGetTasks('error', err.response.data.message, err);
    }
  };

  return (
    <Paper>
      <form
        className={classes.form}
        onSubmit={
          edit && deleteMode
            ? (e) => handleForm(e, 'delete')
            : edit
            ? (e) => handleForm(e, 'update')
            : (e) => handleForm(e, 'success')
        }
      >
        <Title>Create a New Task</Title>
        {alerts.success && (
          <Alert severity="success" role="alert">
            {alerts.success}
          </Alert>
        )}
        {alerts.update && (
          <Alert severity="info" role="alert">
            {alerts.update}
          </Alert>
        )}
        {alerts.delete && (
          <Alert severity="warning" role="alert">
            {alerts.delete}
          </Alert>
        )}
        {alerts.error && (
          <Alert severity="error" role="alert">
            {alerts.error}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="name"
              variant="outlined"
              required
              fullWidth
              id="name"
              label="Task Name"
              autoFocus
              value={formData.name}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              variant="outlined"
              required
              fullWidth
              type="number"
              id="projectNumber"
              label="Project Number"
              name="projectNumber"
              value={formData.projectNumber}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              variant="outlined"
              required
              fullWidth
              type="number"
              id="hoursAvailableToWork"
              label="Hours Available to Work"
              name="hoursAvailableToWork"
              autoComplete="lname"
              value={formData.hoursAvailableToWork}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              variant="outlined"
              required
              fullWidth
              type="number"
              id="hoursWorked"
              label="Hours Worked"
              name="hoursWorked"
              value={formData.hoursWorked}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              variant="outlined"
              required
              fullWidth
              type="number"
              id="reviewHours"
              label="Hours Spent on Review"
              name="reviewHours"
              autoComplete="lname"
              value={formData.reviewHours}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              variant="outlined"
              required
              fullWidth
              type="number"
              id="hoursRequiredByBim"
              label="Hours Required By BIM"
              name="hoursRequiredByBim"
              autoComplete="lname"
              value={formData.hoursRequiredByBim}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              variant="outlined"
              required
              fullWidth
              type="number"
              id="numberOfReviews"
              label="Number of Reviews"
              name="numberOfReviews"
              value={formData.numberOfReviews}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              variant="outlined"
              fullWidth
              id="notes"
              label="Notes or Comments"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DatePicker
              selected={formData.dateAssigned}
              onChange={(date) =>
                setFormData({ ...formData, dateAssigned: date })
              }
            />
            <FormHelperText>Date assigned</FormHelperText>
            <DatePicker
              selected={formData.dueDate}
              onChange={(date) => setFormData({ ...formData, dueDate: date })}
            />
            <FormHelperText>Due date</FormHelperText>
          </Grid>
        </Grid>

        <div className="submit">
          {edit ? (
            <>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                onClick={() => setDeleteMode(false)}
                style={{ margin: '10px' }}
              >
                Update
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                onClick={() => setDeleteMode(true)}
                style={{ margin: '10px' }}
              >
                Delete
              </Button>
            </>
          ) : (
            <Button
              className="job-form-button"
              type="submit"
              variant="contained"
              color="primary"
              style={{ margin: '10px' }}
            >
              Submit
            </Button>
          )}
        </div>
      </form>
    </Paper>
  );
};

export default JobForm;
