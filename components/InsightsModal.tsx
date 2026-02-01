
import React, { useState, useRef } from 'react';
import { InsightsData, MetricData, ContentMetric } from '../types';

interface Props {
  insights: InsightsData;
  onClose: () => void;
  onSave: (data: InsightsData) => void;
}

const InsightsModal: React.FC<Props> = ({ insights, onClose, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [viewAllContent, setViewAllContent] = useState(false);
  const [tempInsights, setTempInsights] = useState<InsightsData>(insights);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeContentIndex, setActiveContentIndex] = useState<number | null>(null);

  const handleMetricChange = (field: 'countries' | 'ageRanges', index: number, value: string) => {
    const val = parseInt(value) || 0;
    const newList = [...tempInsights[field]];
    newList[index] = { ...newList[index], percentage: Math.min(100, Math.max(0, val)) };
    setTempInsights({ ...tempInsights, [field]: newList });
  };

  const handleContentMetricChange = (index: number, value: string) => {
    const newList = [...tempInsights.contentPerformance];
    newList[index] = { ...newList[index], views: value };
    setTempInsights({ ...tempInsights, contentPerformance: newList });
  };

  const handleThumbnailClick = (index: number) => {
    if (!isEditing) return;
    setActiveContentIndex(index);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeContentIndex !== null) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newList = [...tempInsights.contentPerformance];
          newList[activeContentIndex] = { 
            ...newList[activeContentIndex], 
            thumbnail: event.target.result as string 
          };
          setTempInsights({ ...tempInsights, contentPerformance: newList });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenderChange = (gender: 'female' | 'male', value: string) => {
    const val = parseInt(value) || 0;
    setTempInsights({
      ...tempInsights,
      gender: { ...tempInsights.gender, [gender]: Math.min(100, Math.max(0, val)) }
    });
  };

  const handleMainMetricChange = (field: 'reach' | 'engagement' | 'netFollowers', value: string) => {
    setTempInsights({ ...tempInsights, [field]: value });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-4xl h-full md:h-auto md:max-h-[95vh] rounded-none md:rounded-xl shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
        
        <input 
          type="file" 
          className="hidden" 
          ref={fileInputRef} 
          accept="image/*" 
          onChange={handleFileChange} 
        />

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <i className="fas fa-chart-line text-[#1877f2] text-xl"></i>
            <h2 className="text-lg md:text-xl font-bold">Panel para profesionales</h2>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-blue-50 text-[#1877f2] hover:bg-blue-100 px-3 md:px-4 py-2 rounded-lg font-bold text-sm transition-colors"
              >
                <i className="fas fa-edit md:mr-2"></i><span className="hidden md:inline">Editar métricas y fotos</span>
              </button>
            ) : (
              <button 
                onClick={() => {
                  onSave(tempInsights);
                  setIsEditing(false);
                }}
                className="bg-green-600 text-white hover:bg-green-700 px-3 md:px-4 py-2 rounded-lg font-bold text-sm transition-colors"
              >
                <i className="fas fa-check md:mr-2"></i><span className="hidden md:inline">Guardar</span>
              </button>
            )}
            <button onClick={onClose} className="bg-gray-100 hover:bg-gray-200 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-gray-600">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 overflow-y-auto space-y-6 md:space-y-8 bg-[#f0f2f5] flex-1">
          {/* Main Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {[
              { label: "Alcance", value: tempInsights.reach, field: 'reach', icon: 'fa-bullhorn' },
              { label: "Interacción", value: tempInsights.engagement, field: 'engagement', icon: 'fa-hand-pointer' },
              { label: "Seguidores netos", value: tempInsights.netFollowers, field: 'netFollowers', icon: 'fa-user-plus' }
            ].map(m => (
              <div key={m.label} className="bg-white p-4 md:p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-500 font-semibold uppercase text-[10px] md:text-xs tracking-wider">{m.label}</span>
                  <i className={`fas ${m.icon} text-[#1877f2]`}></i>
                </div>
                {isEditing ? (
                  <input 
                    className="text-xl md:text-2xl font-bold w-full border-b-2 border-blue-200 outline-none"
                    value={m.value}
                    onChange={(e) => handleMainMetricChange(m.field as any, e.target.value)}
                  />
                ) : (
                  <div className="text-xl md:text-2xl font-bold text-gray-800">{m.value}</div>
                )}
                <div className="text-green-500 text-xs md:text-sm font-semibold flex items-center gap-1 mt-1">
                  <i className="fas fa-caret-up"></i> 12.4% vs. últimos 28 días
                </div>
              </div>
            ))}
          </div>

          {/* Visualizaciones de Contenido Reciente */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="font-bold text-base md:text-lg flex items-center gap-2">
                <i className="fas fa-play-circle text-red-500"></i>
                Tu contenido reciente
              </h3>
              <button 
                onClick={() => setViewAllContent(!viewAllContent)}
                className="text-[#1877f2] font-semibold text-sm hover:underline"
              >
                {viewAllContent ? 'Ver menos' : 'Ver todo'}
              </button>
            </div>
            <div className="p-4">
              <div className={viewAllContent ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4" : "flex gap-3 md:gap-4 overflow-x-auto no-scrollbar pb-2"}>
                {tempInsights.contentPerformance.map((content, i) => (
                  <div key={content.id} className={`${viewAllContent ? 'w-full' : 'w-28 md:w-32 flex-shrink-0'} flex flex-col items-center`}>
                    <div 
                      onClick={() => handleThumbnailClick(i)}
                      className={`w-full aspect-square rounded-lg overflow-hidden relative group bg-gray-100 shadow-sm ${isEditing ? 'cursor-pointer hover:ring-4 ring-blue-300 ring-inset' : ''}`}
                    >
                      <img src={content.thumbnail} className="w-full h-full object-cover" />
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <i className="fas fa-camera text-white text-xl"></i>
                        </div>
                      )}
                      <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] md:text-[10px] px-1.5 py-0.5 rounded font-bold">
                        {content.date}
                      </div>
                    </div>
                    <div className="mt-2 text-center w-full">
                       {isEditing ? (
                         <div className="flex items-center justify-center gap-1 border-b border-blue-200">
                            <input 
                              className="text-xs md:text-sm font-bold w-16 text-center outline-none bg-blue-50"
                              value={content.views}
                              onChange={(e) => handleContentMetricChange(i, e.target.value)}
                            />
                         </div>
                       ) : (
                         <div className="text-xs md:text-sm font-bold text-gray-800 flex items-center justify-center gap-1">
                           <i className="fas fa-eye text-[9px] text-gray-400"></i>
                           {content.views}
                         </div>
                       )}
                       <div className="text-[9px] md:text-[10px] text-gray-500 truncate px-1">{content.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Países Principales */}
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-base md:text-lg font-bold mb-5 flex items-center gap-2">
                <i className="fas fa-globe-americas text-[#1877f2]"></i>
                Países principales
              </h3>
              <div className="space-y-4">
                {tempInsights.countries.map((c, i) => (
                  <div key={c.label} className="space-y-1">
                    <div className="flex justify-between text-xs md:text-sm font-semibold text-gray-700">
                      <span>{c.label}</span>
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input 
                            type="number"
                            className="w-10 border-b border-gray-300 text-right outline-none bg-blue-50/50"
                            value={c.percentage}
                            onChange={(e) => handleMetricChange('countries', i, e.target.value)}
                          />%
                        </div>
                      ) : (
                        <span className="text-[#1877f2]">{c.percentage}%</span>
                      )}
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#1877f2] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${c.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rangos de Edad */}
            <div className="bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-base md:text-lg font-bold mb-5 flex items-center gap-2">
                <i className="fas fa-users text-[#1877f2]"></i>
                Rangos de edad
              </h3>
              <div className="space-y-4">
                {tempInsights.ageRanges.map((age, i) => (
                  <div key={age.label} className="space-y-1">
                    <div className="flex justify-between text-xs md:text-sm font-semibold text-gray-700">
                      <span>{age.label}</span>
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input 
                            type="number"
                            className="w-10 border-b border-gray-300 text-right outline-none bg-blue-50/50"
                            value={age.percentage}
                            onChange={(e) => handleMetricChange('ageRanges', i, e.target.value)}
                          />%
                        </div>
                      ) : (
                        <span className="text-[#1877f2]">{age.percentage}%</span>
                      )}
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#1877f2] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${age.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribución por Género */}
            <div className="lg:col-span-2 bg-white p-5 md:p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-base md:text-lg font-bold mb-5 flex items-center gap-2">
                <i className="fas fa-venus-mars text-[#1877f2]"></i>
                Distribución por Género
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Mujeres', percentage: tempInsights.gender.female, field: 'female' },
                  { label: 'Hombres', percentage: tempInsights.gender.male, field: 'male' }
                ].map((g, i) => (
                  <div key={g.label} className="space-y-1">
                    <div className="flex justify-between text-xs md:text-sm font-semibold text-gray-700">
                      <span>{g.label}</span>
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <input 
                            type="number"
                            className="w-10 border-b border-gray-300 text-right outline-none bg-blue-50/50"
                            value={g.percentage}
                            onChange={(e) => handleGenderChange(g.field as 'female' | 'male', e.target.value)}
                          />%
                        </div>
                      ) : (
                        <span className="text-[#1877f2]">{g.percentage}%</span>
                      )}
                    </div>
                    <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#1877f2] rounded-full transition-all duration-1000 ease-out"
                        style={{ width: `${g.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsModal;
