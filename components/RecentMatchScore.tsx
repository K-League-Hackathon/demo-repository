
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

interface MatchHistory {
  date: string;
  homeScore: number;
  awayScore: number;
  competition: string;
}

interface RecentMatchScoreProps {
  match: RecentMatch;
  isVideoPlaying?: boolean;
  videoCurrentTime?: number;
}

// 최근 맞대결 기록 (광주 FC vs FC 서울)
const MATCH_HISTORY: MatchHistory[] = [
  { date: '2025.09.15', homeScore: 2, awayScore: 1, competition: 'K리그1' },
  { date: '2025.05.22', homeScore: 0, awayScore: 0, competition: 'K리그1' },
  { date: '2024.10.06', homeScore: 1, awayScore: 3, competition: 'K리그1' },
  { date: '2024.06.30', homeScore: 2, awayScore: 2, competition: 'K리그1' },
  { date: '2024.03.10', homeScore: 1, awayScore: 0, competition: 'K리그1' },
];

const RecentMatchScore: React.FC<RecentMatchScoreProps> = ({ match, isVideoPlaying = false, videoCurrentTime }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTimeSeconds = 20 * 60 + 28; // 20:28
  const goalTimeSeconds = 20 * 60 + 50; // 20:50에 골
  const duration = 60; // 1분 영상

  // 영상 시간과 동기화 (영상 0초 = 타이머 20:28)
  useEffect(() => {
    if (videoCurrentTime !== undefined && isVideoPlaying) {
      const elapsed = Math.floor(videoCurrentTime);
      if (elapsed >= 0 && elapsed <= duration) {
        setElapsedSeconds(elapsed);
      }
    }
  }, [videoCurrentTime, isVideoPlaying, duration]);

  // 영상이 재생 중이 아니면 타이머 멈춤 (초기 상태에서 대기)

  const currentTimeSeconds = startTimeSeconds + elapsedSeconds;
  const minutes = Math.floor(currentTimeSeconds / 60);
  const seconds = currentTimeSeconds % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  // 20:50 이후면 1-0, 이전이면 0-0 (영상 22초 시점)
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
      <div className="flex justify-center ml-4 mt-2 mb-2">
        <span className="text-[9px] font-bold text-[#c5a059] tracking-[0.3em] uppercase">최근 맞대결</span>
      </div>
      
      {/* Match History */}
      <div className="flex flex-col gap-1 mt-1">
        {MATCH_HISTORY.slice(0, 3).map((history, index) => (
          <div 
            key={index}
            className="flex items-center justify-center gap-4 py-1 px-3 rounded bg-white/[0.02] border border-white/5"
          >
            <span className="text-[9px] text-gray-500 font-mono w-20">{history.date}</span>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-black ${history.homeScore > history.awayScore ? 'text-green-400' : history.homeScore < history.awayScore ? 'text-red-400' : 'text-gray-400'}`}>
                {history.homeScore}
              </span>
              <span className="text-[9px] text-gray-600">-</span>
              <span className={`text-[11px] font-black ${history.awayScore > history.homeScore ? 'text-green-400' : history.awayScore < history.homeScore ? 'text-red-400' : 'text-gray-400'}`}>
                {history.awayScore}
              </span>
            </div>
            <span className="text-[8px] text-gray-600 font-medium">{history.competition}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentMatchScore;
