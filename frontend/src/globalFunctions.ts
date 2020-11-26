import axios, { AxiosResponse } from 'axios';
import { ITask, ILog, ITaskForm, MessageType } from './type';
import moment from 'moment-timezone';

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const getTasks = async (showComplete: boolean) => {
  const res: AxiosResponse<ITask[]> = await axios.get(
    showComplete ? '/api/archive' : '/api/task',
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );

  res.data.forEach((task) => {
    task.dateAssigned = moment(task.dateAssigned)
      .tz('America/Los_Angeles')
      .format();

    task.dueDate = moment(task.dueDate).tz('America/Los_Angeles').format();
  });

  return res.data;
};

export const createNewTask = async (formData: ITaskForm) => {
  const res: AxiosResponse<MessageType> = await axios.post(
    'api/task',
    formData,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );

  return res.data;
};

export const updateTask = async (formData: ITaskForm) => {
  const res = await axios.put(`api/task/${formData.projectNumber}`, formData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return res.data;
};

export const deleteTask = async (projectNumber: number) => {
  const res = await axios.delete(`api/task/${projectNumber}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return res.data;
};

export const getLogs = async (projectNumber: number) => {
  const res: AxiosResponse<ILog[]> = await axios.get(
    `api/log/task/${projectNumber}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );

  res.data.forEach((log) => {
    log.loggedAt = moment(log.loggedAt).tz('America/Los_Angeles').format();
  });
  return res.data;
};

export const getLog = async (logId: number) => {
  const res: AxiosResponse<ILog> = await axios.get(`/api/log/${logId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  res.data.loggedAt = moment(res.data.loggedAt)
    .tz('America/Los_Angeles')
    .format();

  return res.data;
};

export const updateLog = async (logId: number, formData: ITaskForm) => {
  const res = await axios.put(`/api/log/${logId}`, formData, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return res.data;
};

export const deleteLog = async (logId: number) => {
  const res = await axios.delete(`/api/log/${logId}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });

  return res.data;
};
