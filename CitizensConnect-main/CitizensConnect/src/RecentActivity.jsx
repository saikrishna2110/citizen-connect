import React from 'react';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      <h1>Welcome to CitizenConnect</h1>
      <p>Empowering citizens to engage with their elected representatives for transparent and responsive governance.</p>
      <div className="stats">
        <div className="stat-item">
          <h3>1,250</h3>
          <p>Issues Reported</p>
        </div>
        <div className="stat-item">
          <h3>892</h3>
          <p>Issues Resolved</p>
        </div>
        <div className="stat-item">
          <h3>156</h3>
          <p>Active Representatives</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;