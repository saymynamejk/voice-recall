import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Palette, 
  Check, 
  Folder,
  Code,
  Smartphone,
  Globe,
  Gamepad2,
  Music,
  Camera,
  ShoppingBag,
  Briefcase,
  GraduationCap,
  Heart,
  Rocket,
  Lightbulb,
  BookOpen,
  Wrench,
  Zap
} from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

const PROJECT_COLORS = [
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#EF4444', // Red
  '#F97316', // Orange
  '#EAB308', // Yellow
  '#22C55E', // Green
  '#14B8A6', // Teal
  '#06B6D4', // Cyan
  '#3B82F6', // Blue
  '#6366F1', // Indigo
  '#A855F7', // Violet
  '#F43F5E', // Rose
];

const PROJECT_ICONS = [
  { name: 'folder', icon: Folder, label: 'Default' },
  { name: 'code', icon: Code, label: 'Code' },
  { name: 'smartphone', icon: Smartphone, label: 'Mobile' },
  { name: 'globe', icon: Globe, label: 'Web' },
  { name: 'gamepad', icon: Gamepad2, label: 'Game' },
  { name: 'music', icon: Music, label: 'Music' },
  { name: 'camera', icon: Camera, label: 'Photo' },
  { name: 'shopping', icon: ShoppingBag, label: 'Commerce' },
  { name: 'briefcase', icon: Briefcase, label: 'Business' },
  { name: 'graduation', icon: GraduationCap, label: 'Education' },
  { name: 'heart', icon: Heart, label: 'Health' },
  { name: 'rocket', icon: Rocket, label: 'Startup' },
  { name: 'lightbulb', icon: Lightbulb, label: 'Idea' },
  { name: 'book', icon: BookOpen, label: 'Content' },
  { name: 'wrench', icon: Wrench, label: 'Tools' },
  { name: 'zap', icon: Zap, label: 'Fast' },
];

const PROJECT_TYPES = [
  { value: 'personal', label: 'Personal', description: 'A solo project' },
  { value: 'work', label: 'Work', description: 'Professional project' },
  { value: 'side', label: 'Side Project', description: 'Hobby or experiment' },
  { value: 'client', label: 'Client', description: 'For a client' },
];

const NewProject = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PROJECT_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState('folder');
  const [projectType, setProjectType] = useState('personal');
  const [enableAI, setEnableAI] = useState(true);
  const [isPublic, setIsPublic] = useState(false);

  const SelectedIconComponent = PROJECT_ICONS.find(i => i.name === selectedIcon)?.icon || Folder;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a project name.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: 'Authentication required',
          description: 'Please sign in to create a project.',
          variant: 'destructive',
        });
        navigate('/auth');
        return;
      }

      const { error } = await supabase.from('projects').insert({
        name: name.trim(),
        description: description.trim() || null,
        color,
        user_id: user.id,
      });

      if (error) throw error;

      toast({
        title: 'Project created!',
        description: `${name} is ready for your voice notes.`,
      });

      navigate('/');
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error creating project',
        description: error.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout title="New Project" showBack showSettings={false} backTo="/">
      <form onSubmit={handleSubmit} className="space-y-6 max-w-lg mx-auto">
        {/* Preview */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center py-8"
        >
          <motion.div
            key={`${color}-${selectedIcon}`}
            initial={{ scale: 0.9, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-4 text-white shadow-lg"
            style={{ backgroundColor: color }}
          >
            <SelectedIconComponent className="w-12 h-12" />
          </motion.div>
          <h2 className="text-2xl font-bold">
            {name || 'Untitled Project'}
          </h2>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">{description}</p>
          )}
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-xs px-2 py-1 bg-muted rounded-full capitalize">{projectType}</span>
            {enableAI && <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">AI Enabled</span>}
          </div>
        </motion.div>

        {/* Basic Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                placeholder="My Awesome App"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="What is this project about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Project Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {PROJECT_TYPES.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setProjectType(type.value)}
                    className={cn(
                      'p-3 rounded-lg border text-left transition-all',
                      projectType === type.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground/50'
                    )}
                  >
                    <p className="font-medium text-sm">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-8 gap-2">
                {PROJECT_ICONS.map((iconItem) => {
                  const IconComp = iconItem.icon;
                  return (
                    <button
                      key={iconItem.name}
                      type="button"
                      onClick={() => setSelectedIcon(iconItem.name)}
                      className={cn(
                        'w-10 h-10 rounded-lg flex items-center justify-center transition-all',
                        selectedIcon === iconItem.name
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted hover:bg-muted/80'
                      )}
                      title={iconItem.label}
                    >
                      <IconComp className="w-5 h-5" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex flex-wrap gap-2">
                {PROJECT_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    className={cn(
                      'w-8 h-8 rounded-full transition-all',
                      color === c && 'ring-2 ring-offset-2 ring-offset-background ring-primary'
                    )}
                    style={{ backgroundColor: c }}
                  >
                    {color === c && (
                      <Check className="w-4 h-4 text-white mx-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">AI Features</p>
                <p className="text-xs text-muted-foreground">
                  Auto-transcription, smart titles, and more
                </p>
              </div>
              <Switch
                checked={enableAI}
                onCheckedChange={setEnableAI}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Public Project</p>
                <p className="text-xs text-muted-foreground">
                  Allow others to view this project
                </p>
              </div>
              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            className="flex-1" 
            disabled={loading || !name.trim()}
          >
            {loading ? 'Creating...' : 'Create Project'}
          </Button>
        </div>
      </form>
    </AppLayout>
  );
};

export default NewProject;
