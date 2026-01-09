import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isYesterday, startOfDay, subDays } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, Sparkles, Plus } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { VoiceNoteCard } from '@/components/voice/VoiceNoteCard';
import { RecordingModal } from '@/components/voice/RecordingModal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VoiceNote, BucketType } from '@/types';

// Demo data
const generateDemoLogs = (): VoiceNote[] => {
  const notes: VoiceNote[] = [];
  const now = new Date();

  // Today's entries
  notes.push({
    id: 'dl1',
    projectId: '1',
    bucketType: 'daily-log',
    status: 'open',
    audioUrl: '',
    duration: 120,
    quality: 'high',
    createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 2),
    updatedAt: new Date(),
    title: 'Morning standup notes',
    transcript: 'Started working on the authentication flow. Met with the team to discuss the new design requirements. Plan to finish the login page by end of day.',
    logDate: format(now, 'yyyy-MM-dd'),
    userId: '1',
  });

  notes.push({
    id: 'dl2',
    projectId: '1',
    bucketType: 'daily-log',
    status: 'open',
    audioUrl: '',
    duration: 85,
    quality: 'high',
    createdAt: new Date(now.getTime() - 1000 * 60 * 30),
    updatedAt: new Date(),
    title: 'Progress update - authentication',
    transcript: 'Finished implementing the login form. Need to add form validation and connect to Firebase auth. Also discovered a bug with the password reset flow.',
    logDate: format(now, 'yyyy-MM-dd'),
    userId: '1',
  });

  // Yesterday's entries
  const yesterday = subDays(now, 1);
  notes.push({
    id: 'dl3',
    projectId: '1',
    bucketType: 'daily-log',
    status: 'open',
    audioUrl: '',
    duration: 95,
    quality: 'high',
    createdAt: yesterday,
    updatedAt: yesterday,
    title: 'End of day summary',
    transcript: 'Completed the voice recording feature. Fixed several bugs related to audio playback. Tomorrow will focus on authentication.',
    logDate: format(yesterday, 'yyyy-MM-dd'),
    userId: '1',
  });

  return notes;
};

const DailyLog = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [showRecordingModal, setShowRecordingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showAISummary, setShowAISummary] = useState(false);

  // In production, fetch from Firebase
  const allLogs = generateDemoLogs();

  // Group by date
  const logsByDate = useMemo(() => {
    const grouped: Record<string, VoiceNote[]> = {};
    
    allLogs.forEach((log) => {
      const dateKey = log.logDate || format(log.createdAt, 'yyyy-MM-dd');
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(log);
    });

    // Sort each group by time (newest first)
    Object.keys(grouped).forEach((date) => {
      grouped[date].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    });

    return grouped;
  }, [allLogs]);

  const selectedDateKey = format(selectedDate, 'yyyy-MM-dd');
  const todayLogs = logsByDate[selectedDateKey] || [];

  const getDateLabel = (date: Date): string => {
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'EEEE, MMMM d');
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    setSelectedDate((current) =>
      direction === 'prev' ? subDays(current, 1) : subDays(current, -1)
    );
  };

  const handleRecordingSave = async (blob: Blob, duration: number, bucket: BucketType) => {
    console.log('Saving daily log:', { blob, duration });
    setShowRecordingModal(false);
  };

  const handleGenerateSummary = () => {
    // In production: call AI API to generate summary
    setShowAISummary(true);
  };

  return (
    <AppLayout
      title="Daily Log"
      subtitle={getDateLabel(selectedDate)}
      showBack
      showRecordFab
      onRecord={() => setShowRecordingModal(true)}
    >
      <div className="space-y-6">
        {/* Date navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateDate('prev')}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          <button
            onClick={() => setSelectedDate(new Date())}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span className="font-medium">{format(selectedDate, 'MMM d, yyyy')}</span>
          </button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigateDate('next')}
            disabled={isToday(selectedDate)}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* AI Summary (if enabled) */}
        {showAISummary && todayLogs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  AI Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Today you focused on authentication, completing the login form implementation. 
                  You discovered a bug with password reset that needs attention. The team discussed 
                  new design requirements during the morning standup.
                </p>
                <p className="text-xs text-muted-foreground/60 mt-2">
                  Generated from {todayLogs.length} voice notes
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Today's entries */}
        {todayLogs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-log/10 mb-4">
              <Calendar className="w-8 h-8 text-log" />
            </div>
            <h3 className="font-semibold mb-1">
              {isToday(selectedDate) ? 'No entries today' : 'No entries this day'}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isToday(selectedDate)
                ? 'Record your thoughts, progress, and learnings'
                : 'No voice notes were recorded on this day'}
            </p>
            {isToday(selectedDate) && (
              <Button onClick={() => setShowRecordingModal(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Start Today's Log
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {/* Summary button */}
            {!showAISummary && todayLogs.length >= 2 && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGenerateSummary}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Generate AI Summary
              </Button>
            )}

            {/* Timeline */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {todayLogs.map((log, index) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative"
                  >
                    {/* Time marker */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full bg-log" />
                      <span className="text-xs text-muted-foreground">
                        {format(log.createdAt, 'h:mm a')}
                      </span>
                    </div>
                    
                    {/* Note card */}
                    <div className="ml-5 border-l-2 border-muted pl-4 pb-4">
                      <VoiceNoteCard
                        note={log}
                        showBucket={false}
                        onPlay={() => console.log('Play:', log.id)}
                        onDelete={() => console.log('Delete:', log.id)}
                      />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Week overview */}
        <section className="pt-4 border-t">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">This Week</h3>
          <div className="flex gap-2">
            {Array.from({ length: 7 }).map((_, i) => {
              const date = subDays(new Date(), 6 - i);
              const dateKey = format(date, 'yyyy-MM-dd');
              const hasLogs = logsByDate[dateKey]?.length > 0;
              const isSelected = dateKey === selectedDateKey;

              return (
                <button
                  key={dateKey}
                  onClick={() => setSelectedDate(date)}
                  className={`
                    flex-1 py-2 rounded-lg text-center transition-colors
                    ${isSelected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'}
                  `}
                >
                  <span className="text-xs block text-inherit opacity-70">
                    {format(date, 'EEE')}
                  </span>
                  <span className="text-sm font-medium block">
                    {format(date, 'd')}
                  </span>
                  {hasLogs && !isSelected && (
                    <div className="w-1 h-1 rounded-full bg-log mx-auto mt-1" />
                  )}
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {/* Recording Modal */}
      <AnimatePresence>
        {showRecordingModal && (
          <RecordingModal
            projectId={projectId!}
            initialBucket="daily-log"
            onClose={() => setShowRecordingModal(false)}
            onSave={handleRecordingSave}
          />
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default DailyLog;
