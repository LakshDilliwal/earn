'use client';

import { type ReactNode, useEffect } from 'react';

import { gsap } from '@/lib/gsap';

import HeroContainer from '../common/HeroContainer';

interface HeroProps {
  line1?: string;
  line2?: string;
  line3?: string;
  line4?: string;
  buttonVisible?: boolean;
  children?: ReactNode;
}

export default function Hero({
  line1 = '',
  line2 = '',
  line3 = '',
  line4 = '',
  buttonVisible = true,
  children,
}: HeroProps) {
  useEffect(() => {
    const tl = gsap.timeline();

    tl.fromTo(
      '.fade-in',
      { y: 0, opacity: 0 },
      {
        opacity: 1,
        duration: 1.8,
        ease: 'power4.out',
      },
    );
  }, []);

  return (
    <section className="st-hero relative col-span-5 flex min-h-[calc(100vh-40px-32px)] flex-col items-center bg-[#18261F]">
      <HeroContainer
        line1={line1}
        line2={line2}
        line3={line3}
        line4={line4}
        buttonVisible={buttonVisible}
      >
        {children}
      </HeroContainer>
    </section>
  );
}
