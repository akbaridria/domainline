export interface DomainName {
  claimedBy: string;
  eoi: boolean;
  expiresAt: string;
  name: string;
  isFractionalized: boolean;
  tokenizedAt: string;
  tokens: {
    networkId: string;
    tokenAddress: string;
    tokenId: string;
    listings: {
      price: string;
      id: string;
      expiresAt: string;
      externalId: string;
      currency: {
        decimals: number;
        name: string;
        symbol: string;
      };
    }[];
  }[];
}
