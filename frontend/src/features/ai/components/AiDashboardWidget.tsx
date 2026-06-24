'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export const AiDashboardWidget = ({ workspaceId, projectId }: { workspaceId: string, projectId: string }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      await apiClient.post('/api/ai/generate/tasks', {
        json: { workspaceId, projectId, prompt }
      });
      toast.success('Tasks generated successfully!');
      setPrompt('');
    } catch (error) {
      toast.error('AI generation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-none border-none">
      <CardHeader className="flex flex-row items-center gap-2 pb-2">
        <Sparkles className="size-5 text-blue-600" />
        <CardTitle>Evolvian AI Flow</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Generate tasks automatically using AI based on your project requirements.
        </p>
        <div className="flex gap-2">
          <Input 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Set up database schema..."
            disabled={isLoading}
          />
          <Button onClick={handleGenerate} disabled={isLoading || !prompt}>
            {isLoading ? <Loader2 className="animate-spin" /> : 'Generate'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
