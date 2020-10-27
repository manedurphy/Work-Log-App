import React, {
  useState,
  useContext,
  ChangeEvent,
  FormEvent,
  useEffect,
} from 'react';
import axios from 'axios';
import { ITaskForm } from '../type';
import { Paper } from '@material-ui/core';
import { Tasks } from '../enums';
import { GlobalContext } from '../context/GlobalState';

const JobForm: React.FC = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const { edit, currentTask } = state.tasks;
  const [alerts, setAlerts] = useState({
    success: null,
    update: null,
  });

  const [formData, setFormData] = useState<ITaskForm>({
    name: '',
    projectNumber: '',
    hoursAvailableToWork: '',
    hoursWorked: '',
    description: '',
    numberOfReviews: '',
    reviewHours: '',
    hoursRequiredByBim: '',
  });

  useEffect((): void => {
    edit &&
      setFormData({
        name: currentTask.name,
        projectNumber: currentTask.projectNumber.toString(),
        hoursAvailableToWork: currentTask.hours.hoursAvailableToWork.toString(),
        hoursWorked: currentTask.hours.hoursWorked.toString(),
        description: currentTask.description,
        numberOfReviews: currentTask.reviews.numberOfReviews.toString(),
        reviewHours: currentTask.reviews.reviewHours.toString(),
        hoursRequiredByBim: currentTask.reviews.hoursRequiredByBim.toString(),
      });
  }, [edit]);

  const getTasks = async (): Promise<void> => {
    const token = localStorage.getItem('token');
    const res = await axios.get('/api/task', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setFormData({
      name: '',
      projectNumber: '',
      hoursAvailableToWork: '',
      hoursWorked: '',
      description: '',
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

  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios
      .post('api/task', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAlerts({ ...alerts, success: res.data.message });
        setTimeout(() => {
          setAlerts({ ...alerts, success: null });
        }, 3000);
        getTasks();
      })
      .catch((err) => {
        throw err;
      });
  };

  const handleEdit = (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    axios
      .put(`api/task/${formData.projectNumber}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setAlerts({ ...alerts, update: res.data.message });
        setTimeout(() => {
          setAlerts({ ...alerts, update: null });
        }, 3000);
        getTasks();
      })
      .catch((err) => {
        throw err;
      });
  };

  return (
    <Paper>
      <form className="job-form" onSubmit={edit ? handleEdit : handleSubmit}>
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
              name="description"
              id="description"
              cols={10}
              rows={5}
              className="form-control"
              onChange={handleChange}
              value={formData.description}
            ></textarea>
          </div>
        </div>
        <div className="submit">
          <button type="submit" className="btn btn-primary">
            {!edit ? 'Submit' : 'Update'}
          </button>
        </div>
      </form>
    </Paper>
  );
};

export default JobForm;
