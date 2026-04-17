import { useLoginWithOAuth } from '@/lib/privy-react';
import { useSetAtom } from 'jotai';
import Link from 'next/link';
import { useRouter } from 'next/router';
import posthog from '@/lib/posthog';
import { type Dispatch, type SetStateAction, useState } from 'react';

import MdOutlineEmail from '@/components/icons/MdOutlineEmail';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-tooltip';
import { TERMS_OF_USE } from '@/constants/TERMS_OF_USE';
import { useBreakpoint } from '@/hooks/use-breakpoint';
import { GoogleIcon } from '@/svg/google';

import { loginEventAtom } from '../atoms';
import { handleUserCreation } from '../utils/handleUserCreation';
import { EmailSignIn } from './EmailSignIn';

interface SigninProps {
  loginStep: number;
  setLoginStep: Dispatch<SetStateAction<number>>;
  redirectTo?: string;
  onSuccess?: () => void;
}

export const SignIn = ({
  loginStep,
  setLoginStep,
  redirectTo,
  onSuccess,
}: SigninProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isMD = useBreakpoint('md');
  const setLoginEvent = useSetAtom(loginEventAtom);

  const { initOAuth } = useLoginWithOAuth({
    onComplete: async ({ user, wasAlreadyAuthenticated }) => {
      onSuccess?.();
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

  const handleGmailSignIn = async () => {
    posthog.capture('google_auth');
    setIsLoading(true);
    await initOAuth();
  };

  return (
    <div>
      <div className="px-6">
        <div>
          <div
            className={`transform transition-all duration-200 ${
              loginStep === 0
                ? 'translate-y-0 opacity-100'
                : 'translate-y-5 opacity-0'
            }`}
          >
            {loginStep === 0 && (
              <div className="flex flex-col items-center justify-center gap-2 text-center text-slate-500">
                <Button
                  className="ph-no-capture h-12 w-full bg-[#22362B] font-semibold text-white hover:bg-[#1A2920]"
                  size="lg"
                  onClick={handleGmailSignIn}
                  disabled={isLoading}
                >
                  <GoogleIcon />
                  {isLoading ? (
                    <span>Logging in...</span>
                  ) : (
                    <span>Log In with Google</span>
                  )}
                </Button>

                <div className="my-3 flex w-full items-center gap-4">
                  <div className="h-px flex-1 bg-slate-300" />
                  <span className="text-sm text-slate-400">OR</span>
                  <div className="h-px flex-1 bg-slate-300" />
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  className="h-12 w-full border-[#D9D1C5] bg-[#FBF7F0] font-medium text-[#111111] hover:bg-[#F6F1E8] active:bg-[#F6F1E8]"
                  onClick={() => setLoginStep(1)}
                >
                  <MdOutlineEmail className="mr-2" />
                  <span>Log In with Email</span>
                </Button>
              </div>
            )}
          </div>

          <div
            className={`transform transition-all duration-200 ${
              loginStep === 1
                ? 'translate-y-0 opacity-100'
                : 'translate-y-5 opacity-0'
            }`}
          >
            {loginStep === 1 && (
              <EmailSignIn redirectTo={redirectTo} onSuccess={onSuccess} />
            )}
          </div>
        </div>

        <p className="mt-4 mb-2 text-center text-xs text-slate-500">
          By using this website, you agree to our{' '}
          <Link
            href={TERMS_OF_USE}
            className="font-semibold hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Use
          </Link>{' '}
          and our{' '}
          <Link
            href={`https://a36labs.com/earn/privacy-policy.pdf`}
            className="font-semibold hover:underline"
            target="_blank"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <div className="rounded-b-md bg-slate-100 py-[7px]">
        <p className="text-center text-xs text-slate-400">
          Need help? Reach out to us at{' '}
          {isMD ? (
            <CopyButton
              text="support@a36labs.com"
              contentProps={{
                className: 'px-1.5 py-0.5 text-[0.6875rem]',
              }}
            >
              <p className="underline hover:text-slate-500">
                support@a36labs.com
              </p>
            </CopyButton>
          ) : (
            <a
              href="mailto:support@a36labs.com"
              className="underline hover:text-slate-500"
              target="_blank"
            >
              support@a36labs.com
            </a>
          )}
        </p>
      </div>
    </div>
  );
};
