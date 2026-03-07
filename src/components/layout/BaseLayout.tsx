import { useAppContext } from "@/context/app-context";
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect } from "react";
import { useHistory } from "react-router";

type BaseLayoutProp = {
  children?: React.ReactNode;
  headerRender?: React.ReactNode;
  headerToolbarEndRender?: React.ReactNode;
  headerTitle?: string;
  loadingPage?: boolean;
  backHref?: string | undefined;
};

const BaseLayout: React.FC<BaseLayoutProp> = ({
  children,
  headerRender,
  headerToolbarEndRender,
  headerTitle,
  loadingPage = false,
  backHref,
}) => {
  const history = useHistory();
  const app = useAppContext();

  useEffect(() => {
    if (app.imageShare?.imageFile && location.pathname != "/payment") {
      history.push("/payment");
    }
  }, [app.imageShare?.imageFile, history]);

  return (
    <IonPage className="bg-gray-50">
      <IonLoading isOpen={loadingPage} message="Memproses..." />

      {/* Header */}
      <IonHeader className="ion-no-border shadow-sm">
        <IonToolbar className="bg-white">
          {backHref && (
            <IonButtons slot="start">
              <IonBackButton defaultHref={backHref} className="text-white" />
            </IonButtons>
          )}
          <IonTitle className="text-white font-bold text-lg mx-5">
            {headerTitle}
          </IonTitle>
          {headerToolbarEndRender}
        </IonToolbar>

        {headerRender}
      </IonHeader>

      {children}
    </IonPage>
  );
};

export default React.memo(BaseLayout);
