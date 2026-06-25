import type { Metadata } from 'next';
import { PrivacyClient } from './privacy-client';

export const metadata: Metadata = {
  title: 'Privacy Policy | TaskOrbit',
  description: 'Learn how TaskOrbit flow manages, protects, and respects your workspaces, projects, and personal data.',
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
