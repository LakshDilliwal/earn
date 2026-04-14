type VerifyClaims = {
  readonly user_id: string;
  readonly app_id: string;
};

type PrivyUserRecord = {
  readonly linked_accounts: readonly Record<string, unknown>[];
};

type CreatedWallet = {
  readonly address: string;
};

interface PrivyStub {
  readonly users: () => {
    readonly _get: (userId: string) => Promise<PrivyUserRecord>;
  };
  readonly wallets: () => {
    readonly create: (options: {
      readonly chain_type: string;
      readonly owner: { readonly user_id: string };
    }) => Promise<CreatedWallet>;
  };
  readonly utils: () => {
    readonly auth: () => {
      readonly verifyAuthToken: (token: string) => Promise<VerifyClaims>;
    };
  };
}

const privyStub: PrivyStub = {
  users: () => ({
    _get: async (_userId: string): Promise<PrivyUserRecord> => {
      return { linked_accounts: [] };
    },
  }),
  wallets: () => ({
    create: async (_options): Promise<CreatedWallet> => {
      return { address: '' };
    },
  }),
  utils: () => ({
    auth: () => ({
      verifyAuthToken: async (token: string): Promise<VerifyClaims> => {
        return {
          user_id: token || '',
          app_id: '',
        };
      },
    }),
  }),
};

export const privy = privyStub;
export const privyClient = null;
