import { motion } from 'framer-motion';
import { Bug, Sparkles, Lightbulb, Calendar, ChevronRight } from 'lucide-react';
import { BucketType, BUCKET_CONFIG } from '@/types';
import { cn } from '@/lib/utils';

interface BucketCardProps {
  type: BucketType;
  noteCount: number;
  openCount?: number;
  onClick: () => void;
}

const iconMap = {
  Bug,
  Sparkles,
  Lightbulb,
  Calendar,
};

export function BucketCard({ type, noteCount, openCount, onClick }: BucketCardProps) {
  const config = BUCKET_CONFIG[type];
  const IconComponent = iconMap[config.icon as keyof typeof iconMap];

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'w-full p-4 rounded-lg border bg-card text-left transition-colors',
        'hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring',
        'flex items-center gap-4'
      )}
    >
      <div
        className={cn(
          'w-12 h-12 rounded-lg flex items-center justify-center',
          `bg-${config.color}/10`
        )}
        style={{
          backgroundColor: `hsl(var(--${config.color}) / 0.1)`,
        }}
      >
        <IconComponent
          className="w-6 h-6"
          style={{ color: `hsl(var(--${config.color}))` }}
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground">{config.label}</h3>
        <p className="text-sm text-muted-foreground truncate">{config.description}</p>
      </div>

      <div className="flex items-center gap-3">
        {openCount !== undefined && openCount > 0 && (
          <span
            className="px-2 py-0.5 text-xs font-medium rounded-full"
            style={{
              backgroundColor: `hsl(var(--${config.color}) / 0.1)`,
              color: `hsl(var(--${config.color}))`,
            }}
          >
            {openCount} open
          </span>
        )}
        <span className="text-sm text-muted-foreground">{noteCount}</span>
        <ChevronRight className="w-5 h-5 text-muted-foreground" />
      </div>
    </motion.button>
  );
}
