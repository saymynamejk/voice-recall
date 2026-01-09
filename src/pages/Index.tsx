import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Mic, FolderOpen, Search } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

// Demo data for now
const demoProjects = [
  {
    id: '1',
    name: 'nona App',
    description: 'Voice-first developer workspace',
    color: '#8B5CF6',
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: '1',
    isArchived: false,
  },
];

const Index = () => {
  const navigate = useNavigate();
  const [projects] = useState(demoProjects);

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

          {projects.length === 0 ? (
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
                  project={project}
                  stats={{ openBugsCount: 2, pendingFeaturesCount: 5, totalNotes: 12 }}
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
