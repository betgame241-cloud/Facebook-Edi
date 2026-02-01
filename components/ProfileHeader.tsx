
import React, { useState, useRef, useEffect } from 'react';
import { ProfileData } from '../types';

interface Props {
  profile: ProfileData;
  onEdit: () => void;
  onUpdatePhoto: (type: 'profilePic' | 'coverPhoto', url: string) => void;
  isViewerMode?: boolean;
  publicSlug?: string;
}

const ProfileHeader: React.FC<Props> = ({ profile, onEdit, onUpdatePhoto, isViewerMode, publicSlug }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied'>('idle');
  const menuRef = useRef<HTMLDivElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShareProfile = () => {
    // Si tenemos un slug público, usamos ese enlace. Si no, usamos el actual.
    let profileUrl = window.location.href;
    if (publicSlug && !window.location.hash.includes(publicSlug)) {
        profileUrl = `${window.location.origin}${window.location.pathname}#/${publicSlug}`;
    }

    navigator.clipboard.writeText(profileUrl).then(() => {
      setCopyStatus('copied');
      alert(`¡Enlace copiado!\n${profileUrl}`);
      setTimeout(() => {
        setCopyStatus('idle');
        setIsMenuOpen(false);
      }, 2000);
    });
  };

  const handleFileChange = (type: 'profilePic' | 'coverPhoto') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdatePhoto(type, event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white shadow">
      {!isViewerMode && (
        <>
          <input type="file" className="hidden" ref={profileInputRef} accept="image/*" onChange={handleFileChange('profilePic')} />
          <input type="file" className="hidden" ref={coverInputRef} accept="image/*" onChange={handleFileChange('coverPhoto')} />
        </>
      )}

      {/* Cover Photo */}
      <div className="max-w-[1200px] mx-auto relative group">
        <div className="h-[200px] md:h-[400px] bg-gray-200 overflow-hidden rounded-b-lg">
          <img 
            src={profile.coverPhoto} 
            alt="Portada" 
            className="w-full h-full object-cover"
          />
        </div>
        {!isViewerMode && (
          <button 
            onClick={() => coverInputRef.current?.click()}
            className="absolute bottom-4 right-4 bg-white hover:bg-gray-100 text-black font-semibold py-2 px-4 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
          >
            <i className="fas fa-camera"></i>
            <span className="hidden sm:inline">Editar foto de portada</span>
          </button>
        )}
      </div>

      {/* Profile Info Area */}
      <div className="max-w-[1040px] mx-auto px-4 pb-4">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-8 md:-mt-12 relative z-10">
          {/* Avatar */}
          <div className="relative group">
            <div className="w-40 h-40 md:w-44 md:h-44 rounded-full border-4 border-white bg-white overflow-hidden shadow-lg">
              <img 
                src={profile.profilePic} 
                alt={profile.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {!isViewerMode && (
              <button 
                onClick={() => profileInputRef.current?.click()}
                className="absolute bottom-2 right-2 bg-[#e4e6eb] hover:bg-gray-300 p-2 rounded-full shadow border border-white transition-colors"
              >
                <i className="fas fa-camera text-xl"></i>
              </button>
            )}
          </div>

          {/* Name & Followers */}
          <div className="flex-1 text-center md:text-left mb-2">
            <h1 className="text-3xl font-bold flex items-center justify-center md:justify-start gap-2">
              {profile.name}
              {profile.isVerified && (
                <span className="bg-[#1877f2] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center" title="Verificado">
                  <i className="fas fa-check"></i>
                </span>
              )}
            </h1>
            <p className="text-gray-600 font-semibold hover:underline cursor-pointer">
              {profile.followers} seguidores • {profile.following} seguidos
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-2 relative">
            <button className={`bg-[#1877f2] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#166fe5] transition-colors ${isViewerMode ? 'flex-1' : ''}`}>
              <i className={isViewerMode ? "fas fa-user-plus" : "fas fa-plus"}></i>
              {isViewerMode ? 'Seguir' : 'Añadir a historia'}
            </button>
            
            {!isViewerMode && (
              <button 
                onClick={onEdit}
                className="bg-[#e4e6eb] text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-300 transition-colors"
              >
                <i className="fas fa-pen"></i>
                Editar perfil
              </button>
            )}
            
            {isViewerMode && (
               <button className="bg-[#e4e6eb] text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-300 transition-colors">
                 <i className="fab fa-facebook-messenger"></i>
                 Mensaje
               </button>
            )}

            <div ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="bg-[#e4e6eb] text-black px-3 py-2 rounded-lg font-bold hover:bg-gray-300 transition-colors"
                aria-label="Más opciones"
              >
                <i className={`fas fa-chevron-down transition-transform ${isMenuOpen ? 'rotate-180' : ''}`}></i>
              </button>

              {isMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 shadow-xl rounded-lg z-50 overflow-hidden py-1 animate-in fade-in zoom-in duration-200 origin-top-right">
                  <button 
                    onClick={handleShareProfile}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3 transition-colors"
                  >
                    <i className="fas fa-share-alt text-gray-500 w-5"></i>
                    <span className="font-semibold text-sm">Copiar enlace</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Menu */}
        <div className="border-t mt-4 flex overflow-x-auto whitespace-nowrap no-scrollbar">
          {['Publicaciones', 'Información', 'Amigos', 'Fotos', 'Videos', 'Reels', 'Más'].map((tab, i) => (
            <button 
              key={tab} 
              className={`px-4 py-4 font-semibold text-gray-600 border-b-4 transition-all hover:bg-gray-100 rounded-lg ${i === 0 ? 'border-[#1877f2] text-[#1877f2]' : 'border-transparent'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
