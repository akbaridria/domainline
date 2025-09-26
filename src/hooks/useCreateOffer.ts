import {
  OrderbookType,
  viemToEthersSigner,
} from "@doma-protocol/orderbook-sdk";
import { useCallback } from "react";
import { SUPPORTED_CURRENCIES } from "@/config";
import { useWalletClient } from "wagmi";
import { domaTestnet } from "@/custom-chains/doma-testnet";
import { parseUnits } from "viem";
import { toast } from "sonner";
import { getDomaClient } from "@/lib/doma-client";

const useCreateOffer = () => {
  const { data: walletClient } = useWalletClient();

  const createOffer = useCallback(
    async (
      tokenAddress: string,
      tokenId: string,
      currencyContractAddress: string,
      amount: string,
      duration: number,
      chainID?: number,
      callbackOnSuccess?: () => void
    ) => {
      if (!walletClient) return;

      const chainId = `eip155:${chainID || domaTestnet.id}` as const;

      const signer = viemToEthersSigner(walletClient, chainId);

      const client = getDomaClient();

      const isNativeToken =
        SUPPORTED_CURRENCIES.find((c) => c.value === currencyContractAddress)
          ?.label === "WETH";

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
              price: parseUnits(amount, isNativeToken ? 18 : 6).toString(),
              duration,
            },
          ],
        },
        onProgress: (progress) => {
          const isAllComplete = progress.every((p) => p.status === "complete");
          if (isAllComplete) {
            toast.success("Offer created successfully!");
            callbackOnSuccess?.();
          }
        },
      });
      return result;
    },
    [walletClient]
  );

  return {
    createOffer,
  };
};

export default useCreateOffer;
