// =============================================================================
// A36 Earn — App Providers
// Privy removed. Auth is handled by NextAuth SessionProvider.
// Solana RPC is configured via wagmi/viem in Phase 2b.
// =============================================================================
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';

import { ExternalLinkDialogProvider } from '@/components/shared/ExternalLinkDialogProvider';

export default function Providers({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <ExternalLinkDialogProvider>
          {children}
        </ExternalLinkDialogProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
