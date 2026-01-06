
import React from 'react';
import {
  Radar,
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { PlayerStats } from '../types';
import { COLORS } from '../constants';

interface RadarChartProps {
  data: PlayerStats[];
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  // 능력치 평균 계산
  const avgValue = data.reduce((acc, d) => acc + d.value, 0) / data.length;
  
  // 능력치에 따른 색상 결정
  const getColor = (avg: number) => {
    if (avg >= 75) return { stroke: '#22c55e', fill: '#22c55e' }; // green
    if (avg >= 60) return { stroke: '#c5a059', fill: '#c5a059' }; // gold
    if (avg >= 45) return { stroke: '#3b82f6', fill: '#3b82f6' }; // blue
    return { stroke: '#ef4444', fill: '#ef4444' }; // red
  };
  
  const colorScheme = getColor(avgValue);

  return (
    <div className="w-full h-full relative">
      {/* Background glow effect */}
      <div 
        className="absolute inset-0 rounded-full blur-3xl opacity-20"
        style={{ background: `radial-gradient(circle, ${colorScheme.fill} 0%, transparent 70%)` }}
      />
      
      <ResponsiveContainer width="100%" height="100%">
        <ReRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <defs>
            <linearGradient id="statGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colorScheme.fill} stopOpacity={0.8} />
              <stop offset="100%" stopColor={colorScheme.fill} stopOpacity={0.3} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <PolarGrid 
            stroke="#1e3a5f" 
            strokeOpacity={0.5}
            gridType="polygon"
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={false}
            axisLine={false}
          />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={({ x, y, payload }) => {
              const stat = data.find(d => d.subject === payload.value);
              const value = stat ? Math.round(stat.value) : 0;
              return (
                <g transform={`translate(${x},${y})`}>
                  <text 
                    textAnchor="middle" 
                    fill="#94a3b8"
                    fontSize={11}
                    fontWeight={800}
                    dy={-2}
                  >
                    {payload.value}
                  </text>
                  <text 
                    textAnchor="middle" 
                    fill={colorScheme.fill}
                    fontSize={13}
                    fontWeight={900}
                    dy={12}
                  >
                    {value}
                  </text>
                </g>
              );
            }}
          />
          <Radar
            name="Player"
            dataKey="value"
            stroke={colorScheme.stroke}
            strokeWidth={2}
            fill="url(#statGradient)"
            fillOpacity={0.6}
            filter="url(#glow)"
          />
        </ReRadarChart>
      </ResponsiveContainer>
      
      {/* Center average score */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div 
            className="text-3xl font-black"
            style={{ color: colorScheme.fill }}
          >
            {Math.round(avgValue)}
          </div>
          <div className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">
            OVR
          </div>
        </div>
      </div>
      
      {/* Decorative ring */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
        <div 
          className="w-20 h-20 border-2 rounded-full animate-pulse"
          style={{ borderColor: colorScheme.fill }}
        />
      </div>
    </div>
  );
};

export default RadarChart;
