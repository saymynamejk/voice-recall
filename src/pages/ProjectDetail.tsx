import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Edit2, Archive, Trash2, Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { BucketCard } from '@/components/buckets/BucketCard';
import { RecordingModal } from '@/components/voice/RecordingModal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/context/AppContext';
import { BucketType, BUCKET_CONFIG, Project, VoiceNote } from '@/types';

// Demo data - will be replaced with Firebase
const demoProject: Project = {
  id: '1',
  name: 'nona App',
  description: 'Voice-first developer workspace',
  color: '#8B5CF6',
  createdAt: new Date(),
  updatedAt: new Date(),
  userId: '1',
  isArchived: false,
};

const demoNotes: VoiceNote[] = [
  {
    id: '1',
    projectId: '1',
    bucketType: 'bugs',
    status: 'open',
    audioUrl: '',
    duration: 45,
    quality: 'high',
    createdAt: new Date(),
    updatedAt: new Date(),
    title: 'Login button not responding on mobile',
    userId: '1',
  },
  {
    id: '2',
    projectId: '1',
    bucketType: 'bugs',
    status: 'open',
    audioUrl: '',
    duration: 30,
    quality: 'high',
    createdAt: new Date(),
    updatedAt: new Date(),
    title: 'Audio playback stops when screen locks',
    userId: '1',
  },
  {
    id: '3',
    projectId: '1',
    bucketType: 'features',
    status: 'open',
    audioUrl: '',
    duration: 60,
    quality: 'high',
    createdAt: new Date(),
    updatedAt: new Date(),
    title: 'Add dark mode toggle',
    userId: '1',
  },
];

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { setCurrentProject, setCurrentBucket } = useApp();
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState<BucketType | null>(null);

  // In production, fetch from Firebase
  const project = demoProject;
  const notes = demoNotes.filter((n) => n.projectId === projectId);

  // Calculate counts per bucket
  const bucketCounts = useMemo(() => {
    const counts: Record<BucketType, { total: number; open: number }> = {
      bugs: { total: 0, open: 0 },
      features: { total: 0, open: 0 },
      ideas: { total: 0, open: 0 },
      'daily-log': { total: 0, open: 0 },
    };

    notes.forEach((note) => {
      counts[note.bucketType].total++;
      if (note.status === 'open') {
        counts[note.bucketType].open++;
      }
    });

    return counts;
  }, [notes]);

  const handleBucketClick = (type: BucketType) => {
    setCurrentBucket(type);
    if (type === 'daily-log') {
      navigate(`/projects/${projectId}/daily-log`);
    } else {
      navigate(`/projects/${projectId}/buckets/${type}`);
    }
  };

  const handleRecord = (bucket?: BucketType) => {
    setSelectedBucket(bucket || null);
    setShowRecordingModal(true);
  };

  const handleRecordingSave = async (blob: Blob, duration: number, bucket: BucketType) => {
    // In production: upload to Firebase Storage, create Firestore doc
    console.log('Saving recording:', { blob, duration, bucket });
    setShowRecordingModal(false);
  };

  if (!project) {
    return (
      <AppLayout title="Project Not Found" showBack>
        <div className="text-center py-12">
          <p className="text-muted-foreground">This project doesn't exist.</p>
          <Button className="mt-4" onClick={() => navigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout
      title={project.name}
      subtitle={project.description}
      showBack
      showRecordFab
      onRecord={() => handleRecord()}
      headerAction={
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/projects/${projectId}/edit`)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Project
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Archive className="w-4 h-4 mr-2" />
              Archive Project
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Project
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    >
      <div className="space-y-6">
        {/* Project color indicator */}
        <div
          className="h-1 rounded-full"
          style={{ backgroundColor: project.color }}
        />

        {/* Buckets */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Buckets</h2>
            <span className="text-sm text-muted-foreground">
              {notes.length} notes total
            </span>
          </div>

          <div className="space-y-2">
            {(Object.keys(BUCKET_CONFIG) as BucketType[]).map((type) => (
              <BucketCard
                key={type}
                type={type}
                noteCount={bucketCounts[type].total}
                openCount={type !== 'daily-log' ? bucketCounts[type].open : undefined}
                onClick={() => handleBucketClick(type)}
              />
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-3">
          <h2 className="font-semibold">Quick Record</h2>
          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(BUCKET_CONFIG) as BucketType[])
              .filter((t) => t !== 'daily-log')
              .map((type) => {
                const config = BUCKET_CONFIG[type];
                return (
                  <Button
                    key={type}
                    variant="outline"
                    className="justify-start"
                    onClick={() => handleRecord(type)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {config.label}
                  </Button>
                );
              })}
          </div>
        </section>

        {/* Recent Activity */}
        {notes.length > 0 && (
          <section className="space-y-3">
            <h2 className="font-semibold">Recent Activity</h2>
            <div className="space-y-2">
              {notes.slice(0, 3).map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: `hsl(var(--${BUCKET_CONFIG[note.bucketType].color}))`,
                      }}
                    />
                    <span className="text-xs text-muted-foreground">
                      {BUCKET_CONFIG[note.bucketType].label}
                    </span>
                  </div>
                  <p className="text-sm font-medium truncate">
                    {note.title || 'Untitled recording'}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Recording Modal */}
      <AnimatePresence>
        {showRecordingModal && (
          <RecordingModal
            projectId={projectId!}
            initialBucket={selectedBucket}
            onClose={() => setShowRecordingModal(false)}
            onSave={handleRecordingSave}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default ProjectDetail;
