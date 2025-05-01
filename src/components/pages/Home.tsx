import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import Speedometer, { CustomSegmentLabelPosition } from 'react-d3-speedometer';
import axios from 'axios';
import { motion } from 'framer-motion';

const Home = () => {
  const [pieData, setPieData] = useState<{ name: string; value: number }[]>([]);
  const [barData, setBarData] = useState<{ name: string; performance: number }[]>([]);
  const [barChartfilter, setbarChartfilter] = useState('1w');
  const [pieChartfilter, setpieChartfilter] = useState('1w');
  const [investmentSMFilter, setinvestmentSMFilter] = useState('1w');
  const [returnsSMFilter, setreturnsSMFilter] = useState('1w');

  const [investment, setInvestment] = useState(0);
  const [returns, setReturns] = useState(0);
  const userData = localStorage.getItem('userData');
  const { user_id } = userData ? JSON.parse(userData) : { user_id: null };
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const COLORS = ['#0088FE', '#FF8042'];

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        type: 'spring',
      },
    }),
  };

  const fetchPieChartData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/portfolios/get/piechart/data`, {
        params: { user_id, filter: pieChartfilter },
      });
      const data = response.data.data;
      const chartData = [
        { name: 'Gain', value: data.profit },
        { name: 'Investment', value: data.total_investment },
      ];
      setPieData(chartData);
    } catch (error) {
      console.error('Error fetching pie chart data:', error);
    }
  };

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/portfolios/get/barchart/details`, {
        params: { user_id, filter: barChartfilter },
      });
      const data = response.data.data;
      const transformedData = data.map((item: any) => ({
        name: item.stockName,
        performance: item.totalProfitOrLoss,
      }));
      setBarData(transformedData);
    } catch (error) {
      console.error('Error fetching bar chart data:', error);
    }
  };

  const fetchInvestmentData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/portfolios/get/speedometer/details`, {
        params: { user_id, filter: investmentSMFilter },
      });
      setInvestment(response.data.data.overallInvestment);
    } catch (error) {
      console.error('Error fetching investment data:', error);
    }
  };

  const fetchReturnsData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/portfolios/get/speedometer/details`, {
        params: { user_id, filter: returnsSMFilter },
      });
      setReturns(response.data.data.overallReturns);
    } catch (error) {
      console.error('Error fetching returns data:', error);
    }
  };

  useEffect(() => {
    fetchPieChartData();
  }, [pieChartfilter]);

  useEffect(() => {
    fetchBarChartData();
  }, [barChartfilter]);

  useEffect(() => {
    fetchInvestmentData();
  }, [investmentSMFilter]);

  useEffect(() => {
    fetchReturnsData();
  }, [returnsSMFilter]);

  const filterOptions = ['1d', '1w', '1m', '1y'];

  return (
    <div className="h-full w-full bg-gray-50 flex items-center justify-center min-h-screen">
      <motion.div
        className="bg-white rounded-lg shadow-md p-8 w-11/12 max-w-7xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-3xl font-bold text-gray-800 mb-8"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          Dashboard
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <motion.div
            className="bg-gray-100 rounded-lg shadow-inner h-80 flex flex-col"
            custom={0}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center px-4 mt-4">
              <h2 className="text-lg font-semibold text-gray-700">Gain vs Investment</h2>
              <select
                value={pieChartfilter}
                onChange={(e) => setpieChartfilter(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {filterOptions.map(option => (
                  <option key={option} value={option}>{option.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div className="flex-grow px-4">
              {pieData.length === 0 ? (
                <p className="text-center text-gray-500 mt-4">No data available for the pie chart.</p>
              ) : (
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
              )}
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            className="bg-gray-100 rounded-lg shadow-inner h-80 flex flex-col"
            custom={1}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between items-center px-4 mt-4">
              <h2 className="text-lg font-semibold text-gray-700">User Performance</h2>
              <select
                value={barChartfilter}
                onChange={(e) => setbarChartfilter(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {filterOptions.map(option => (
                  <option key={option} value={option}>{option.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <div className="flex-grow px-4 overflow-x-auto">
              {barData.length === 0 ? (
                <p className="text-center text-gray-500 mt-4">No data available for the bar chart.</p>
              ) : (
                <div style={{ width: `${barData.length * 100}px`, height: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData}>
                      <XAxis dataKey="name" tick={false} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="performance" name="Performance">
                        {barData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={entry.performance >= 0 ? '#82ca9d' : '#FF4D4D'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </motion.div>

          {/* Investment Speedometer */}
          <motion.div
            className="bg-gray-100 rounded-lg shadow-inner h-80 flex flex-col items-center justify-center"
            custom={2}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between w-full px-6">
              <h2 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Investment Indicator</h2>
              <select
                value={investmentSMFilter}
                onChange={(e) => setinvestmentSMFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 mt-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {filterOptions.map(option => (
                  <option key={option} value={option}>{option.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <Speedometer
              maxValue={1000000}
              value={investment}
              needleColor="red"
              startColor="green"
              endColor="red"
              segments={5}
              customSegmentLabels={[
                { text: '0', position: CustomSegmentLabelPosition.Inside, color: '#555' },
                { text: '2L', position: CustomSegmentLabelPosition.Inside, color: '#555' },
                { text: '5L', position: CustomSegmentLabelPosition.Inside, color: '#555' },
                { text: '7L', position: CustomSegmentLabelPosition.Inside, color: '#555' },
                { text: '10L', position: CustomSegmentLabelPosition.Inside, color: '#555' },
              ]}
              width={250}
              height={160}
            />
          </motion.div>

          {/* Returns Speedometer */}
          <motion.div
            className="bg-gray-100 rounded-lg shadow-inner h-80 flex flex-col items-center justify-center"
            custom={3}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="flex justify-between w-full px-6">
              <h2 className="text-lg font-semibold text-gray-700 mt-4 mb-2">Returns Indicator</h2>
              <select
                value={returnsSMFilter}
                onChange={(e) => setreturnsSMFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-2 py-1 mt-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {filterOptions.map(option => (
                  <option key={option} value={option}>{option.toUpperCase()}</option>
                ))}
              </select>
            </div>
            <Speedometer
              maxValue={1000000}
              value={returns}
              needleColor="blue"
              startColor="green"
              endColor="orange"
              segments={5}
              customSegmentLabels={[
                { text: '0', position: CustomSegmentLabelPosition.Inside, color: '#555' },
                { text: '2L', position: CustomSegmentLabelPosition.Inside, color: '#555' },
                { text: '5L', position: CustomSegmentLabelPosition.Inside, color: '#555' },
                { text: '7L', position: CustomSegmentLabelPosition.Inside, color: '#555' },
                { text: '10L', position: CustomSegmentLabelPosition.Inside, color: '#555' },
              ]}
              width={250}
              height={160}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
