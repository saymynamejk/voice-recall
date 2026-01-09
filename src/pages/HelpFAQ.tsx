import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Mic, 
  FolderOpen, 
  Brain, 
  Cloud, 
  Shield, 
  Settings,
  ChevronDown,
  MessageCircle,
  Mail,
  ExternalLink
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    category: 'Getting Started',
    question: 'How do I create my first voice note?',
    answer: 'Tap the microphone button at the bottom of the screen to start recording. Speak your thoughts, and tap again to stop. Your voice note will be automatically saved to the current bucket.',
  },
  {
    category: 'Getting Started',
    question: 'What are buckets and how do they work?',
    answer: 'Buckets are categories for organizing your voice notes. There are four bucket types: Bugs (for issues), Features (for new ideas), Ideas (for general thoughts), and Log (for daily updates). Each project has its own set of buckets.',
  },
  {
    category: 'Getting Started',
    question: 'How do I create a new project?',
    answer: 'From the home screen, tap the "+" button or "New Project". Enter a project name, optional description, and choose a color. Your project will be created with empty buckets ready for your voice notes.',
  },
  // Recording
  {
    category: 'Recording',
    question: 'What audio quality options are available?',
    answer: 'We offer three quality levels: Standard (16kHz mono, smallest files), High (44.1kHz mono, balanced), and Lossless (48kHz stereo, best quality). Choose based on your storage needs and quality preferences in Settings > Audio.',
  },
  {
    category: 'Recording',
    question: 'Is there a maximum recording length?',
    answer: 'Individual recordings can be up to 30 minutes long. For longer sessions, we recommend splitting into multiple recordings for easier management and organization.',
  },
  {
    category: 'Recording',
    question: 'Can I edit or trim my recordings?',
    answer: 'Currently, recordings cannot be edited after saving. We recommend re-recording if needed. Audio editing features are on our roadmap for future updates.',
  },
  // AI Features
  {
    category: 'AI Features',
    question: 'How does AI transcription work?',
    answer: 'When AI features are enabled, your voice notes are automatically transcribed to text. The transcription happens in the cloud and typically completes within seconds of finishing your recording.',
  },
  {
    category: 'AI Features',
    question: 'What AI features are available?',
    answer: 'Available AI features include: Auto-transcription, Smart titles (generates titles from content), Auto-tagging, Bucket detection (automatically categorizes notes), and AI summaries for your daily log.',
  },
  {
    category: 'AI Features',
    question: 'Is my data safe when using AI?',
    answer: 'Yes. Audio is processed securely and deleted after transcription. We do not use your data to train AI models. See our Privacy Policy for complete details on data handling.',
  },
  // Data & Sync
  {
    category: 'Data & Sync',
    question: 'How is my data synced across devices?',
    answer: 'When signed in, your data syncs automatically to our secure cloud. Any changes you make are reflected across all your signed-in devices within seconds.',
  },
  {
    category: 'Data & Sync',
    question: 'Can I export my data?',
    answer: 'Yes! Go to Settings > Account > Export Data to download all your projects, voice notes, and transcriptions. Exports are available in JSON format for easy import into other tools.',
  },
  {
    category: 'Data & Sync',
    question: 'What happens if I lose internet connection?',
    answer: 'The app works offline. Recordings are saved locally and will automatically sync when you reconnect. A sync indicator shows when there are pending uploads.',
  },
  // Account
  {
    category: 'Account',
    question: 'How do I reset my password?',
    answer: 'Go to the Sign In page and tap "Forgot Password". Enter your email address and we\'ll send you a password reset link. The link expires after 24 hours.',
  },
  {
    category: 'Account',
    question: 'Can I delete my account?',
    answer: 'Yes. Go to Settings > Account > Delete Account. This action is permanent and will delete all your projects, recordings, and data. We recommend exporting your data first.',
  },
  {
    category: 'Account',
    question: 'Is there a free tier?',
    answer: 'Yes! The free tier includes unlimited projects, up to 50 voice notes per month, and basic AI features. Upgrade to Pro for unlimited notes and advanced AI features.',
  },
];

const categories = [
  { name: 'Getting Started', icon: FolderOpen },
  { name: 'Recording', icon: Mic },
  { name: 'AI Features', icon: Brain },
  { name: 'Data & Sync', icon: Cloud },
  { name: 'Account', icon: Shield },
];

const HelpFAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

  const toggleQuestion = (question: string) => {
    setExpandedQuestions((prev) => {
      const next = new Set(prev);
      if (next.has(question)) {
        next.delete(question);
      } else {
        next.add(question);
      }
      return next;
    });
  };

  const filteredFAQs = faqData.filter((item) => {
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === null || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedFAQs = filteredFAQs.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  return (
    <AppLayout title="Help & FAQ" showBack showSettings={false}>
      <div className="space-y-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for help..."
            className="pl-10"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="shrink-0"
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat.name}
              variant={selectedCategory === cat.name ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat.name)}
              className="shrink-0 gap-1.5"
            >
              <cat.icon className="w-4 h-4" />
              {cat.name}
            </Button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-6">
          {Object.entries(groupedFAQs).map(([category, items]) => (
            <section key={category}>
              <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1 flex items-center gap-2">
                {categories.find(c => c.name === category)?.icon && (
                  (() => {
                    const Icon = categories.find(c => c.name === category)!.icon;
                    return <Icon className="w-4 h-4" />;
                  })()
                )}
                {category}
              </h2>
              <Card className="overflow-hidden divide-y divide-border">
                {items.map((item) => (
                  <div key={item.question} className="overflow-hidden">
                    <button
                      onClick={() => toggleQuestion(item.question)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium">{item.question}</span>
                      <ChevronDown 
                        className={cn(
                          'w-5 h-5 text-muted-foreground shrink-0 transition-transform',
                          expandedQuestions.has(item.question) && 'rotate-180'
                        )}
                      />
                    </button>
                    <AnimatePresence>
                      {expandedQuestions.has(item.question) && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="px-4 pb-4 text-muted-foreground">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </Card>
            </section>
          ))}
        </div>

        {filteredFAQs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
            <p className="text-sm text-muted-foreground mt-1">Try different keywords or browse categories</p>
          </div>
        )}

        {/* Contact Support */}
        <section>
          <h2 className="text-sm font-medium text-muted-foreground mb-3 px-1">Still Need Help?</h2>
          <Card className="overflow-hidden divide-y divide-border">
            <button
              onClick={() => window.open('mailto:support@nona.app', '_blank')}
              className="w-full p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Email Support</p>
                <p className="text-sm text-muted-foreground">support@nona.app</p>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground" />
            </button>
            <button
              onClick={() => window.open('https://discord.gg/nona', '_blank')}
              className="w-full p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-muted">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium">Community Discord</p>
                <p className="text-sm text-muted-foreground">Get help from the community</p>
              </div>
              <ExternalLink className="w-5 h-5 text-muted-foreground" />
            </button>
          </Card>
        </section>
      </div>
    </AppLayout>
  );
};

export default HelpFAQ;
