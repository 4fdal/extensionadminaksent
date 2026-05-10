import { IonSearchbar, IonToolbar } from "@ionic/react";
import React, { useEffect, useState } from "react";

type TextSearchToolbarProp = {
  onChange?: (searchText: string) => void;
};

const TextSearchToolbar: React.FC<TextSearchToolbarProp> = (props) => {
  const [searchText, setSearchText] = useState<string | null | undefined>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      if (props.onChange) props.onChange(searchText ?? "");
    }, 500);

    return () => clearTimeout(handler);
  }, [searchText]);

  return (
    <IonToolbar className="bg-white pb-2">
      <div className="px-4">
        <div className="relative rounded-full p-0.5 bg-white">
          <IonSearchbar
            value={searchText}
            onIonClear={() => setSearchText("")}
            onIonInput={(e) => {
              setSearchText(e.detail.value);
            }}
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
