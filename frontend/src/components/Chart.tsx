import React, { useContext } from 'react';
import Title from './Title';
import { GlobalContext } from '../context/GlobalState';
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

const Chart = (): JSX.Element => {
  const tasks = useContext(GlobalContext).state.tasks.currentTasks;
  const data: { name: string; completion: number }[] = [];

  for (let i: number = 0; i < 5; i++) {
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
          <Bar dataKey="completion" fill="purple" />
        </BarChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};
export default Chart;
