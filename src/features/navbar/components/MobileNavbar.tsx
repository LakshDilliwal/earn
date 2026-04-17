import { usePrivy } from '@/lib/privy-react';
import { Gift, Menu } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import posthog from '@/lib/posthog';

import { Button } from '@/components/ui/button';
import { useDisclosure } from '@/hooks/use-disclosure';
import { useCreditBalance } from '@/store/credit';
import { useUser } from '@/store/user';
import { cn } from '@/utils/cn';

import { CreditIcon } from '@/features/credits/icon/credit';

interface Props {
  onLoginOpen: () => void;
  onCreditOpen: () => void;
  onReferralOpen: () => void;
}

// const AnnouncementBar = dynamic(() =>
//   import('@/features/navbar').then((mod) => mod.AnnouncementBar),
// );

const MobileDrawer = dynamic(
  () => import('./MobileDrawer').then((mod) => mod.MobileDrawer),
  {
    ssr: false,
  },
);

export const MobileNavbar = ({
  onLoginOpen,
  onCreditOpen,
  onReferralOpen,
}: Props) => {
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();

  const { authenticated, ready } = usePrivy();

  const { user } = useUser();
  const { creditBalance } = useCreditBalance();

  const openCreditDrawer = () => {
    posthog.capture('open_credits');
    onCreditOpen();
  };

  const openDrawer = () => {
    onDrawerOpen();
    posthog.capture('open_mobile nav');
  };

  return (
    <>
      {/* {router.pathname === '/' && <AnnouncementBar />} */}
      <div className="sticky top-0 z-50">
        <div className="flex min-h-16 items-center justify-between border-b border-white/10 bg-[#1F2337] px-2 py-2 lg:hidden">
          <div className="flex items-center gap-3">
            <div onClick={openDrawer} className="ml-1 cursor-pointer">
              <Menu className="size-5 text-white/75" />
            </div>
            <Link
              href="/"
              className="flex items-center hover:no-underline"
              onClick={() => {
                posthog.capture('homepage logo click_universal');
              }}
            >
              <svg
                viewBox="0 0 92 28"
                xmlns="http://www.w3.org/2000/svg"
                aria-label="A36 Earn"
                role="img"
                fill="white"
                className="h-7 w-auto"
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
            </Link>
          </div>

          <MobileDrawer
            isDrawerOpen={isDrawerOpen}
            onDrawerClose={onDrawerClose}
            onLoginOpen={onLoginOpen}
          />

          <div className="flex items-center gap-1">
            {ready && authenticated && user?.isTalentFilled && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'text-brand-purple hover:text-brand-purple bg-indigo-50 text-xs font-semibold hover:bg-indigo-100',
                    user?.isPro
                      ? 'bg-zinc-200 text-zinc-700 hover:bg-zinc-300 hover:text-zinc-700'
                      : 'bg-indigo-50 text-xs font-semibold hover:bg-indigo-100',
                  )}
                  onClick={onReferralOpen}
                >
                  <Gift />
                  <span>Free Credits</span>
                </Button>
                <div className="relative">
                  <div
                    className="flex cursor-pointer items-center gap-1 rounded-md px-2 py-1.5 text-slate-500 transition-all duration-100 hover:bg-slate-100 hover:text-slate-700 md:gap-2"
                    onClick={openCreditDrawer}
                  >
                    <CreditIcon
                      className={cn(
                        'size-4.5',
                        user?.isPro ? 'text-zinc-600' : 'text-brand-purple',
                      )}
                    />
                    <p className="text-sm font-medium">{creditBalance}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          {ready && !authenticated && (
            <Button
              variant="ghost"
              className="ph-no-capture mr-2 rounded-md border border-white/30 px-3 text-base text-white hover:bg-white hover:text-[#1F2337]"
              onClick={() => {
                posthog.capture('login_navbar');
                onLoginOpen();
              }}
            >
              Log In
            </Button>
          )}
        </div>
      </div>
    </>
  );
};
