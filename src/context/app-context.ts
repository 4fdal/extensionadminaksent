import { ResultUseCustomer } from "@/hook/requests/customer";
import { createContext, useContext } from "react";

export type AppContextType = {
  customer?: ResultUseCustomer | null;
};

export const AppContext = createContext<AppContextType>({
  customer: null,
});

export const useAppContext = () => {
  const app = useContext(AppContext);
  return app;
};
