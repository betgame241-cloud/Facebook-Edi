
import React, { useState, useEffect } from 'react';
import { ProfileData, PostData, MediaType, StoryData, InsightsData } from './types';
import { db } from './db';
import { firestore, storage } from './firebase';
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import PostCard from './components/PostCard';
import Sidebar from './components/Sidebar';
import ProfileHeader from './components/ProfileHeader';
import PostCreator from './components/PostCreator';
import EditProfileModal from './components/EditProfileModal';
import StoriesBar from './components/StoriesBar';
import InsightsModal from './components/InsightsModal';
import StoryViewer from './components/StoryViewer';
import LoginPage from './components/LoginPage';

const INITIAL_PROFILE: ProfileData = {
  name: "Doris Jocelyn",
  isVerified: true,
  followers: "70,6 mill.",
  following: "6",
  bio: "Hola! Soy Doris Jocelyn me gusta contar historias de terror mientras me maquillo. ^_^❤️ ¡Sigueme!",
  category: "Creador de reels",
  email: "dorisjocelyn@rawtalent.co",
  instagram: "dorisjocelynn",
  instagramFollowers: "5,8 mill.",
  profilePic: "https://picsum.photos/seed/doris/400/400",
  coverPhoto: "https://picsum.photos/seed/makeup/1200/400"
};

const INITIAL_INSIGHTS: InsightsData = {
  reach: "124.5M",
  engagement: "8.2M",
  netFollowers: "+1.2M",
  countries: [
    { label: "México", value: 45890000, percentage: 65 },
    { label: "Estados Unidos", value: 10590000, percentage: 15 },
    { label: "Colombia", value: 7060000, percentage: 10 },
    { label: "Perú", value: 3530000, percentage: 5 },
    { label: "Otros", value: 3530000, percentage: 5 }
  ],
  gender: { female: 72, male: 28 },
  ageRanges: [
    { label: "18-24", value: 0, percentage: 40 },
    { label: "25-34", value: 0, percentage: 35 },
    { label: "35-44", value: 0, percentage: 15 },
    { label: "45+", value: 0, percentage: 10 }
  ],
  contentPerformance: [
    { id: 'cp1', thumbnail: 'https://picsum.photos/seed/content1/150/150', title: 'Tutorial de Catrina', views: '12.4M', date: '12 dic' },
    { id: 'cp2', thumbnail: 'https://picsum.photos/seed/content2/150/150', title: 'Storytime Terror', views: '8.1M', date: '10 dic' },
    { id: 'cp3', thumbnail: 'https://picsum.photos/seed/content3/150/150', title: 'Maquillaje Pro', views: '5.2M', date: '8 dic' },
    { id: 'cp4', thumbnail: 'https://picsum.photos/seed/content4/150/150', title: 'Trend Navidad', views: '15.7M', date: '25 dic' },
    { id: 'cp5', thumbnail: 'https://picsum.photos/seed/content5/150/150', title: 'GRWM Terror', views: '6.3M', date: '20 dic' },
  ]
};

const GLOBAL_POSTS: PostData[] = [
  {
    id: 'g1',
    author: "Jimmy Donaldson",
    authorPic: "https://picsum.photos/seed/beast/100/100",
    isVerified: true,
    timestamp: "2 h",
    content: "¡Acabo de regalar 100 casas! El video ya está disponible. 🏠🔥",
    mediaUrl: "https://picsum.photos/seed/houses/800/600",
    mediaType: 'image',
    likes: 12000000,
    comments: 55000,
    shares: 8000,
    views: "45M",
    hasLiked: false
  }
];

const INITIAL_POSTS: PostData[] = [
  {
    id: '1',
    author: "Doris Jocelyn",
    authorPic: INITIAL_PROFILE.profilePic,
    isVerified: true,
    timestamp: "1 d",
    content: "Espero que la hayas pasado lindo esta navidad te quiero ✨🎄❤️",
    mediaUrl: "https://picsum.photos/seed/xmas/800/1000",
    mediaType: 'image',
    likes: 8400000,
    comments: 430,
    shares: 1200,
    views: "15.7M",
    hasLiked: false
  }
];

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [insights, setInsights] = useState<InsightsData>(INITIAL_INSIGHTS);
  const [posts, setPosts] = useState<PostData[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<StoryData[]>([
    { id: 's1', user: "Tu historia", userPic: INITIAL_PROFILE.profilePic, thumbnail: INITIAL_PROFILE.profilePic, mediaType: 'image' }
  ]);
  const [publicSlug, setPublicSlug] = useState<string | undefined>(undefined);
  
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const [activeStory, setActiveStory] = useState<StoryData | null>(null);
  const [viewMode, setViewMode] = useState<'personal' | 'global'>('personal');
  const [isViewerMode, setIsViewerMode] = useState(false);

  useEffect(() => {
    const loadAppData = async () => {
      // 1. Detectar si estamos en una URL pública (hash presente)
      const shareId = window.location.hash.replace('#/', '');
      
      if (shareId && shareId !== 'personal' && shareId !== 'global' && shareId.length > 2) {
        // MODO PÚBLICO: Cargar desde la nube y saltar Login
        try {
          const docRef = doc(firestore, "profiles", shareId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile(data.profile);
            setPosts(data.posts);
            setStories(data.stories);
            setInsights(data.insights);
            setIsViewerMode(true); // Bloquear edición
            setLoading(false);
            setIsLoggedIn(true); // Auto-login para espectadores
            return;
          }
        } catch (err) {
          console.error("Error loading cloud profile:", err);
        }
      }

      // 2. MODO PERSONAL: Cargar desde LocalStorage
      const savedData = db.load();
      if (savedData) {
        setProfile(savedData.profile);
        setPosts(savedData.posts);
        setStories(savedData.stories);
        setInsights(savedData.insights);
        if (savedData.publicSlug) {
          setPublicSlug(savedData.publicSlug);
        }
      }
      setLoading(false);
    };

    loadAppData();
  }, []);

  // Guardar cambios locales automáticamente (solo si estamos en modo editor)
  useEffect(() => {
    if (!isViewerMode && isLoggedIn) {
      db.save({ profile, posts, stories, insights, publicSlug });
    }
  }, [profile, posts, stories, insights, publicSlug, isViewerMode, isLoggedIn]);
  
  const handleAddPost = (content: string, media?: { url: string; type: MediaType }) => {
    const newPost: PostData = {
      id: Date.now().toString(),
      author: profile.name,
      authorPic: profile.profilePic,
      isVerified: profile.isVerified,
      timestamp: "Ahora",
      content,
      mediaUrl: media?.url,
      mediaType: media?.type,
      likes: 0,
      comments: 0,
      shares: 0,
      views: "0",
      hasLiked: false
    };
    setPosts([newPost, ...posts]);
  };

  const handleUpdateProfile = (updated: Partial<ProfileData>) => {
    setProfile(prev => ({ ...prev, ...updated }));
    setIsEditModalOpen(false);
  };

  const handleUpdatePhoto = async (type: 'profilePic' | 'coverPhoto', base64: string) => {
    setProfile(prev => ({ ...prev, [type]: base64 }));
    try {
      const storageRef = ref(storage, `uploads/${Date.now()}_${type}`);
      await uploadString(storageRef, base64, 'data_url');
      const downloadURL = await getDownloadURL(storageRef);
      setProfile(prev => ({ ...prev, [type]: downloadURL }));
      if (type === 'profilePic') {
        setStories(prev => prev.map(s => s.id === 's1' ? { ...s, userPic: downloadURL, thumbnail: downloadURL } : s));
      }
    } catch (err) {
      console.error("Upload error:", err);
    }
  };

  const handleAddStory = (url: string, type: MediaType) => {
    const newStory: StoryData = {
      id: Date.now().toString(),
      user: profile.name,
      userPic: profile.profilePic,
      thumbnail: url,
      mediaType: type
    };
    setStories([stories[0], newStory, ...stories.slice(1)]);
  };

  const handlePublishCloud = async () => {
    const slug = publicSlug || (profile.name.toLowerCase().replace(/\s+/g, '-') + "-" + Math.floor(Math.random() * 1000));
    try {
      await setDoc(doc(firestore, "profiles", slug), {
        profile,
        posts,
        stories,
        insights,
        updatedAt: new Date().toISOString()
      });
      setPublicSlug(slug);
      return `${window.location.origin}${window.location.pathname}#/${slug}`;
    } catch (err) {
      console.error("Publish error:", err);
      throw err;
    }
  };

  const handleExportJSON = () => {
    const data = { profile, posts, stories, insights, publicSlug };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `perfil-${profile.name.replace(/\s/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.profile) setProfile(data.profile);
        if (data.posts) setPosts(data.posts);
        if (data.stories) setStories(data.stories);
        if (data.insights) setInsights(data.insights);
        if (data.publicSlug) setPublicSlug(data.publicSlug);
        alert("¡Perfil cargado con éxito!");
      } catch (err) {
        alert("El archivo no es un JSON válido.");
      }
    };
    reader.readAsText(file);
  };

  if (!isLoggedIn && !loading) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  if (loading) return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
      <div className="bg-[#1877f2] w-16 h-16 rounded-full flex items-center justify-center animate-pulse mb-4">
        <i className="fab fa-facebook-f text-white text-4xl"></i>
      </div>
    </div>
  );

  const displayedPosts = viewMode === 'personal' ? posts : [...posts, ...GLOBAL_POSTS].sort((a,b) => b.id.localeCompare(a.id));

  return (
    <div className={`min-h-screen bg-[#f0f2f5] pb-10 ${isViewerMode ? 'viewer-active' : ''}`}>
      <nav className="sticky top-0 z-50 bg-white shadow-sm h-14 flex items-center px-2 md:px-4 justify-between">
        <div className="flex items-center gap-2">
          <div onClick={() => window.location.hash = ""} className="bg-[#1877f2] w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 cursor-pointer">
            <i className="fab fa-facebook-f text-white text-xl md:text-2xl"></i>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 flex-1 justify-center max-w-xl">
          <div className="flex gap-1 md:gap-8 text-xl md:text-2xl text-gray-500 w-full justify-around md:justify-center">
            <button onClick={() => setViewMode('personal')} className={`px-4 py-2 border-b-2 ${viewMode === 'personal' ? 'border-[#1877f2] text-[#1877f2]' : 'border-transparent'}`}><i className="fas fa-home"></i></button>
            <button onClick={() => setViewMode('global')} className={`px-4 py-2 border-b-2 ${viewMode === 'global' ? 'border-[#1877f2] text-[#1877f2]' : 'border-transparent'}`}><i className="fas fa-globe-americas"></i></button>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 shrink-0">
          {!isViewerMode && (
             <div onClick={() => setIsInsightsOpen(true)} className="bg-[#e7f3ff] w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center hover:bg-blue-100 cursor-pointer text-[#1877f2] transition-colors"><i className="fas fa-chart-line"></i></div>
          )}
          {!window.location.hash.includes(publicSlug || '####') && (
            <button 
                onClick={() => setIsViewerMode(!isViewerMode)} 
                className={`w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors ${isViewerMode ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                title="Vista previa local"
            >
                <i className={`fas ${isViewerMode ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          )}
          <img src={profile.profilePic} className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border border-gray-300 ml-1" />
        </div>
      </nav>

      <ProfileHeader 
        profile={profile} 
        onEdit={() => setIsEditModalOpen(true)} 
        onUpdatePhoto={handleUpdatePhoto} 
        isViewerMode={isViewerMode}
        publicSlug={publicSlug}
      />

      <div className="max-w-[1040px] mx-auto px-0 md:px-4 mt-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="md:col-span-2 space-y-4 px-2 md:px-0 order-1">
          <Sidebar 
            profile={profile} 
            onExport={handleExportJSON} 
            onImport={handleImportJSON} 
            isViewerMode={isViewerMode} 
            onPublishCloud={handlePublishCloud}
            publicSlug={publicSlug}
          />
          <div className="bg-white rounded-lg shadow-sm p-4">
             <h2 className="text-xl font-bold mb-4">Fotos</h2>
             <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden">
               {[1,2,3,4,5,6,7,8,9].map(i => <img key={i} src={`https://picsum.photos/seed/p${i}/300/300`} className="aspect-square object-cover" />)}
             </div>
          </div>
        </div>

        <div className="md:col-span-3 space-y-4 order-2">
          {viewMode === 'personal' && (
            <>
              <StoriesBar stories={stories} onStoryClick={setActiveStory} onAddStory={handleAddStory} isViewerMode={isViewerMode} />
              {!isViewerMode && <PostCreator profile={profile} onPost={handleAddPost} />}
            </>
          )}
          <div className="space-y-4">
            {displayedPosts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        </div>
      </div>

      {isEditModalOpen && <EditProfileModal profile={profile} onClose={() => setIsEditModalOpen(false)} onSave={handleUpdateProfile} />}
      {isInsightsOpen && <InsightsModal insights={insights} onClose={() => setIsInsightsOpen(false)} onSave={setInsights} />}
      {activeStory && <StoryViewer story={activeStory} onClose={() => setActiveStory(null)} />}
    </div>
  );
};

export default App;
