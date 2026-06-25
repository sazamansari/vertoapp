import type { Metadata } from 'next';
import { TermsClient } from './terms-client';

export const metadata: Metadata = {
  title: 'Terms of Service | TaskOrbit',
  description: 'Read the terms and conditions for using TaskOrbit project management platform, tools, and workspaces.',
};

export default function TermsPage() {
  return <TermsClient />;
}
