import axios, { AxiosResponse } from 'axios';
import moment from 'moment-timezone';
import { ILog, ILogForm, ITask, ITaskForm, MessageType } from '../types/type';
import { getToken, hoursRemaining } from './helpers';

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

export const getTask = async (projectNumber: number) => {
  const res: AxiosResponse<ITask> = await axios.get(
    `api/task/${projectNumber}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );

  res.data.dateAssigned = moment(res.data.dateAssigned)
    .tz('America/Los_Angeles')
    .format()
    .slice(0, res.data.dateAssigned.length - 8);

  res.data.dueDate = moment(res.data.dueDate)
    .tz('America/Los_Angeles')
    .format()
    .slice(0, res.data.dueDate.length - 8);

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
  const res: AxiosResponse<MessageType> = await axios.put(
    hoursRemaining(formData)
      ? `api/task/${formData.projectNumber}`
      : `api/task/complete/${formData.projectNumber}`,
    formData,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );

  return res.data;
};

export const completeTask = async (projectNumber: number) => {
  const res: AxiosResponse<MessageType> = await axios.put(
    `/api/task/complete/no-form/${projectNumber}`,
    null,
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );

  return res.data;
};

export const deleteTask = async (projectNumber: number) => {
  const res: AxiosResponse<MessageType> = await axios.delete(
    `api/task/${projectNumber}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );

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
    .format()
    .slice(0, res.data.loggedAt.length - 8);

  return res.data;
};

export const updateLog = async (logId: number, formData: ILogForm) => {
  const res: AxiosResponse<MessageType> = await axios.put(
    `/api/log/${logId}`,
    formData,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );

  return res.data;
};

export const deleteLog = async (logId: number) => {
  const res: AxiosResponse<MessageType> = await axios.delete(
    `/api/log/${logId}`,
    {
      headers: { Authorization: `Bearer ${getToken()}` },
    }
  );

  return res.data;
};
