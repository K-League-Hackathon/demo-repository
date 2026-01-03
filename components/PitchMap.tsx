
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { Player, SequenceAction } from '../types';
import { MOCK_SEQUENCE, PLAYERS, COLORS } from '../constants';
import ActionStack from './ActionStack';

interface PitchMapProps {
  players: Player[];
  selectedId: string;
  onSelectPlayer: (player: Player) => void;
  activeActionIndex: number;
  isAutoPlaying: boolean;
  onJumpToStep: (index: number) => void;
  activeSequenceActions?: SequenceAction[];
}

const FIELD_X = 105;
const FIELD_Y = 68;

const getPosX = (x: number) => (x / FIELD_X) * 100;
const getPosY = (y: number) => (y / FIELD_Y) * 100;

// 골대 위치 계산 (중앙 기준 약 7.32m 폭)
const GOAL_Y_START = 44.6;
const GOAL_Y_END = 55.4;

const PitchMap: React.FC<PitchMapProps> = ({ 
  players, 
  selectedId, 
  onSelectPlayer, 
  activeActionIndex, 
  isAutoPlaying, 
  onJumpToStep,
  activeSequenceActions = []
}) => {
  const [viewMode, setViewMode] = useState<'IDLE' | 'ACTION'>('IDLE');
  const [currentAction, setCurrentAction] = useState<SequenceAction | null>(null);
  const [trails, setTrails] = useState<SequenceAction[]>([]);
  
  const ballControls = useAnimation();
  const resetTimerRef = useRef<number | null>(null);

  const clearResetTimer = () => {
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  };

  const playSequenceStep = useCallback(async (action: SequenceAction, isConnected: boolean) => {
    clearResetTimer();
    setViewMode('ACTION');
    setCurrentAction(action);
    
    setTrails(prev => {
        const actionIdx = MOCK_SEQUENCE.findIndex(a => a.action_id === action.action_id);
        const startOfSeq = Math.max(0, actionIdx - 4);
        const currentSeq = MOCK_SEQUENCE.slice(startOfSeq, actionIdx + 1);
        return currentSeq;
    });
    
    const isShot = action.type_name === "Shot";
    const hasEnd = action.end_x !== undefined && action.end_y !== undefined;

    const moveDuration = isShot ? 0.5 : 0.8;
    const moveEase: any = isShot ? [0.16, 1, 0.3, 1] : [0.45, 0, 0.55, 1];

    if (!isConnected) {
      ballControls.set({
        left: `${getPosX(action.start_x)}%`,
        top: `${getPosY(action.start_y)}%`,
        opacity: 0,
        scale: 0.5
      });
      await ballControls.start({ opacity: 1, scale: 1, transition: { duration: 0.2 } });
    }

    if (hasEnd) {
      await new Promise(r => setTimeout(r, 100));
      await ballControls.start({
        left: `${getPosX(action.end_x!)}%`,
        top: `${getPosY(action.end_y!)}%`,
        transition: { duration: moveDuration, ease: moveEase }
      });
    }

    if (!isAutoPlaying) {
      resetTimerRef.current = window.setTimeout(() => {
        setViewMode('IDLE');
        setCurrentAction(null);
        setTrails([]);
      }, 5000);
    }
  }, [ballControls, isAutoPlaying]);

  useEffect(() => {
    if (activeActionIndex >= 0 && MOCK_SEQUENCE[activeActionIndex]) {
      const action = MOCK_SEQUENCE[activeActionIndex];
      const prevAction = MOCK_SEQUENCE[activeActionIndex - 1];
      const isConnected = prevAction && 
                          Math.abs(prevAction.end_x! - action.start_x) < 0.5 && 
                          Math.abs(prevAction.end_y! - action.start_y) < 0.5;

      playSequenceStep(action, isConnected);
    } else if (activeActionIndex === -1) {
      setViewMode('IDLE');
      setCurrentAction(null);
      setTrails([]);
    }
  }, [activeActionIndex, playSequenceStep]);

  // 어느 쪽 골대에 골이 들어갔는지 확인
  const isLeftGoal = currentAction?.result_name === "Goal" && currentAction.end_x! < 50;
  const isRightGoal = currentAction?.result_name === "Goal" && currentAction.end_x! >= 50;

  return (
    <div className="w-full bg-[#030712] p-6 rounded-3xl border border-white/5 flex flex-col gap-4 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="goalGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feFlood floodColor={COLORS.GOLD} result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      <AnimatePresence>
        {currentAction?.result_name === "Goal" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 pointer-events-none rounded-2xl overflow-hidden"
          >
            <div className="absolute inset-0 bg-amber-500/10 mix-blend-color-dodge" />
            <motion.div 
              animate={{ opacity: [0, 0.4, 0], scale: [0.9, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 bg-radial-gradient from-white/20 via-transparent to-transparent"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className={`w-1 h-6 rounded-full ${isAutoPlaying ? 'bg-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.8)]' : 'bg-gray-600'}`} />
          <h3 className={`text-[12px] font-black uppercase tracking-[0.4em] ${isAutoPlaying ? 'text-amber-400' : 'text-gray-400'}`}>
            {isAutoPlaying ? (currentAction?.result_name === 'Goal' ? '★ GOAL CONFIRMED: ANALYTICS' : 'TACTICAL SEQUENCE REPLAY') : 'SQUAD TACTICAL FORMATION'}
          </h3>
        </div>
      </div>
      
      <div className="flex gap-6 items-stretch min-h-[380px] z-10">
        <div className="w-[220px] shrink-0">
          <ActionStack 
            actions={activeSequenceActions} 
            activeIndex={activeActionIndex}
            onActionClick={onJumpToStep}
          />
        </div>

        <div className="relative flex-1 aspect-[105/68] bg-[#0a101f] border border-white/10 rounded-2xl overflow-hidden shadow-inner group">
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:20px_20px]" />
          
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
              <rect width="100" height="100" fill="none" stroke="#94a3b8" strokeWidth="0.3" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="#94a3b8" strokeWidth="0.3" />
              <circle cx="50" cy="50" r="9" fill="none" stroke="#94a3b8" strokeWidth="0.3" />
              <rect x="0" y="21" width="16.5" height="58" fill="none" stroke="#94a3b8" strokeWidth="0.3" />
              <rect x="83.5" y="21" width="16.5" height="58" fill="none" stroke="#94a3b8" strokeWidth="0.3" />
              
              {/* 기본 골대 가이드 라인 (Penalty Box 내부) */}
              <line x1="0" y1={GOAL_Y_START} x2="0" y2={GOAL_Y_END} stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.5" />
              <line x1="100" y1={GOAL_Y_START} x2="100" y2={GOAL_Y_END} stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.5" />
            </svg>
          </div>

          {/* 실시간 하이라이트 골대 레이어 */}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-20 pointer-events-none">
            {/* Left Goalpost */}
            <motion.path
              d={`M 0 ${GOAL_Y_START} L 0 ${GOAL_Y_END}`}
              stroke={isLeftGoal ? COLORS.GOLD : "#60a5fa"}
              strokeWidth={isLeftGoal ? 2 : 1.5}
              animate={isLeftGoal ? { strokeOpacity: [0.6, 1, 0.6], filter: 'url(#goalGlow)' } : { strokeOpacity: 0.8 }}
              fill="none"
            />
            {/* Right Goalpost */}
            <motion.path
              d={`M 100 ${GOAL_Y_START} L 100 ${GOAL_Y_END}`}
              stroke={isRightGoal ? COLORS.GOLD : "#60a5fa"}
              strokeWidth={isRightGoal ? 2 : 1.5}
              animate={isRightGoal ? { strokeOpacity: [0.6, 1, 0.6], filter: 'url(#goalGlow)' } : { strokeOpacity: 0.8 }}
              fill="none"
            />
            
            {/* 골 발생 시 충격파(Ripple) 효과 */}
            <AnimatePresence>
              {isLeftGoal && (
                <motion.circle
                  cx="0" cy="50"
                  initial={{ r: 0, opacity: 0.8 }}
                  animate={{ r: 20, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  fill="none"
                  stroke={COLORS.GOLD}
                  strokeWidth="0.5"
                />
              )}
              {isRightGoal && (
                <motion.circle
                  cx="100" cy="50"
                  initial={{ r: 0, opacity: 0.8 }}
                  animate={{ r: 20, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  fill="none"
                  stroke={COLORS.GOLD}
                  strokeWidth="0.5"
                />
              )}
            </AnimatePresence>
          </svg>

          <AnimatePresence>
            {viewMode === 'IDLE' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-20">
                {PLAYERS.map(p => (
                  <button 
                    key={p.id} 
                    onClick={() => onSelectPlayer(p)}
                    style={{ left: `${getPosX(p.x)}%`, top: `${getPosY(p.y)}%` }} 
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full border flex items-center justify-center font-black text-[9px] shadow-lg transition-all hover:scale-125 active:scale-90 ${selectedId === p.id ? 'bg-amber-500 border-white text-black z-30 ring-4 ring-amber-500/20' : 'bg-[#0f172a] border-white/20 text-white hover:border-white/50'}`}
                  >
                    {p.number}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full z-10 pointer-events-none">
            <AnimatePresence>
              {trails.map((t, i) => {
                const isTShot = t.type_name === 'Shot';
                const isTGoal = t.result_name === 'Goal';
                const isCurrent = t.action_id === currentAction?.action_id;
                
                const color = isTGoal ? '#f59e0b' : (isTShot ? '#fbbf24' : '#22d3ee');
                const strokeWidth = isCurrent ? 1.5 : 0.8;
                
                return (
                  <g key={`trail-group-${t.action_id}`}>
                    <motion.path
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: isCurrent ? 0.4 : 0.1 }}
                      transition={{ duration: isTShot ? 0.5 : 0.8, ease: "easeInOut" }}
                      d={`M ${getPosX(t.start_x)} ${getPosY(t.start_y)} L ${getPosX(t.end_x!)} ${getPosY(t.end_y!)}`}
                      fill="none"
                      stroke={color}
                      strokeWidth={strokeWidth * 4}
                      style={{ filter: 'blur(4px)' }}
                    />
                    <motion.path
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: isTShot ? 0.5 : 0.8, ease: "easeInOut" }}
                      d={`M ${getPosX(t.start_x)} ${getPosY(t.start_y)} L ${getPosX(t.end_x!)} ${getPosY(t.end_y!)}`}
                      fill="none"
                      stroke={color}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      style={{ filter: 'url(#neonGlow)' }}
                    />
                  </g>
                );
              })}
            </AnimatePresence>
          </svg>

          <AnimatePresence>
            {viewMode === 'ACTION' && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={ballControls}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute z-40"
                style={{ transform: 'translate(-50%, -50%)' }}
              >
                <div className="absolute inset-0 -z-10 blur-md opacity-50 scale-150">
                  <div className={`w-full h-full rounded-full animate-pulse ${currentAction?.type_name === 'Shot' ? 'bg-amber-400' : 'bg-cyan-400'}`} />
                </div>
                
                <div className={`w-4 h-4 rounded-full border-2 border-white/80 shadow-[0_0_20px_white] flex items-center justify-center transition-colors duration-300 ${currentAction?.result_name === 'Goal' ? 'bg-amber-400 scale-150 shadow-amber-500' : (currentAction?.type_name === 'Shot' ? 'bg-amber-300 scale-125' : 'bg-cyan-300')}`}>
                   <div className="w-1.5 h-1.5 bg-white rounded-full opacity-80" />
                </div>

                {currentAction?.result_name === 'Goal' && (
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 1 }}
                    animate={{ scale: 3, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 bg-amber-400 rounded-full"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {currentAction?.result_name === 'Goal' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-black px-8 py-2 rounded-full font-black text-xs tracking-widest shadow-[0_0_40px_rgba(245,158,11,0.6)] uppercase italic"
              >
                Target Reached: Goal
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default PitchMap;
