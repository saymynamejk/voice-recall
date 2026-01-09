import { motion } from 'framer-motion';
import { Play, Pause, MoreVertical, Check, Archive, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { VoiceNote, BUCKET_CONFIG } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface VoiceNoteCardProps {
  note: VoiceNote;
  onPlay?: () => void;
  onStatusChange?: (status: 'open' | 'resolved' | 'archived') => void;
  onDelete?: () => void;
  showProject?: boolean;
  showBucket?: boolean;
  projectName?: string;
  projectColor?: string;
  highlightText?: string;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function VoiceNoteCard({
  note,
  onPlay,
  onStatusChange,
  onDelete,
  showProject,
  showBucket = true,
  projectName,
  projectColor,
  highlightText,
}: VoiceNoteCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const config = BUCKET_CONFIG[note.bucketType];
  const displayTitle = note.manualTitle || note.title || 'Untitled note';
  const timeAgo = formatDistanceToNow(note.createdAt, { addSuffix: true });

  useEffect(() => {
    const audio = new Audio(note.audioUrl);
    audioRef.current = audio;

    audio.addEventListener('timeupdate', () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    });

    audio.addEventListener('ended', () => {
      setIsPlaying(false);
      setProgress(0);
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [note.audioUrl]);

  const handlePlayPause = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      onPlay?.();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'p-4 rounded-lg border bg-card',
        'hover:border-border/80 transition-colors'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Play button */}
        <Button
          variant="outline"
          size="icon"
          onClick={handlePlayPause}
          className="shrink-0 rounded-full"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </Button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {showProject && projectName && (
              <span
                className="px-2 py-0.5 text-xs font-medium rounded-full"
                style={{
                  backgroundColor: projectColor
                    ? `${projectColor}20`
                    : 'hsl(var(--muted))',
                  color: projectColor || 'hsl(var(--muted-foreground))',
                }}
              >
                {projectName}
              </span>
            )}
            <span
              className="px-2 py-0.5 text-xs font-medium rounded-full"
              style={{
                backgroundColor: `hsl(var(--${config.color}) / 0.1)`,
                color: `hsl(var(--${config.color}))`,
              }}
            >
              {config.label}
            </span>
            {note.status === 'resolved' && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-success/10 text-success">
                Resolved
              </span>
            )}
          </div>

          <h4 className="font-medium text-foreground truncate">{displayTitle}</h4>

          {note.transcript && (
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {note.transcript}
            </p>
          )}

          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">
              {formatDuration(note.duration)}
            </span>
          </div>

          {/* Tags */}
          {(note.manualTags || note.tags)?.length ? (
            <div className="flex flex-wrap gap-1 mt-2">
              {(note.manualTags || note.tags)?.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-muted text-muted-foreground rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {note.status === 'open' && onResolve && (
                <DropdownMenuItem onClick={onResolve}>
                  <Check className="w-4 h-4 mr-2" />
                  Mark as resolved
                </DropdownMenuItem>
              )}
              {onArchive && (
                <DropdownMenuItem onClick={onArchive}>
                  <Archive className="w-4 h-4 mr-2" />
                  Archive
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.div>
  );
}
