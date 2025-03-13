'use client';

import { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Mock data
const mockWeatherData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Temperature (°C)',
      data: [25, 24, 26, 28, 27, 25, 26],
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
    {
      label: 'Humidity (%)',
      data: [65, 68, 70, 72, 68, 66, 65],
      borderColor: 'rgb(53, 162, 235)',
      tension: 0.1,
    },
  ],
};

const mockYieldData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Crop Yield (kg)',
      data: [1200, 1900, 1700, 1600, 2100, 1800],
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
  ],
};

export default function MonitoringPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('week');

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Farm Monitoring</h1>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="bg-gray-800 text-gray-100 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="day">Last 24 Hours</option>
            <option value="week">Last Week</option>
            <option value="month">Last Month</option>
          </select>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Weather Stats */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Weather Conditions</h2>
            <Line
              data={mockWeatherData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                    labels: { color: '#f3f4f6' },
                  },
                },
                scales: {
                  y: {
                    ticks: { color: '#f3f4f6' },
                    grid: { color: '#374151' },
                  },
                  x: {
                    ticks: { color: '#f3f4f6' },
                    grid: { color: '#374151' },
                  },
                },
              }}
            />
          </div>

          {/* Crop Yield */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Crop Yield</h2>
            <Bar
              data={mockYieldData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                    labels: { color: '#f3f4f6' },
                  },
                },
                scales: {
                  y: {
                    ticks: { color: '#f3f4f6' },
                    grid: { color: '#374151' },
                  },
                  x: {
                    ticks: { color: '#f3f4f6' },
                    grid: { color: '#374151' },
                  },
                },
              }}
            />
          </div>

          {/* Soil Health */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Soil Health</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">pH Level</p>
                <p className="text-2xl font-bold text-gray-100">6.8</p>
                <p className="text-green-500 text-sm">Optimal</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Moisture</p>
                <p className="text-2xl font-bold text-gray-100">42%</p>
                <p className="text-yellow-500 text-sm">Moderate</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Nitrogen</p>
                <p className="text-2xl font-bold text-gray-100">180 ppm</p>
                <p className="text-green-500 text-sm">Good</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Organic Matter</p>
                <p className="text-2xl font-bold text-gray-100">3.2%</p>
                <p className="text-green-500 text-sm">Good</p>
              </div>
            </div>
          </div>

          {/* Alerts & Recommendations */}
          <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">Alerts & Recommendations</h2>
            <div className="space-y-4">
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
                <p className="text-yellow-500 font-medium">Low Soil Moisture Alert</p>
                <p className="text-gray-300 text-sm mt-1">Consider irrigation in the next 24 hours</p>
              </div>
              <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                <p className="text-green-500 font-medium">Optimal Planting Conditions</p>
                <p className="text-gray-300 text-sm mt-1">Perfect time to plant winter crops</p>
              </div>
              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                <p className="text-blue-500 font-medium">Weather Forecast</p>
                <p className="text-gray-300 text-sm mt-1">Light rain expected in the next 48 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 