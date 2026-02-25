import DataList from "@/components/list/DataList";
import HeaderFilterChipToolbar from "@/components/toolbars/HeaderFilterChip";
import TextSearchToolbar from "@/components/toolbars/TextSearch";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { ellipsisVertical } from "ionicons/icons";
import React from "react";

const CustomerPage: React.FC = () => {
  return (
    <IonPage className="bg-gray-50">
      <IonLoading isOpen={false} message="Memproses..." />

      {/* Header */}
      <IonHeader className="ion-no-border shadow-sm">
        <IonToolbar className="bg-white">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" className="text-gray-700" />
          </IonButtons>
          <IonTitle className="text-gray-800 font-bold text-lg">
            Belum Bayar
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => {}}>
              <IonIcon icon={ellipsisVertical} className="text-gray-600" />
            </IonButton>
          </IonButtons>
        </IonToolbar>

        {/* Search Bar */}
        <TextSearchToolbar />

        {/* Status Filter Chips */}
        <HeaderFilterChipToolbar />

        {/* Sort & Filter Bar */}
      </IonHeader>

      <IonContent>
        <DataList />
      </IonContent>
    </IonPage>
  );
};

export default CustomerPage;
