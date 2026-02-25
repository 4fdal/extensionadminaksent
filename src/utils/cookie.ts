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

        browser.addEventListener(
          "message",
          (params: { data: { cookie: string } }) => {
            const cookie: string = params.data.cookie;
            rev(cookie);
          },
        );
      });
    });

    return cookie;
  } catch (error) {
    console.log("[Error] handleOpenBrowserLoginGetCookie", error?.message);
    return null;
  }
};

export const getCookieTungkaLilirAdmin = async (): Promise<string | null> => {
  const PREF_KEY_COOKIE = "COOKIE";
  const pref = await Preferences.get({ key: PREF_KEY_COOKIE });
  let cookie: string | null = pref?.value;

  if (!cookie) {
    cookie = await handleOpenBrowserLoginGetCookie({
      openUrl: "https://tungkalilir.rlradius.app/adminrad",
      closeWithUrl: "https://tungkalilir.rlradius.app/home",
    });
  }

  if (cookie) {
    Preferences.set({ key: PREF_KEY_COOKIE, value: cookie });
    return cookie;
  }

  return null;
};
