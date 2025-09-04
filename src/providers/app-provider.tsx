import { AppContext } from "@/context/app-context";
import { Client } from "@xmtp/browser-sdk";
import { useState, type ReactNode } from "react";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <AppContext.Provider
      value={{ xmtpClient, setXmtpClient, isAuthenticated, setIsAuthenticated }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
