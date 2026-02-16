import {
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../../components/ExploreContainer";
import "./Home.css";
import { Capacitor, CapacitorHttp } from "@capacitor/core";
import { useEffect, useState } from "react";
import { Preferences } from "@capacitor/preferences";
import { App } from "@capacitor/app";

const Home: React.FC = () => {
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    const checkPendingShare = async () => {
      const obj = await Preferences.get({ key: "pendingImage" });
      const { value } = obj;
      console.log("LOGIONICS Found shared image:", JSON.stringify(obj));

      if (value) {
        console.log("LOGIONICS Found shared image:", value);

        const converted = Capacitor.convertFileSrc(value);

        setImageUri(converted);

        // 🔥 hapus setelah dipakai supaya tidak muncul lagi
        await Preferences.remove({ key: "pendingImage" });
      }
    };

    checkPendingShare();
  }, []);

  const handleOpenBrowser = () => {
    document.addEventListener("deviceready", () => {
      const browser = window.cordova.InAppBrowser.open(
        "https://tungkalilir.rlradius.app/adminrad",
        "_blank",
        "location=no",
      );

      browser.addEventListener("loadstop", (e) => {
        if (e.url.startsWith("https://tungkalilir.rlradius.app/home")) {
          browser.executeScript(
            {
              code: "\
            var message = document.cookie;\
            var messageObj = {cookie: message};\
            var stringifiedMessageObj = JSON.stringify(messageObj);\
            webkit.messageHandlers.cordova_iab.postMessage(stringifiedMessageObj);",
            },
            (error) => {
              if (error[0] == null) {
                browser.close();
              }
            },
          );
        }
      });

      browser.addEventListener("message", (params) => {
        const cookie: string = params.data.cookie;
        console.log("Cookie : ", cookie);
      });
    });
  };

  const handleGetData = async () => {
    const response = await CapacitorHttp.post({
      url: "https://tungkalilir.rlradius.app/invoice/unpaid/data",
      headers: {
        Accept: "application/json, text/javascript, */*; q=0.01",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
        Origin: "https://tungkalilir.rlradius.app",
        Referer: "https://tungkalilir.rlradius.app/invoice/unpaid",
        Cookie:
          "PHPSESSID=55bf4b181fec9d783f44b8ff686ed32d; adminc1=NDA%3D; adminc2=240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9; adminc3=c991b2c2aab64f87e35cfe8331112152cd4ec54c328c90c5292337bb56208ec3; admincookie=f61444dff704632e1d108d0d36e971a1b35c299d8225030f85473bb8a25bc69e",
      },
      data: "draw=2&columns%5B0%5D%5Bdata%5D=invoice&columns%5B0%5D%5Bname%5D=&columns%5B0%5D%5Bsearchable%5D=true&columns%5B0%5D%5Borderable%5D=false&columns%5B0%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B0%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B1%5D%5Bdata%5D=tgltempo&columns%5B1%5D%5Bname%5D=&columns%5B1%5D%5Bsearchable%5D=true&columns%5B1%5D%5Borderable%5D=true&columns%5B1%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B1%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B2%5D%5Bdata%5D=invoice&columns%5B2%5D%5Bname%5D=&columns%5B2%5D%5Bsearchable%5D=true&columns%5B2%5D%5Borderable%5D=true&columns%5B2%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B2%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B3%5D%5Bdata%5D=nolayanan&columns%5B3%5D%5Bname%5D=&columns%5B3%5D%5Bsearchable%5D=true&columns%5B3%5D%5Borderable%5D=true&columns%5B3%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B3%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B4%5D%5Bdata%5D=namapelanggan&columns%5B4%5D%5Bname%5D=&columns%5B4%5D%5Bsearchable%5D=true&columns%5B4%5D%5Borderable%5D=true&columns%5B4%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B4%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B5%5D%5Bdata%5D=namaprofile&columns%5B5%5D%5Bname%5D=&columns%5B5%5D%5Bsearchable%5D=true&columns%5B5%5D%5Borderable%5D=true&columns%5B5%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B5%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B6%5D%5Bdata%5D=fullname&columns%5B6%5D%5Bname%5D=&columns%5B6%5D%5Bsearchable%5D=true&columns%5B6%5D%5Borderable%5D=true&columns%5B6%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B6%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B7%5D%5Bdata%5D=namakategoriinvoice&columns%5B7%5D%5Bname%5D=&columns%5B7%5D%5Bsearchable%5D=true&columns%5B7%5D%5Borderable%5D=true&columns%5B7%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B7%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B8%5D%5Bdata%5D=tglterbit&columns%5B8%5D%5Bname%5D=&columns%5B8%5D%5Bsearchable%5D=true&columns%5B8%5D%5Borderable%5D=true&columns%5B8%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B8%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B9%5D%5Bdata%5D=tgltempo&columns%5B9%5D%5Bname%5D=&columns%5B9%5D%5Bsearchable%5D=true&columns%5B9%5D%5Borderable%5D=true&columns%5B9%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B9%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B10%5D%5Bdata%5D=subtotal&columns%5B10%5D%5Bname%5D=&columns%5B10%5D%5Bsearchable%5D=true&columns%5B10%5D%5Borderable%5D=true&columns%5B10%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B10%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B11%5D%5Bdata%5D=diskon&columns%5B11%5D%5Bname%5D=&columns%5B11%5D%5Bsearchable%5D=true&columns%5B11%5D%5Borderable%5D=true&columns%5B11%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B11%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B12%5D%5Bdata%5D=ppn&columns%5B12%5D%5Bname%5D=&columns%5B12%5D%5Bsearchable%5D=true&columns%5B12%5D%5Borderable%5D=true&columns%5B12%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B12%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B13%5D%5Bdata%5D=kodeunik&columns%5B13%5D%5Bname%5D=&columns%5B13%5D%5Bsearchable%5D=true&columns%5B13%5D%5Borderable%5D=true&columns%5B13%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B13%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B14%5D%5Bdata%5D=total&columns%5B14%5D%5Bname%5D=&columns%5B14%5D%5Bsearchable%5D=true&columns%5B14%5D%5Borderable%5D=true&columns%5B14%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B14%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B15%5D%5Bdata%5D=catatan&columns%5B15%5D%5Bname%5D=&columns%5B15%5D%5Bsearchable%5D=true&columns%5B15%5D%5Borderable%5D=true&columns%5B15%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B15%5D%5Bsearch%5D%5Bregex%5D=false&columns%5B16%5D%5Bdata%5D=tagih&columns%5B16%5D%5Bname%5D=&columns%5B16%5D%5Bsearchable%5D=true&columns%5B16%5D%5Borderable%5D=true&columns%5B16%5D%5Bsearch%5D%5Bvalue%5D=&columns%5B16%5D%5Bsearch%5D%5Bregex%5D=false&order%5B0%5D%5Bcolumn%5D=2&order%5B0%5D%5Bdir%5D=desc&start=0&length=100&search%5Bvalue%5D=&search%5Bregex%5D=false&status=1",
    });

    console.log(response.status);
    console.log(JSON.stringify(response.data));
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Blank</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Blank</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonButton onClick={handleOpenBrowser}>Browser</IonButton>
        <IonButton onClick={handleGetData}>Get Data</IonButton>
        <IonButton onClick={() => setImageUri(null)}>Reset Image</IonButton>
        <h1>Share Image : {imageUri}</h1>

        {imageUri && (
          <img
            src={Capacitor.convertFileSrc(imageUri)}
            alt="shared"
            style={{ width: "100%" }}
          />
        )}
        <ExploreContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
