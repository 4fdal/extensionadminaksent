import React, { useEffect, useState } from "react";
import GlassInput from "../ui/GlassInput";
import { Search } from "lucide-react";

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
    <div className="flex-1">
      <GlassInput
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Cari invoice, pelanggan, layanan..."
        icon={<Search size={18} />}
        className="!bg-white/5 border-white/5"
      />
    </div>
  );
};

export default TextSearchToolbar;

