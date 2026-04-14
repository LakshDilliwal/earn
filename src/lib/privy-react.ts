export interface PrivyAuthUser {
  readonly email: { readonly address: string } | null;
  readonly google: { readonly email: string } | null;
  readonly mfaMethods: readonly string[];
}

interface PrivyState {
  readonly authenticated: boolean;
  readonly ready: boolean;
  readonly user: PrivyAuthUser | null;
  readonly logout: () => Promise<void>;
}

interface OAuthCompletePayload {
  readonly user: PrivyAuthUser;
  readonly wasAlreadyAuthenticated: boolean;
}

interface OAuthOptions {
  readonly onComplete?: (payload: OAuthCompletePayload) => Promise<void> | void;
  readonly onError?: (error: Error) => Promise<void> | void;
}

interface EmailState {
  readonly status: 'initial' | 'awaiting-code-input' | 'done';
}

interface LoginWithEmailOptions {
  readonly onComplete?: (payload: OAuthCompletePayload) => Promise<void> | void;
  readonly onError?: (error: Error) => Promise<void> | void;
}

interface LoginWithCodeParams {
  readonly code: string;
}

interface SendCodeParams {
  readonly email: string;
}

export const usePrivy = (): PrivyState => {
  return {
    authenticated: false,
    ready: true,
    user: null,
    logout: async (): Promise<void> => {},
  };
};

export const useLoginWithOAuth = (
  _options: OAuthOptions,
): { readonly initOAuth: () => Promise<void> } => {
  return {
    initOAuth: async (): Promise<void> => {},
  };
};

export const useLoginWithEmail = (
  _options: LoginWithEmailOptions,
): {
  readonly state: EmailState;
  readonly sendCode: (params: SendCodeParams) => Promise<void>;
  readonly loginWithCode: (params: LoginWithCodeParams) => Promise<void>;
} => {
  return {
    state: { status: 'initial' },
    sendCode: async (_params: SendCodeParams): Promise<void> => {},
    loginWithCode: async (_params: LoginWithCodeParams): Promise<void> => {},
  };
};

export const useMfaEnrollment = (): {
  readonly showMfaEnrollmentModal: () => Promise<void>;
} => {
  return {
    showMfaEnrollmentModal: async (): Promise<void> => {},
  };
};

export const getAccessToken = async (): Promise<string | null> => {
  return null;
};
