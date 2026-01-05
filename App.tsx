
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { PLAYERS, MOCK_SEQUENCE } from './constants';
import PlayerCard from './components/PlayerCard';
import VideoPlayer from './components/VideoPlayer';
import PitchMap from './components/PitchMap';
import RecentMatchScore from './components/RecentMatchScore';
import { MatchInfo, Player, SequenceAction } from './types';
import { motion, AnimatePresence } from 'framer-motion';

// ActionStack 내부에서 인덱스 비교를 정확히 하기 위해 전역에 데이터 노출
(window as any).MOCK_SEQUENCE_DATA = MOCK_SEQUENCE;

const App: React.FC = () => {
  const [matchInfo] = useState<MatchInfo>({
    homeTeam: 'SEOUL FC',
    awayTeam: 'ULSAN HD',
    homeScore: 1,
    awayScore: 0,
    time: '34:12',
    stadium: 'SEOUL WORLD CUP STADIUM'
  });

  const [currentPlayer, setCurrentPlayer] = useState<Player>(PLAYERS[0]);
  const [activeActionIndex, setActiveActionIndex] = useState(-1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentSequenceRange, setCurrentSequenceRange] = useState<number[]>([]);
  const [activeSequenceActions, setActiveSequenceActions] = useState<SequenceAction[]>([]);
  const autoPlayTimerRef = useRef<number | null>(null);

  // 최근 맞대결 데이터
  const recentMatch = {
    homeTeam: 'Gwangju FC',
    awayTeam: 'FC Seoul',
    homeScore: 2,
    awayScore: 0,
    homeLogo: '/광주fc.png',
    awayLogo: '/서울fc.png'
  };

  const shotLogs = MOCK_SEQUENCE.filter(action => action.type_name === "Shot");

  const handleShotClick = useCallback((shotAction: SequenceAction) => {
    setIsAutoPlaying(false);
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    
    const shotIdx = MOCK_SEQUENCE.findIndex(a => a.action_id === shotAction.action_id);
    const startIdx = Math.max(0, shotIdx - 4);
    
    const sequenceIndices = [];
    const sequenceActions = [];
    for (let i = startIdx; i <= shotIdx; i++) {
      sequenceIndices.push(i);
      sequenceActions.push(MOCK_SEQUENCE[i]);
    }
    
    setActiveSequenceActions(sequenceActions);
    setCurrentSequenceRange(sequenceIndices);
    setActiveActionIndex(sequenceIndices[0]);
    setIsAutoPlaying(true);
  }, []);

  const handleJumpToStep = useCallback((index: number) => {
    if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current);
    setActiveActionIndex(index);
    setIsAutoPlaying(true);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || activeActionIndex < 0) return;

    const currentAction = MOCK_SEQUENCE[activeActionIndex];
    const targetPlayer = PLAYERS.find(p => p.name === currentAction.player_name_ko);
    if (targetPlayer) setCurrentPlayer(targetPlayer);

    const currentRangeIdx = currentSequenceRange.indexOf(activeActionIndex);
    
    if (currentRangeIdx !== -1 && currentRangeIdx < currentSequenceRange.length - 1) {
      const nextGlobalIdx = currentSequenceRange[currentRangeIdx + 1];
      const nextAction = MOCK_SEQUENCE[nextGlobalIdx];
      
      const timeDiff = (nextAction.time_seconds - currentAction.time_seconds) * 1000;
      const delay = Math.min(Math.max(1200, timeDiff), 2500); 

      autoPlayTimerRef.current = window.setTimeout(() => {
        setActiveActionIndex(nextGlobalIdx);
      }, delay);
    } else if (currentRangeIdx === currentSequenceRange.length - 1) {
      autoPlayTimerRef.current = window.setTimeout(() => {
        setIsAutoPlaying(false);
      }, 5000); 
    }

    return () => { if (autoPlayTimerRef.current) clearTimeout(autoPlayTimerRef.current); };
  }, [activeActionIndex, isAutoPlaying, currentSequenceRange]);

  return (
    <div className="min-h-screen flex flex-col bg-[#050b18] text-white selection:bg-[#c5a059] selection:text-[#050b18]">
      <header className="h-14 flex items-center px-6 bg-[#0a1428]/95 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-[100] justify-between shadow-xl">
        <div className="flex items-center gap-5">
          <img src="/KLeague.png" alt="K League" className="h-8 drop-shadow-md" />
          <div className="h-4 w-[1px] bg-white/10"></div>
          <div className="flex flex-col">
            <h1 className="text-sm font-black tracking-tight uppercase italic leading-none">Match Matrix AI</h1>
            <span className="text-[8px] font-black text-[#c5a059] tracking-widest uppercase opacity-80">Shot build-up Analysis</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2.5 bg-white/5 px-3 py-1.5 rounded border border-white/5">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse shadow-[0_0_8px_red]" />
              <span className="text-[9px] font-black tracking-widest uppercase italic text-red-500">LIVE FEED</span>
           </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-10 h-[calc(100vh-3.5rem)] overflow-hidden">
        {/* Sidebar: Profile Dominant Layout */}
        <aside className="lg:col-span-3 h-full border-r border-[#c5a059]/20 flex flex-col overflow-hidden bg-[#0a1428] shadow-2xl z-20">
          {/* Recent Match Score */}
          <RecentMatchScore match={recentMatch} />
          
          <div className="h-[60%] overflow-hidden border-b border-white/5 shrink-0">
            <AnimatePresence mode="wait">
                <motion.div 
                  key={currentPlayer.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <PlayerCard player={currentPlayer} />
                </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden bg-[#050b18]">
            <div className="px-5 py-2.5 border-b border-white/5 bg-[#0a1428] flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-3.5 h-3.5 text-amber-500">
                   <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
                </div>
                <h3 className="text-[9px] font-black uppercase tracking-[0.25em] text-[#c5a059]">Shot Events</h3>
              </div>
              <span className="text-[8px] font-bold text-gray-500 tracking-widest">{shotLogs.length} LOGS</span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2.5 space-y-2 no-scrollbar">
              {shotLogs.map((action) => (
                <motion.button
                  key={action.action_id}
                  onClick={() => handleShotClick(action)}
                  whileHover={{ x: 3 }}
                  className={`w-full text-left p-2.5 rounded-lg flex items-center gap-3 border transition-all duration-300 ${activeActionIndex === MOCK_SEQUENCE.findIndex(a => a.action_id === action.action_id) || (activeSequenceActions.some(a => a.action_id === action.action_id)) ? 'bg-amber-500/15 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)] ring-1 ring-amber-500/40' : 'bg-white/2 border-white/5 hover:bg-white/5 hover:border-white/10'}`}
                >
                  <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shrink-0">
                    <span className="text-[8px] font-black italic">S</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-[12px] font-black text-white truncate uppercase">{action.player_name_ko}</p>
                      <span className="text-[8px] font-mono text-amber-500/80">
                        {Math.floor(action.time_seconds / 60)}:{(action.time_seconds % 60).toFixed(0).padStart(2,'0')}
                      </span>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </aside>

        <section className="lg:col-span-7 bg-[#050b18] flex flex-col overflow-hidden relative">
          <div className="p-6 lg:p-8 flex flex-col gap-6 overflow-y-auto h-full no-scrollbar z-10">
            <div className="absolute top-0 right-0 w-[70%] h-full bg-blue-600/5 blur-[150px] pointer-events-none -z-10" />
            <div className="w-full max-w-6xl mx-auto flex flex-col gap-6">
              <VideoPlayer matchInfo={matchInfo} />
              <PitchMap 
                players={PLAYERS} 
                selectedId={currentPlayer.id} 
                onSelectPlayer={(player) => setCurrentPlayer(player)}
                activeActionIndex={activeActionIndex}
                isAutoPlaying={isAutoPlaying}
                onJumpToStep={handleJumpToStep}
                activeSequenceActions={activeSequenceActions}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
