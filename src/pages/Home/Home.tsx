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

const Home: React.FC = () => {
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
        <ExploreContainer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
