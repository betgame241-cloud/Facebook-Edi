
import React, { useState, useRef } from 'react';
import { ProfileData, MediaType } from '../types';

interface Props {
  profile: ProfileData;
  onPost: (content: string, media?: { url: string; type: MediaType }) => void;
}

const PostCreator: React.FC<Props> = ({ profile, onPost }) => {
  const [content, setContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<{ url: string; type: MediaType } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePost = () => {
    if (content.trim() || previewMedia) {
      onPost(content, previewMedia || undefined);
      setContent('');
      setPreviewMedia(null);
      setIsExpanded(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type: MediaType = file.type.startsWith('video/') ? 'video' : 'image';
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPreviewMedia({ url: event.target.result as string, type });
          setIsExpanded(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex gap-2">
        <img src={profile.profilePic} className="w-10 h-10 rounded-full object-cover" />
        <textarea
          onClick={() => setIsExpanded(true)}
          className={`flex-1 bg-[#f0f2f5] hover:bg-[#e4e6eb] rounded-2xl py-3 px-4 resize-none outline-none transition-all ${isExpanded ? 'h-32' : 'h-11'}`}
          placeholder={`¿Qué estás pensando, ${profile.name.split(' ')[0]}?`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {previewMedia && (
        <div className="relative mt-4 border rounded-lg overflow-hidden group">
          {previewMedia.type === 'image' ? (
            <img src={previewMedia.url} className="w-full max-h-[400px] object-contain bg-black" />
          ) : (
            <video src={previewMedia.url} className="w-full max-h-[400px]" controls />
          )}
          <button 
            onClick={() => setPreviewMedia(null)}
            className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {isExpanded && (
        <div className="mt-4 flex flex-col gap-4">
          <div className="flex items-center justify-between border-t pt-4">
             <div className="flex gap-2">
               <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-gray-500"
               >
                 <i className="fas fa-images text-green-500"></i>
                 <span className="font-semibold text-sm">Foto/video</span>
               </button>
               <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                 <i className="fas fa-user-tag text-blue-500"></i>
                 <span className="font-semibold text-sm">Etiquetar</span>
               </button>
               <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                 <i className="fas fa-smile text-yellow-500"></i>
                 <span className="font-semibold text-sm">Sentimiento</span>
               </button>
             </div>
             <div className="flex gap-2">
                <button 
                  onClick={() => { setIsExpanded(false); setContent(''); setPreviewMedia(null); }}
                  className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button 
                  disabled={!content.trim() && !previewMedia}
                  onClick={handlePost}
                  className={`px-8 py-2 font-semibold rounded-lg text-white ${(!content.trim() && !previewMedia) ? 'bg-gray-300' : 'bg-[#1877f2] hover:bg-[#166fe5]'}`}
                >
                  Publicar
                </button>
             </div>
          </div>
        </div>
      )}

      {!isExpanded && (
        <div className="flex items-center border-t mt-4 pt-4">
          <button onClick={() => setIsExpanded(true)} className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <i className="fas fa-video text-red-500"></i>
            <span className="font-semibold">Video en vivo</span>
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <i className="fas fa-images text-green-500"></i>
            <span className="font-semibold">Foto/video</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
            <i className="fas fa-smile text-yellow-500"></i>
            <span className="font-semibold">Sentimiento</span>
          </button>
        </div>
      )}

      <input 
        type="file" 
        accept="image/*,video/*" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange}
      />
    </div>
  );
};

export default PostCreator;
