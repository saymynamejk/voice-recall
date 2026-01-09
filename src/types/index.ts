// nona Types - Voice-First Developer Workspace

export type BucketType = 'bugs' | 'features' | 'ideas' | 'daily-log';

export type NoteStatus = 'open' | 'resolved' | 'archived';

export type AudioQuality = 'standard' | 'high' | 'lossless';

export interface Project {
  id: string;
  name: string;
  description?: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  isArchived: boolean;
}

export interface VoiceNote {
  id: string;
  projectId: string;
  bucketType: BucketType;
  status: NoteStatus;
  
  // Audio data
  audioUrl: string;
  audioUrlLossless?: string; // WAV version if available
  duration: number; // in seconds
  quality: AudioQuality;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  
  // AI-generated content (optional)
  transcript?: string;
  title?: string;
  tags?: string[];
  aiGenerated?: {
    title: boolean;
    transcript: boolean;
    tags: boolean;
    bucketType: boolean;
  };
  
  // Manual overrides
  manualTitle?: string;
  manualTags?: string[];
  
  // For daily logs - which day this belongs to
  logDate?: string; // YYYY-MM-DD format
  
  userId: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  projectId: string;
  notes: VoiceNote[];
  summary?: string;
  summaryGeneratedAt?: Date;
}

export interface AISettings {
  enabled: boolean;
  provider: AIProvider;
  apiKey?: string; // Stored securely
  autoTranscribe: boolean;
  autoTitle: boolean;
  autoTags: boolean;
  autoBucketDetection: boolean;
}

export type AIProvider = 'gemini' | 'openai' | 'grok' | 'whisper-openai';

export interface UserSettings {
  aiSettings: AISettings;
  audioQuality: AudioQuality;
  theme: 'light' | 'dark' | 'system';
  defaultProject?: string;
}

// Dashboard types
export interface ProjectStats {
  projectId: string;
  projectName: string;
  projectColor: string;
  lastActivity: Date;
  openBugsCount: number;
  pendingFeaturesCount: number;
  totalNotes: number;
}

export interface ActionItem {
  id: string;
  noteId: string;
  projectId: string;
  type: 'unresolved-bug' | 'pending-feature' | 'ai-followup';
  title: string;
  createdAt: Date;
  priority: 'low' | 'medium' | 'high';
}

export interface RecentActivity {
  note: VoiceNote;
  projectName: string;
  projectColor: string;
}

// Bucket metadata
export const BUCKET_CONFIG: Record<BucketType, {
  label: string;
  icon: string;
  color: string;
  description: string;
}> = {
  bugs: {
    label: 'Bugs',
    icon: 'Bug',
    color: 'bug',
    description: 'Issues, errors, and problems to fix',
  },
  features: {
    label: 'Features',
    icon: 'Sparkles',
    color: 'feature',
    description: 'New functionality to build',
  },
  ideas: {
    label: 'Ideas',
    icon: 'Lightbulb',
    color: 'idea',
    description: 'Improvements and considerations',
  },
  'daily-log': {
    label: 'Daily Log',
    icon: 'Calendar',
    color: 'log',
    description: 'Chronological work journal',
  },
};
