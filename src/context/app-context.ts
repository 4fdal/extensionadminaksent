import { ResultUseCustomer } from "@/hooks/useCustomer";
import { SharedFile } from "@capgo/capacitor-share-target";
import { createContext, useContext } from "react";

export type AppContextType = {
  customer?: ResultUseCustomer | null;
  imageShare?: {
    imageFile: SharedFile | null;
    setImageFile: React.Dispatch<React.SetStateAction<SharedFile | null>>;
  } | null;
};

export const AppContext = createContext<AppContextType>({
  customer: null,
  imageShare: null,
});

export const useAppContext = () => {
  const app = useContext(AppContext);
  return app;
};
