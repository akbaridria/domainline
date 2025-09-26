import { useCallback } from "react";
import { useWalletClient } from "wagmi";
import { viemToEthersSigner } from "@doma-protocol/orderbook-sdk";
import { domaTestnet } from "@/custom-chains/doma-testnet";
import { toast } from "sonner";
import { getDomaClient } from "@/lib/doma-client";

const useAcceptOffer = () => {
  const { data: walletClient } = useWalletClient();

  const acceptOffer = useCallback(
    async (orderId: string, chainID?: number, callbackOnSuccess?: () => void) => {
      if (!walletClient) return;

      const chainId = `eip155:${chainID || domaTestnet.id}` as const;

      const signer = viemToEthersSigner(walletClient, chainId);

      const client = getDomaClient();

      return await client.acceptOffer({
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
        },
      });
    },
    [walletClient]
  );

  return { acceptOffer };
};

export default useAcceptOffer;
