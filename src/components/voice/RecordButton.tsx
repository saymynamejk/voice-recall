import { motion } from 'framer-motion';
import { Mic, Square, Pause, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { RecordingState } from '@/hooks/useVoiceRecorder';

interface RecordButtonProps {
  state: RecordingState;
  duration: number;
  audioLevel: number;
  onStart: () => void;
  onStop: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function RecordButton({
  state,
  duration,
  audioLevel,
  onStart,
  onStop,
  onPause,
  onResume,
  onCancel,
}: RecordButtonProps) {
  const isRecording = state === 'recording';
  const isPaused = state === 'paused';
  const isProcessing = state === 'processing';
  const isActive = isRecording || isPaused;

  if (state === 'idle') {
    return (
      <motion.div className="flex flex-col items-center gap-2">
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center',
            'bg-primary text-primary-foreground',
            'shadow-lg shadow-primary/25',
            'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          )}
        >
          <Mic className="w-7 h-7" />
        </motion.button>
        <span className="text-sm text-muted-foreground">Tap to record</span>
      </motion.div>
    );
  }

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-muted">
          <motion.div
            className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        <span className="text-sm text-muted-foreground">Processing...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-4"
    >
      {/* Audio level visualizer */}
      <div className="flex items-end justify-center gap-1 h-8">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-primary rounded-full"
            animate={{
              height: isRecording
                ? `${Math.max(8, audioLevel * 32 * (1 + Math.sin(Date.now() / 100 + i)))}px`
                : '8px',
            }}
            transition={{ duration: 0.1 }}
          />
        ))}
      </div>

      {/* Duration */}
      <span className="text-2xl font-mono font-semibold tabular-nums">
        {formatDuration(duration)}
      </span>

      {/* Controls */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={onCancel}
          className="rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>

        <motion.button
          onClick={onStop}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={cn(
            'w-16 h-16 rounded-full flex items-center justify-center',
            'bg-recording text-white',
            'shadow-lg',
            isRecording && 'animate-pulse-ring'
          )}
        >
          <Square className="w-6 h-6" />
        </motion.button>

        <Button
          variant="outline"
          size="icon"
          onClick={isPaused ? onResume : onPause}
          className="rounded-full"
        >
          {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
        </Button>
      </div>

      <span className="text-sm text-muted-foreground">
        {isPaused ? 'Paused' : 'Recording...'}
      </span>
    </motion.div>
  );
}
