
import React from 'react';
import {
  Radar,
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';
import { PlayerStats } from '../types';
import { COLORS } from '../constants';

interface RadarChartProps {
  data: PlayerStats[];
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
  return (
    <div className="w-full h-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <ReRadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#1e293b" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: COLORS.GRAY, fontSize: 16, fontWeight: 800 }}
          />
          <Radar
            name="Player"
            dataKey="value"
            stroke={COLORS.GOLD}
            fill={COLORS.GOLD}
            fillOpacity={0.65}
          />
        </ReRadarChart>
      </ResponsiveContainer>
      {/* Decorative pulse glow in the background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
         <div className="w-32 h-32 border border-amber-500 rounded-full animate-ping"></div>
      </div>
    </div>
  );
};

export default RadarChart;
