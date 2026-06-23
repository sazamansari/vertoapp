import React from 'react';
import { motion } from 'framer-motion';
import { PlusIcon, FolderIcon } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PremiumCard } from '@/components/ui/premium-card';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useCreateProjectModal } from '@/features/projects/hooks/use-create-project-modal';
import type { Project } from '@/features/projects/types';
import { ProjectAvatar } from './project-avatar';

interface PremiumProjectListProps {
  data: Project[];
  total: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export const PremiumProjectList = ({ data, total }: PremiumProjectListProps) => {
  const workspaceId = useWorkspaceId();
  const { open: createProject } = useCreateProjectModal();

  return (
    <PremiumCard className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold tracking-tight">Active Projects</h3>
          <p className="text-sm text-muted-foreground">{total} total projects</p>
        </div>
        <Button onClick={createProject} variant="secondary" size="sm" className="h-8 gap-1 rounded-full px-3">
          <PlusIcon className="size-3.5" />
          <span>New Project</span>
        </Button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {data.map((project) => (
          <motion.div key={project.$id} variants={itemVariants}>
            <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
              <motion.div 
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group flex h-full flex-col justify-between rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-indigo-500/30"
              >
                <div className="flex items-start justify-between">
                  <ProjectAvatar 
                    name={project.name} 
                    image={project.imageUrl} 
                    className="size-10 shadow-sm transition-transform group-hover:scale-105" 
                    fallbackClassName="text-sm bg-gradient-to-br from-indigo-500 to-purple-500 text-white" 
                  />
                  <div className="flex size-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-neutral-800 dark:group-hover:bg-indigo-500/20 dark:group-hover:text-indigo-400 transition-colors">
                    <FolderIcon className="size-4" />
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="line-clamp-1 font-semibold group-hover:text-primary transition-colors">{project.name}</h4>
                  
                  {/* Mocked Progress Bar since we don't have project completion API yet */}
                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">75%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '75%' }}
                      transition={{ duration: 1, delay: 0.2, type: 'spring' as const }}
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                    />
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-muted-foreground">No projects found.</p>
          </div>
        )}
      </motion.div>
    </PremiumCard>
  );
};
