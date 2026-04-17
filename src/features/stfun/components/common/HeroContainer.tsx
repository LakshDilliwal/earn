'use client';

import Link from 'next/link';
import { type ReactNode, useEffect } from 'react';

import { gsap } from '@/lib/gsap';

interface HeroContainerProps {
  line1?: string;
  line2?: string;
  line3?: string;
  line4?: string;
  buttonVisible?: boolean;
  children?: ReactNode;
}

export default function HeroContainer({
  line1 = 'Earn From the Best Opportunities',
  line2 = '',
  line3 = 'A global builder ecosystem — connecting serious builders to',
  line4 = 'protocols, capital, and real work across Web3, AI, and frontier tech.',
  buttonVisible = true,
  children,
}: HeroContainerProps) {
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      '.heading .line span',
      {
        y: 100,
        opacity: 0,
      },
      {
        y: 0,
        opacity: 1,
        duration: 1.8,
        ease: 'power4.out',
        stagger: 0.15,
      },
    );

    tl.fromTo(
      '.sub-heading',
      { y: 0, opacity: 0 },
      {
        opacity: 1,
        duration: 1.8,
        ease: 'power4.out',
      },
      '-=1.8',
    );

    tl.to('.know-more-button', {
      opacity: 1,
      duration: 1.8,
      ease: 'power4.out',
    });
    tl.to('.slot', { opacity: 1, duration: 1.8, ease: 'power4.out' }, '-=1.8');

    tl.to('.heading .line', {
      position: 'relative',
    });
  }, []);

  return (
    <div className="hero-content flex w-full flex-col items-center justify-start">
      <h1 className="heading mt-20 flex w-[320px] flex-col text-center text-[calc(24px+0.5vw)] leading-[1.1] font-extrabold tracking-[-0.02em] text-white md:w-[800px] md:text-[56px]">
        <span className="line relative block h-10 w-full md:h-14">
          <span className="heading-text absolute top-0 left-0 w-full opacity-0">
            {line1}
          </span>
        </span>
        <span className="line relative block h-10 md:h-14">
          <span className="heading-text absolute top-0 left-0 w-full opacity-0">
            {line2}
          </span>
        </span>
      </h1>
      <p className="sub-heading mt-8 max-w-4xl px-4 text-center text-base leading-[1.5] text-white/80 opacity-0 md:text-xl">
        <span className="inline sm:block">{line3}</span>
        <span className="inline sm:block">{line4}</span>
      </p>
      {children}
      {buttonVisible && (
        <div className="know-more-button mt-8 flex flex-col items-center gap-4 opacity-0 sm:flex-row">
          <Link
            href="/earn"
            className="rounded-md border border-[#F9B012] bg-[#22362B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2A4334] hover:no-underline"
          >
            Explore Opportunities
          </Link>
          <Link
            href="/sponsor/create"
            className="rounded-md border border-white/30 bg-transparent px-5 py-2.5 text-sm font-semibold text-white hover:bg-white hover:text-[#18261F] hover:no-underline"
          >
            Become a Sponsor
          </Link>
        </div>
      )}
      <p className="mt-4 text-sm text-white/70">
        Curated for serious builders. Not for everyone.
      </p>
    </div>
  );
}
