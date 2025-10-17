// Dashboard.jsx - Student Attendance Manager main dashboard component
// This file contains the main React component for the dashboard interface.
// All major UI sections are labeled below and explained for clarity.

import React, { useState, useEffect } from 'react';

// Import attendance-related icons for UI visuals
import { FaCheckCircle, FaTimesCircle, FaArrowUp, FaArrowDown } from 'react-icons/fa';

// Import Chart.js core and useful chart elements for data visualization
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';

// Register required Chart.js parts for charts used below
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

// Sidebar navigation menu items (can add icons in future updates)
const menuItems = [
  { label: "Attendance", icon: null },
  { label: "Student", icon: null },
  { label: "Report", icon: null },
  { label: "Settings", icon: null },
  { label: "Help & Support", icon: null }
];

// Hardcoded user table data (replace with API in production)
const users = [
  { name: 'Elaine', role: 'Software Engineer', status: 'Online', lastLogin: 'Just now' },
  { name: 'Yuval', role: 'Product Manager', status: 'Offline', lastLogin: '10 mins ago' },
  { name: 'Arohi', role: 'QA Engineer', status: 'Offline', lastLogin: 'Yesterday' },
  { name: 'Mohit', role: 'Software Engineer', status: 'Online', lastLogin: '5 mins ago' },
  { name: 'Anugya', role: 'Product Manager', status: 'Online', lastLogin: '15 mins ago' },
  { name: 'Nandini', role: 'Designer', status: 'Online', lastLogin: 'Just now' },
  { name: 'Shreya', role: 'Software Engineer', status: 'Offline', lastLogin: '1 min ago' },
  { name: 'Nelay', role: 'Tester', status: 'Online', lastLogin: '10 secs ago' },
  { name: 'Ashita', role: 'Developer', status: 'Online', lastLogin: '30 mins ago' },
  { name: 'Akshita', role: 'Software Engineer', status: 'Offline', lastLogin: '45 mins ago' },
];

// Data set for weekly attendance (used by Line chart)
const lineData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Attendance',
      data: [12, 19, 14, 20, 18, 24, 22],
      borderColor: 'rgb(54, 162, 235)',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
    },
  ],
};

// Data set for department breakdown (used by Pie chart)
const pieData = {
  labels: [
    'Theory Of Computation',
    'Fundamentals of Predictive Analysis',
    'Data Science',
    'Reactive Architecture',
    'Big Data Technologies'
  ],
  datasets: [
    {
      label: 'Department Breakdown',
      data: [20, 15, 30, 25, 10],
      backgroundColor: [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
      ],
      borderWidth: 1,
    },
  ],
};

// Utility component for showing arrow icon in user table (sorting indicator)
const SortArrow = ({ direction }) => {
  if (!direction) return null;
  if (direction === 'asc') return <FaArrowUp style={{ marginLeft: 5, fontSize: 12 }} />;
  return <FaArrowDown style={{ marginLeft: 5, fontSize: 12 }} />;
};

// Main dashboard React component
const Dashboard = () => {
  // Sidebar navigation selection state
  const [active, setActive] = useState("Attendance");
  // Search input state
  const [searchTerm, setSearchTerm] = useState('');
  // Table sorting configuration
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Attendance stats state (present/absent counts)
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);

  // Loading and error state for attendance fetch
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch present and absent count from API (called on component mount by useEffect)
  const fetchAttendance = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/attendance/today');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setPresentCount(data.presentCount);
      setAbsentCount(data.absentCount);
    } catch (err) {
      setError('Failed to fetch attendance data.');
    }
    setLoading(false);
  };

  // Side effect to fetch attendance on component load
  useEffect(() => {
    fetchAttendance();
  }, []);

  // Filters users by search term typed by user
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handles sorting user table by selected column (Name, Semester, Status)
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Prepare sorted user data for display in table
  let sortedUsers = [...filteredUsers];
  if (sortConfig.key !== null) {
    sortedUsers.sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  // Render dashboard structure
  return (
    <div className="dashboard-root">
      {/* Sidebar navigation section */}
      <aside className="dashboard-sidebar">
        <div className="logo"><strong>Student Attendance Manager</strong></div>
        <ul>
          {menuItems.map(item => (
            <li
              key={item.label}
              className={active === item.label ? "active" : ""}
              onClick={() => setActive(item.label)}
            >
              <strong>{item.label}</strong>
            </li>
          ))}
        </ul>
      </aside>
      <main className="dashboard-main">
        {/* Top header: search bar and profile */}
        <header className="dashboard-header">
          <input
            className="searchbar"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          {/* User profile display */}
          <div className="user-profile">Kushal Joshi</div>
        </header>
        {/* Attendance statistics cards */}
        <section className="stats-row">
          <div className="stat-box present">
            <FaCheckCircle className="stat-icon green" /> Present Today<br />
            {loading ? <strong>Loading...</strong> :
              error ? <strong>{error}</strong> :
                <strong>{presentCount}</strong>
            }
            <span className="trend up"><FaArrowUp /> 5%</span>
          </div>
          <div className="stat-box absent">
            <FaTimesCircle className="stat-icon red" /> Absent<br />
            {loading ? <strong>Loading...</strong> :
              error ? <strong>{error}</strong> :
                <strong>{absentCount}</strong>
            }
            <span className="trend down"><FaArrowDown /> 2%</span>
          </div>
        </section>
        {/* Attendance charts row */}
        <section className="charts-row">
          <div className="chart-box">
            <h4>Weekly Attendance Trend</h4>
            <Line data={lineData} />
          </div>
          <div className="chart-box">
            <h4>Department Breakdown</h4>
            <Pie data={pieData} />
          </div>
        </section>
        {/* Student attendance table */}
        <section className="table-row">
          <h4>Student Overview</h4>
          <input
            type="text"
            className="table-search"
            placeholder="Search users..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <table>
            <thead>
              <tr>
                {/* Table headers with sorting */}
                <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>
                  Name{sortConfig.key === 'name' && <SortArrow direction={sortConfig.direction} />}
                </th>
                <th style={{ cursor: 'default' }}>
                  Semester
                </th>
                <th onClick={() => requestSort('status')} style={{ cursor: 'pointer' }}>
                  Status{sortConfig.key === 'status' && <SortArrow direction={sortConfig.direction} />}
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Render student data in table rows */}
              {sortedUsers.length > 0 ? sortedUsers.map(user => (
                <tr key={user.name}>
                  <td>{user.name}</td>
                  <td>Sem V</td>
                  <td className={user.status.toLowerCase()}>
                    {user.status === "Online" ? "Present" : "Absent"}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: 'center' }}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
