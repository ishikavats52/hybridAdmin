import React, { useState, useEffect } from 'react';
import {
  Users, TrendingUp, TrendingDown, DollarSign, Activity,
  Car, UserPlus, Calendar, Clock, MapPin, AlertCircle, CheckCircle
} from 'lucide-react';
import axios from 'axios';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

// --- Mock Data ---

const rideTrendsData = [
  { name: 'Mon', rides: 120 },
  { name: 'Tue', rides: 132 },
  { name: 'Wed', rides: 101 },
  { name: 'Thu', rides: 134 },
  { name: 'Fri', rides: 190 },
  { name: 'Sat', rides: 230 },
  { name: 'Sun', rides: 210 },
];

const revenueGrowthData = [
  { name: 'Week 1', revenue: 4000 },
  { name: 'Week 2', revenue: 3000 },
  { name: 'Week 3', revenue: 5000 },
  { name: 'Week 4', revenue: 4500 },
];

const userRegistrationData = [
  { name: 'Jan', passengers: 400, drivers: 240 },
  { name: 'Feb', passengers: 300, drivers: 139 },
  { name: 'Mar', passengers: 200, drivers: 980 },
  { name: 'Apr', passengers: 278, drivers: 390 },
  { name: 'May', passengers: 189, drivers: 480 },
  { name: 'Jun', passengers: 239, drivers: 380 },
];

// const classDistribution = [ ... ]; // Removed as unused

// const recentRides = [ ... ]; // Removed as unused

// --- Components ---

const StatCard = ({ title, value, icon, color, trend, footer, subtitle }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-slate-600 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900 mt-2">{value}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
      <div className={`p-3 rounded-xl ${color} text-white`}>
        {icon}
      </div>
    </div>
    {footer && (
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
        <span className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 border ${trend.startsWith('+') ? 'text-emerald-600 bg-emerald-50 border-emerald-200' : 'text-rose-600 bg-rose-50 border-rose-200'}`}>
          {trend.startsWith('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {trend}
        </span>
        <span className="text-slate-500 text-xs">{footer}</span>
      </div>
    )}
  </div>
);

function Home() {
  const [stats, setStats] = useState({
    totalPassengers: 0,
    totalDrivers: 0,
    activeDrivers: 0,
    newRegistrationsToday: 0,
    dailyRevenue: 0,
    totalRevenue: 0
  });
  // const [loading, setLoading] = useState(true); // Removed as unused

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        // setLoading(false);
      }
    };

    fetchStats();
  }, []);
  return (
    <div className="space-y-8">
      {/* Review & Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white text-sm">Real-time platform overview</p>
        </div>
        <div className="flex gap-3">
          {/* <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm">
            Download Report
          </button> */}
        </div>
      </div>

      {/* Stats Row 1: Users & Live Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
        <StatCard
          title="Total Pools"
          value={stats.totalPools?.toLocaleString() || '0'}
          subtitle={`${stats.activePools} Active`}
          icon={<Activity size={24} />}
          color="bg-amber-500"
          trend="+8%"
          footer="Live pooling"
        />
        <StatCard
          title="Total Passengers"
          value={stats.totalPassengers.toLocaleString()}
          icon={<Users size={24} />}
          color="bg-blue-600"
          trend="+12%"
          footer="vs last month"
        />
        <StatCard
          title="Total Drivers"
          value={stats.totalDrivers.toLocaleString()}
          subtitle={`${stats.activeDrivers} Active`}
          icon={<Car size={24} />}
          color="bg-purple-600"
          trend="+5%"
          footer="vs last month"
        />
      </div>

      {/* Stats Row 2: Revenue */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard
          title="Total Collection (Gross)"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign size={24} />}
          color="bg-slate-800"
          trend="+12%"
          footer="Full passenger payments"
        />
        <StatCard
          title="Total Payouts (After 2% Cut)"
          value={`₹${(stats.totalPayouts || 0).toLocaleString()}`}
          subtitle={`Commission: ₹${(stats.totalCommission || 0).toLocaleString()}`}
          icon={<CheckCircle size={24} />}
          color="bg-emerald-600"
          trend="+12%"
          footer="Driver share (98%)"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ride Trends */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Ride Trends (Last 7 Days)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={rideTrendsData}>
                <defs>
                  <linearGradient id="colorRides" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="rides" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRides)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Growth */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Revenue Growth (Monthly)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueGrowthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* User Growth & Recent Rides */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">User Registration Growth</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userRegistrationData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Legend />
                <Bar dataKey="passengers" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Passengers" />
                <Bar dataKey="drivers" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Drivers" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Rides List */}
        {/* <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-900">Recent Rides</h3>
            <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
          </div>
         <div className="space-y-4"> 
            {recentRides.map(ride => (
              <div key={ride.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                    <Car size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">{ride.user}</p>
                    <p className="text-xs text-slate-500">{ride.status} • {ride.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-slate-900">{ride.amount}</p>
                </div>
              </div>
            ))}
          </div> 
        </div> */}
      </div>
    </div>
  );
}

export default Home;
