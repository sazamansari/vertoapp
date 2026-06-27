'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useVerifyOtp } from '@/features/auth/api/use-verify-otp';
import { useResendOtp } from '@/features/auth/api/use-resend-otp';

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { delay, duration: 0.45, ease: 'easeOut' as const } },
});

export const OTPVerificationCard = () => {
  const [otp, setOtp] = useState('');
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const { mutate: verifyOtp, isPending: isVerifying } = useVerifyOtp();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || otp.length !== 6) return;

    verifyOtp({ json: { userId, otp } });
  };

  const handleResend = () => {
    if (!userId) return;
    resendOtp({ json: { userId } });
  };

  if (!userId) {
    return (
      <Card className="w-full max-w-[440px] shadow-sm border border-neutral-200/60 rounded-xl p-8 text-center">
        <p className="text-neutral-500">Invalid verification link. Please sign up or login again.</p>
      </Card>
    );
  }

  return (
    <motion.div initial="hidden" animate="show" variants={fadeUp(0)}>
      <Card className="w-full max-w-[440px] shadow-sm border border-neutral-200/60 rounded-xl">
        <CardHeader className="p-8 pb-6">
          <motion.div variants={fadeUp(0.05)} initial="hidden" animate="show" className="mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-6">
              <Mail className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-bold mb-2">Check your email</CardTitle>
            <CardDescription className="text-sm text-neutral-500">
              We've sent a 6-digit verification code to your email address. Please enter it below to verify your account.
            </CardDescription>
          </motion.div>
        </CardHeader>

        <CardContent className="p-8 pt-0">
          <form onSubmit={onSubmit} className="space-y-6">
            <motion.div variants={fadeUp(0.08)} initial="hidden" animate="show">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-neutral-700">Verification Code</label>
                <Input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="h-12 bg-neutral-50/50 text-center text-lg tracking-widest font-semibold"
                  disabled={isVerifying}
                  maxLength={6}
                />
              </div>
            </motion.div>

            <motion.div variants={fadeUp(0.14)} initial="hidden" animate="show">
              <Button
                type="submit"
                disabled={isVerifying || otp.length !== 6}
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 h-11 text-base group"
              >
                {isVerifying ? 'Verifying...' : 'Verify Email'}
                {!isVerifying && <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />}
              </Button>
            </motion.div>
          </form>

          <motion.div variants={fadeUp(0.20)} initial="hidden" animate="show" className="mt-6 text-center">
            <p className="text-sm text-neutral-500 mb-2">Didn't receive the code?</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResend}
              disabled={isResending || isVerifying}
              className="w-full"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isResending ? 'animate-spin' : ''}`} />
              Resend Code
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
