import { IonSearchbar, IonToolbar } from "@ionic/react";
import React from "react";

const TextSearchToolbar: React.FC = () => {
  return (
    <IonToolbar className="bg-white pb-2">
      <div className="px-4">
        <div className="relative rounded-full p-0.5 bg-white">
          <IonSearchbar
            value=""
            onIonChange={(e: any) => {}}
            placeholder="Cari invoice, pelanggan, layanan..."
            className="p-0 bg-gray-100 rounded-full"
            style={{ "--box-shadow": "none" }}
          />
        </div>
      </div>
    </IonToolbar>
  );
};

export default TextSearchToolbar;
