'use client';

import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

export default function Template({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // We use mode="sync" to allow shared element layout transitions across routes.
  // This means the old route and new route will exist in the DOM briefly.
  return (
    <AnimatePresence mode="sync">
      <div key={pathname} className="w-full h-full relative isolate">
        {children}
      </div>
    </AnimatePresence>
  );
}
