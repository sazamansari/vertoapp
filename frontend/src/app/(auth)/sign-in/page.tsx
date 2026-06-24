import { redirect } from 'next/navigation';

import { SignInCard } from '@/features/auth/components/sign-in-card';
import { getCurrent } from '@/features/auth/queries';

const SignInPage = async ({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) => {
  const resolvedSearchParams = await searchParams;
  const user = await getCurrent();

  if (user) redirect(resolvedSearchParams.callbackUrl || '/');

  return <SignInCard />;
};

export default SignInPage;
