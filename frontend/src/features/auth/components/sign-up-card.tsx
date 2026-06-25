'use client';

import Image from 'next/image';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { UserPlus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRegister } from '@/features/auth/api/use-register';
import { signUpFormSchema } from '@/features/auth/schema';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { delay, duration: 0.45, ease: 'easeOut' as const } },
});

export const SignUpCard = () => {
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { mutate: register, isPending: isRegistering } = useRegister();

  const signUpForm = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = (values: z.infer<typeof signUpFormSchema>) => {
    register(
      { json: values },
      {
        onSuccess: () => { signUpForm.reset(); },
        onError: () => { signUpForm.resetField('password'); },
      },
    );
  };

  const isPending = isRegistering || isRedirecting;

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp(0)}>
      <Card className="w-full max-w-[440px] shadow-sm border border-neutral-200/60 rounded-xl">
        <CardHeader className="p-8 pb-6">
          <motion.div variants={fadeUp(0.05)} initial="hidden" animate="show" className="mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-6">
              <Image src="/icon.svg" alt="TaskOrbit Icon" height={24} width={24} unoptimized />
            </div>
            <CardTitle className="text-2xl font-bold mb-2">Create your account</CardTitle>
            <CardDescription className="text-sm text-neutral-500">
              By signing up, you agree to our{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>{' '}
              and{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>.
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className="p-8 pt-0">
          <Form {...signUpForm}>
            <form onSubmit={signUpForm.handleSubmit(onSubmit)} className="space-y-5">
              <motion.div variants={fadeUp(0.08)} initial="hidden" animate="show">
                <FormField
                  disabled={isPending}
                  name="name"
                  control={signUpForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-neutral-700">Full name</FormLabel>
                      <FormControl>
                        <Input {...field} type="text" className="h-11 bg-neutral-50/50" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>

              <motion.div variants={fadeUp(0.14)} initial="hidden" animate="show">
                <FormField
                  disabled={isPending}
                  name="email"
                  control={signUpForm.control}
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

              <motion.div variants={fadeUp(0.20)} initial="hidden" animate="show">
                <FormField
                  disabled={isPending}
                  name="password"
                  control={signUpForm.control}
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

              <motion.div variants={fadeUp(0.28)} initial="hidden" animate="show">
                <Button
                  type="submit"
                  disabled={isPending}
                  size="lg"
                  className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base group"
                >
                  Create account
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
