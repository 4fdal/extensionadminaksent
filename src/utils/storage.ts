import { Preferences } from "@capacitor/preferences";

/**
 * Helper to manage cached data in Capacitor Preferences.
 * Retrieves data from storage if available and not resyncing,
 * otherwise fetches fresh data and updates the cache.
 * 
 * @param key - The unique key for the preference storage
 * @param fetchFn - The async function to fetch fresh data
 * @param resync - If true, bypasses the cache and fetches fresh data
 * @returns The retrieved or fetched data
 */
export const getOrFetchPreference = async <T>(
  key: string,
  fetchFn: () => Promise<T>,
  resync: boolean = false
): Promise<T> => {
  if (!resync) {
    const pref = await Preferences.get({ key });
    if (pref.value) {
      try {
        return JSON.parse(pref.value);
      } catch (error) {
        console.warn(`[Storage] Cache parse error for key "${key}":`, error);
      }
    }
  }

  // Fetch fresh data
  const data = await fetchFn();
  
  // Update cache
  await Preferences.set({ 
    key, 
    value: JSON.stringify(data) 
  });
  
  return data;
};
