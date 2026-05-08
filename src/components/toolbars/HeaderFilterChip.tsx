import { FilterCustomerStatus } from "@/types/customer";
import React, { useEffect, useState } from "react";

export type Tab = {
  key: FilterCustomerStatus;
  label: string;
  count: number;
};

type HeaderFilterChipToolbarProp = {
  tabs: Array<Tab>;
  onClick?: (tap: Tab) => void;
  onChange?: (tap: Tab) => void;
};

const HeaderFilterChipToolbar: React.FC<HeaderFilterChipToolbarProp> = (
  props,
) => {
  const [selectedTab, setSelectedTab] = useState<Tab | null>(
    props.tabs.length > 0 ? props.tabs[0] : null,
  );

  useEffect(() => {
    if (props.onChange && selectedTab) props.onChange(selectedTab);
  }, [selectedTab, props]);

  return (
    <div className="bg-white mt-2 px-4 pb-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {props.tabs.map((status) => (
          <div
            key={status.key}
            onClick={() => {
              setSelectedTab(status);
              if (props.onClick) props.onClick(status);
            }}
            className={`flex items-center gap-2 py-0.5 px-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedTab?.key === status.key
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status.label}
            <span
              className={`p-1.5 py-0.5 rounded-full text-[10px] ${
                selectedTab?.key === status.key ? "bg-white/30" : "bg-gray-200"
              }`}
            >
              {status.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(HeaderFilterChipToolbar);
