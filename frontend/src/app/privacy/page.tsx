import type { Metadata } from 'next';
import { PrivacyClient } from './privacy-client';

export const metadata: Metadata = {
  title: 'Privacy Policy | Verto',
  description: 'Learn how Verto flow manages, protects, and respects your workspaces, projects, and personal data.',
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
