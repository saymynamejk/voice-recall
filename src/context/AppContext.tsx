import { createContext, useContext, useState, ReactNode } from 'react';
import { Project, VoiceNote, UserSettings, BucketType } from '@/types';

interface AppState {
  projects: Project[];
  currentProject: Project | null;
  currentBucket: BucketType | null;
  voiceNotes: VoiceNote[];
  settings: UserSettings;
  isRecording: boolean;
}

interface AppContextType extends AppState {
  setCurrentProject: (project: Project | null) => void;
  setCurrentBucket: (bucket: BucketType | null) => void;
  setProjects: (projects: Project[]) => void;
  setVoiceNotes: (notes: VoiceNote[]) => void;
  setSettings: (settings: UserSettings) => void;
  setIsRecording: (recording: boolean) => void;
}

const defaultSettings: UserSettings = {
  aiSettings: {
    enabled: false,
    provider: 'gemini',
    autoTranscribe: true,
    autoTitle: true,
    autoTags: false,
    autoBucketDetection: false,
  },
  audioQuality: 'high',
  theme: 'dark',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    projects: [],
    currentProject: null,
    currentBucket: null,
    voiceNotes: [],
    settings: defaultSettings,
    isRecording: false,
  });

  const setCurrentProject = (project: Project | null) => {
    setState((prev) => ({ ...prev, currentProject: project, currentBucket: null }));
  };

  const setCurrentBucket = (bucket: BucketType | null) => {
    setState((prev) => ({ ...prev, currentBucket: bucket }));
  };

  const setProjects = (projects: Project[]) => {
    setState((prev) => ({ ...prev, projects }));
  };

  const setVoiceNotes = (notes: VoiceNote[]) => {
    setState((prev) => ({ ...prev, voiceNotes: notes }));
  };

  const setSettings = (settings: UserSettings) => {
    setState((prev) => ({ ...prev, settings }));
  };

  const setIsRecording = (isRecording: boolean) => {
    setState((prev) => ({ ...prev, isRecording }));
  };

  return (
    <AppContext.Provider
      value={{
        ...state,
        setCurrentProject,
        setCurrentBucket,
        setProjects,
        setVoiceNotes,
        setSettings,
        setIsRecording,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
