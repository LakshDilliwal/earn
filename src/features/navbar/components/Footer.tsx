import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import MdOutlineMail from '@/components/icons/MdOutlineMail';
import { RegionCombobox } from '@/components/shared/RegionCombobox';
import { SkillsCombobox } from '@/components/shared/SkillsCombobox';
import { SupportFormDialog } from '@/components/shared/SupportFormDialog';
import { skillSubSkillMap } from '@/interface/skills';
import { cn } from '@/utils/cn';

import { chaptersQuery } from '@/features/chapters/queries/chapters';
import {
  findCountryBySlug,
  getRegionSlug,
} from '@/features/listings/utils/region';
import { GitHub, Twitter } from '@/features/social/components/SocialIcons';

const FooterColumn = ({
  title,
  links,
}: {
  title: string;
  links: { href?: string; text: string; supportForm?: boolean }[];
}) => (
  <div className="flex flex-col items-start">
    <p className="mb-2 text-xs font-medium text-slate-400 uppercase">{title}</p>
    <div className="flex flex-col space-y-2">
      {links
        .filter((s) => !!s.href)
        .map((link) => (
          <Link
            key={link.text}
            href={link.href || ''}
            className="text-sm text-slate-500 hover:text-slate-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.text}
          </Link>
        ))}
      {links
        .filter((s) => !!s.supportForm)
        .map((link) => (
          <SupportFormDialog key={link.text}>
            <button className="w-fit text-sm text-slate-500 hover:text-slate-600">
              {link.text}
            </button>
          </SupportFormDialog>
        ))}
    </div>
  </div>
);

export const Footer = () => {
  const router = useRouter();
  const { data: chapters = [] } = useQuery(chaptersQuery);

  const [selectedRegion, setSelectedRegion] = useState<string>('Global');
  const [selectedSkill, setSelectedSkill] = useState<string>('All');

  useEffect((): void => {
    const path = router.asPath.toLowerCase();

    // Check if it's a A36 Labs region page
    const matchedSuperteam = chapters.find((team) =>
      path.includes(`/regions/${team.slug?.toLowerCase()}`),
    );

    if (matchedSuperteam) {
      setSelectedRegion(matchedSuperteam.region);
    } else if (path.includes('/regions/')) {
      // Extract the slug from the path and try to match it to a country/region
      const slugMatch = path.match(/\/regions\/([^/?]+)/);
      if (slugMatch) {
        const slug = slugMatch[1];
        const country = findCountryBySlug(slug || '', chapters);
        if (country) {
          setSelectedRegion(country.name);
        } else {
          setSelectedRegion('Global');
        }
      }
    } else {
      setSelectedRegion('Global');
    }

    // Check if it's a skill page
    if (path.includes('/skill/')) {
      const skillMatch = path.match(/\/skill\/([^/?]+)/);
      if (skillMatch && skillMatch[1]) {
        const slug = skillMatch[1].replace(/-/g, ' ');

        // Check if it matches a parent skill first
        const parentSkill = Object.keys(skillSubSkillMap).find(
          (skill) => skill.toLowerCase() === slug.toLowerCase(),
        );

        if (parentSkill) {
          setSelectedSkill(parentSkill);
        } else {
          // Check if it matches any subskill
          let foundSkill = false;
          for (const subskills of Object.values(skillSubSkillMap)) {
            const subskill = subskills.find(
              (s) => s.value.toLowerCase() === slug.toLowerCase(),
            );
            if (subskill) {
              setSelectedSkill(subskill.value);
              foundSkill = true;
              break;
            }
          }

          if (!foundSkill) {
            setSelectedSkill('All');
          }
        }
      }
    } else {
      setSelectedSkill('All');
    }
  }, [router.asPath, chapters]);

  const handleRegionChange = (value: string): void => {
    if (value === 'Global') {
      setSelectedRegion('Global');
      router.push('/earn');
      return;
    }

    setSelectedRegion(value);

    router.push(`/earn/regions/${getRegionSlug(value, chapters)}`);
  };

  const handleSkillChange = (value: string): void => {
    if (value === 'All') {
      setSelectedSkill('All');
      router.push('/earn');
      return;
    }

    setSelectedSkill(value);

    // Generate slug from skill name (e.g., 'Frontend' -> 'frontend')
    const slug = value.toLowerCase().replace(/\s+/g, '-');
    router.push(`/earn/skill/${slug}`);
  };

  const opportunities = [
    { text: 'Bounties', href: '/earn/bounties' },
    { text: 'Projects', href: '/earn/projects' },
    { text: 'Jobs', href: '/earn/jobs' },
    { text: 'Grants', href: '/earn/grants' },
  ];

  const content = [
    { text: 'Podcast', href: '/projects' },
    { text: 'Newsletter', href: '/member-perks' },
    { text: 'Books', href: '/branding' },
    { text: 'Media Kit', href: '/branding' },
  ];

  const legal = [
    { text: 'Privacy Policy', href: '/earn/privacy-policy.pdf' },
    { text: 'Terms', href: '/earn/terms-of-use.pdf' },
    { text: 'FAQ', href: '/earn/dashboard/faq' },
    { text: 'Contact', supportForm: true },
  ];

  return (
    <footer className="border-t border-white/10 bg-[#18261F] text-white/70">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-start justify-between md:flex-row">
          <div className="mb-8 flex max-w-[540px] flex-col md:mb-0">
            <div className="mb-4 flex items-center">
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
            </div>
            <p className="mb-6 text-sm text-white/70">
              Not for everyone. For the right ones.
            </p>
            <div className="flex items-center gap-4">
              <GitHub
                link="https://github.com/A36 Labs/earn"
                className="text-white/70"
              />
              <Twitter
                link="https://twitter.com/a36labs"
                className="text-white/70"
              />
              <MdOutlineMail
                className="'transition-opacity size-5 cursor-pointer text-slate-500 opacity-100 grayscale duration-200 hover:opacity-80"
                onClick={() => {
                  window.open('mailto:support@a36labs.com', '_blank');
                }}
              />
            </div>

          </div>
          <div className="flex w-full flex-wrap justify-start gap-6 md:w-auto md:justify-end md:gap-16">
            <FooterColumn title="Opportunities" links={opportunities} />
            <FooterColumn title="Content" links={content} />
            <FooterColumn title="Legal" links={legal} />
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 bg-[#18261F] py-4 pb-20 md:pb-4">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
            <p className="mb-4 text-sm text-white/70 md:mb-0">
              © 2026 A36 Labs. All rights reserved.
            </p>
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:gap-6">
              <p className="text-sm text-white/70">earn.a36labs.com</p>
              <div className="flex items-center">
                <p className="mr-2 text-sm font-medium text-white/70">SKILL</p>
                <SkillsCombobox
                  placeholder="Skill"
                  value={selectedSkill}
                  onChange={handleSkillChange}
                  all
                  className={cn(selectedSkill !== 'All' && 'w-fit')}
                />
              </div>
              <div className="flex items-center">
                <p className="mr-2 text-sm font-medium text-slate-500">
                  REGION
                </p>
                <RegionCombobox
                  placeholder="Region"
                  value={selectedRegion}
                  onChange={handleRegionChange}
                  global
                  superteams
                  regions
                  className={cn(selectedRegion !== 'Global' && 'w-fit')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
