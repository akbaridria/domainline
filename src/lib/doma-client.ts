import { DOMA_CONFIG_CLIENT } from "@/config";
import { createDomaOrderbookClient } from "@doma-protocol/orderbook-sdk";

export const getDomaClient = () => {
  return createDomaOrderbookClient(DOMA_CONFIG_CLIENT);
};
