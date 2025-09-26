import { useCallback } from "react";
import { useSwitchChain, useWalletClient } from "wagmi";
import { viemToEthersSigner } from "@doma-protocol/orderbook-sdk";
import { domaTestnet } from "@/custom-chains/doma-testnet";
import { toast } from "sonner";
import { getDomaClient } from "@/lib/doma-client";

const useBuyListing = () => {
  const { data: walletClient } = useWalletClient();
  const { switchChainAsync } = useSwitchChain();

  const buyListing = useCallback(
    async (
      orderId: string,
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

      return await client.buyListing({
        chainId,
        signer,
        params: {
          orderId,
        },
        onProgress: (progress) => {
          const isAllComplete = progress.every((p) => p.status === "complete");
          if (isAllComplete) {
            toast.success("Offer accepted successfully!");
            callbackOnSuccess?.();
          }
          console.log({ progress });
        },
      });
    },
    [switchChainAsync, walletClient]
  );

  return { buyListing };
};

export default useBuyListing;
