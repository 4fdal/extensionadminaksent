import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import "./theme/global.css";
import PaymentPage from "./pages/Payment/Payment";
import CustomerPage from "./pages/Customer/Customer";
import React from "react";
import { useCustomer } from "./hooks/requests/customer";
import { AppContext } from "./context/app-context";
import { useShareTarget } from "./hooks/share-target";

setupIonicReact();

const App: React.FC = () => {
  const customer = useCustomer();
  const imageShare = useShareTarget();

  return (
    <AppContext.Provider value={{ customer, imageShare }}>
      <IonApp>
        <IonReactRouter>
          <IonRouterOutlet>
            <Route exact path="/customer">
              <CustomerPage />
            </Route>
            <Route exact path="/payment">
              <PaymentPage />
            </Route>
            <Route exact path="/">
              <Redirect to="/customer" />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </IonApp>
    </AppContext.Provider>
  );
};

export default App;
