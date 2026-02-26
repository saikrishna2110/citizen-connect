import React from 'react';
import './Charts.css';

const BarChart = ({ data, title, color = '#6a47f2' }) => {
  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="bar-chart">
        {data.map((item, index) => (
          <div key={index} className="bar-item">
            <div className="bar-label">{item.label}</div>
            <div className="bar-container">
              <div
                className="bar-fill"
                style={{
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: color
                }}
              >
                <span className="bar-value">{item.value}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarChart;
