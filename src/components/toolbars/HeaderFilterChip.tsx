import React, { useState } from "react";

const HeaderFilterChipToolbar: React.FC = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  return (
    <div className="bg-white mt-2 px-4 pb-3">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {[
          { key: "ALL", label: "Semua", count: 40 },
          {
            key: "BELUM",
            label: "Belum Bayar",
            count: 40,
          },
          {
            key: "PROSES",
            label: "Dalam Proses",
            count: 40,
          },
          {
            key: "PENDING",
            label: "Pending",
            count: 40,
          },
        ].map((status) => (
          <div
            key={status.key}
            onClick={() => setSelectedStatus(status.key)}
            className={`flex items-center gap-2 py-0.5 px-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
              selectedStatus === status.key
                ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status.label}
            <span
              className={`p-1.5 py-0.5 rounded-full text-[10px] ${
                selectedStatus === status.key ? "bg-white/30" : "bg-gray-200"
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

export default HeaderFilterChipToolbar;
