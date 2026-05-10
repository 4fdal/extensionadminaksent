import { FilterCustomerStatus } from "@/types/customer";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

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
    <div className="flex-1 overflow-hidden">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {props.tabs.map((status) => (
          <motion.div
            key={status.key}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSelectedTab(status);
              if (props.onClick) props.onClick(status);
            }}
            className={`flex items-center gap-2 py-1.5 px-3 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all duration-300 cursor-pointer ${
              selectedTab?.key === status.key
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-white/50 text-slate-500 hover:text-slate-800 border border-white/60"
            }`}
          >
            {status.label}
            <span
              className={`px-1.5 py-0.5 rounded-md text-[9px] ${
                selectedTab?.key === status.key ? "bg-white/20 text-white" : "bg-white/50 text-slate-600"
              }`}
            >
              {status.count}
            </span>
          </motion.div>

        ))}
      </div>
    </div>
  );
};

export default React.memo(HeaderFilterChipToolbar);

