import type { Metadata } from 'next';
import { TermsClient } from './terms-client';

export const metadata: Metadata = {
  title: 'Terms of Service | Verto',
  description: 'Read the terms and conditions for using Verto project management platform, tools, and workspaces.',
};

export default function TermsPage() {
  return <TermsClient />;
}
