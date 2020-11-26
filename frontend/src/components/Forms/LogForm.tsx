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
import Title from '../Title';
import { Alerts, Logs } from '../../enums';
import { getLogs, getToken, GlobalContext } from '../../context/GlobalState';
import { MessageType } from '../../type';
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

const LogForm: React.FC = () => {
  const classes = useStyles();
  const { state, dispatch } = useContext(GlobalContext);
  const { edit, currentLog } = state.log;
  const [deleteMode, setDeleteMode] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: '',
    projectNumber: '',
    hoursAvailableToWork: '',
    hoursWorked: '',
    notes: '',
    numberOfReviews: '',
    reviewHours: '',
    hoursRequiredByBim: '',
    loggedAt: null,
  });

  const clearForm = () => {
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
  };

  useEffect((): void => {
    edit &&
      setFormData({
        name: currentLog.name,
        projectNumber: currentLog.projectNumber.toString(),
        hoursAvailableToWork: currentLog.hoursAvailableToWork.toString(),
        hoursWorked: currentLog.hoursWorked.toString(),
        notes: currentLog.notes || '',
        numberOfReviews: currentLog.numberOfReviews.toString(),
        reviewHours: currentLog.reviewHours.toString(),
        hoursRequiredByBim: currentLog.hoursRequiredByBim.toString(),
        loggedAt: new Date(currentLog.loggedAt),
        TaskId: currentLog.TaskId,
      });
  }, [edit]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleForm = async (e: FormEvent<HTMLFormElement>, command: string) => {
    e.preventDefault();
    let res: AxiosResponse<MessageType>;
    const token = getToken();

    try {
      if (command === 'update') {
        res = await axios.put(`/api/log/${currentLog.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        res = await axios.delete(`/api/log/${currentLog.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      dispatch({
        type: Logs.setLogs,
        payload: await getLogs(formData.projectNumber),
      });
      dispatch({ type: Alerts.setAlerts, payload: res.data });
      clearForm();
      setTimeout(() => {
        dispatch({ type: Alerts.removeAlerts, payload: [] });
      }, 3000);
    } catch (err) {
      dispatch({ type: Alerts.setAlerts, payload: err.response.data.message });
      setTimeout(() => {
        dispatch({ type: Alerts.removeAlerts, payload: [] });
      }, 3000);
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
        <Title>Edit Log Item</Title>

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
              selected={formData.loggedAt}
              onChange={(date) => setFormData({ ...formData, loggedAt: date })}
              dateFormat="MM/dd/yyyy h:mm aa"
              timeInputLabel="Time:"
              showTimeInput
            />
            <FormHelperText>Logged on</FormHelperText>
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

export default LogForm;
