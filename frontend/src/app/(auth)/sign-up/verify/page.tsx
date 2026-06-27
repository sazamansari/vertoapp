import { Suspense } from 'react';
import { OTPVerificationCard } from '@/features/auth/components/otp-verification-card';

const VerifyPage = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-8">Loading...</div>}>
      <OTPVerificationCard />
    </Suspense>
  );
};

export default VerifyPage;
