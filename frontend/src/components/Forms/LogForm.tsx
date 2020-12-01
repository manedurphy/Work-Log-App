import React, {
  useState,
  useContext,
  ChangeEvent,
  FormEvent,
  useEffect,
} from 'react';
import CloseIcon from '@material-ui/icons/Close';
import Title from '../Title';
import { Alerts, Commands, Logs } from '../../enums';
import { GlobalContext } from '../../context/GlobalState';
import { deleteLog, getLogs, updateLog } from '../../global/functions/axios';
import { ILogForm, MessageType } from '../../global/types/type';
import {
  Paper,
  Grid,
  TextField,
  makeStyles,
  Button,
  IconButton,
  Fade,
  Box,
} from '@material-ui/core';
import { getFormDate } from '../../global/functions/helpers';

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

  const [formData, setFormData] = useState<ILogForm>({
    name: '',
    projectNumber: '',
    hoursAvailableToWork: '',
    hoursWorked: '',
    notes: '',
    numberOfReviews: '',
    reviewHours: '',
    hoursRequiredByBim: '',
    loggedAt: getFormDate(),
  });

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
        loggedAt: currentLog.loggedAt,
      });
  }, [edit, currentLog]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleForm = async (e: FormEvent<HTMLFormElement>, command: string) => {
    e.preventDefault();
    let responseData: MessageType;

    try {
      if (command === Commands.UPDATE) {
        responseData = await updateLog(currentLog.id, formData);
      } else {
        responseData = await deleteLog(currentLog.id);
      }

      dispatch({
        type: Logs.setLogs,
        payload: await getLogs(+formData.projectNumber),
      });
      dispatch({ type: Alerts.setAlerts, payload: responseData });
    } catch (err) {
      dispatch({ type: Alerts.setAlerts, payload: err.response.data.message });
      setTimeout(() => {
        dispatch({ type: Alerts.removeAlerts, payload: [] });
      }, 3000);
    }
  };

  return (
    <Fade in={state.log.edit} timeout={500} enter exit>
      <Paper>
        <form
          className={classes.form}
          onSubmit={
            deleteMode
              ? (e) => handleForm(e, Commands.DELETE)
              : (e) => handleForm(e, Commands.UPDATE)
          }
        >
          <Box display="flex">
            <Box flexGrow={1}>
              <Title>Edit Log Item</Title>
            </Box>
            <Box>
              <IconButton
                onClick={() =>
                  dispatch({ type: Logs.setEditLog, payload: false })
                }
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

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
              <TextField
                type="datetime-local"
                value={formData.loggedAt}
                label="Logged at"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(date) =>
                  setFormData({ ...formData, loggedAt: date.target.value })
                }
              />
            </Grid>
          </Grid>

          <div className="submit">
            <div>
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
            </div>
          </div>
        </form>
      </Paper>
    </Fade>
  );
};

export default LogForm;
