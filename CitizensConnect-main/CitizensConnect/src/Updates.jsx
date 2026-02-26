import React, { useState, useMemo, useEffect } from "react";
import {
  updatesCategories,
  getRecentUpdates,
  getCategoryStats
} from "./data/UpdatesData";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  Search,
  Filter,
  RefreshCw
} from "lucide-react";
import "./Updates.css";

export default function Updates() {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [selectedUpdate, setSelectedUpdate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Date filtering state
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [datePreset, setDatePreset] = useState('last30days');

  // Set default to last 30 days on component mount
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    setEndDate(today.toISOString().split('T')[0]);
    setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
  }, []);

  // Toggle category expansion
  const toggleCategory = (categoryKey) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey]
    }));
  };

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#dc2626';
      case 'high': return '#ea580c';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Resolved':
      case 'Completed':
        return <CheckCircle size={16} color="#10b981" />;
      case 'In Progress':
      case 'Active':
        return <Clock size={16} color="#f59e0b" />;
      case 'Upcoming':
        return <Calendar size={16} color="#6a47f2" />;
      default:
        return <AlertCircle size={16} color="#6b7280" />;
    }
  };

  // Get count of updates for a specific date range
  const getUpdatesCountForRange = (days) => {
    const today = new Date();
    const startRange = new Date();
    startRange.setDate(today.getDate() - days);

    const allUpdates = Object.values(updatesCategories).flatMap(category => category.updates);
    return allUpdates.filter(update => {
      const updateDate = new Date(update.date);
      return updateDate >= startRange && updateDate <= today;
    }).length;
  };

  // Handle date preset changes
  const handleDatePresetChange = (preset) => {
    setDatePreset(preset);
    const today = new Date();

    switch (preset) {
      case 'last7days':
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);
        setStartDate(sevenDaysAgo.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        break;
      case 'last30days':
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);
        setStartDate(thirtyDaysAgo.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        break;
      case 'last90days':
        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(today.getDate() - 90);
        setStartDate(ninetyDaysAgo.toISOString().split('T')[0]);
        setEndDate(today.toISOString().split('T')[0]);
        break;
      case 'custom':
        // Keep current dates for custom range
        break;
      default:
        break;
    }
  };

  // Filter updates based on search, priority, and date range
  const filteredUpdates = useMemo(() => {
    const allUpdates = Object.entries(updatesCategories).flatMap(([categoryKey, category]) =>
      category.updates.map(update => ({
        ...update,
        categoryKey,
        categoryTitle: category.title,
        categoryColor: category.color,
        categoryIcon: category.icon
      }))
    );

    return allUpdates.filter(update => {
      const matchesSearch = searchTerm === '' ||
        update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
        update.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriority = priorityFilter === 'all' || update.priority === priorityFilter;

      // Date range filtering
      const updateDate = new Date(update.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      const matchesDateRange = (!start || updateDate >= start) && (!end || updateDate <= end);

      return matchesSearch && matchesPriority && matchesDateRange;
    });
  }, [searchTerm, priorityFilter, startDate, endDate]);

  // Group filtered updates by category
  const groupedUpdates = useMemo(() => {
    const groups = {};
    filteredUpdates.forEach(update => {
      if (!groups[update.categoryKey]) {
        groups[update.categoryKey] = [];
      }
      groups[update.categoryKey].push(update);
    });
    return groups;
  }, [filteredUpdates]);

  // Get category stats
  const categoryStats = getCategoryStats();

  return (
    <div className="updates-container">
      <div className="updates-header">
        <h1 className="updates-title">Latest Updates</h1>
        <p className="updates-subtitle">
          Stay informed about the latest developments in your community and government initiatives.
          Click on any category heading to view detailed updates.
        </p>

        {/* Search and Filters */}
        <div className="updates-controls">
          <div className="search-bar">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search updates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={18} />
            Filters
            <ChevronDown size={16} className={showFilters ? 'rotated' : ''} />
          </button>

          {showFilters && (
            <div className="filter-options">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          )}

          {/* Date Range Controls */}
          <div className="date-controls">
            <div className="date-filter-header">
              <h4>📅 Filter by Date</h4>
              <span className="filter-info">
                Showing {filteredUpdates.length} of {Object.values(updatesCategories).reduce((total, category) => total + category.updates.length, 0)} updates
              </span>
            </div>

            <div className="date-presets">
              <div className="preset-group">
                <button
                  className={`preset-btn ${datePreset === 'last7days' ? 'active' : ''}`}
                  onClick={() => handleDatePresetChange('last7days')}
                >
                  <span className="preset-label">Last 7 Days</span>
                  <span className="preset-count">
                    {getUpdatesCountForRange(7)} updates
                  </span>
                </button>
                <button
                  className={`preset-btn ${datePreset === 'last30days' ? 'active' : ''}`}
                  onClick={() => handleDatePresetChange('last30days')}
                >
                  <span className="preset-label">Last 30 Days</span>
                  <span className="preset-count">
                    {getUpdatesCountForRange(30)} updates
                  </span>
                </button>
              </div>
              <div className="preset-group">
                <button
                  className={`preset-btn ${datePreset === 'last90days' ? 'active' : ''}`}
                  onClick={() => handleDatePresetChange('last90days')}
                >
                  <span className="preset-label">Last 90 Days</span>
                  <span className="preset-count">
                    {getUpdatesCountForRange(90)} updates
                  </span>
                </button>
                <button
                  className={`preset-btn ${datePreset === 'custom' ? 'active' : ''}`}
                  onClick={() => handleDatePresetChange('custom')}
                >
                  <span className="preset-label">Custom Range</span>
                  <span className="preset-count">Select dates</span>
                </button>
              </div>
            </div>

            {datePreset === 'custom' && (
              <div className="custom-dates">
                <div className="date-input-group">
                  <label>From Date:</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="date-input"
                  />
                </div>
                <div className="date-input-group">
                  <label>To Date:</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="date-input"
                  />
                </div>
              </div>
            )}

            {/* Current Date Range Display */}
            <div className="current-range">
              <span className="range-label">Current Range:</span>
              <span className="range-dates">
                {startDate && endDate ?
                  `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}` :
                  'All dates'
                }
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Update Categories */}
      <div className="updates-categories">
        {Object.entries(updatesCategories).map(([categoryKey, category]) => (
          <div key={categoryKey} className="update-category">
            <div
              className="category-header"
              onClick={() => toggleCategory(categoryKey)}
              style={{ borderLeftColor: category.color }}
            >
              <div className="category-info">
                <span className="category-icon">{category.icon}</span>
                <div className="category-text">
                  <h3 className="category-title" style={{ color: category.color }}>
                    {category.title}
                  </h3>
                  <p className="category-description">{category.description}</p>
                  <div className="category-stats">
                    <span className="update-count">
                      {groupedUpdates[categoryKey]?.length || 0} updates
                    </span>
                    {category.lastUpdated && (
                      <span className="last-updated">
                        Last updated: {new Date(category.lastUpdated).toLocaleDateString()}
                      </span>
                    )}
                    {category.availableDateRange && (
                      <span className="date-range">
                        Available: {category.availableDateRange.totalDays} days ({new Date(category.availableDateRange.earliest).toLocaleDateString()} - {new Date(category.availableDateRange.latest).toLocaleDateString()})
                      </span>
                    )}
                  </div>
                  {category.availableOptions && (
                    <div className="available-options">
                      <div className="options-header">
                        <span className="options-label">📅 Available Date Options:</span>
                        {category.availableDateRange && (
                          <span className="date-coverage">
                            {category.availableDateRange.totalDays} days of data
                          </span>
                        )}
                      </div>
                      <div className="options-list">
                        {category.availableOptions.map((option, idx) => (
                          <span key={idx} className="option-tag">{option}</span>
                        ))}
                      </div>
                      {category.availableDateRange && (
                        <div className="date-range-info">
                          <span className="range-text">
                            From {new Date(category.availableDateRange.earliest).toLocaleDateString()} to {new Date(category.availableDateRange.latest).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="expand-icon">
                {expandedCategories[categoryKey] ?
                  <ChevronUp size={20} /> :
                  <ChevronDown size={20} />
                }
              </div>
            </div>

            {/* Expanded Updates */}
            {expandedCategories[categoryKey] && (
              <div className="category-updates">
                {groupedUpdates[categoryKey]?.length > 0 ? (
                  groupedUpdates[categoryKey].map((update) => (
                    <div
                      key={update.id}
                      className="update-item"
                      onClick={() => setSelectedUpdate(selectedUpdate?.id === update.id ? null : update)}
                    >
                      <div className="update-header">
                        <div className="update-meta">
                          <span
                            className="priority-badge"
                            style={{ backgroundColor: getPriorityColor(update.priority) }}
                          >
                            {update.priority}
                          </span>
                          <span className="update-date">
                            {new Date(update.date).toLocaleDateString()}
                          </span>
                          <div className="update-location">
                            <MapPin size={14} />
                            <span>{update.location}</span>
                          </div>
                        </div>
                        <div className="update-status">
                          {getStatusIcon(update.status)}
                          <span>{update.status}</span>
                        </div>
                      </div>

                      <h4 className="update-title">{update.title}</h4>
                      <p className="update-summary">{update.summary}</p>

                      {/* Detailed View */}
                      {selectedUpdate?.id === update.id && (
                        <div className="update-details">
                          <div className="detail-section">
                            <h5>Details</h5>
                            <p>{update.details}</p>
                          </div>

                          <div className="detail-grid">
                            <div className="detail-item">
                              <h6>Timeline</h6>
                              <p>{update.timeline}</p>
                            </div>

                            <div className="detail-item">
                              <h6>Contact</h6>
                              <p>{update.contact}</p>
                            </div>

                            <div className="detail-item">
                              <h6>Source</h6>
                              <p>{update.source}</p>
                            </div>
                          </div>

                          {update.resolution && (
                            <div className="detail-section">
                              <h5>Resolution</h5>
                              <p>{update.resolution}</p>
                            </div>
                          )}

                          {update.citizen_impact && (
                            <div className="detail-section">
                              <h5>Citizen Impact</h5>
                              <p>{update.citizen_impact}</p>
                            </div>
                          )}

                          {update.highlights && (
                            <div className="detail-section">
                              <h5>Highlights</h5>
                              <ul>
                                {update.highlights.map((highlight, idx) => (
                                  <li key={idx}>{highlight}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {update.url && (
                            <div className="detail-actions">
                              <a
                                href={update.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="external-link"
                              >
                                <ExternalLink size={14} />
                                View Source
                              </a>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-updates">
                    <p>No updates found matching your filters.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Updates Overview Summary */}
      <div className="updates-overview">
        <h3>📊 Updates Overview</h3>
        <div className="overview-grid">
          <div className="overview-card">
            <h4>Total Updates Available</h4>
            <div className="total-count">
              {Object.values(updatesCategories).reduce((total, category) => total + category.updates.length, 0)}
            </div>
            <p>Across all categories</p>
          </div>

          <div className="overview-card">
            <h4>Date Range Coverage</h4>
            <div className="date-coverage">
              <span className="earliest-date">
                From: {new Date(Math.min(...Object.values(updatesCategories).map(cat => new Date(cat.availableDateRange?.earliest || cat.updates[0]?.date)))).toLocaleDateString()}
              </span>
              <span className="latest-date">
                To: {new Date(Math.max(...Object.values(updatesCategories).map(cat => new Date(cat.availableDateRange?.latest || cat.updates[0]?.date)))).toLocaleDateString()}
              </span>
            </div>
            <p>Historical data available</p>
          </div>

          <div className="overview-card">
            <h4>Available Filter Options</h4>
            <div className="filter-options-summary">
              <span className="filter-count">5+ date presets</span>
              <span className="custom-range">Custom ranges</span>
              <span className="priority-filters">Priority filters</span>
            </div>
            <p>Flexible filtering options</p>
          </div>
        </div>
      </div>

      {/* Category Statistics */}
      <div className="recent-updates-summary">
        <h3>📈 Category Statistics</h3>
        <div className="summary-stats">
          {categoryStats.map((stat) => {
            const categoryData = updatesCategories[stat.key];
            return (
              <div key={stat.key} className="stat-item">
                <span className="stat-icon">{stat.icon}</span>
                <div className="stat-info">
                  <span className="stat-number">{stat.updateCount}</span>
                  <span className="stat-label">{stat.title}</span>
                  {categoryData?.lastUpdated && (
                    <span className="stat-last-updated">
                      Updated: {new Date(categoryData.lastUpdated).toLocaleDateString()}
                    </span>
                  )}
                  {categoryData?.availableDateRange && (
                    <span className="stat-range">
                      {categoryData.availableDateRange.totalDays} days available
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
