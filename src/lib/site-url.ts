// =============================================================================
// A36 Earn — Site URL Helper
// =============================================================================

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL.replace(/\/$/, '');
  }
  return 'http://localhost:3000';
}

export const SITE_URL = getSiteUrl();
export const PLATFORM_NAME = process.env.NEXT_PUBLIC_PLATFORM_NAME ?? 'A36 Earn';
export const PLATFORM_DOMAIN = 'earn.a36labs.com';
