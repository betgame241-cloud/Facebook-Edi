
import React, { useEffect, useState, useRef } from 'react';
import { StoryData } from '../types';

interface Props {
  story: StoryData;
  onClose: () => void;
}

const StoryViewer: React.FC<Props> = ({ story, onClose }) => {
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const duration = story.mediaType === 'video' ? 15000 : 5000; // Máximo 15s para videos o 5s para fotos

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);
      
      if (newProgress >= 100) {
        clearInterval(interval);
        onClose();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onClose, duration]);

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center animate-in fade-in duration-300">
      {/* Progress Bar Container */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-[210]">
        <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
          <div 
            className="h-full bg-white transition-all duration-75 ease-linear"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Header Info */}
      <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-[210]">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full border-2 border-[#1877f2] overflow-hidden">
            <img src={story.userPic} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="text-white font-bold text-sm">{story.user}</div>
            <div className="text-white/70 text-xs">Ahora</div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-lg h-[80vh] md:h-[90vh] relative rounded-xl overflow-hidden shadow-2xl flex items-center justify-center bg-black">
        {story.mediaType === 'video' ? (
          <video 
            ref={videoRef}
            src={story.thumbnail} 
            autoPlay 
            playsInline
            className="w-full h-full object-contain"
          />
        ) : (
          <img 
            src={story.thumbnail} 
            className="w-full h-full object-contain" 
            alt="Story content" 
          />
        )}
      </div>

      {/* Interaction Footer */}
      <div className="absolute bottom-6 left-0 right-0 px-6 flex items-center gap-4 z-[210]">
        <div className="flex-1 bg-white/10 rounded-full border border-white/20 py-2 px-4 text-white/70 text-sm">
          Responder a {story.user}...
        </div>
        <div className="flex gap-4 text-white text-xl">
          <i className="far fa-heart hover:scale-110 transition-transform cursor-pointer"></i>
          <i className="far fa-paper-plane hover:scale-110 transition-transform cursor-pointer"></i>
        </div>
      </div>

      <div 
        onClick={onClose}
        className="absolute inset-0 cursor-pointer hidden md:block"
        style={{ zIndex: -1 }}
      ></div>
    </div>
  );
};

export default StoryViewer;
