
import React, { useState } from 'react';
import { ProfileData } from '../types';

interface Props {
  profile: ProfileData;
  onClose: () => void;
  onSave: (data: Partial<ProfileData>) => void;
}

const EditProfileModal: React.FC<Props> = ({ profile, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<ProfileData>>({
    name: profile.name,
    followers: profile.followers,
    following: profile.following,
    bio: profile.bio,
    email: profile.email,
    category: profile.category
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-2xl border flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold">Editar perfil</h2>
          <button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 w-8 h-8 rounded-full flex items-center justify-center">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <section>
            <div className="flex justify-between items-center mb-2">
               <h3 className="font-bold text-lg">Foto de perfil</h3>
               <button className="text-[#1877f2] font-semibold hover:bg-gray-100 px-2 py-1 rounded">Editar</button>
            </div>
            <div className="flex justify-center">
              <img src={profile.profilePic} className="w-40 h-40 rounded-full object-cover border" />
            </div>
          </section>

          <section className="space-y-4">
             <h3 className="font-bold text-lg">Información general</h3>
             <div className="grid gap-4">
                <div className="space-y-1">
                   <label className="text-sm font-semibold text-gray-600">Nombre</label>
                   <input 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                   />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-600">Seguidores</label>
                    <input 
                      name="followers"
                      value={formData.followers}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-semibold text-gray-600">Seguidos</label>
                    <input 
                      name="following"
                      value={formData.following}
                      onChange={handleChange}
                      className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                   <label className="text-sm font-semibold text-gray-600">Biografía</label>
                   <textarea 
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                   />
                </div>
                <div className="space-y-1">
                   <label className="text-sm font-semibold text-gray-600">Email</label>
                   <input 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                   />
                </div>
             </div>
          </section>
        </div>

        <div className="p-4 border-t flex justify-end gap-2 bg-gray-50 rounded-b-lg">
          <button 
            onClick={onClose}
            className="px-6 py-2 font-semibold text-gray-700 hover:bg-gray-200 rounded-lg"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onSave(formData)}
            className="px-8 py-2 font-semibold text-white bg-[#1877f2] hover:bg-[#166fe5] rounded-lg"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
