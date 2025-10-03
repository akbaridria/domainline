import { useCallback } from "react";
import { useAccount, useSwitchChain, useWalletClient } from "wagmi";
import { viemToEthersSigner } from "@doma-protocol/orderbook-sdk";
import { domaTestnet } from "@/custom-chains/doma-testnet";
import { toast } from "sonner";
import { getDomaClient } from "@/lib/doma-client";
import { SUPPORTED_CHAINS } from "@/config";

const useBuyListing = () => {
  const { data: walletClient } = useWalletClient();
  const { chainId: id } = useAccount();
  const { switchChainAsync } = useSwitchChain();

  const buyListing = useCallback(
    async (
      orderId: string,
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
    },
    [id, switchChainAsync, walletClient]
  );

  return { buyListing };
};

export default useBuyListing;
