'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLogin } from '@/features/auth/api/use-login';
import { signInFormSchema } from '@/features/auth/schema';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { delay, duration: 0.45, ease: 'easeOut' as const } },
});

export const SignInCard = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { mutate: login, isPending: isLoggingIn } = useLogin();

  const signInForm = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof signInFormSchema>) => {
    login(
      { json: values },
      {
        onSuccess: () => { signInForm.reset(); },
        onError: () => { signInForm.resetField('password'); },
      },
    );
  };

  const isPending = isLoggingIn || isRedirecting;

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp(0)}>
      <Card className="w-full max-w-[440px] shadow-sm border border-neutral-200/60 rounded-xl">
        <CardHeader className="p-8 pb-6">
          <motion.div variants={fadeUp(0.05)} initial="hidden" animate="show" className="mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-6">
              <Lock className="w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold mb-2">Welcome back to evolvian</CardTitle>
            <CardDescription className="text-sm text-neutral-500">
              Access your workspace, projects, tasks, AI insights, and team analytics.
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className="p-8 pt-0">
          <Form {...signInForm}>
            <form onSubmit={signInForm.handleSubmit(onSubmit)} className="space-y-6">
              <motion.div variants={fadeUp(0.1)} initial="hidden" animate="show">
                <FormField
                  disabled={isPending}
                  name="email"
                  control={signInForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-neutral-700">Email address</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" className="h-11 bg-neutral-50/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={fadeUp(0.18)} initial="hidden" animate="show">
                <FormField
                  disabled={isPending}
                  name="password"
                  control={signInForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-neutral-700">Password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" className="h-11 bg-neutral-50/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={fadeUp(0.26)} initial="hidden" animate="show">
                <Button
                  type="submit"
                  disabled={isPending}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base group"
                >
                  Log in to Evolvian AI Flow
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};
