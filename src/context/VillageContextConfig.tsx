import {
  createContext,
  useMemo,
  ReactNode,
  useContext
} from "react";

import {
  useVillageConfig as useVillageConfigHook,
  VillageConfig
} from "@/hooks/useVillageConfig";

import { usePageVisibility } from "@/hooks/usePageVisibility";
import { useTranslation } from "react-i18next";


// ---------- TYPES ----------
type VillageContextType = {
  config: VillageConfig | null;
  loading: boolean;
  error: any;
  isPageVisible: (pageKey: string) => boolean;
};


// ---------- CONTEXT ----------
export const VillageContext = createContext<VillageContextType>({
  config: null,
  loading: false,
  error: null,
  isPageVisible: () => true,
});


// ---------- PROVIDER ----------
type VillageProviderProps = {
  children: ReactNode;
  villageName?: string;
};

export const VillageProvider = ({
  children,
  villageName = "Shivankhed",
}: VillageProviderProps) => {

  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const {
    config,
    loading: configLoading,
    error,
  } = useVillageConfigHook(villageName, currentLanguage);

  const { isPageVisible, loading: visibilityLoading } = usePageVisibility();

  const value = useMemo(
    () => ({
      config,
      loading: configLoading || visibilityLoading,
      error,
      isPageVisible,
    }),
    [config, configLoading, visibilityLoading, error, isPageVisible]
  );

  return (
    <VillageContext.Provider value={value}>
      {children}
    </VillageContext.Provider>
  );
};


// ---------- HOOK (EXPORT THIS) ----------
export const useVillageConfig = () => useContext(VillageContext);
