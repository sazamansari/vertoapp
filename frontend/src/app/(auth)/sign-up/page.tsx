import { redirect } from 'next/navigation';

import { SignUpCard } from '@/features/auth/components/sign-up-card';
import { getCurrent } from '@/features/auth/queries';

const SignUpPage = async ({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) => {
  const resolvedSearchParams = await searchParams;
  const user = await getCurrent();

  if (user) redirect(resolvedSearchParams.callbackUrl || '/');

  return <SignUpCard />;
};

export default SignUpPage;
