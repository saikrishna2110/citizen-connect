import React from 'react';
import './Charts.css';

const LineChart = ({ data, title, color = '#6a47f2', lineColor = '#6a47f2' }) => {
  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const range = maxValue - minValue || 1;

  const width = 300;
  const height = 150;
  const padding = 40;

  const chartWidth = width - (padding * 2);
  const chartHeight = height - (padding * 2);

  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = height - padding - ((item.value - minValue) / range) * chartHeight;
    return `${x},${y}`;
  }).join(' ');

  const gridLines = [];
  for (let i = 0; i <= 5; i++) {
    const y = padding + (i / 5) * chartHeight;
    const value = Math.round(maxValue - (i / 5) * range);
    gridLines.push(
      <g key={i}>
        <line
          x1={padding}
          y1={y}
          x2={width - padding}
          y2={y}
          stroke="#e1e5e9"
          strokeWidth="1"
          strokeDasharray="2,2"
        />
        <text
          x={padding - 10}
          y={y + 4}
          textAnchor="end"
          className="line-chart-axis-label"
        >
          {value}
        </text>
      </g>
    );
  }

  return (
    <div className="chart-container">
      <h3 className="chart-title">{title}</h3>
      <div className="line-chart-container">
        <svg width={width} height={height} className="line-chart-svg">
          {gridLines}

          {/* X-axis */}
          <line
            x1={padding}
            y1={height - padding}
            x2={width - padding}
            y2={height - padding}
            stroke="#6b7280"
            strokeWidth="2"
          />

          {/* Y-axis */}
          <line
            x1={padding}
            y1={padding}
            x2={padding}
            y2={height - padding}
            stroke="#6b7280"
            strokeWidth="2"
          />

          {/* Data line */}
          <polyline
            points={points}
            fill="none"
            stroke={lineColor}
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Data points */}
          {data.map((item, index) => {
            const x = padding + (index / (data.length - 1)) * chartWidth;
            const y = height - padding - ((item.value - minValue) / range) * chartHeight;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="4"
                fill={color}
                stroke="white"
                strokeWidth="2"
              />
            );
          })}

          {/* X-axis labels */}
          {data.map((item, index) => {
            if (index % Math.ceil(data.length / 5) === 0 || index === data.length - 1) {
              const x = padding + (index / (data.length - 1)) * chartWidth;
              return (
                <text
                  key={`label-${index}`}
                  x={x}
                  y={height - padding + 20}
                  textAnchor="middle"
                  className="line-chart-axis-label"
                >
                  {item.label}
                </text>
              );
            }
            return null;
          })}
        </svg>

        {/* Legend */}
        <div className="line-chart-legend">
          <div className="legend-item">
            <div
              className="legend-line"
              style={{ backgroundColor: lineColor }}
            ></div>
            <span>Trend Line</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineChart;
