import React from "react";
import NagiveAdmin from "./admin/nagiveadmin";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const data = [
  { name: "Mon", value: 40 },
  { name: "Tue", value: 30 },
  { name: "Wed", value: 20 },
  { name: "Thu", value: 27 },
  { name: "Fri", value: 18 },
  { name: "Sat", value: 23 },
  { name: "Sun", value: 34 },
];

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <NagiveAdmin />

      {/* Main content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Dashboard / Home</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search"
              className="border rounded-lg px-3 py-1"
            />
            <button>🔔</button>
            <button>⚙️</button>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm">Doanh thu hôm nay</p>
            <h3 className="text-2xl font-bold">$53k</h3>
            <p className="text-green-500">+55% than last week</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm">Today's Users</p>
            <h3 className="text-2xl font-bold">2,300</h3>
            <p className="text-green-500">+3% than last month</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm">New Clients</p>
            <h3 className="text-2xl font-bold">3,462</h3>
            <p className="text-red-500">-2% than yesterday</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm">Sales</p>
            <h3 className="text-2xl font-bold">$103,430</h3>
            <p className="text-green-500">+5% than yesterday</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-bold">Website View</h4>
            <p className="text-sm text-gray-500">Last Campaign Performance</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-bold">Daily Sales</h4>
            <p className="text-sm text-gray-500">15% increase in today sales</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h4 className="font-bold">Completed Tasks</h4>
            <p className="text-sm text-gray-500">Last Campaign Performance</p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#ff7300" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
