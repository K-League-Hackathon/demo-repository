
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '../types';
import { COLORS } from '../constants';

interface PlayerCardProps {
  player: Player;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player }) => {
  const [hoveredTrait, setHoveredTrait] = useState<number | null>(null);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#0a1428] overflow-hidden relative border-r border-[#c5a059]/10">
      {/* 1. Header Area: Minimalist */}
      <div className="px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#0c1a33] shrink-0 z-30">
        <div className="flex items-center gap-3">
          <img src={player.teamLogo} alt={player.team} className="w-5 h-5 object-contain filter drop-shadow-[0_0_5px_rgba(255,255,255,0.2)]" />
          <span className="text-[10px] font-black text-gray-300 tracking-[0.3em] uppercase">{player.team}</span>
        </div>
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-[#c5a059] rounded-full animate-pulse"></div>
           <div className="px-2 py-0.5 bg-[#c5a059] text-[#050b18] text-[9px] font-black rounded italic shadow-[0_0_15px_rgba(197,160,89,0.3)] uppercase tracking-tighter">
            Elite Squad
           </div>
        </div>
      </div>

      {/* 2. Vertically Extended Profile Area: Main Focus */}
      {/* 높이를 55% 정도로 유지하여 아래 Traits 영역 확보 */}
      <div className="relative h-[50%] overflow-hidden bg-gradient-to-b from-[#0a1428] to-[#050b18] shrink-0">
        {/* Advanced Layered Vignette Masks */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#0a1428] via-transparent to-[#0a1428]/95" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#050b18] via-transparent to-transparent opacity-100" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 z-15 bg-gradient-to-t from-[#0a1428] to-transparent" />
        
        {/* 원형 프로필 이미지 */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-5">
          {!imgError ? (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-48 h-48 rounded-full overflow-hidden border-2 border-white/10 shadow-2xl"
            >
              <img 
                src={player.photoUrl} 
                alt={player.name} 
                onError={() => setImgError(true)}
                className="w-full h-full object-cover object-center"
              />
            </motion.div>
          ) : (
            <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center border border-white/10 italic text-[14px] text-gray-700">
              PROFILE ERROR
            </div>
          )}
        </div>

        {/* Big Name & Number Overlay */}
        <div className="absolute inset-0 z-20 px-8 flex flex-col justify-end pb-10">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="flex items-center gap-5 mb-4"
          >
            <span className="text-7xl font-black text-[#c5a059] italic leading-none drop-shadow-[0_8px_20px_rgba(0,0,0,1)]">
              {player.number}
            </span>
            <div className="flex flex-col">
              <span className="text-[13px] font-black text-amber-500 tracking-[0.6em] leading-none mb-1.5 drop-shadow-md">
                {player.position}
              </span>
              <h2 className="text-5xl font-black tracking-tighter text-white uppercase leading-none drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]">
                {player.name}
              </h2>
            </div>
          </motion.div>
          <p className="text-[11px] font-bold text-gray-400 tracking-[0.7em] uppercase opacity-40 pl-1.5 border-l-2 border-[#c5a059]/30">
            {player.engName}
          </p>
        </div>
      </div>

      {/* 3. Data Area: Specialist Traits Only (Occupies the remaining 45%) */}
      <div className="flex-1 flex flex-col bg-[#0a1428] border-t border-white/5 overflow-hidden">
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <div className="w-1.5 h-4 bg-[#c5a059] rounded-full shadow-[0_0_10px_rgba(197,160,89,0.5)]"></div>
            <h3 className="text-[11px] font-black text-[#c5a059] uppercase tracking-[0.4em]">Specialist Traits</h3>
          </div>
          
          {/* Traits Grid: 3 blocks centered and visible without scrolling */}
          <div className="flex-1 flex flex-col gap-3 justify-center min-h-0">
            {player.keyTraits.slice(0, 3).map((trait, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + (index * 0.1) }}
                onMouseEnter={() => setHoveredTrait(index)}
                onMouseLeave={() => setHoveredTrait(null)}
                className={`flex flex-col p-4 rounded-xl border transition-all duration-300 relative overflow-hidden flex-1 max-h-[100px] justify-center ${
                  hoveredTrait === index ? 'border-[#c5a059]/50 bg-[#c5a059]/10' : 'bg-white/[0.03] border-white/5'
                }`}
              >
                {/* Visual Accent */}
                <div className={`absolute top-0 left-0 w-1 h-full bg-[#c5a059] transition-opacity duration-300 ${hoveredTrait === index ? 'opacity-100' : 'opacity-20'}`} />
                
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="w-2 h-2 rotate-45 bg-[#c5a059] shadow-[0_0_8px_rgba(197,160,89,0.8)] shrink-0" />
                  <span className="text-[13px] font-black text-white uppercase tracking-tight">
                    {trait.name}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 leading-snug ml-5 font-medium pr-2">
                  {trait.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer: Micro Stats Summary */}
        <div className="px-6 py-4 bg-[#081122] border-t border-white/5 flex items-center justify-between shrink-0">
            <div className="flex gap-5">
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Form</span>
                    <span className="text-[11px] font-black text-green-500">EXCELLENT</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">Grade</span>
                    <span className="text-[11px] font-black text-white">S+ ★</span>
                </div>
            </div>
            <button className="text-[10px] font-black text-[#c5a059] uppercase tracking-widest hover:brightness-125 transition-all">
                Full Profile
            </button>
        </div>
      </div>

      {/* Aesthetic Border Glow */}
      <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-[#c5a059]/50 via-transparent to-[#c5a059]/50 pointer-events-none"></div>
    </div>
  );
};

export default PlayerCard;
