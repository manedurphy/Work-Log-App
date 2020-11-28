import React, {
  useState,
  useContext,
  ChangeEvent,
  FormEvent,
  useEffect,
} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Title from '../Title';
import { Alerts, Commands, Tasks } from '../../enums';
import { GlobalContext } from '../../context/GlobalState';
import {
  createNewTask,
  deleteTask,
  getTasks,
  updateTask,
} from '../../global/functions/axios';
import { ITaskForm, MessageType } from '../../global/types/type';
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

  const [formData, setFormData] = useState<ITaskForm>({
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
  }, [edit]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleForm = async (e: FormEvent<HTMLFormElement>, command: string) => {
    e.preventDefault();
    let responseData: MessageType;

    try {
      if (command === Commands.SUCCESS) {
        responseData = await createNewTask(formData);
      } else if (command === Commands.UPDATE) {
        responseData = await updateTask(formData);
      } else {
        responseData = await deleteTask(+formData.projectNumber);
      }

      dispatch({
        type: Tasks.updateTasks,
        payload: await getTasks(state.tasks.showCompleted),
      });
      dispatch({ type: Alerts.setAlerts, payload: responseData });

      // setTimeout(() => {
      //   dispatch({ type: Alerts.removeAlerts, payload: [] });
      // }, 3000);
    } catch (err) {
      dispatch({ type: Alerts.setAlerts, payload: err.response.data });
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
            ? (e) => handleForm(e, Commands.DELETE)
            : edit
            ? (e) => handleForm(e, Commands.UPDATE)
            : (e) => handleForm(e, Commands.SUCCESS)
        }
      >
        <Title>{!edit ? 'Create a New Task' : 'Edit Task'}</Title>

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
              dateFormat="MM/dd/yyyy h:mm aa"
              timeInputLabel="Time:"
              showTimeInput
            />
            <FormHelperText>Date assigned</FormHelperText>
            <DatePicker
              selected={formData.dueDate}
              onChange={(date) => setFormData({ ...formData, dueDate: date })}
              dateFormat="MM/dd/yyyy h:mm aa"
              timeInputLabel="Time:"
              showTimeInput
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
