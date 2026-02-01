
import { ProfileData, PostData, StoryData, InsightsData } from './types';

const STORAGE_KEY = 'facebook_clone_db';

interface AppState {
  profile: ProfileData;
  posts: PostData[];
  stories: StoryData[];
  insights: InsightsData;
  publicSlug?: string; // Nuevo campo para recordar el ID público
}

export const db = {
  save: (state: AppState) => {
    try {
      const serializedState = JSON.stringify(state);
      localStorage.setItem(STORAGE_KEY, serializedState);
    } catch (err) {
      console.error("Error al guardar en la base de datos:", err);
    }
  },

  load: (): AppState | null => {
    try {
      const serializedState = localStorage.getItem(STORAGE_KEY);
      if (serializedState === null) return null;
      return JSON.parse(serializedState);
    } catch (err) {
      console.error("Error al cargar la base de datos:", err);
      return null;
    }
  },

  clear: () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  }
};
