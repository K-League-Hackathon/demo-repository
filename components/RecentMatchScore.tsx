
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface RecentMatch {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  homeLogo: string;
  awayLogo: string;
}

interface RecentMatchScoreProps {
  match: RecentMatch;
}

const RecentMatchScore: React.FC<RecentMatchScoreProps> = ({ match }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTimeSeconds = 20 * 60 + 28; // 20:28
  const endTimeSeconds = 21 * 60 + 28; // 21:28
  const goalTimeSeconds = 20 * 60 + 50; // 20:50에 골
  const duration = endTimeSeconds - startTimeSeconds; // 60초

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedSeconds(prev => {
        if (prev >= duration) {
          return 0; // 루프
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration]);

  const currentTimeSeconds = startTimeSeconds + elapsedSeconds;
  const minutes = Math.floor(currentTimeSeconds / 60);
  const seconds = currentTimeSeconds % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  // 20:50 이후면 1-0, 이전이면 0-0
  const homeScore = currentTimeSeconds >= goalTimeSeconds ? 1 : 0;
  const awayScore = 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#0c1a33] border-b border-white/5 px-6 py-4"
    >
      <div className="flex items-center justify-center gap-6">
        {/* Home Team */}
        <div className="flex items-center gap-3">
          <img 
            src={match.homeLogo} 
            alt={match.homeTeam} 
            className="w-8 h-8 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]" 
          />
          <span className="text-sm font-bold text-gray-300 tracking-wide">{match.homeTeam}</span>
        </div>

        {/* Score */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-3">
            <motion.span 
              key={homeScore}
              initial={{ scale: 1.5, color: '#c5a059' }}
              animate={{ scale: 1, color: '#ffffff' }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-black text-white"
            >
              {homeScore}
            </motion.span>
            <span className="text-lg font-bold text-gray-500">-</span>
            <span className="text-2xl font-black text-white">{awayScore}</span>
          </div>
          <span className="text-[11px] text-[#c5a059] mt-1 tracking-wider font-mono font-bold">
            {timeDisplay}
          </span>
        </div>

        {/* Away Team */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-300 tracking-wide">{match.awayTeam}</span>
          <img 
            src={match.awayLogo} 
            alt={match.awayTeam} 
            className="w-8 h-8 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]" 
          />
        </div>
      </div>

      {/* Recent Record Label */}
      <div className="flex justify-center mt-2">
        <span className="text-[9px] font-bold text-[#c5a059] tracking-[0.3em] uppercase">최근 맞대결</span>
      </div>
    </motion.div>
  );
};

export default RecentMatchScore;
