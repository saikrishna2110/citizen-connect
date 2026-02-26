import React from 'react';
import './Charts.css';

const DoughnutChart = ({ data, title, colors = ['#6a47f2', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 60;
  const strokeWidth = 20;
  const center = radius + strokeWidth;

  let cumulativePercentage = 0;

  const segments = data.map((item, index) => {
    const percentage = (item.value / total) * 100;
    const startAngle = (cumulativePercentage / 100) * 360;
    cumulativePercentage += percentage;
    const endAngle = (cumulativePercentage / 100) * 360;

    const startAngleRad = (startAngle - 90) * (Math.PI / 180);
    const endAngleRad = (endAngle - 90) * (Math.PI / 180);

    const x1 = center + radius * Math.cos(startAngleRad);
    const y1 = center + radius * Math.sin(startAngleRad);
    const x2 = center + radius * Math.cos(endAngleRad);
    const y2 = center + radius * Math.sin(endAngleRad);

    const largeArcFlag = percentage > 50 ? 1 : 0;

    const pathData = [
      `M ${x1} ${y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`
    ].join(' ');

    return {
      pathData,
      color: colors[index % colors.length],
      percentage,
      item
    };
  });

  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="doughnut-chart">
        <svg width={center * 2} height={center * 2} className="doughnut-svg">
          {segments.map((segment, index) => (
            <path
              key={index}
              d={segment.pathData}
              stroke={segment.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeLinecap="round"
            />
          ))}
          <circle
            cx={center}
            cy={center}
            r={radius - strokeWidth / 2}
            fill="white"
          />
          <text
            x={center}
            y={center - 5}
            textAnchor="middle"
            className="doughnut-center-text"
          >
            {total}
          </text>
          <text
            x={center}
            y={center + 15}
            textAnchor="middle"
            className="doughnut-center-label"
          >
            Total
          </text>
        </svg>

        <div className="doughnut-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <div
                className="legend-color"
                style={{ backgroundColor: colors[index % colors.length] }}
              ></div>
              <span className="legend-label">{item.label}</span>
              <span className="legend-value">{item.value} ({((item.value / total) * 100).toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoughnutChart;
