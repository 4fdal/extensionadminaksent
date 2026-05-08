/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const response = await CapacitorHttp.get({
    url,
    headers: {
      Cookie: cookie ?? "",
    },
  });

  if (response.url != url) return true;

  // Check if content is HTML and contains login indicators
  const contentType =
    response.headers["Content-Type"] || response.headers["content-type"] || "";
  if (contentType.toLowerCase().includes("text/html")) {
    const body = typeof response.data === "string" ? response.data : "";
    if (
      body.toLowerCase().includes("login") ||
      body.toLowerCase().includes("username") ||
      body.toLowerCase().includes("password")
    ) {
      return true;
    }
  }

  return false;
};

export const getCookieTungkaLilirAdmin = async (): Promise<string | null> => {
  const PREF_KEY_COOKIE = "COOKIE";
  let cookie: string | null = (await Preferences.get({ key: PREF_KEY_COOKIE }))
    .value;

  const openUrl = "https://tungkalilir.rlradius.app/adminrad";
  const closeWithUrl = "https://tungkalilir.rlradius.app/home";

  if (cookie == null || (await isExpiredCookie(closeWithUrl, cookie))) {
    cookie = await handleOpenBrowserLoginGetCookie({
      openUrl,
      closeWithUrl,
    });
  }

  if (cookie) {
    await Preferences.set({ key: PREF_KEY_COOKIE, value: cookie });
    return cookie;
  }

  return null;
};
