import { domaTestnet } from "./custom-chains/doma-testnet";
import { baseSepolia, curtis, sepolia, shibariumTestnet } from "wagmi/chains";

export const DEFAULT_COLORS_BORING_AVATAR = [
  "#92A1C6",
  "#146A7C",
  "#F0AB3D",
  "#C271B4",
  "#C20D90",
];

export const BASE_DOMAIN_API_URL = "https://api-testnet.doma.xyz/graphql";

export const SUPPORTED_CHAINS = [
  domaTestnet,
  baseSepolia,
  curtis,
  sepolia,
  shibariumTestnet,
];
