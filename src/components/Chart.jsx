import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartData } from "../assets/data.js";

export const Chart = () => {
  return (
    <ResponsiveContainer width={"90%"} height={300}>
      <BarChart width={150} height={40} data={chartData}>
        <XAxis dataKey='name' />
        <YAxis />
        {/* <YAxis dataKey='total' /> */}
        <Tooltip />
        <Legend />
        <CartesianGrid strokeDasharray='3 3' />
        <Bar dataKey='total' fill='#b444d0' />
      </BarChart>
    </ResponsiveContainer>
  );
}; 
export default Chart;