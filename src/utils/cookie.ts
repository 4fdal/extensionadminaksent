/* eslint-disable @typescript-eslint/no-explicit-any */
import { getApiConfig } from "@/config";
import { CapacitorHttp } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

type OpenBrowserLoginGetCookieType = {
  openUrl: string;
  closeWithUrl: string;
};

const handleOpenBrowserLoginGetCookie = async (
  params: OpenBrowserLoginGetCookieType,
): Promise<string | null> => {
  try {
    const cookie: string | null = await new Promise<string | null>((rev) => {
      document.addEventListener("deviceready", () => {
        const browser = window.cordova.InAppBrowser.open(
          params.openUrl,
          "_blank",
          "location=no",
        );

        browser.addEventListener("loadstop", (e: { url: string }) => {
          if (e.url.startsWith(params.closeWithUrl)) {
            browser.executeScript(
              {
                code: "\
            var message = document.cookie;\
            var messageObj = {cookie: message};\
            var stringifiedMessageObj = JSON.stringify(messageObj);\
            webkit.messageHandlers.cordova_iab.postMessage(stringifiedMessageObj);",
              },
              (error: null[]) => {
                if (error[0] == null) {
                  browser.close();
                }
              },
            );
          }
        });

        browser.addEventListener("message", (params: any) => {
          const cookie: string = params?.data?.cookie;
          rev(cookie);
        });
      });
    });

    return cookie;
  } catch (error) {
    console.log("[Error] handleOpenBrowserLoginGetCookie", error);
    return null;
  }
};

export const isExpiredCookie = async (
  url: string,
  cookie?: string | null | undefined,
) => {
  try {
    if (cookie == null || cookie == "" || cookie == undefined) return true;

    const response = await CapacitorHttp.get({
      url,
      headers: {
        Cookie: cookie,
      },
    });


    if (response.status != 200 || response.url != url) return true

    return false;
  } catch (error) {
    console.error("[isExpiredCookie] Error checking cookie:", error);
    return true; // Assume expired on error to be safe
  }
};

let singleFlightPromise: Promise<string | null> | null = null;

export const getCookieTungkaLilirAdmin = async (): Promise<string | null> => {
  if (singleFlightPromise) {
    return singleFlightPromise;
  }

  singleFlightPromise = (async () => {
    try {
      const PREF_KEY_COOKIE = "COOKIE";
      const prefCookie = await Preferences.get({ key: PREF_KEY_COOKIE });

      const API_CONFIG = await getApiConfig();

      const openUrl = `${API_CONFIG.BASE_URL}/adminrad`;
      const closeWithUrl = `${API_CONFIG.BASE_URL}/home`;

      const isExpired = await isExpiredCookie(closeWithUrl, prefCookie?.value);

      console.log({ isExpired, prefCookie });
      const needsRefresh = prefCookie.value == null || prefCookie.value == "" || isExpired;
      if (needsRefresh) {
        console.log("[getCookie] Cookie is missing or expired. Starting refresh...");
        const newCookie = await handleOpenBrowserLoginGetCookie({
          openUrl,
          closeWithUrl,
        });

        if (newCookie) {
          await Preferences.set({ key: PREF_KEY_COOKIE, value: newCookie });
          console.log("[getCookie] New cookie saved successfully.");
        }
        return newCookie;
      }

      return prefCookie.value || null;
    } catch (error) {
      console.error("[getCookie] Error in single-flight execution:", error);
      return null;
    } finally {
      singleFlightPromise = null;
    }
  })();

  return singleFlightPromise;
};
