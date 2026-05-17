import { Preferences } from "@capacitor/preferences";
import { API_CONFIG } from "./constants";

export const getApiConfig = async () => {
    const baseUrlPref = await Preferences.get({ key: "SETTINGS_BASE_URL" });
    const dbUrlPref = await Preferences.get({ key: "SETTINGS_DB_EXTENSION_API_URL" });

    return {
        BASE_URL: baseUrlPref.value || API_CONFIG.BASE_URL,
        DB_EXTENSION_API_URL: dbUrlPref.value || API_CONFIG.DB_EXTENSION_API_URL,
    };
};

// Constants
export * from "./constants";
