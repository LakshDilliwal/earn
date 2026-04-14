import { type Survey } from '@/lib/posthog';

export function getMatchingSurvey(
  surveys: Survey[],
  key: string,
): Survey | null {
  const survey = surveys.find(
    (survey) => survey.id === key || survey.name === key,
  );
  return survey || null;
}
