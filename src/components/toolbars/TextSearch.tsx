import React, { useEffect, useState } from "react";
import GlassInput from "../ui/GlassInput";
import { Search } from "lucide-react";
import { IonIcon } from "@ionic/react";
import { closeCircle } from "ionicons/icons";

type TextSearchToolbarProp = {
  onChange?: (searchText: string) => void;
};

const TextSearchToolbar: React.FC<TextSearchToolbarProp> = (props) => {
  const [searchText, setSearchText] = useState<string>("");

  useEffect(() => {
    const handler = setTimeout(() => {
      if (props.onChange) props.onChange(searchText);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchText, props]);

  return (
    <div className="flex-1 relative">
      <GlassInput
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Cari invoice, pelanggan, layanan..."
        icon={<Search size={18} />}
        className="!bg-white/50 border-white/60 pr-10"
      />
      {searchText && (
        <button
          onClick={() => setSearchText("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors z-10 flex items-center justify-center"
        >
          <IonIcon icon={closeCircle} className="text-xl" />
        </button>
      )}
    </div>
  );
};

export default TextSearchToolbar;

