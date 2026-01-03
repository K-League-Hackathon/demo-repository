
import React from 'react';
import { motion } from 'framer-motion';
import { SequenceAction } from '../types';

interface ActionStackProps {
  actions: SequenceAction[];
  activeIndex: number;
  onActionClick: (index: number) => void;
}

const ActionStack: React.FC<ActionStackProps> = ({ actions, activeIndex, onActionClick }) => {
  if (actions.length === 0) {
    return (
      <div className="h-full flex flex-col justify-center items-center text-center px-4 bg-white/[0.02] border border-white/10 border-dashed rounded-xl">
        <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest leading-relaxed italic">Select Shot for Replay</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-1.5 overflow-hidden">
      {actions.map((action, idx) => {
        // App에서 넘겨주는 activeIndex는 전체 MOCK_SEQUENCE의 인덱스임
        const globalSequence = (window as any).MOCK_SEQUENCE_DATA || [];
        const isSelected = activeIndex >= 0 && action.action_id === globalSequence[activeIndex]?.action_id;
        
        return (
          <motion.button
            key={action.action_id}
            onClick={() => {
                const globalIdx = globalSequence.findIndex((a: any) => a.action_id === action.action_id);
                if (globalIdx !== -1) onActionClick(globalIdx);
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              scale: isSelected ? 1.02 : 1,
            }}
            whileHover={{ x: 2, backgroundColor: "rgba(255,255,255,0.08)" }}
            className={`relative flex-1 min-h-0 rounded-lg border flex items-center px-3 transition-all duration-300 text-left ${
              isSelected 
                ? 'bg-gradient-to-r from-amber-500/20 to-[#12203a] border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)] z-10' 
                : 'bg-white/[0.03] border-white/5 opacity-50'
            }`}
          >
            {/* Glow for Active */}
            {isSelected && (
              <motion.div 
                animate={{ opacity: [0.2, 0.4, 0.2] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 bg-amber-500/10 rounded-lg pointer-events-none"
              />
            )}

            {/* Icon */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-3 transition-all ${
              isSelected ? 'bg-amber-500 text-black shadow-[0_0_10px_#f59e0b]' : 'bg-white/5 text-gray-500 border border-white/10'
            }`}>
              {action.type_name === 'Shot' ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
              ) : action.type_name === 'Pass' ? (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M13 5l7 7-7 7M5 5l7 7-7 7"/></svg>
              ) : (
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M9 5l7 7-7 7"/></svg>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <span className={`text-[11px] font-black truncate ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                  {action.player_name_ko}
                </span>
                <span className={`text-[8px] font-mono ${isSelected ? 'text-amber-500' : 'text-gray-600'}`}>
                   {Math.floor(action.time_seconds / 60)}:{(action.time_seconds % 60).toFixed(0).padStart(2,'0')}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-[7px] font-black uppercase tracking-widest ${isSelected ? 'text-amber-400' : 'text-gray-600'}`}>
                  {action.result_name === 'Goal' ? '★ GOAL' : action.type_name}
                </span>
                {action.receiver_name_ko && (
                  <span className="text-[7px] text-blue-400/50 font-black truncate">→ {action.receiver_name_ko}</span>
                )}
              </div>
            </div>

            {/* Active Indicator Bar */}
            {isSelected && (
              <motion.div 
                layoutId="activeBar"
                className="absolute left-0 top-2 bottom-2 w-0.5 bg-amber-500 rounded-r-full"
              />
            )}
          </motion.button>
        // Fix: Properly close the return statement and the map function body
        );
      })}
    </div>
  );
};

export default ActionStack;
