type LogMeta = Record<string, unknown> | undefined;

const noop = (_message: string, _meta?: LogMeta): void => {};

export const log = {
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
} as const;
