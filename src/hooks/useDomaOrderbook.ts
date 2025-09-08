import {
  createDomaOrderbookClient,
  getDomaOrderbookClient,
  OrderbookType,
  viemToEthersSigner,
} from "@doma-protocol/orderbook-sdk";
import { useCallback } from "react";
import { useMemo } from "react";
import { SUPPORTED_CHAINS } from "@/config";
import { useWalletClient } from "wagmi";
import { domaTestnet } from "@/custom-chains/doma-testnet";
import { parseEther } from "viem";

const useDomaOrderbook = () => {
  const { data: walletClient } = useWalletClient();
  const config = useMemo(
    () => ({
      apiClientOptions: {
        baseUrl: "https://api-testnet.doma.xyz",
        apiKey: import.meta.env.VITE_DOMA_API_KEY,
      },
      source: "domainLine",
      chains: SUPPORTED_CHAINS,
    }),
    []
  );

  const getDomaClient = useCallback(() => {
    const client = getDomaOrderbookClient();
    if (!client) {
      return createDomaOrderbookClient(config);
    }
    return client;
  }, [config]);

  const createOffer = useCallback(
    async (
      tokenAddress: string,
      tokenId: string,
      currencyContractAddress: string,
      amount: string,
      duration: number
    ) => {
      if (!walletClient) return;

      const chainId = `eip155:${domaTestnet.id}` as const;

      const signer = viemToEthersSigner(walletClient, chainId);

      const client = getDomaClient();

      const result = await client.createOffer({
        signer,
        chainId,
        params: {
          orderbook: OrderbookType.DOMA,
          source: "domainLine",
          items: [
            {
              contract: tokenAddress,
              tokenId,
              currencyContractAddress,
              price: parseEther(amount).toString(),
              duration,
            },
          ],
        },
        onProgress: (progress) => {
          console.log("Offer creation status:", progress);
        },
      });
      return result;
    },
    [getDomaClient, walletClient]
  );

  return {
    createOffer,
  };
};

export default useDomaOrderbook;
