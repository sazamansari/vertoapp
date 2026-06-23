'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeft,
  CopyIcon,
  ImageIcon,
  QrCode,
  ShieldAlert,
  Sparkles,
  Users,
  FolderKanban,
  CheckCircle2,
  CalendarDays,
  Activity,
  Trash2,
  UploadCloud,
  Check
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useDeleteWorkspace } from '@/features/workspaces/api/use-delete-workspace';
import { useResetInviteCode } from '@/features/workspaces/api/use-reset-invite-code';
import { useUpdateWorkspace } from '@/features/workspaces/api/use-update-workspace';
import { updateWorkspaceSchema } from '@/features/workspaces/schema';
import type { Workspace } from '@/features/workspaces/types';
import { useConfirm } from '@/hooks/use-confirm';
import { cn } from '@/lib/utils';
import { StatCard } from '@/components/ui/stat-card';

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
  analytics?: any;
  membersCount?: number;
  projectsCount?: number;
  tasks?: any[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export const EditWorkspaceForm = ({ onCancel, initialValues, analytics, membersCount = 0, projectsCount = 0, tasks = [] }: EditWorkspaceFormProps) => {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCopied, setIsCopied] = useState(false);

  const [DeleteDialog, confirmDelete] = useConfirm('Delete workspace', 'This action is irreversible and will remove all associated data forever.', 'destructive');
  const [ResetDialog, confirmReset] = useConfirm(
    'Reset invite link',
    'This action will invalidate the current invite link.',
    'destructive',
  );

  const { mutate: updateWorkspace, isPending: isUpdatingWorkspace } = useUpdateWorkspace();
  const { mutate: deleteWorkspace, isPending: isDeletingWorkspace } = useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } = useResetInviteCode();

  const updateWorkspaceForm = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? '',
    },
  });

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : '',
    };

    updateWorkspace({
      form: finalValues,
      param: { workspaceId: initialValues.$id },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB
    const file = e.target.files?.[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) return toast.error('Image size cannot exceed 1 MB.');
      updateWorkspaceForm.setValue('image', file);
    }
  };

  const handleDelete = async () => {
    const ok = await confirmDelete();
    if (!ok) return;

    deleteWorkspace(
      { param: { workspaceId: initialValues.$id } },
      { onSuccess: () => { window.location.href = '/'; } }
    );
  };

  const handleResetInviteCode = async () => {
    const ok = await confirmReset();
    if (!ok) return;

    resetInviteCode({ param: { workspaceId: initialValues.$id } });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fullInviteLink).then(() => {
      setIsCopied(true);
      toast.success('Invite link copied to clipboard.');
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const fullInviteLink = `${process.env.NEXT_PUBLIC_APP_BASE_URL}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;
  const isPending = isUpdatingWorkspace || isDeletingWorkspace || isResettingInviteCode;

  // Calculate some dummy completion rate if analytics not perfectly shaped
  const completionRate = analytics?.taskCompletionRate || (tasks.length > 0 ? Math.round((tasks.filter(t => t.status === 'DONE').length / tasks.length) * 100) : 0);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-y-8 pb-10"
    >
      <DeleteDialog />
      <ResetDialog />

      {/* HEADER SECTION */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 p-8 shadow-sm">
        <div className="absolute top-0 right-0 p-32 bg-blue-500/10 dark:bg-indigo-500/10 rounded-full blur-[100px] -z-10" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Avatar className="size-20 border-2 border-white dark:border-neutral-800 shadow-md">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl font-bold">
                {initialValues.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {initialValues.name}
                </h1>
                <span className="px-2.5 py-1 text-xs font-semibold bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-full">
                  Admin
                </span>
              </div>
              <p className="text-muted-foreground flex items-center gap-2">
                Manage workspace configuration, branding, AI settings and security.
              </p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="outline"
              onClick={onCancel ? onCancel : () => router.push(`/workspaces/${initialValues.$id}`)}
              className="gap-x-2 rounded-xl h-12 px-6 bg-white dark:bg-neutral-900 shadow-sm"
            >
              <ArrowLeft className="size-4" />
              Return to Workspace
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="xl:col-span-7 flex flex-col gap-8">
          
          {/* PROFILE & BRANDING */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-2xl border-neutral-200/50 dark:border-neutral-800/50 shadow-sm overflow-hidden bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold tracking-tight">Workspace Profile</h2>
                  <p className="text-sm text-muted-foreground">Update your workspace details and branding.</p>
                </div>

                <Form {...updateWorkspaceForm}>
                  <form onSubmit={updateWorkspaceForm.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                      disabled={isPending}
                      control={updateWorkspaceForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-700 dark:text-neutral-300">Workspace Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-950/50 border-neutral-200 dark:border-neutral-800 focus-visible:ring-indigo-500 transition-all duration-200" 
                              placeholder="Enter workspace name" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      disabled={isPending}
                      control={updateWorkspaceForm.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-neutral-700 dark:text-neutral-300">Workspace Logo</FormLabel>
                          <div className="mt-2">
                            <div 
                              onClick={() => inputRef.current?.click()}
                              className={cn(
                                "relative group cursor-pointer flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-300",
                                field.value 
                                  ? "border-indigo-500/50 bg-indigo-50/50 dark:bg-indigo-500/10" 
                                  : "border-neutral-300 dark:border-neutral-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                              )}
                            >
                              <input
                                type="file"
                                className="hidden"
                                onChange={handleImageChange}
                                accept=".jpg, .png, .jpeg"
                                ref={inputRef}
                                disabled={isPending}
                              />
                              
                              {field.value ? (
                                <div className="flex flex-col items-center gap-4">
                                  <div className="relative size-24 overflow-hidden rounded-xl shadow-md border-2 border-white dark:border-neutral-800">
                                    <Image
                                      src={field.value instanceof File ? URL.createObjectURL(field.value) : field.value}
                                      alt="Workspace Logo"
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      type="button"
                                      disabled={isPending}
                                      variant="outline"
                                      size="sm"
                                      className="rounded-lg h-9"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        inputRef.current?.click();
                                      }}
                                    >
                                      Replace
                                    </Button>
                                    <Button
                                      type="button"
                                      disabled={isPending}
                                      variant="destructive"
                                      size="sm"
                                      className="rounded-lg h-9"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        field.onChange('');
                                        if (inputRef.current) inputRef.current.value = '';
                                      }}
                                    >
                                      Remove
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center text-center gap-3">
                                  <div className="p-4 bg-white dark:bg-neutral-800 rounded-full shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    <UploadCloud className="size-6 text-indigo-500" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-neutral-900 dark:text-neutral-100">Click to upload or drag and drop</p>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">SVG, PNG, JPG or GIF (max. 1MB)</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="pt-4 flex items-center justify-end">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button 
                          disabled={isPending} 
                          type="submit" 
                          size="lg"
                          className="h-12 rounded-xl px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/20"
                        >
                          Save Changes
                        </Button>
                      </motion.div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI SETTINGS */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-2xl border-neutral-200/50 dark:border-neutral-800/50 shadow-sm overflow-hidden bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 backdrop-blur-md">
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/20">
                      <Sparkles className="size-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold tracking-tight">Vetro AI Flow</h2>
                      <p className="text-sm text-muted-foreground mt-1">Advanced predictive insights and workload optimization.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold border border-emerald-200 dark:border-emerald-500/30">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    Online
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  {[
                    "AI Assistant Active",
                    "Task Prediction Enabled",
                    "Risk Analysis Running",
                    "Sprint Forecasting Active"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <CheckCircle2 className="size-5 text-indigo-500" />
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="xl:col-span-5 flex flex-col gap-8">
          
          {/* INVITE MEMBERS */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-2xl border-neutral-200/50 dark:border-neutral-800/50 shadow-sm overflow-hidden bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md">
              <CardContent className="p-8">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold tracking-tight">Invite Members</h3>
                  <p className="text-sm text-muted-foreground mt-1">Share this link to invite others to the workspace.</p>
                </div>

                <div className="flex flex-col gap-6">
                  <div className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col items-center justify-center gap-4 bg-neutral-50/50 dark:bg-neutral-950/50">
                    <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-100 dark:border-neutral-800">
                      <QrCode className="size-16 text-neutral-800 dark:text-neutral-200" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Scan to join</p>
                      <p className="text-xs text-muted-foreground mt-1">Or use the link below</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-x-2">
                    <Input 
                      value={fullInviteLink} 
                      readOnly 
                      className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-950/50 font-mono text-sm cursor-text" 
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button onClick={handleCopy} variant="secondary" className="h-12 w-12 rounded-xl shadow-sm">
                        <AnimatePresence mode="wait">
                          {isCopied ? (
                            <motion.div
                              key="check"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                            >
                              <Check className="size-5 text-emerald-500" />
                            </motion.div>
                          ) : (
                            <motion.div
                              key="copy"
                              initial={{ opacity: 0, scale: 0.5 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.5 }}
                            >
                              <CopyIcon className="size-5 text-neutral-600 dark:text-neutral-400" />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </Button>
                    </motion.div>
                  </div>

                  <Button
                    variant="outline"
                    type="button"
                    disabled={isPending}
                    onClick={handleResetInviteCode}
                    className="w-full h-11 rounded-xl text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border-dashed"
                  >
                    Generate New Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* STATISTICS */}
          <motion.div variants={itemVariants}>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md rounded-2xl p-5 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 text-muted-foreground mb-3">
                  <Users className="size-4" />
                  <span className="text-sm font-medium">Members</span>
                </div>
                <div className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {membersCount}
                </div>
              </div>
              <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md rounded-2xl p-5 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 text-muted-foreground mb-3">
                  <FolderKanban className="size-4" />
                  <span className="text-sm font-medium">Projects</span>
                </div>
                <div className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {projectsCount}
                </div>
              </div>
              <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md rounded-2xl p-5 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 text-muted-foreground mb-3">
                  <CheckCircle2 className="size-4" />
                  <span className="text-sm font-medium">Tasks</span>
                </div>
                <div className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {tasks.length}
                </div>
              </div>
              <div className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md rounded-2xl p-5 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 duration-300">
                <div className="flex items-center gap-3 text-muted-foreground mb-3">
                  <Activity className="size-4" />
                  <span className="text-sm font-medium">Completion</span>
                </div>
                <div className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                  {completionRate}%
                </div>
              </div>
            </div>
          </motion.div>

          {/* DANGER ZONE */}
          <motion.div variants={itemVariants}>
            <Card className="rounded-2xl border-red-200 dark:border-red-900/50 shadow-sm overflow-hidden bg-red-50/30 dark:bg-red-950/10">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl text-red-600 dark:text-red-400">
                    <ShieldAlert className="size-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold tracking-tight text-red-900 dark:text-red-400">Danger Zone</h3>
                    <p className="text-sm text-red-700/80 dark:text-red-400/80 mt-1 mb-6">
                      Deleting a workspace is irreversible. All projects, tasks, and data will be permanently removed.
                    </p>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="destructive"
                        type="button"
                        disabled={isPending}
                        onClick={handleDelete}
                        className="h-11 rounded-xl w-full bg-red-600 hover:bg-red-700 text-white border-none shadow-md shadow-red-600/20"
                      >
                        <Trash2 className="size-4 mr-2" />
                        Delete Workspace
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};
