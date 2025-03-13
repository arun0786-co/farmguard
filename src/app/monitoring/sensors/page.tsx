'use client';

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const hourlyData = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'],
  datasets: [
    {
      label: 'Soil Moisture (%)',
      data: [65, 63, 64, 62, 65, 66],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
      label: 'Temperature (°C)',
      data: [22, 20, 23, 26, 25, 23],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Humidity (%)',
      data: [70, 72, 71, 68, 69, 70],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
  ],
};

const alerts = [
  {
    id: 1,
    type: 'warning',
    message: 'Soil moisture dropping below optimal levels in Tomato field',
    timestamp: '2024-03-20T10:30:00',
  },
  {
    id: 2,
    type: 'info',
    message: 'Temperature optimal for Rice growth',
    timestamp: '2024-03-20T09:15:00',
  },
  {
    id: 3,
    type: 'critical',
    message: 'High humidity detected in Wheat field - Risk of fungal growth',
    timestamp: '2024-03-20T08:45:00',
  },
];

export default function SensorsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Please log in to access sensor data.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Sensor Data Dashboard</h1>
        <p className="mt-2 text-gray-600">Real-time monitoring of your crop conditions</p>
      </div>

      {/* Sensor Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Soil Moisture</h3>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-blue-600">65%</span>
            <span className="text-green-500 text-sm mb-1">↑ 2%</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Optimal range: 60-70%</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Temperature</h3>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-red-600">25°C</span>
            <span className="text-red-500 text-sm mb-1">↑ 1°C</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Optimal range: 20-28°C</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Humidity</h3>
          <div className="flex items-end space-x-2">
            <span className="text-3xl font-bold text-cyan-600">70%</span>
            <span className="text-yellow-500 text-sm mb-1">→ Stable</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">Optimal range: 65-75%</p>
        </div>
      </div>

      {/* Sensor Chart */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">24-Hour Trends</h2>
        <div className="h-96">
          <Line
            data={hourlyData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top' as const,
                },
                title: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: false,
                },
              },
            }}
          />
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Alerts</h2>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg ${
                alert.type === 'warning'
                  ? 'bg-yellow-50 border-yellow-200'
                  : alert.type === 'critical'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-blue-50 border-blue-200'
              } border`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      alert.type === 'warning'
                        ? 'text-yellow-800'
                        : alert.type === 'critical'
                        ? 'text-red-800'
                        : 'text-blue-800'
                    }`}
                  >
                    {alert.message}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(alert.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 