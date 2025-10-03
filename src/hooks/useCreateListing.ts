import {
  OrderbookType,
  viemToEthersSigner,
} from "@doma-protocol/orderbook-sdk";
import { useCallback } from "react";
import { SUPPORTED_CHAINS, SUPPORTED_CURRENCIES } from "@/config";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";
import { domaTestnet } from "@/custom-chains/doma-testnet";
import { parseUnits } from "viem";
import { toast } from "sonner";
import { getDomaClient } from "@/lib/doma-client";

const useCreateListing = () => {
  const { data: walletClient } = useWalletClient();
  const { chainId: id } = useAccount();
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
      if (id !== (chainID || domaTestnet.id)) {
        const chainName = SUPPORTED_CHAINS.find(
          (chain) => chain.id === (chainID || domaTestnet.id)
        )?.name;
        toast.info(`Switching to ${chainName || "the correct network"}`);
        const res = await switchChainAsync?.({
          chainId: chainID || domaTestnet.id,
        });
        if (res?.id !== (chainID || domaTestnet.id)) {
          toast.error(
            `Please switch to ${
              chainName || "the correct network"
            } and try again.`
          );
          throw new Error("Wrong network");
        }
      }

      if (!walletClient) return;

      const chainId = `eip155:${chainID || domaTestnet.id}` as const;

      const signer = viemToEthersSigner(walletClient, chainId);

      const client = getDomaClient();

      const isNativeToken =
        SUPPORTED_CURRENCIES.find((c) => c.value === currencyContractAddress)
          ?.label === "WETH";

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
          const pendingProgress = progress.filter(
            (p) => p.progressState === "pending"
          )?.[0];

          if (pendingProgress) {
            if (["signature", "transaction"].includes(pendingProgress.kind)) {
              toast.info(pendingProgress.description, {
                description:
                  "Make sure to confirm the action in your wallet. If your wallet is locked, please unlock it and refresh the page again.",
                duration: 7000,
              });
            } else {
              toast.info(pendingProgress.action, {
                description: pendingProgress.description,
              });
            }
          }
        },
      });
      return result;
    },
    [id, walletClient, switchChainAsync]
  );

  return {
    createListing,
  };
};

export default useCreateListing;
