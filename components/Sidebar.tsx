
import React, { useState, useRef } from 'react';
import { ProfileData } from '../types';

interface Props {
  profile: ProfileData;
  onExport: () => void;
  onImport: (file: File) => void;
  isViewerMode?: boolean;
  onPublishCloud?: () => Promise<string>;
  publicSlug?: string;
}

const Sidebar: React.FC<Props> = ({ profile, onExport, onImport, isViewerMode, onPublishCloud, publicSlug }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCloudPublish = async () => {
    if (!onPublishCloud) return;
    setIsSyncing(true);
    try {
      const link = await onPublishCloud();
      alert(publicSlug ? "¡Cambios actualizados en tu perfil público!" : `🚀 ¡Publicado con éxito!\nTu enlace público es:\n${link}`);
    } catch (err) {
      alert("Error al conectar con Firebase. Revisa tu configuración.");
    } finally {
      setIsSyncing(false);
    }
  };

  const copyLink = () => {
    if (publicSlug) {
      const link = `${window.location.origin}${window.location.pathname}#/${publicSlug}`;
      navigator.clipboard.writeText(link);
      alert("Enlace público copiado al portapapeles.");
    }
  };

  const copyJSONToClipboard = () => {
    const savedData = localStorage.getItem('facebook_clone_db');
    if (savedData) {
      navigator.clipboard.writeText(savedData);
      alert("¡Código JSON copiado al portapapeles! Ahora puedes pegarlo donde quieras.");
    } else {
      alert("No hay datos guardados para copiar.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        <h2 className="text-xl font-bold">Detalles</h2>
        <div className="text-center text-[15px] text-gray-800">{profile.bio}</div>
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-[15px]">
            <i className="fas fa-info-circle text-gray-500 w-5 text-center"></i>
            <span>Página · <span className="font-semibold">{profile.category}</span></span>
          </div>
          <div className="flex items-center gap-2 text-[15px]">
            <i className="fas fa-envelope text-gray-500 w-5 text-center"></i>
            <span>{profile.email}</span>
          </div>
          <div className="flex items-center gap-2 text-[15px]">
            <i className="fab fa-instagram text-gray-500 w-5 text-center"></i>
            <span className="text-[#1877f2] hover:underline cursor-pointer">{profile.instagram}</span>
          </div>
        </div>
      </div>

      {!isViewerMode && (
        <div className="bg-white rounded-lg shadow p-4 space-y-3 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">
              <i className="fas fa-globe text-green-500"></i>
              Perfil Público
            </h3>
            <button 
              onClick={copyJSONToClipboard}
              className="text-[10px] bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded font-bold text-gray-600 flex items-center gap-1"
              title="Copiar código JSON directamente"
            >
              <i className="fas fa-copy"></i> Copiar JSON
            </button>
          </div>
          
          <p className="text-[11px] text-gray-500 leading-tight">
            {publicSlug 
              ? "Tu perfil ya es público. Si haces cambios aquí (local), pulsa 'Guardar' para que se vean en el enlace." 
              : "Crea un enlace público para que otros vean este perfil."}
          </p>
          
          <button 
            onClick={handleCloudPublish}
            disabled={isSyncing}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${isSyncing ? 'bg-gray-200 text-gray-400' : 'bg-green-600 text-white hover:bg-green-700 shadow-md'}`}
          >
            {isSyncing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-cloud-upload-alt"></i>}
            {isSyncing ? 'Guardando...' : (publicSlug ? 'Guardar cambios en Público' : 'Crear Perfil Público')}
          </button>

          {publicSlug && (
             <div className="space-y-2 mt-2 pt-2 border-t border-gray-100">
                <div className="p-2 bg-blue-50 border border-blue-100 rounded text-[10px] break-all font-mono text-blue-800">
                  .../#/{publicSlug}
                </div>
                <button 
                  onClick={copyLink}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-50"
                >
                  <i className="fas fa-link mr-1"></i> Copiar enlace público
                </button>
             </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-2 border-t mt-2">
            <button 
              onClick={onExport}
              className="flex items-center justify-center gap-2 bg-gray-50 text-gray-600 hover:bg-gray-100 font-bold py-2 rounded-lg text-xs border transition-colors"
            >
              <i className="fas fa-file-download"></i>
              Exportar
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 bg-gray-50 text-gray-600 hover:bg-gray-100 font-bold py-2 rounded-lg text-xs border transition-colors"
            >
              <i className="fas fa-file-upload"></i>
              Importar
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".json" 
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onImport(file);
            }} 
          />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
