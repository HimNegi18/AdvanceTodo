'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import { AuthProvider } from '../context/AuthContext';

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryStreamedHydration>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ReactQueryStreamedHydration>
    </QueryClientProvider>
  );
}
