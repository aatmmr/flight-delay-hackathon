import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { analyticsAPI } from '../lib/api';
import { AnalyticsResponse } from '../types';

export function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await analyticsAPI.getDelayAnalytics();
      setAnalytics(res.data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!analytics) {
    return <div className="text-center py-12 text-gray-500">Failed to load analytics</div>;
  }

  const dayLabels: Record<number, string> = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday',
  };

  const monthLabels: Record<number, string> = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December',
  };

  const dayOfWeekData = Object.entries(analytics.delaysByDayOfWeek).map(([day, stats]) => ({
    name: dayLabels[parseInt(day)],
    delayPercentage: stats.delayPercentage,
    avgDelay: stats.averageDepDelay,
  }));

  const monthData = Object.entries(analytics.delaysByMonth).map(([month, stats]) => ({
    name: monthLabels[parseInt(month)],
    delayPercentage: stats.delayPercentage,
    avgDelay: stats.averageDepDelay,
  }));

  const carrierData = analytics.delaysByCarrier.slice(0, 10).map((c) => ({
    name: c.carrier,
    delayedFlights: c.delayedFlights,
  }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold">Flight Delay Analytics</h1>

      {/* Top Airlines with Delays */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4">Top Airlines by Delayed Flights</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={carrierData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="delayedFlights" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Delay by Day of Week */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4">Delay by Day of Week</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dayOfWeekData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="delayPercentage"
              stroke="#3b82f6"
              name="Delay %"
            />
            <Line
              type="monotone"
              dataKey="avgDelay"
              stroke="#10b981"
              name="Avg Delay (min)"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Delay by Month */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white p-6 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-4">Delay by Month</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="delayPercentage"
              stroke="#f59e0b"
              name="Delay %"
            />
            <Line
              type="monotone"
              dataKey="avgDelay"
              stroke="#8b5cf6"
              name="Avg Delay (min)"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analytics.delaysByCarrier.slice(0, 4).map((carrier, idx) => (
          <motion.div
            key={carrier.carrier}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white p-4 rounded-lg shadow-md"
          >
            <h3 className="text-lg font-semibold text-gray-700">{carrier.carrier}</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {carrier.delayPercentage.toFixed(1)}%
            </p>
            <p className="text-sm text-gray-600">Flights Delayed</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
