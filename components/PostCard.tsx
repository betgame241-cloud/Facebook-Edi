
import React, { useState } from 'react';
import { PostData } from '../types';

interface Props {
  post: PostData;
}

const PostCard: React.FC<Props> = ({ post }) => {
  const [likes, setLikes] = useState(post.likes);
  const [hasLiked, setHasLiked] = useState(post.hasLiked);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + ' mill.';
    if (num >= 1000) return (num / 1000).toFixed(1) + ' mil';
    return num;
  };

  const toggleLike = () => {
    if (hasLiked) {
      setLikes(prev => prev - 1);
      setHasLiked(false);
    } else {
      setLikes(prev => prev + 1);
      setHasLiked(true);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow mb-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="p-4 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <img src={post.authorPic} className="w-10 h-10 rounded-full object-cover border" />
          <div>
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm hover:underline cursor-pointer">{post.author}</span>
              {post.isVerified && (
                 <span className="bg-[#1877f2] text-white text-[8px] w-3 h-3 rounded-full flex items-center justify-center">
                    <i className="fas fa-check"></i>
                 </span>
              )}
            </div>
            <div className="text-gray-500 text-xs flex items-center gap-1">
              {post.timestamp} • <i className="fas fa-globe-americas"></i>
            </div>
          </div>
        </div>
        <button className="text-gray-500 hover:bg-gray-100 w-8 h-8 rounded-full flex items-center justify-center">
          <i className="fas fa-ellipsis-h"></i>
        </button>
      </div>

      <div className="px-4 pb-3 text-[15px]">
        {post.content}
      </div>

      {post.mediaUrl && (
        <div className="bg-gray-100 overflow-hidden relative group">
          {post.mediaType === 'image' ? (
            <img src={post.mediaUrl} className="w-full object-cover max-h-[600px]" alt="Post media" />
          ) : (
            <video src={post.mediaUrl} controls className="w-full max-h-[600px] bg-black" />
          )}
          <div className="absolute top-4 right-4 bg-black/50 text-white px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
             <i className="fas fa-eye"></i> {post.views}
          </div>
        </div>
      )}

      <div className="px-4 py-2 border-b mx-4">
        <div className="flex justify-between text-gray-500 text-sm">
          <div className="flex items-center gap-1">
            <span className="flex -space-x-1">
              <span className="bg-blue-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-[10px] border border-white"><i className="fas fa-thumbs-up"></i></span>
              <span className="bg-red-500 rounded-full w-5 h-5 flex items-center justify-center text-white text-[10px] border border-white"><i className="fas fa-heart"></i></span>
            </span>
            <span className="hover:underline cursor-pointer">{formatNumber(likes)}</span>
          </div>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">{post.comments} comentarios</span>
            <span className="hover:underline cursor-pointer">{post.shares} veces compartido</span>
          </div>
        </div>
      </div>

      <div className="flex items-center px-4 py-1 mx-2">
        <button 
          onClick={toggleLike}
          className={`flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg font-semibold ${hasLiked ? 'text-[#1877f2]' : 'text-gray-500'}`}
        >
          <i className={`${hasLiked ? 'fas' : 'far'} fa-thumbs-up text-lg`}></i>
          <span>Me gusta</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-gray-500 font-semibold">
          <i className="far fa-comment text-lg"></i>
          <span>Comentar</span>
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 p-2 hover:bg-gray-100 rounded-lg text-gray-500 font-semibold">
          <i className="fas fa-share text-lg"></i>
          <span>Compartir</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;
