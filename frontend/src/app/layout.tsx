import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Suspense } from 'react';
import type { PropsWithChildren } from 'react';
import { QueryProvider } from '@/components/query-provider';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from '@/components/ui/sonner';
import { siteConfig } from '@/config';
import { cn } from '@/lib/utils';

import './globals.css';

const inter = localFont({
  src: './fonts/InterVariable.woff2',
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = siteConfig;

import { ThemeProvider } from '@/components/theme-provider';

const RootLayout = ({ children }: Readonly<PropsWithChildren>) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'min-h-screen antialiased')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'dummy_client_id_for_build'}>
            <QueryProvider>
              <Toaster theme="system" richColors closeButton />

              <Suspense fallback={null}>
                {children}
              </Suspense>
            </QueryProvider>
          </GoogleOAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
