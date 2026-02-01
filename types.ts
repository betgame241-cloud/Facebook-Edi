
export interface ProfileData {
  name: string;
  isVerified: boolean;
  followers: string;
  following: string;
  bio: string;
  category: string;
  email: string;
  instagram: string;
  instagramFollowers: string;
  profilePic: string;
  coverPhoto: string;
}

export interface MetricData {
  label: string;
  value: number;
  percentage: number;
}

export interface ContentMetric {
  id: string;
  thumbnail: string;
  title: string;
  views: string;
  date: string;
}

export interface InsightsData {
  reach: string;
  engagement: string;
  netFollowers: string;
  countries: MetricData[];
  gender: { female: number; male: number };
  ageRanges: MetricData[];
  contentPerformance: ContentMetric[];
}

export type MediaType = 'image' | 'video';

export interface PostData {
  id: string;
  author: string;
  authorPic: string;
  isVerified: boolean;
  timestamp: string;
  content: string;
  mediaUrl?: string;
  mediaType?: MediaType;
  likes: number;
  comments: number;
  shares: number;
  views: string;
  hasLiked: boolean;
}

export interface StoryData {
  id: string;
  user: string;
  userPic: string;
  thumbnail: string;
  mediaType?: MediaType;
}
