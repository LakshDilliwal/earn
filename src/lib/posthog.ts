type CaptureProperties = Record<string, unknown> | undefined;
type Survey = Record<string, unknown>;

let distinctId: string | null = null;

const capture = (_event: string, _properties?: CaptureProperties): void => {};

const identify = (idOrEmail: string, _properties?: CaptureProperties): void => {
  distinctId = idOrEmail;
};

const reset = (): void => {
  distinctId = null;
};

const getDistinctId = (): string | undefined => {
  return distinctId ?? undefined;
};

const isIdentified = (): boolean => {
  return distinctId !== null;
};

const getActiveMatchingSurveys = (
  callback: (surveys: Survey[]) => void,
): void => {
  callback([]);
};

const posthog = {
  capture,
  identify,
  reset,
  get_distinct_id: getDistinctId,
  _isIdentified: isIdentified,
  getActiveMatchingSurveys,
} as const;

export default posthog;
