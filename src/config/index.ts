import { Preferences } from "@capacitor/preferences";

export const getApiConfig = async () => {
    const baseUrlPref = await Preferences.get({ key: "SETTINGS_BASE_URL" });
    const dbExtensionApiUrlPref = await Preferences.get({ key: "SETTINGS_DB_EXTENSION_API_URL" });
    const dbExtensionUsernamePref = await Preferences.get({ key: "SETTINGS_DB_EXTENSION_USERNAME" });
    const dbExtensionPasswordPref = await Preferences.get({ key: "SETTINGS_DB_EXTENSION_PASSWORD" });

    return {
        BASE_URL: baseUrlPref.value ?? null,
        DB_EXTENSION_API_URL: dbExtensionApiUrlPref.value ?? null,
        DB_EXTENSION_USERNAME: dbExtensionUsernamePref.value ?? null,
        DB_EXTENSION_PASSWORD: dbExtensionPasswordPref.value ?? null,
    };
};

export const getDBAuthenticationToken = async () => {
    const API_CONFIG = await getApiConfig();
    const username = API_CONFIG.DB_EXTENSION_USERNAME;
    const password = API_CONFIG.DB_EXTENSION_PASSWORD;

    if (!username || !password)
      return Promise.reject(
        new Error("Username or password not found"),
      );

    return btoa(`${username}:${password}`);
};

export const setApiConfig = async (configs: Record<string, string>) => {
    for (let key in configs) {
        await Preferences.set({ key, value: configs[key] });
    }
};

// Constants
export * from "./constants";
