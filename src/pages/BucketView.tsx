import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, SortAsc, Plus, CheckCircle2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { VoiceNoteCard } from '@/components/voice/VoiceNoteCard';
import { RecordingModal } from '@/components/voice/RecordingModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BucketType, BUCKET_CONFIG, VoiceNote, NoteStatus } from '@/types';

// Demo data
const demoNotes: VoiceNote[] = [
  {
    id: '1',
    projectId: '1',
    bucketType: 'bugs',
    status: 'open',
    audioUrl: '',
    duration: 45,
    quality: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    updatedAt: new Date(),
    title: 'Login button not responding on mobile Safari',
    transcript: 'The login button on the landing page is not responding to taps on mobile Safari. I tested on iPhone 14 Pro and the issue is consistent. Need to check the click handler.',
    tags: ['mobile', 'safari', 'authentication'],
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
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(),
    title: 'Audio playback stops when screen locks',
    transcript: 'When playing back voice notes, if the screen locks the audio stops. Need to implement background audio session.',
    tags: ['audio', 'playback'],
    userId: '1',
  },
  {
    id: '3',
    projectId: '1',
    bucketType: 'bugs',
    status: 'resolved',
    audioUrl: '',
    duration: 25,
    quality: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(),
    title: 'Fixed navigation crash on Android',
    userId: '1',
  },
];

type SortOption = 'newest' | 'oldest' | 'longest' | 'shortest';

const BucketView = () => {
  const { projectId, bucketType } = useParams<{ projectId: string; bucketType: BucketType }>();
  const navigate = useNavigate();
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<NoteStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const bucket = bucketType as BucketType;
  const config = BUCKET_CONFIG[bucket];

  // In production, fetch from Firebase
  const allNotes = demoNotes.filter((n) => n.bucketType === bucket);

  // Filter and sort
  const filteredNotes = useMemo(() => {
    let notes = [...allNotes];

    // Filter by status
    if (statusFilter !== 'all') {
      notes = notes.filter((n) => n.status === statusFilter);
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        notes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        break;
      case 'oldest':
        notes.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
        break;
      case 'longest':
        notes.sort((a, b) => b.duration - a.duration);
        break;
      case 'shortest':
        notes.sort((a, b) => a.duration - b.duration);
        break;
    }

    return notes;
  }, [allNotes, statusFilter, sortBy]);

  const statusCounts = useMemo(() => {
    return {
      all: allNotes.length,
      open: allNotes.filter((n) => n.status === 'open').length,
      resolved: allNotes.filter((n) => n.status === 'resolved').length,
      archived: allNotes.filter((n) => n.status === 'archived').length,
    };
  }, [allNotes]);

  const handlePlay = (note: VoiceNote) => {
    console.log('Play note:', note.id);
  };

  const handleStatusChange = (noteId: string, status: NoteStatus) => {
    console.log('Change status:', noteId, status);
  };

  const handleDelete = (noteId: string) => {
    console.log('Delete note:', noteId);
  };

  const handleRecordingSave = async (blob: Blob, duration: number, bucket: BucketType) => {
    console.log('Saving recording:', { blob, duration, bucket });
    setShowRecordingModal(false);
  };

  return (
    <AppLayout
      title={config.label}
      subtitle={`${allNotes.length} notes`}
      showBack
      showRecordFab
      onRecord={() => setShowRecordingModal(true)}
    >
      <div className="space-y-4">
        {/* Status tabs */}
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as NoteStatus | 'all')}>
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">
              All ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="open" className="flex-1">
              Open ({statusCounts.open})
            </TabsTrigger>
            <TabsTrigger value="resolved" className="flex-1">
              Resolved ({statusCounts.resolved})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Sort dropdown */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <SortAsc className="w-4 h-4 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy('newest')}>
                Newest first {sortBy === 'newest' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                Oldest first {sortBy === 'oldest' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('longest')}>
                Longest first {sortBy === 'longest' && '✓'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('shortest')}>
                Shortest first {sortBy === 'shortest' && '✓'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Notes list */}
        {filteredNotes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            {statusFilter === 'all' ? (
              <>
                <div
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
                  style={{ backgroundColor: `hsl(var(--${config.color}) / 0.1)` }}
                >
                  <Plus
                    className="w-8 h-8"
                    style={{ color: `hsl(var(--${config.color}))` }}
                  />
                </div>
                <h3 className="font-semibold mb-1">No {config.label.toLowerCase()} yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tap the mic button to record your first {config.label.toLowerCase().slice(0, -1)}
                </p>
                <Button onClick={() => setShowRecordingModal(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Record {config.label.slice(0, -1)}
                </Button>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">
                  No {statusFilter} {config.label.toLowerCase()}
                </p>
              </>
            )}
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {filteredNotes.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <VoiceNoteCard
                    note={note}
                    showBucket={false}
                    onPlay={() => handlePlay(note)}
                    onStatusChange={(status) => handleStatusChange(note.id, status)}
                    onDelete={() => handleDelete(note.id)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Recording Modal */}
      <AnimatePresence>
        {showRecordingModal && (
          <RecordingModal
            projectId={projectId!}
            initialBucket={bucket}
            onClose={() => setShowRecordingModal(false)}
            onSave={handleRecordingSave}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default BucketView;
