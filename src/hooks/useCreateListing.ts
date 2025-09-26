import {
  OrderbookType,
  viemToEthersSigner,
} from "@doma-protocol/orderbook-sdk";
import { useCallback } from "react";
import { SUPPORTED_CURRENCIES } from "@/config";
import { useSwitchChain, useWalletClient } from "wagmi";
import { domaTestnet } from "@/custom-chains/doma-testnet";
import { parseUnits } from "viem";
import { toast } from "sonner";
import { getDomaClient } from "@/lib/doma-client";

const useCreateListing = () => {
  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();

  const createListing = useCallback(
    async (
      tokenAddress: string,
      tokenId: string,
      currencyContractAddress: string,
      amount: string,
      duration: number,
      chainID?: number,
      callbackOnSuccess?: () => void
    ) => {
      const res = await switchChainAsync?.({
        chainId: chainID || domaTestnet.id,
      });
      if (res?.id !== (chainID || domaTestnet.id)) {
        toast.error("Please switch to the correct network and try again.");
        return;
      }
      
      if (!walletClient) return;

      const chainId = `eip155:${chainID || domaTestnet.id}` as const;

      const signer = viemToEthersSigner(walletClient, chainId);

      const client = getDomaClient();

      const isNativeToken =
        SUPPORTED_CURRENCIES.find((c) => c.value === currencyContractAddress)
          ?.label === "WETH";
      console.log({
        tokenAddress,
        tokenId,
        currencyContractAddress,
        amount,
        duration,
        chainID,
      });

      const result = await client.createListing({
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
      console.log("Create listing result:", result);
      return result;
    },
    [switchChainAsync, walletClient]
  );

  return {
    createListing,
  };
};

export default useCreateListing;
