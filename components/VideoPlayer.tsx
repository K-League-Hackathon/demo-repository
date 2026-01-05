
import React, { useRef, useEffect } from 'react';
import { MatchInfo } from '../types';
import { COLORS } from '../constants';

interface VideoPlayerProps {
  matchInfo: MatchInfo;
  onPlayStateChange?: (isPlaying: boolean) => void;
  onTimeUpdate?: (currentTime: number) => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ matchInfo, onPlayStateChange, onTimeUpdate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0; // 영상 처음부터 시작 (1분짜리 영상)
    }
  }, []);

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl shadow-blue-900/20 group">
      {/* Match Video */}
      <video 
        ref={videoRef}
        src="/ksoccer.mp4"
        className="w-full h-full object-cover brightness-75 group-hover:brightness-90 transition-all duration-500"
        controls
        muted
        onPlay={() => onPlayStateChange?.(true)}
        onPause={() => onPlayStateChange?.(false)}
        onTimeUpdate={(e) => onTimeUpdate?.((e.target as HTMLVideoElement).currentTime)}
      />

      {/* Overlay: Live Badge */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_10px_red]"></div>
        <span className="text-white text-xs font-black tracking-widest uppercase italic">On Air</span>
      </div>

      {/* Overlay: Stadium Info */}
      <div className="absolute bottom-6 right-6 text-right">
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Location</p>
        <p className="text-sm text-white font-black italic">{matchInfo.stadium}</p>
      </div>

      {/* Central Play Button (Mock Interaction) */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="w-20 h-20 bg-[#c5a059]/80 backdrop-blur-sm rounded-full flex items-center justify-center text-[#050b18]">
          <svg className="w-10 h-10 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
      </div>
      
      {/* Broadcast UI Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-[#c5a059]/40 m-4"></div>
        <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-[#c5a059]/40 m-4"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-[#c5a059]/40 m-4"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-[#c5a059]/40 m-4"></div>
      </div>
    </div>
  );
};

export default VideoPlayer;
