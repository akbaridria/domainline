import { Client, type Signer } from "@xmtp/browser-sdk";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toBytes } from "viem";
import { useAccount, useSignMessage } from "wagmi";
import useApp from "./useApp";

const useXmtp = () => {
  const [isLoadingXmtp, setIsLoadingXmtp] = useState(false);
  const { setXmtpClient, xmtpClient } = useApp();
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const signer: Signer = useMemo(() => {
    return {
      type: "EOA",
      getIdentifier: () => ({
        identifier: address as string,
        identifierKind: "Ethereum",
      }),
      signMessage: async (message: string): Promise<Uint8Array> => {
        const signature = await signMessageAsync({
          account: address,
          message,
        });
        return toBytes(signature);
      },
    };
  }, [address, signMessageAsync]);

  const connectXmtp = useCallback(() => {
    try {
      setIsLoadingXmtp(true);
      Client.create(signer, { env: "dev" })
        .then((res) => {
          setXmtpClient(res);
        })
        .catch(() => {})
        .finally(() => {
          setIsLoadingXmtp(false);
        });
    } catch (error) {
      console.error("Failed to create XMTP client:", error);
    }
  }, [setXmtpClient, signer]);

  useEffect(() => {
    if (!address) {
      setXmtpClient(null);
    }
  }, [address, setXmtpClient]);

  useEffect(() => {
    if (address && !xmtpClient) {
      connectXmtp();
    }
  }, [address, xmtpClient, connectXmtp, setXmtpClient]);

  return {
    isLoadingXmtp,
  };
};

export default useXmtp;
