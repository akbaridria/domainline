import {
  createDomaOrderbookClient,
  getDomaOrderbookClient,
} from "@doma-protocol/orderbook-sdk";
import { useCallback } from "react";
import { useMemo } from "react";
import { SUPPORTED_CHAINS } from "@/config";

const useDomaOrderbook = () => {
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

  return {
    getDomaClient,
  };
};

export default useDomaOrderbook;
