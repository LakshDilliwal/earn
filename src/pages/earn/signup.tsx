import { usePrivy } from '@/lib/privy-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useUser } from '@/store/user';

import { SignIn } from '@/features/auth/components/SignIn';
import {
  acceptInvite,
  verifyInviteQuery,
} from '@/features/sponsor-dashboard/queries/accept-invite';
import { EarnAvatar } from '@/features/talent/components/EarnAvatar';

export default function SignupPage() {
  const [loginStep, setLoginStep] = useState(0);
  const router = useRouter();
  const { authenticated, logout, ready } = usePrivy();
  const [isNavigating, setIsNavigating] = useState(false);
  const { user, refetchUser } = useUser();

  const { invite } = router.query;
  const cleanToken =
    (Array.isArray(invite) ? invite[0] : invite)?.split('?')[0] || '';

  const {
    data: inviteDetails,
    error,
    isPending,
  } = useQuery(verifyInviteQuery(cleanToken));

  const acceptInviteMutation = useMutation({
    mutationFn: acceptInvite,
    onSuccess: async () => {
      toast.success("You've successfully joined the sponsor's dashboard.");
      await refetchUser();
      setIsNavigating(true);
      router.push('/earn/dashboard/listings');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleAcceptInvite = () => {
    acceptInviteMutation.mutate(cleanToken);
  };

  const isEmailMismatch =
    ready &&
    authenticated &&
    user?.email &&
    inviteDetails?.invitedEmail &&
    user.email.toLowerCase() !== inviteDetails.invitedEmail.toLowerCase();

  if (error) {
    return (
      <div className="container flex justify-center bg-[#F6F1E8]">
        <div className="mt-10 flex flex-col items-center gap-4">
          <h1 className="text-2xl font-bold">Invitation Error</h1>
          <p>{error instanceof Error ? error.message : 'An error occurred'}</p>
          <Button onClick={() => router.push('/earn')} variant="default">
            Go to Homepage
          </Button>
        </div>
      </div>
    );
  }

  if (!ready || isPending) {
    return (
      <div className="container mx-auto flex max-w-xl justify-center bg-[#F6F1E8]">
        <div className="mt-10 w-full rounded-lg border border-[#D9D1C5] bg-[#FBF7F0] px-20 pt-20 pb-40 shadow-lg">
          <div className="flex flex-col items-center">
            <p className="text-center text-2xl font-semibold text-[#18261F]">
              Join A36 Earn.
            </p>
            <p className="text-center text-lg text-[#5E5A54]">
              Access bounties, grants, and jobs from serious ecosystems.
            </p>
            <div className="mt-8 text-center text-slate-500">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto flex max-w-xl justify-center bg-[#F6F1E8]">
      <div className="mt-10 w-full rounded-lg border border-[#D9D1C5] bg-[#FBF7F0] px-20 pt-20 pb-40 shadow-lg">
        <div className="flex flex-col items-center">
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
          <p className="text-center text-2xl font-semibold text-[#18261F]">
            Join A36 Earn.
          </p>
          <p className="mb-6 text-center text-lg text-[#5E5A54]">
            Access bounties, grants, and jobs from serious ecosystems.
          </p>

          {inviteDetails?.sponsorLogo && inviteDetails?.sponsorName ? (
            <div>
              <EarnAvatar
                className="my-5 size-20 rounded-lg"
                avatar={inviteDetails.sponsorLogo}
                id={inviteDetails.sponsorName}
              />
            </div>
          ) : null}

          <p className="text-center text-xl font-medium text-slate-800">
            {inviteDetails?.senderName} has invited you to join{' '}
            <span className="font-bold">{inviteDetails?.sponsorName}</span>
          </p>

          <div>
            {!authenticated ? (
              <div className="mt-6 w-full">
                <p className="mb-4 text-center font-medium text-slate-500">
                  Please sign in to accept the invitation:
                </p>
                <SignIn loginStep={loginStep} setLoginStep={setLoginStep} />
              </div>
            ) : isEmailMismatch ? (
              <div className="mt-16 w-full max-w-md">
                <div className="mt-4">
                  <p className="text-center text-sm text-slate-500">
                    You&apos;re signed in as{' '}
                    <span className="font-medium">
                      {user?.email?.toLowerCase()}
                    </span>
                    . <br />
                    To accept, log out and sign in as{' '}
                    <span className="font-medium">
                      {inviteDetails?.invitedEmail?.toLowerCase()}
                    </span>
                    .
                  </p>
                </div>
                <div className="mt-4 text-center">
                  <Button
                    onClick={async () => {
                      try {
                        await logout();
                        router.push(`/earn/signup?invite=${cleanToken}`);
                      } catch (error) {
                        router.push(`/earn/signup?invite=${cleanToken}`);
                      }
                    }}
                    className="cursor-pointer text-sm text-white hover:underline"
                  >
                    Log out and continue as{' '}
                    {inviteDetails?.invitedEmail?.toLowerCase()}
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                className="mt-4 bg-[#22362B] text-white hover:bg-[#1A2920]"
                disabled={
                  !inviteDetails ||
                  acceptInviteMutation.isPending ||
                  isNavigating
                }
                onClick={handleAcceptInvite}
                size="lg"
              >
                Create Account
              </Button>
            )}
          </div>
          <div className="mt-6 text-sm text-[#5E5A54]">
            <Link href="/earn/signin" className="hover:text-[#18261F] hover:underline">
              Already have an account? Log in →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
