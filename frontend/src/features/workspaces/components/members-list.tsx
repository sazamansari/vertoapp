'use client';

import { 
  ArrowLeft, MoreVertical, Search, Filter, SortDesc, Download, 
  UserPlus, Mail, Users, CheckCircle2, FolderKanban, Activity, 
  Sparkles, ShieldAlert, Zap, BarChart3, X
} from 'lucide-react';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useDeleteMember } from '@/features/members/api/use-delete-member';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useUpdateMember } from '@/features/members/api/use-update-member';
import { MemberRole } from '@/features/members/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useConfirm } from '@/hooks/use-confirm';
import { cn } from '@/lib/utils';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm('Remove member', 'This member will be permanently removed from the workspace.', 'destructive');

  const { data: workspace } = useGetWorkspace({ workspaceId });
  const { data: members, isLoading } = useGetMembers({ workspaceId });
  const { mutate: deleteMember, isPending: isDeletingMember } = useDeleteMember();
  const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;
    deleteMember(
      { param: { memberId } },
      { onSuccess: () => window.location.reload() }
    );
  };

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({ json: { role }, param: { memberId } });
  };

  const handleExport = () => {
    if (filteredMembers.length === 0) {
      toast.error('No members to export.');
      return;
    }
    
    const headers = ['Name', 'Email', 'Role', 'Status'];
    const csvRows = filteredMembers.map((member: any) => {
      const status = getStatus(member.$id);
      return [
        `"${member.name.replace(/"/g, '""')}"`,
        `"${member.email.replace(/"/g, '""')}"`,
        `"${member.role}"`,
        `"${status.label}"`
      ];
    });

    const csvContent = [headers.join(','), ...csvRows.map((row: string[]) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${workspace?.name || 'workspace'}_members.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Member directory exported successfully.');
  };

  const handleInviteMember = () => {
    if (!workspace?.inviteCode) {
      toast.error('Workspace invite details are loading or unavailable.');
      return;
    }
    const inviteLink = `${window.location.origin}/workspaces/${workspaceId}/join/${workspace.inviteCode}`;
    
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(inviteLink).then(() => {
        toast.success('Workspace invite link copied to clipboard.');
      }).catch(() => {
        toast.error('Failed to copy invite link to clipboard.');
      });
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = inviteLink;
      textArea.style.position = "absolute";
      textArea.style.left = "-999999px";
      document.body.prepend(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        toast.success('Workspace invite link copied to clipboard.');
      } catch (error) {
        toast.error('Failed to copy invite link to clipboard.');
      } finally {
        textArea.remove();
      }
    }
  };

  const isPending = isDeletingMember || isUpdatingMember || (members?.documents?.length === 1);

  // Client-side filtering & sorting
  const filteredMembers = useMemo(() => {
    if (!members?.documents) return [];
    return members.documents.filter((m: any) => {
      const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === 'ALL' || m.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [members, search, roleFilter]);

  const adminsCount = members?.documents?.filter((m: any) => m.role === MemberRole.ADMIN).length || 0;

  // Mock status distribution for UI demonstration
  const getStatus = (id: string) => {
    const hash = id.charCodeAt(id.length - 1);
    if (hash % 3 === 0) return { label: 'Away', color: 'bg-amber-500', text: 'text-amber-500' };
    if (hash % 5 === 0) return { label: 'Offline', color: 'bg-neutral-500', text: 'text-neutral-500' };
    return { label: 'Online', color: 'bg-emerald-500', text: 'text-emerald-500' };
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-transparent';
      case 'MANAGER': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'VIEWER': return 'bg-slate-100 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200 dark:border-slate-700';
      default: return 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700';
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-y-8 pb-10 w-full"
    >
      <ConfirmDialog />

      {/* HEADER SECTION */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-xl border border-neutral-200/50 dark:border-neutral-800/50 p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute top-0 right-1/4 p-32 bg-indigo-500/10 dark:bg-purple-500/10 rounded-full blur-[100px] -z-10" />
        
        <div className="flex items-center gap-6">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20 text-white">
            <Users className="size-8" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Team Members
              </h1>
            </div>
            <p className="text-muted-foreground">
              Manage workspace members, roles, permissions and collaboration for <span className="font-semibold text-neutral-800 dark:text-neutral-200">{workspace?.name || 'this workspace'}</span>.
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={handleExport} variant="outline" className="h-11 rounded-xl px-5 border-neutral-200 dark:border-neutral-800 shadow-sm bg-white dark:bg-neutral-950">
              <Download className="size-4 mr-2" />
              Export
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button onClick={handleInviteMember} className="h-11 rounded-xl px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-indigo-500/20">
              <UserPlus className="size-4 mr-2" />
              Invite Member
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* SUMMARY CARDS */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Members", value: members?.documents?.length || 0, icon: Users, color: "text-blue-500" },
          { title: "Admins", value: adminsCount, icon: ShieldAlert, color: "text-purple-500" },
          { title: "Active This Week", value: Math.max(1, (members?.documents?.length || 0) - 1), icon: Activity, color: "text-emerald-500" },
          { title: "Projects Assigned", value: (members?.documents?.length || 0) * 3, icon: FolderKanban, color: "text-indigo-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md rounded-2xl p-6 border border-neutral-200/50 dark:border-neutral-800/50 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 duration-300 group">
            <div className="flex justify-between items-start mb-4">
              <span className="text-sm font-medium text-muted-foreground group-hover:text-neutral-900 dark:group-hover:text-white transition-colors">{stat.title}</span>
              <stat.icon className={cn("size-5", stat.color)} />
            </div>
            <div className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {stat.value}
            </div>
          </div>
        ))}
      </motion.div>

      {/* MAIN 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* LEFT DIRECTORY */}
        <div className="xl:col-span-8 flex flex-col gap-6">
          
          {/* TOOLBAR */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..." 
                className="pl-9 h-11 rounded-xl bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border-neutral-200/50 dark:border-neutral-800/50"
              />
            </div>
            <div className="flex gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="h-11 rounded-xl px-4 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border-neutral-200/50 dark:border-neutral-800/50">
                    <Filter className="size-4 mr-2" />
                    {roleFilter === 'ALL' ? 'All Roles' : roleFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                  <DropdownMenuItem onClick={() => setRoleFilter('ALL')}>All Roles</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('ADMIN')}>Admin</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setRoleFilter('MEMBER')}>Member</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" className="h-11 rounded-xl px-4 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border-neutral-200/50 dark:border-neutral-800/50">
                <SortDesc className="size-4 mr-2" />
                Sort
              </Button>
            </div>
          </motion.div>

          {/* MEMBER CARDS */}
          {filteredMembers.length === 0 ? (
            <motion.div variants={itemVariants} className="flex flex-col items-center justify-center p-12 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl shadow-sm text-center">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-full mb-4">
                <Users className="size-8 text-indigo-500" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight">No team members found</h3>
              <p className="text-muted-foreground mt-1 text-sm max-w-sm">
                Invite teammates to collaborate on projects and tasks, or adjust your search filters.
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-4">
              <AnimatePresence>
                {filteredMembers.map((member: any) => {
                  const status = getStatus(member.$id);
                  return (
                    <motion.div 
                      layout
                      key={member.$id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border border-neutral-200/50 dark:border-neutral-800/50 hover:border-indigo-500/30 dark:hover:border-indigo-500/30 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <MemberAvatar name={member.name} role={member.role} className="size-12 border-2 border-white dark:border-neutral-800 shadow-sm" fallbackClassName="text-lg font-medium" />
                          <span className={cn("absolute bottom-0 right-0 size-3 border-2 border-white dark:border-neutral-900 rounded-full", status.color)} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">{member.name}</h4>
                            <span className={cn("px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border", getRoleBadge(member.role))}>
                              {member.role}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><Mail className="size-3" />{member.email}</span>
                            <span>•</span>
                            <span className={status.text}>{status.label}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-neutral-200 dark:border-neutral-800">
                        <div className="flex gap-4 text-xs text-neutral-500 dark:text-neutral-400">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold text-neutral-900 dark:text-neutral-200 text-sm">{(member.$id.charCodeAt(0) % 5) + 1}</span>
                            Projects
                          </div>
                          <div className="flex flex-col items-center">
                            <span className="font-semibold text-neutral-900 dark:text-neutral-200 text-sm">{(member.$id.charCodeAt(1) % 15) + 3}</span>
                            Tasks
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger disabled={isPending} asChild>
                            <Button className="h-9 w-9 rounded-xl ml-auto opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity" variant="secondary" size="icon">
                              <MoreVertical className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent side="bottom" align="end" className="w-56 rounded-xl p-1">
                            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground uppercase tracking-wider mb-1">Actions</DropdownMenuLabel>
                            
                            <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg">
                              <MemberAvatar name={member.name} role={member.role} className="size-4" /> View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg">
                              <FolderKanban className="size-4 text-neutral-500" /> Assign Project
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg">
                              <CheckCircle2 className="size-4 text-neutral-500" /> Assign Task
                            </DropdownMenuItem>
                            
                            <DropdownMenuSeparator />
                            
                            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground uppercase tracking-wider mb-1">Role & Access</DropdownMenuLabel>
                            
                            {member.role === MemberRole.ADMIN ? (
                              <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg" onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)} disabled={isPending}>
                                <Users className="size-4 text-neutral-500" /> Demote to Member
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg" onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)} disabled={isPending}>
                                <ShieldAlert className="size-4 text-neutral-500" /> Promote to Admin
                              </DropdownMenuItem>
                            )}
                            
                            <DropdownMenuSeparator />

                            <DropdownMenuItem className="gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 rounded-lg" onClick={() => handleDeleteMember(member.$id)} disabled={isPending}>
                              <X className="size-4" /> Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* RIGHT ANALYTICS PANEL */}
        <div className="xl:col-span-4 flex flex-col gap-6">
          <motion.div variants={itemVariants}>
            <Card className="rounded-2xl border-neutral-200/50 dark:border-neutral-800/50 shadow-sm overflow-hidden bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg shadow-sm">
                      <Sparkles className="size-4 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold tracking-tight text-neutral-900 dark:text-white">TaskOrbit</h3>
                      <p className="text-xs text-muted-foreground">Team Insights</p>
                    </div>
                  </div>
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-neutral-600 dark:text-neutral-400 font-medium">Collaboration Score</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">92%</span>
                    </div>
                    <div className="w-full bg-white dark:bg-neutral-900 rounded-full h-2 overflow-hidden shadow-inner">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-neutral-600 dark:text-neutral-400 font-medium">Resource Utilization</span>
                      <span className="font-semibold text-indigo-600 dark:text-indigo-400">78%</span>
                    </div>
                    <div className="w-full bg-white dark:bg-neutral-900 rounded-full h-2 overflow-hidden shadow-inner">
                      <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="rounded-2xl border-neutral-200/50 dark:border-neutral-800/50 shadow-sm bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-6">
                  <BarChart3 className="size-5 text-indigo-500" />
                  <h3 className="font-semibold tracking-tight">Team Performance</h3>
                </div>

                <div className="space-y-6">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tasks Completed</span>
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-bold">142</span>
                      <span className="text-sm font-medium text-emerald-500 mb-1">+12% this week</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Workload Distribution</span>
                    <div className="flex h-3 w-full rounded-full overflow-hidden gap-0.5">
                      <div className="bg-indigo-500 h-full w-[40%]" title="Engineering"></div>
                      <div className="bg-purple-500 h-full w-[30%]" title="Design"></div>
                      <div className="bg-pink-500 h-full w-[20%]" title="Product"></div>
                      <div className="bg-emerald-500 h-full w-[10%]" title="Marketing"></div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Eng</span>
                      <span>Design</span>
                      <span>Prod</span>
                      <span>Mktg</span>
                    </div>
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
