interface WalletAccount {
  readonly address: string;
}

interface SignAndSendParams {
  readonly wallet: WalletAccount;
  readonly transaction: Uint8Array;
  readonly chain: string;
}

interface SignAndSendResult {
  readonly signature: Uint8Array;
}

export const useWallets = (): { readonly wallets: readonly WalletAccount[] } => {
  return {
    wallets: [],
  };
};

export const useSignAndSendTransaction = (): {
  readonly signAndSendTransaction: (
    params: SignAndSendParams,
  ) => Promise<SignAndSendResult>;
} => {
  return {
    signAndSendTransaction: async (
      _params: SignAndSendParams,
    ): Promise<SignAndSendResult> => {
      return { signature: new Uint8Array() };
    },
  };
};
