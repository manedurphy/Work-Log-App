import React, { useContext } from 'react';
import {
  BarChart,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import Title from './Title';
import { GlobalContext } from '../context/GlobalState';

export default function Chart() {
  const tasks = useContext(GlobalContext).state.tasks.currentTasks;
  const data: any[] = [];

  for (let i = 0; i < 5; i++) {
    if (tasks[i]) {
      data.push({
        name: tasks[i].name,
        completion:
          (1 - tasks[i].hoursRemaining / tasks[i].hoursAvailableToWork) * 100,
      });
    }
  }
  return (
    <React.Fragment>
      <Title>Task Completion</Title>
      <ResponsiveContainer>
        <BarChart width={730} height={250} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis label={{ value: '%', position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="completion" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
}
