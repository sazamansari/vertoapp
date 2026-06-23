import { redirect } from 'next/navigation';
import { getCurrent } from '@/features/auth/queries';

import { AiClient } from './client';

const AiPage = async () => {
  const user = await getCurrent();
  if (!user) redirect('/sign-in');

  return <AiClient />;
};

export default AiPage;
