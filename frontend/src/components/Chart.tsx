import React from 'react';
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

const data = [
  {
    name: 'Task 1',
    completion: 40,
  },
  {
    name: 'Task 2',
    completion: 40,
  },
  {
    name: 'Task 3',
    completion: 42,
  },
  {
    name: 'Task 4',
    completion: 68,
  },
  {
    name: 'Task 5',
    completion: 10,
  },
];

export default function Chart() {
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
