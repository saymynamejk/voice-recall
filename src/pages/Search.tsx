import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search as SearchIcon, X, Filter, Mic, Clock, Sparkles } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { VoiceNoteCard } from '@/components/voice/VoiceNoteCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BucketType, BUCKET_CONFIG, VoiceNote, NoteStatus } from '@/types';
import { useApp } from '@/context/AppContext';

// Demo data
const allDemoNotes: VoiceNote[] = [
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
    transcript: 'The login button on the landing page is not responding to taps on mobile Safari.',
    tags: ['mobile', 'safari', 'authentication'],
    userId: '1',
  },
  {
    id: '2',
    projectId: '1',
    bucketType: 'features',
    status: 'open',
    audioUrl: '',
    duration: 60,
    quality: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 60),
    updatedAt: new Date(),
    title: 'Add dark mode toggle to settings',
    transcript: 'Users should be able to toggle between dark and light mode in settings.',
    tags: ['ui', 'settings', 'theme'],
    userId: '1',
  },
  {
    id: '3',
    projectId: '1',
    bucketType: 'ideas',
    status: 'open',
    audioUrl: '',
    duration: 90,
    quality: 'high',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    updatedAt: new Date(),
    title: 'Voice command shortcuts',
    transcript: 'What if users could say "new bug" or "new feature" to automatically categorize?',
    tags: ['voice', 'ux', 'shortcuts'],
    userId: '1',
  },
];

const recentSearches = ['login bug', 'authentication', 'mobile issues'];

const Search = () => {
  const { settings } = useApp();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Filters
  const [bucketFilters, setBucketFilters] = useState<BucketType[]>([]);
  const [statusFilter, setStatusFilter] = useState<NoteStatus | null>(null);
  const [projectFilter, setProjectFilter] = useState<string | null>(null);

  // Search results
  const results = useMemo(() => {
    if (!query.trim()) return [];

    const searchTerms = query.toLowerCase().split(' ');

    return allDemoNotes.filter((note) => {
      // Apply bucket filter
      if (bucketFilters.length > 0 && !bucketFilters.includes(note.bucketType)) {
        return false;
      }

      // Apply status filter
      if (statusFilter && note.status !== statusFilter) {
        return false;
      }

      // Search in title, transcript, and tags
      const searchableText = [
        note.title || '',
        note.transcript || '',
        ...(note.tags || []),
      ]
        .join(' ')
        .toLowerCase();

      return searchTerms.every((term) => searchableText.includes(term));
    });
  }, [query, bucketFilters, statusFilter]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setHasSearched(true);
    // In production with AI: use semantic search
  };

  const clearFilters = () => {
    setBucketFilters([]);
    setStatusFilter(null);
    setProjectFilter(null);
  };

  const hasActiveFilters = bucketFilters.length > 0 || statusFilter !== null;

  return (
    <AppLayout title="Search" showBack>
      <div className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search notes, transcripts, tags..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-10"
            autoFocus
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setHasSearched(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0">
                    {bucketFilters.length + (statusFilter ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Buckets</DropdownMenuLabel>
              {(Object.keys(BUCKET_CONFIG) as BucketType[]).map((type) => (
                <DropdownMenuCheckboxItem
                  key={type}
                  checked={bucketFilters.includes(type)}
                  onCheckedChange={(checked) => {
                    setBucketFilters((prev) =>
                      checked
                        ? [...prev, type]
                        : prev.filter((t) => t !== type)
                    );
                  }}
                >
                  {BUCKET_CONFIG[type].label}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Status</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={statusFilter === 'open'}
                onCheckedChange={(checked) => setStatusFilter(checked ? 'open' : null)}
              >
                Open
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={statusFilter === 'resolved'}
                onCheckedChange={(checked) => setStatusFilter(checked ? 'resolved' : null)}
              >
                Resolved
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          )}

          {settings.aiSettings.enabled && (
            <Button variant="outline" size="sm" className="ml-auto gap-2">
              <Sparkles className="w-4 h-4" />
              AI Search
            </Button>
          )}
        </div>

        {/* Results or empty states */}
        {!hasSearched ? (
          <div className="space-y-6 pt-4">
            {/* Recent searches */}
            {recentSearches.length > 0 && (
              <section>
                <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Recent Searches
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className="px-3 py-1.5 text-sm bg-muted rounded-full hover:bg-muted/80 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Voice search hint */}
            <section className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
                <Mic className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-1">Search your voice notes</h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                Find notes by keywords in titles, transcripts, or tags
              </p>
            </section>
          </div>
        ) : results.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <SearchIcon className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
            <h3 className="font-semibold mb-1">No results found</h3>
            <p className="text-sm text-muted-foreground">
              Try different keywords or adjust your filters
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </p>

            <AnimatePresence mode="popLayout">
              {results.map((note, index) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <VoiceNoteCard
                    note={note}
                    showBucket
                    onPlay={() => console.log('Play:', note.id)}
                    onDelete={() => console.log('Delete:', note.id)}
                    highlightText={query}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Search;
