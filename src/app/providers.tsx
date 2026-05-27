'use client';

import { PropsWithChildren } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { useStore } from '@/store';
import { ThemeProvider, ResponsiveProvider } from '@/contexts';

export default function Providers({ children }: PropsWithChildren) {
  const store = useStore();
  return (
    <ReduxProvider store={store}>
      <ThemeProvider>
        <ResponsiveProvider>
          {children}
        </ResponsiveProvider>
      </ThemeProvider>
    </ReduxProvider>
  );
}
