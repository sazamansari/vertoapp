import type { Metadata } from 'next';

export const siteConfig: Metadata = {
  title: 'Verto',
  description: 'Full-stack Verto using Next.js 14 and Appwrite.',
  keywords: [
    'reactjs',
    'nextjs',
    'appwrite',
    'appwrite-io',
    'next-auth',
    'react-big-calendar',
    'lucide-icons',
    'react-icons',
    'react-day-picker',
    'shadcn-ui',
    'radix-ui',
    'tailwindcss',
    'lodash',
    'react-query',
    'nuqs',
    'sonner',

    'project management',
    'sprint planning',
    'kanban board',
    'agile tracking',
    'jira alternative',
    'team productivity',
    'collaboration tool',
    'software engineering dashboard',
    'nextjs project tracker'
  ],
  authors: [{ name: 'Vetro Team', url: 'https://github.com/sanidhyy' }],
  metadataBase: new URL('http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Vetro — Premium Project Management for Teams',
    description: 'Plan, track, and release great software faster with Vetro. Dynamic Kanban boards, team intelligence, and automated sprints.',
    url: 'http://localhost:3000',
    siteName: 'Vetro',
    images: [
      {
        url: '/icon.png',
        width: 512,
        height: 512,
        alt: 'Vetro Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vetro — Premium Project Management for Teams',
    description: 'AI-powered project management, sprints, and team intelligence.',
    images: ['/icon.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/icon.png',
  },
} as const;

export const links = {
  sourceCode: 'https://github.com/sanidhyy/jira-clone',
} as const;
