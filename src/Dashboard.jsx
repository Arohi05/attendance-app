import React, { useState } from 'react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const menuItems = [
  { label: "Attendance", icon: "📋" },
  { label: "Student", icon: "👩‍🎓" },
  { label: "Report", icon: "📊" },
  { label: "Settings", icon: "⚙️" },
  { label: "Help & Support", icon: "🆘" }
];

// Sample chart data for Weekly Attendance Trend
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

const Dashboard = () => {
  const [active, setActive] = useState("Attendance");

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
          <input className="searchbar" type="text" placeholder="Search..." />
          <div className="user-profile">John Dee</div>
        </header>
        <section className="stats-row">
          <div className="stat-box present">Present Today<br /><strong>450</strong></div>
          <div className="stat-box absent">Absent<br /><strong>20</strong></div>
          <div className="stat-box remote">Remote<br /><strong>120</strong></div>
        </section>
        <section className="charts-row">
          <div className="chart-box">
            <h4>Weekly Attendance Trend</h4>
            <Line data={lineData} />
          </div>
          <div className="chart-box">
            <h4>Department Breakdown</h4>
            {/* Static pie chart placeholder */}
            <div className="chart-placeholder">[Pie Chart Here]</div>
          </div>
        </section>
        <section className="table-row">
          <h4>User Overview</h4>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Jane Smith</td>
                <td>Software Engineer</td>
                <td className="online">Online</td>
                <td>Just now</td>
              </tr>
              <tr>
                <td>Chris Lee</td>
                <td>Software Engineer</td>
                <td className="online">Online</td>
                <td>1 min ago</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
