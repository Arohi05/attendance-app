import React, { useState, useEffect } from 'react';

import { FaCheckCircle, FaTimesCircle, FaArrowUp, FaArrowDown } from 'react-icons/fa';

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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

const menuItems = [
  { label: "Attendance", icon: "📋" },
  { label: "Student", icon: "👩‍🎓" },
  { label: "Report", icon: "📊" },
  { label: "Settings", icon: "⚙️" },
  { label: "Help & Support", icon: "🆘" }
];

const users = [
  { name: 'Jane Smith', role: 'Software Engineer', status: 'Online', lastLogin: 'Just now' },
  { name: 'Chris Lee', role: 'Software Engineer', status: 'Online', lastLogin: '1 min ago' },
];

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

const SortArrow = ({ direction }) => {
  if (!direction) return null;
  if (direction === 'asc') return <FaArrowUp style={{ marginLeft: 5, fontSize: 12 }} />;
  return <FaArrowDown style={{ marginLeft: 5, fontSize: 12 }} />;
};

const Dashboard = () => {
  const [active, setActive] = useState("Attendance");
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  useEffect(() => {
    fetchAttendance();
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

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

  return (
    <div className="dashboard-root">
      <aside className="dashboard-sidebar">
        <div className="logo">re</div>
        <ul>
          {menuItems.map(item => (
            <li
              key={item.label}
              className={active === item.label ? "active" : ""}
              onClick={() => setActive(item.label)}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>
      </aside>
      <main className="dashboard-main">
        <header className="dashboard-header">
          <input
            className="searchbar"
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <div className="user-profile">John Dee</div>
        </header>
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
        <section className="table-row">
          <h4>User Overview</h4>
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
                <th onClick={() => requestSort('name')} style={{ cursor: 'pointer' }}>
                  Name{sortConfig.key === 'name' && <SortArrow direction={sortConfig.direction} />}
                </th>
                <th onClick={() => requestSort('role')} style={{ cursor: 'pointer' }}>
                  Role{sortConfig.key === 'role' && <SortArrow direction={sortConfig.direction} />}
                </th>
                <th onClick={() => requestSort('status')} style={{ cursor: 'pointer' }}>
                  Status{sortConfig.key === 'status' && <SortArrow direction={sortConfig.direction} />}
                </th>
                <th onClick={() => requestSort('lastLogin')} style={{ cursor: 'pointer' }}>
                  Last Login{sortConfig.key === 'lastLogin' && <SortArrow direction={sortConfig.direction} />}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.length > 0 ? sortedUsers.map(user => (
                <tr key={user.name}>
                  <td>{user.name}</td>
                  <td>{user.role}</td>
                  <td className={user.status.toLowerCase()}>{user.status}</td>
                  <td>{user.lastLogin}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center' }}>No users found.</td>
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
