
import React, { useRef } from 'react';
import { StoryData, MediaType } from '../types';

interface Props {
  stories: StoryData[];
  onStoryClick: (story: StoryData) => void;
  onAddStory: (url: string, type: MediaType) => void;
  isViewerMode?: boolean;
}

const StoriesBar: React.FC<Props> = ({ stories, onStoryClick, onAddStory, isViewerMode }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type: MediaType = file.type.startsWith('video/') ? 'video' : 'image';
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onAddStory(event.target.result as string, type);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        accept="image/*,video/*" 
        onChange={handleFileChange} 
      />
      
      {stories.map((story, i) => {
        if (i === 0 && isViewerMode) return null; // No mostrar "Tu historia" en modo espectador
        
        return (
          <div 
            key={story.id} 
            onClick={() => i === 0 ? fileInputRef.current?.click() : onStoryClick(story)}
            className="relative w-28 h-48 flex-shrink-0 rounded-xl overflow-hidden shadow-md group cursor-pointer border border-gray-200"
          >
            {story.mediaType === 'video' ? (
              <video 
                src={story.thumbnail} 
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${i === 0 ? 'opacity-90 blur-[1px]' : ''}`}
              />
            ) : (
              <img 
                src={story.thumbnail} 
                className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 ${i === 0 ? 'opacity-90 blur-[1px] group-hover:blur-0' : ''}`} 
                alt={story.user}
              />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60"></div>
            
            <div className={`absolute top-2 left-2 w-8 h-8 rounded-full border-4 ${i === 0 ? 'border-white' : 'border-[#1877f2]'} overflow-hidden bg-white z-10`}>
              <img src={story.userPic} className="w-full h-full object-cover" />
            </div>

            <span className="absolute bottom-2 left-2 right-2 text-white font-bold text-xs leading-tight z-10">
              {story.user}
            </span>

            {i === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#1877f2] flex items-center justify-center text-white border-4 border-white shadow-lg transform group-hover:scale-110 transition-transform">
                  <i className="fas fa-plus"></i>
                </div>
                <span className="mt-8 text-white text-[10px] font-bold text-shadow px-1 text-center leading-tight">Añadir historia</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default StoriesBar;
