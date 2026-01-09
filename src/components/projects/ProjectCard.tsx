import { motion } from 'framer-motion';
import { FolderOpen, MoreVertical, Settings, Trash2 } from 'lucide-react';
import { Project } from '@/types';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: Project;
  stats?: {
    openBugsCount: number;
    pendingFeaturesCount: number;
    totalNotes: number;
  };
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function ProjectCard({
  project,
  stats,
  onClick,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const lastActivity = formatDistanceToNow(project.updatedAt, { addSuffix: true });

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        'p-4 rounded-lg border bg-card cursor-pointer',
        'hover:border-primary/30 transition-all'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        {/* Project icon */}
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${project.color}20` }}
        >
          <FolderOpen className="w-5 h-5" style={{ color: project.color }} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{project.name}</h3>
          {project.description && (
            <p className="text-sm text-muted-foreground truncate">
              {project.description}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">{lastActivity}</p>
        </div>

        {/* Stats badges */}
        {stats && (
          <div className="flex items-center gap-2 shrink-0">
            {stats.openBugsCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-bug/10 text-bug">
                {stats.openBugsCount} bugs
              </span>
            )}
            {stats.pendingFeaturesCount > 0 && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-feature/10 text-feature">
                {stats.pendingFeaturesCount} features
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {onEdit && (
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                <Settings className="w-4 h-4 mr-2" />
                Edit project
              </DropdownMenuItem>
            )}
            {onDelete && (
              <DropdownMenuItem
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="text-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete project
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
