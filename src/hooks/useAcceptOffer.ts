import { DomaOrderbookSDK } from "@/classes/doma-orderbook";
import { DOMA_CONFIG_CLIENT } from "@/config";
import { useCallback } from "react";
import { useWalletClient } from "wagmi";
import { viemToEthersSigner } from "@doma-protocol/orderbook-sdk";
import { domaTestnet } from "@/custom-chains/doma-testnet";
import { toast } from "sonner";

const useAcceptOffer = () => {
  const { data: walletClient } = useWalletClient();

  const getDomaClient = useCallback(() => {
    return new DomaOrderbookSDK(DOMA_CONFIG_CLIENT);
  }, []);

  const acceptOffer = useCallback(
    async (orderId: string, callbackOnSuccess?: () => void) => {
      if (!walletClient) return;

      const chainId = `eip155:${domaTestnet.id}` as const;

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
    [getDomaClient, walletClient]
  );

  return { acceptOffer };
};

export default useAcceptOffer;
