import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Mic, FolderOpen, Search, Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/useProjects';
import { useVoiceNotes } from '@/hooks/useVoiceNotes';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: projects, isLoading: projectsLoading } = useProjects();
  const { data: allNotes } = useVoiceNotes();

  // Check auth status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth');
      }
    };
    checkAuth();
  }, [navigate]);

  // Calculate stats per project
  const getProjectStats = (projectId: string) => {
    const projectNotes = allNotes?.filter(n => n.project_id === projectId) || [];
    return {
      openBugsCount: projectNotes.filter(n => n.bucket_type === 'bugs' && n.status === 'open').length,
      pendingFeaturesCount: projectNotes.filter(n => n.bucket_type === 'features' && n.status === 'open').length,
      totalNotes: projectNotes.length,
    };
  };

  if (projectsLoading) {
    return (
      <AppLayout title="nona" subtitle="Voice-first developer workspace">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout 
      title="nona" 
      subtitle="Voice-first developer workspace"
      headerAction={
        <Button variant="ghost" size="icon" onClick={() => navigate('/search')}>
          <Search className="w-5 h-5" />
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Welcome section */}
        <section className="text-center py-8">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-4"
          >
            <Mic className="w-10 h-10 text-primary" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Welcome to nona</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Capture bugs, features, and ideas with your voice. No typing required.
          </p>
        </section>

        {/* Projects section */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Your Projects</h3>
            <Button size="sm" onClick={() => navigate('/projects/new')}>
              <Plus className="w-4 h-4 mr-1" />
              New Project
            </Button>
          </div>

          {!projects || projects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 border border-dashed rounded-lg"
            >
              <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-4">No projects yet</p>
              <Button onClick={() => navigate('/projects/new')}>
                <Plus className="w-4 h-4 mr-1" />
                Create your first project
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={{
                    id: project.id,
                    name: project.name,
                    description: project.description || '',
                    color: project.color,
                    createdAt: new Date(project.created_at),
                    updatedAt: new Date(project.updated_at),
                    userId: project.user_id,
                    isArchived: project.is_archived,
                  }}
                  stats={getProjectStats(project.id)}
                  onClick={() => navigate(`/projects/${project.id}`)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Quick record hint */}
        <section className="text-center py-6">
          <p className="text-sm text-muted-foreground">
            💡 Select a project and tap the mic to start recording
          </p>
        </section>
      </div>
    </AppLayout>
  );
};

export default Index;
