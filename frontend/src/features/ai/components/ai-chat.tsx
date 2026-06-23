'use client';

import { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api-client';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { toast } from 'sonner';

export const AiChat = () => {
  const workspaceId = useWorkspaceId();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: "Hi, I'm Vetro AI. I can analyze team performance, generate sprint plans, detect project risks, assign tasks intelligently, and provide actionable insights."
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now().toString(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const userPrompt = input;
    setInput('');
    setIsTyping(true);

    try {
      const response = await apiClient.post('/api/ai/chat', {
        json: { message: userPrompt, workspaceId }
      });
      
      const assistantResponse = (response as any)?.content || "I'm sorry, I couldn't process that request.";
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: assistantResponse
        }
      ]);
    } catch (error) {
      toast.error('Failed to communicate with Vetro AI');
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: "Sorry, I had trouble reaching the AI service. Please make sure the AI service is running."
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <Card className="flex h-[600px] flex-col shadow-none">
      <CardHeader className="border-b bg-muted/30 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
            <Sparkles className="size-5" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">Vetro AI Assistant</CardTitle>
            <p className="text-sm text-muted-foreground">Ask me anything about your workspace</p>
          </div>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4">
        <div className="flex flex-col gap-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex max-w-[80%] gap-3 rounded-2xl p-4",
                  message.role === 'assistant' 
                    ? "mr-auto bg-muted/50" 
                    : "ml-auto bg-indigo-600 text-white"
                )}
              >
                {message.role === 'assistant' && (
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm dark:bg-neutral-800">
                    <Bot className="size-4" />
                  </div>
                )}
                <div className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</div>
                {message.role === 'user' && (
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/20 text-white">
                    <User className="size-4" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mr-auto flex max-w-[80%] gap-3 rounded-2xl bg-muted/50 p-4"
            >
              <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-indigo-600 shadow-sm dark:bg-neutral-800">
                <Bot className="size-4" />
              </div>
              <div className="flex items-center gap-1">
                <span className="size-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.3s]"></span>
                <span className="size-2 animate-bounce rounded-full bg-indigo-400 [animation-delay:-0.15s]"></span>
                <span className="size-2 animate-bounce rounded-full bg-indigo-400"></span>
              </div>
            </motion.div>
          )}
        </div>
      </ScrollArea>

      <CardFooter className="border-t p-4 pb-4">
        <form onSubmit={handleSend} className="flex w-full items-center gap-2">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Vetro AI to analyze workload, predict risks..."
            className="flex-1 rounded-full px-4"
            disabled={isTyping}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="shrink-0 rounded-full bg-indigo-600 hover:bg-indigo-700"
            disabled={!input.trim() || isTyping}
          >
            <Send className="size-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};
