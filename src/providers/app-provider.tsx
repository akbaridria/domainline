import { AppContext } from "@/context/app-context";
import { Client } from "@xmtp/browser-sdk";
import { useState, type ReactNode } from "react";

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<string | undefined>(undefined);

  return (
    <AppContext.Provider
      value={{
        xmtpClient,
        setXmtpClient,
        isAuthenticated,
        setIsAuthenticated,
        isOpenProfile,
        setIsOpenProfile,
        selectedProfile,
        setSelectedProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
