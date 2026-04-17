import { useLoginWithOAuth } from '@/lib/privy-react';
import { useAtomValue, useSetAtom } from 'jotai';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import { Dialog, DialogContent } from '@/components/ui/dialog';

import { popupTimeoutAtom } from '@/features/conversion-popups/atoms';

import { loginEventAtom } from '../atoms';
import { handleUserCreation } from '../utils/handleUserCreation';
import { SignIn } from './SignIn';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  isSponsor?: boolean;
  redirectTo?: string;
  hideOverlay?: boolean;
  onOpen?: () => void;
}

export const Login = ({
  isOpen,
  onClose,
  redirectTo,
  hideOverlay,
}: Props) => {
  const router = useRouter();
  const [loginStep, setLoginStep] = useState(0);
  const popupTimeout = useAtomValue(popupTimeoutAtom);
  const setLoginEvent = useSetAtom(loginEventAtom);

  useLoginWithOAuth({
    onComplete: async ({ user, wasAlreadyAuthenticated }) => {
      await handleUserCreation(user.google?.email || '');
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        const currentPath = router.asPath;
        const url = new URL(window.location.origin + currentPath);

        const privyParams = [
          'privy_oauth_state',
          'privy_oauth_provider',
          'privy_oauth_code',
        ];
        privyParams.forEach((param) => url.searchParams.delete(param));

        router.replace(url.toString());
      }
      if (!wasAlreadyAuthenticated) {
        setLoginEvent('fresh_login');
      }
    },
  });

  useEffect(() => {
    if (popupTimeout) {
      if (isOpen) {
        popupTimeout.pause();
      }
    }
  }, [isOpen]);

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open && popupTimeout) {
        popupTimeout.resume();
      }
      onClose();
    },
    [popupTimeout, onClose],
  );

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        className="z-200 w-[23rem] rounded-lg border border-[#D9D1C5] bg-[#FBF7F0] p-0 pt-2"
        classNames={{
          overlay: hideOverlay ? 'hidden' : '',
        }}
        hideCloseIcon
      >
        <div className="py-5">
          {loginStep === 1 && (
            <ArrowLeft
              className="absolute top-8 ml-5 h-5 w-5 cursor-pointer text-slate-500"
              onClick={() => setLoginStep(0)}
            />
          )}
          <div className="mb-3 flex justify-center">
            <svg
              viewBox="0 0 92 28"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="A36 Earn"
              role="img"
              fill="currentColor"
              className="h-8 w-auto text-[#18261F]"
            >
              <text
                x="0"
                y="22"
                fontFamily="Montserrat,sans-serif"
                fontSize="22"
                fontWeight="800"
                letterSpacing="-0.5"
              >
                A36
              </text>
              <circle cx="86" cy="19" r="4" fill="#F9B012" />
            </svg>
          </div>
          <p className="text-center text-lg font-semibold text-[#18261F]">
            Welcome back.
          </p>
          <p className="text-center text-sm text-[#5E5A54]">
            Log in to your A36 Earn account.
          </p>
        </div>
        <SignIn
          redirectTo={redirectTo}
          loginStep={loginStep}
          setLoginStep={setLoginStep}
          onSuccess={onClose}
        />
        <div className="pb-4 text-center text-sm text-[#5E5A54]">
          <Link href="/earn/signup" className="hover:text-[#18261F] hover:underline">
            New here? Create an account →
          </Link>
        </div>
      </DialogContent>
    </Dialog>
  );
};
