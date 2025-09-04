import { createContext } from "react";
import { Client } from "@xmtp/browser-sdk";

type AppContextType = {
  xmtpClient: Client | null;
  setXmtpClient: (client: Client | null) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

