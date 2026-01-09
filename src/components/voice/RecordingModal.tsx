import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Mic, Bug, Sparkles, Lightbulb, Calendar, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RecordButton } from './RecordButton';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { useApp } from '@/context/AppContext';
import { BucketType, BUCKET_CONFIG } from '@/types';
import { cn } from '@/lib/utils';

interface RecordingModalProps {
  projectId: string;
  initialBucket?: BucketType | null;
  onClose: () => void;
  onSave: (blob: Blob, duration: number, bucket: BucketType) => Promise<void>;
}

const bucketIcons = {
  bugs: Bug,
  features: Sparkles,
  ideas: Lightbulb,
  'daily-log': Calendar,
};

export function RecordingModal({
  projectId,
  initialBucket,
  onClose,
  onSave,
}: RecordingModalProps) {
  const { settings } = useApp();
  const [selectedBucket, setSelectedBucket] = useState<BucketType>(
    initialBucket || 'daily-log'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedDuration, setRecordedDuration] = useState(0);

  const {
    state: recordingState,
    duration,
    audioLevel,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    cancelRecording,
  } = useVoiceRecorder({
    quality: settings.audioQuality,
    onRecordingComplete: (blob, dur) => {
      setRecordedBlob(blob);
      setRecordedDuration(dur);
    },
    onError: (error) => {
      console.error('Recording error:', error);
    },
  });

  const isRecording = recordingState === 'recording' || recordingState === 'paused';
  const hasRecording = recordedBlob !== null;

  const handleSave = async () => {
    if (!recordedBlob) return;
    
    setIsSaving(true);
    try {
      await onSave(recordedBlob, recordedDuration, selectedBucket);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (isRecording) {
      cancelRecording();
    }
    setRecordedBlob(null);
    setRecordedDuration(0);
  };

  const handleClose = () => {
    handleCancel();
    onClose();
  };

  // Prevent scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-background/95 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Content */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative mt-auto bg-card rounded-t-3xl border-t shadow-2xl"
      >
        {/* Handle */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1 rounded-full bg-muted" />

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4"
          onClick={handleClose}
        >
          <X className="w-5 h-5" />
        </Button>

        <div className="p-6 pt-10 space-y-8">
          {/* Bucket selector (only show before recording) */}
          {!isRecording && !hasRecording && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                What are you recording?
              </p>
              <div className="grid grid-cols-4 gap-2">
                {(Object.keys(BUCKET_CONFIG) as BucketType[]).map((type) => {
                  const config = BUCKET_CONFIG[type];
                  const Icon = bucketIcons[type];
                  const isSelected = selectedBucket === type;

                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedBucket(type)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-3 rounded-xl transition-all',
                        isSelected
                          ? 'bg-primary/10 ring-2 ring-primary'
                          : 'bg-muted/50 hover:bg-muted'
                      )}
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                          backgroundColor: isSelected
                            ? `hsl(var(--${config.color}))`
                            : `hsl(var(--${config.color}) / 0.1)`,
                        }}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={{
                            color: isSelected
                              ? 'white'
                              : `hsl(var(--${config.color}))`,
                          }}
                        />
                      </div>
                      <span
                        className={cn(
                          'text-xs font-medium',
                          isSelected ? 'text-primary' : 'text-muted-foreground'
                        )}
                      >
                        {type === 'daily-log' ? 'Log' : config.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recording indicator when active */}
          {isRecording && (
            <div className="text-center">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{
                  backgroundColor: `hsl(var(--${BUCKET_CONFIG[selectedBucket].color}) / 0.1)`,
                }}
              >
                {(() => {
                  const Icon = bucketIcons[selectedBucket];
                  return (
                    <Icon
                      className="w-4 h-4"
                      style={{ color: `hsl(var(--${BUCKET_CONFIG[selectedBucket].color}))` }}
                    />
                  );
                })()}
                <span
                  className="text-sm font-medium"
                  style={{ color: `hsl(var(--${BUCKET_CONFIG[selectedBucket].color}))` }}
                >
                  {BUCKET_CONFIG[selectedBucket].label}
                </span>
              </div>
            </div>
          )}

          {/* Record button */}
          <div className="flex flex-col items-center py-4">
            {hasRecording ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center gap-4"
              >
                {/* Preview */}
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-3 mx-auto">
                    <Check className="w-8 h-8 text-success" />
                  </div>
                  <p className="font-medium">Recording complete</p>
                  <p className="text-sm text-muted-foreground">
                    {Math.floor(recordedDuration / 60)}:{String(Math.floor(recordedDuration % 60)).padStart(2, '0')} duration
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 w-full max-w-xs">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setRecordedBlob(null);
                      setRecordedDuration(0);
                    }}
                  >
                    Re-record
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </motion.div>
            ) : (
              <RecordButton
                state={recordingState}
                duration={duration}
                audioLevel={audioLevel}
                onStart={startRecording}
                onStop={stopRecording}
                onPause={pauseRecording}
                onResume={resumeRecording}
                onCancel={handleCancel}
              />
            )}
          </div>

          {/* Tips */}
          {!isRecording && !hasRecording && (
            <p className="text-xs text-center text-muted-foreground px-4">
              Speak naturally. AI will help transcribe and categorize your note.
            </p>
          )}
        </div>

        {/* Safe area padding */}
        <div className="h-safe-area-bottom" />
      </motion.div>
    </motion.div>
  );
}
