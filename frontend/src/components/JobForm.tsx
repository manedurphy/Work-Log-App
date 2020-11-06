import React, {
  useState,
  useContext,
  ChangeEvent,
  FormEvent,
  useEffect,
} from 'react';
import axios, { AxiosResponse } from 'axios';
import { AlertType, ITaskForm, MessageType } from '../type';
import { Paper } from '@material-ui/core';
import { Tasks } from '../enums';
import { getToken, GlobalContext } from '../context/GlobalState';

const JobForm: React.FC = () => {
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
      });
  }, [edit]);

  const getTasks = async (): Promise<void> => {
    const token = getToken();
    const res = await axios.get('/api/task', {
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
        className="job-form"
        onSubmit={
          edit && deleteMode
            ? (e) => handleForm(e, 'delete')
            : edit
            ? (e) => handleForm(e, 'update')
            : (e) => handleForm(e, 'success')
        }
      >
        {alerts.success && (
          <div className="alert alert-success text-center" role="alert">
            {alerts.success}
          </div>
        )}
        {alerts.update && (
          <div className="alert alert-primary text-center" role="alert">
            {alerts.update}
          </div>
        )}
        {alerts.delete && (
          <div className="alert alert-warning text-center" role="alert">
            {alerts.delete}
          </div>
        )}
        {alerts.error && (
          <div className="alert alert-danger text-center" role="alert">
            {alerts.error}
          </div>
        )}
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="name">Enter Task</label>
            <input
              type="text"
              className="form-control"
              id="name"
              onChange={handleChange}
              value={formData.name}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="projectNumber">Enter Project Number</label>
            <input
              type="number"
              className="form-control"
              id="projectNumber"
              onChange={handleChange}
              value={edit ? currentTask.projectNumber : formData.projectNumber}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="hoursAvailableToWork"> Enter Available Hours</label>
            <input
              type="number"
              className="form-control"
              id="hoursAvailableToWork"
              onChange={handleChange}
              value={formData.hoursAvailableToWork}
            />
          </div>
          <div className="form-group col-md-6">
            <label htmlFor="hoursWorked"> Enter Hours Worked</label>
            <input
              type="number"
              className="form-control"
              id="hoursWorked"
              onChange={handleChange}
              value={formData.hoursWorked}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-4">
            <label htmlFor="numberOfReviews"> Enter Number of Reviews</label>
            <input
              type="number"
              className="form-control"
              id="numberOfReviews"
              onChange={handleChange}
              value={formData.numberOfReviews}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="reviewHours"> Enter Hours Spent on Review</label>
            <input
              type="number"
              className="form-control"
              id="reviewHours"
              onChange={handleChange}
              value={formData.reviewHours}
            />
          </div>
          <div className="form-group col-md-4">
            <label htmlFor="hoursRequiredByBim">
              {' '}
              Enter Hours Required By Bim
            </label>
            <input
              type="number"
              className="form-control"
              id="hoursRequiredByBim"
              onChange={handleChange}
              value={formData.hoursRequiredByBim}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group col-md-6">
            <label htmlFor="description">
              Enter a short description of the job
            </label>
            <textarea
              name="notes"
              id="notes"
              cols={10}
              rows={5}
              className="form-control"
              onChange={handleChange}
              value={formData.notes}
            ></textarea>
          </div>
        </div>
        <div className="submit">
          {edit ? (
            <>
              <button
                type="submit"
                className="btn btn-primary mr-1"
                onClick={() => setDeleteMode(false)}
              >
                Update
              </button>
              <button
                type="submit"
                className="btn btn-danger ml-1"
                onClick={() => setDeleteMode(true)}
              >
                Delete
              </button>
            </>
          ) : (
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          )}
        </div>
      </form>
    </Paper>
  );
};

export default JobForm;
