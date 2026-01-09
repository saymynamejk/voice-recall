import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Settings, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Link, useNavigate } from 'react-router-dom';

interface AppLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showSettings?: boolean;
  showRecordFab?: boolean;
  onRecord?: () => void;
  headerAction?: ReactNode;
}

export function AppLayout({
  children,
  title,
  subtitle,
  showBack,
  showSettings = true,
  showRecordFab,
  onRecord,
  headerAction,
}: AppLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b safe-area-top">
        <div className="container flex items-center h-14 px-4">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="mr-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}

          <div className="flex-1 min-w-0">
            {title && (
              <h1 className="font-semibold text-foreground truncate">{title}</h1>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>

          {headerAction}

          {showSettings && (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/settings">
                <Settings className="w-5 h-5" />
              </Link>
            </Button>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 container px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </main>

      {/* Floating Record Button */}
      {showRecordFab && onRecord && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 z-50 safe-area-bottom"
        >
          <Button
            onClick={onRecord}
            size="lg"
            className={cn(
              'w-14 h-14 rounded-full shadow-lg shadow-primary/25',
              'bg-primary hover:bg-primary/90'
            )}
          >
            <Mic className="w-6 h-6" />
          </Button>
        </motion.div>
      )}
    </div>
  );
}
