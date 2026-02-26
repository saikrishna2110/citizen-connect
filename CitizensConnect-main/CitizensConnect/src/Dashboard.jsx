import React, { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useSocket } from "./context/SocketContext";
import { CheckCircle, Clock, TrendingUp, Users, MessageSquare, AlertTriangle, Shield, FileText } from "lucide-react";
import BarChart from "./Components/Charts/BarChart";
import DoughnutChart from "./Components/Charts/DoughnutChart";
import LineChart from "./Components/Charts/LineChart";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useAuth();
  const { tickets, isConnected } = useSocket();
  const [stats, setStats] = useState({
    totalTickets: 0,
    solvedTickets: 0,
    openTickets: 0,
    activeUsers: 0,
    activePoliticians: 0,
    ticketsRaised: 0
  });

  // Calculate stats from tickets
  useEffect(() => {
    const totalTickets = tickets.length;
    const solvedTickets = tickets.filter(ticket => ticket.status === 'solved').length;
    const openTickets = totalTickets - solvedTickets;

    setStats({
      totalTickets,
      solvedTickets,
      openTickets,
      activeUsers: 2847, // Active citizens using the platform
      activePoliticians: 23, // Active politicians from Andhra Pradesh
      ticketsRaised: 2 // Tickets raised this month
    });
  }, [tickets]);

  // Prepare chart data
  const ticketStatusData = [
    { label: 'Open Issues', value: stats.openTickets },
    { label: 'Resolved Issues', value: stats.solvedTickets }
  ];

  // Mock category data based on available tickets (in real app, this would be calculated from actual data)
  const categoryData = [
    { label: 'Infrastructure', value: Math.floor(stats.totalTickets * 0.35) },
    { label: 'Utilities', value: Math.floor(stats.totalTickets * 0.25) },
    { label: 'Public Safety', value: Math.floor(stats.totalTickets * 0.20) },
    { label: 'Healthcare', value: Math.floor(stats.totalTickets * 0.10) },
    { label: 'Other', value: Math.floor(stats.totalTickets * 0.10) }
  ];

  // Mock trend data for the last 6 months
  const trendData = [
    { label: 'Jan', value: 45 },
    { label: 'Feb', value: 52 },
    { label: 'Mar', value: 38 },
    { label: 'Apr', value: 61 },
    { label: 'May', value: 55 },
    { label: 'Jun', value: stats.totalTickets }
  ];

  const recentTickets = tickets
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const solvedIssues = tickets
    .filter(ticket => ticket.status === 'solved')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  return (
    <div className="dashboard">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero card">
          <div className="hero-content">
            <h1>Welcome to CitizensConnect</h1>
            <p>Empowering citizens to engage with elected representatives for transparent and responsive governance.</p>

            {user && (
              <div className="user-greeting">
                <p>Hello, <strong>{user.name}</strong>! You're logged in as a <strong>{user.role}</strong>.</p>
              </div>
            )}

            {!user && (
              <div className="login-prompt">
                <p>Please login to create tickets and engage with your representatives.</p>
              </div>
            )}
          </div>

          <div className="connection-status">
            <div className={`status-indicator ${user ? 'connected' : 'disconnected'}`}>
              <div className="status-dot"></div>
              <span>{user ? 'Online' : 'Offline'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <MessageSquare size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.totalTickets}</h3>
              <p>Total Issues</p>
            </div>
            <div className="stat-trend positive">
              <TrendingUp size={16} />
              <span>+12%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon solved">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.solvedTickets}</h3>
              <p>Issues Resolved</p>
            </div>
            <div className="stat-trend positive">
              <TrendingUp size={16} />
              <span>+8%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.openTickets}</h3>
              <p>Pending Issues</p>
            </div>
            <div className="stat-trend neutral">
              <AlertTriangle size={16} />
              <span>Active</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.activeUsers}</h3>
              <p>Active Citizens</p>
            </div>
            <div className="stat-trend positive">
              <TrendingUp size={16} />
              <span>+5%</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon politician">
              <Shield size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.activePoliticians}</h3>
              <p>Active Politicians</p>
            </div>
            <div className="stat-trend neutral">
              <Users size={16} />
              <span>Active</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <FileText size={24} />
            </div>
            <div className="stat-content">
              <h3>{stats.ticketsRaised}</h3>
              <p>Tickets Raised</p>
            </div>
            <div className="stat-trend positive">
              <TrendingUp size={16} />
              <span>+15%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <div className="charts-header">
          <h2>Data Insights</h2>
          <p>Visual representation of platform statistics and trends</p>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <BarChart
              data={ticketStatusData}
              title="Issue Status Distribution"
              color="#6a47f2"
            />
          </div>

          <div className="chart-card">
            <DoughnutChart
              data={categoryData}
              title="Issues by Category"
              colors={['#6a47f2', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']}
            />
          </div>

          <div className="chart-card">
            <LineChart
              data={trendData}
              title="Monthly Issue Trends"
              color="#6a47f2"
              lineColor="#6a47f2"
            />
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="activity-section">
        <div className="activity-grid">
          {/* Recent Tickets */}
          <div className="activity-card">
            <div className="activity-header">
              <h2>Recent Issues</h2>
              <span className="activity-count">{recentTickets.length}</span>
            </div>

            <div className="activity-list">
              {recentTickets.length === 0 ? (
                <div className="empty-state">
                  <MessageSquare size={32} />
                  <p>No recent issues</p>
                </div>
              ) : (
                recentTickets.map(ticket => (
                  <div key={ticket.id} className="activity-item">
                    <div className="activity-icon">
                      <MessageSquare size={18} />
                    </div>
                    <div className="activity-content">
                      <h4>{ticket.title}</h4>
                      <p>by {ticket.author} • {new Date(ticket.createdAt).toLocaleDateString()}</p>
                      <div className="activity-meta">
                        <span className={`priority-badge ${ticket.priority}`}>
                          {ticket.priority}
                        </span>
                        <span className={`status-badge ${ticket.status}`}>
                          {ticket.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Solved Issues */}
          <div className="activity-card solved-issues">
            <div className="activity-header">
              <h2>Solved Issues</h2>
              <span className="activity-count solved">{solvedIssues.length}</span>
            </div>

            <div className="activity-list">
              {solvedIssues.length === 0 ? (
                <div className="empty-state">
                  <CheckCircle size={32} />
                  <p>No solved issues yet</p>
                </div>
              ) : (
                solvedIssues.map(ticket => (
                  <div key={ticket.id} className="activity-item solved">
                    <div className="activity-icon solved">
                      <CheckCircle size={18} />
                    </div>
                    <div className="activity-content">
                      <h4>{ticket.title}</h4>
                      <p>Solved by representative • {new Date(ticket.createdAt).toLocaleDateString()}</p>
                      <div className="activity-meta">
                        <span className="resolution-time">
                          Resolved in {Math.floor(Math.random() * 30) + 1} days
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      {user && (
        <section className="quick-actions">
          <div className="actions-card">
            <h2>Quick Actions</h2>
            <div className="actions-grid">
              <a href="/issues" className="action-btn primary">
                <MessageSquare size={20} />
                <span>Create New Issue</span>
              </a>

              <a href="/representatives" className="action-btn secondary">
                <Users size={20} />
                <span>View Representatives</span>
              </a>

              <a href="/updates" className="action-btn secondary">
                <Clock size={20} />
                <span>Check Updates</span>
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
