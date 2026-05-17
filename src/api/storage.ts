import { getApiConfig, getDBAuthenticationToken } from "@/config";
import { FileBase64, UploadResponse } from "@/types/storage";
import { CapacitorHttp } from "@capacitor/core";
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




export async function uploadFile(file: FileBase64): Promise<UploadResponse> {
  try {
    const API_CONFIG = await getApiConfig();
    const res = await CapacitorHttp.post({
      url: `${API_CONFIG.DB_EXTENSION_API_URL ?? ''}?authorization=${await getDBAuthenticationToken()}`,
      data: file,
      responseType: "json",
    });

    if (res.status != 200)
      return Promise.reject(
        new Error("Response not status 200 : " + JSON.stringify(res)),
      );

    const contentType =
      res.headers["Content-Type"] || res.headers["content-type"] || "";
    if (contentType.toLowerCase().indexOf("application/json") == -1)
      return Promise.reject({ res });


    return Promise.resolve(res.data);
  } catch (err) {
    return Promise.reject({
      err,
    });
  }
}