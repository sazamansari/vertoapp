import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, TrendingUp, AlertTriangle, Zap, Activity, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAiHealth } from '@/features/ai/api/use-ai-health';
import { useGetAiInsights } from '@/features/ai/api/use-get-ai-insights';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { Skeleton } from '@/components/ui/skeleton';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 300, damping: 24 } }
};

export const PremiumAiWidget = () => {
  const workspaceId = useWorkspaceId();
  const { data: healthData, isLoading: isLoadingHealth, isError: isErrorHealth, refetch: refetchHealth } = useAiHealth();
  const { data: insightsData, isLoading: isLoadingInsights, isError: isErrorInsights, refetch: refetchInsights } = useGetAiInsights(workspaceId);

  const handleReconnect = () => {
    refetchHealth();
    refetchInsights();
  };

  const isOffline = isErrorHealth || isErrorInsights || healthData?.status === 'offline';
  const isLoading = isLoadingHealth || isLoadingInsights;
  const isOnline = !isOffline && !isLoading && healthData?.status === 'online' && insightsData?.success;

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-950">
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div key="loading" variants={containerVariants} initial="hidden" animate="show" exit="exit" className="flex h-full flex-col">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <BrainCircuit className="size-5 animate-pulse text-neutral-400" />
                  Connecting to Evolvian AI Flow...
                </h3>
                <p className="mt-1 text-sm text-muted-foreground animate-pulse">Initializing intelligent project analytics...</p>
              </div>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col space-y-3 rounded-lg border border-neutral-100 p-4 dark:border-neutral-800/50">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {isOffline && !isLoading && (
          <motion.div key="offline" variants={containerVariants} initial="hidden" animate="show" exit="exit" className="flex h-full flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-semibold tracking-tight text-red-600 dark:text-red-500 flex items-center gap-2">
                ⚠️ Evolvian AI Flow Offline
              </h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
                AI services are temporarily unavailable.
              </p>
            </div>

            <div className="mb-6 flex-1 rounded-lg border border-neutral-100 bg-neutral-50 p-4 dark:border-neutral-800/50 dark:bg-neutral-900/50">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">Unavailable Features:</p>
              <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
                <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />Risk Prediction</li>
                <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />Sprint Analytics</li>
                <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />Delivery Forecast</li>
                <li className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />Smart Task Suggestions</li>
              </ul>
            </div>

            <Button onClick={handleReconnect} variant="outline" className="w-full gap-2">
              <RefreshCcw className="size-4" />
              Retry Connection
            </Button>
          </motion.div>
        )}

        {isOnline && (
          <motion.div key="online" variants={containerVariants} initial="hidden" animate="show" exit="exit" className="flex h-full flex-col">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  ✨ Evolvian AI Flow
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">AI-powered team productivity and project intelligence</p>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500"></span>
                </span>
                Online
              </div>
            </div>

            <div className="grid flex-1 grid-cols-2 gap-4">
              <motion.div variants={itemVariants} className="flex flex-col justify-between rounded-lg border border-neutral-100 bg-neutral-50/50 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800/50 dark:bg-neutral-900/20 dark:hover:bg-neutral-900/50">
                <div className="flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  <TrendingUp className="size-4 text-emerald-500" />
                  <span>Velocity</span>
                </div>
                <div className="mt-3 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {insightsData?.insights.velocity}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col justify-between rounded-lg border border-neutral-100 bg-neutral-50/50 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800/50 dark:bg-neutral-900/20 dark:hover:bg-neutral-900/50">
                <div className="flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  <AlertTriangle className="size-4 text-amber-500" />
                  <span>Risk Score</span>
                </div>
                <div className="mt-3 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {insightsData?.insights.riskLevel}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col justify-between rounded-lg border border-neutral-100 bg-neutral-50/50 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800/50 dark:bg-neutral-900/20 dark:hover:bg-neutral-900/50">
                <div className="flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  <Zap className="size-4 text-blue-500" />
                  <span>Efficiency</span>
                </div>
                <div className="mt-3 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {insightsData?.insights.efficiency}
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col justify-between rounded-lg border border-neutral-100 bg-neutral-50/50 p-4 transition-colors hover:bg-neutral-50 dark:border-neutral-800/50 dark:bg-neutral-900/20 dark:hover:bg-neutral-900/50">
                <div className="flex items-center gap-2 text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  <Activity className="size-4 text-purple-500" />
                  <span>Delivery</span>
                </div>
                <div className="mt-3 text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                  {insightsData?.insights.deliveryForecast}
                </div>
              </motion.div>
            </div>
            
            <motion.div variants={itemVariants} className="mt-4 rounded-lg border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/5">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-indigo-700 dark:text-indigo-400">
                <span>Smart Recommendations</span>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Team velocity is stable. Consider breaking down larger tasks in the current sprint to reduce delivery risk.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
