import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Speedometer from 'react-d3-speedometer';

const Home = () => {
  const pieData = [
    { name: 'Profit', value: 400 },
    { name: 'Loss', value: 300 },
  ];

  const barData = [
    { name: 'Jan', performance: 400 },
    { name: 'Feb', performance: 300 },
    { name: 'Mar', performance: 500 },
  ];

  const COLORS = ['#0088FE', '#FF8042'];

  return (
    <div className="h-full w-full bg-gray-50 flex items-center justify-center min-h-screen">
      <div className="bg-white rounded-lg shadow-md p-8 w-11/12 max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

        {/* 2x2 Chart Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">         
          {/* Pie Chart */}
          <div className="bg-gray-100 p-0 m-0 rounded-lg shadow-inner h-80 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700 mt-4 mb-2 px-4">Profit & Loss</h2>
            <div className="flex-grow px-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div className="bg-gray-100 p-0 m-0 rounded-lg shadow-inner h-80 flex flex-col">
            <h2 className="text-lg font-semibold text-gray-700 mt-4 mb-2 px-4">User Performance</h2>
            <div className="flex-grow px-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="performance" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Speedometer Chart 1 */}
          <div className="bg-gray-100 p-0 m-0 rounded-lg shadow-inner h-80 flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Performance Indicator 1</h2>
            <Speedometer
              maxValue={1000}
              value={750}
              needleColor="red"
              startColor="green"
              endColor="red"
              segments={10}
              width={250}
              height={160}
            />
          </div>

          {/* Speedometer Chart 2 */}
          <div className="bg-gray-100 p-0 m-0 rounded-lg shadow-inner h-80 flex flex-col items-center justify-center">
            <h2 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Performance Indicator 2</h2>
            <Speedometer
              maxValue={1000}
              value={450}
              needleColor="blue"
              startColor="green"
              endColor="orange"
              segments={10}
              width={250}
              height={160}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
