import { IonIcon } from "@ionic/react";
import {
  arrowDownOutline,
  arrowUpOutline,
  checkmarkOutline,
  ellipsisVertical,
  funnelOutline,
  optionsOutline,
  search,
} from "ionicons/icons";
import React from "react";
import DetailCardCustomer from "../customer/DetailCardCustomer";

const DataList: React.FC = () => {
  return (
    <div className="h-100 flex flex-col">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {}}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              true && 0 > 0
                ? "bg-blue-500 border-blue-500 text-white"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            {true && 0 > 0 && (
              <IonIcon icon={checkmarkOutline} className="text-xs" />
            )}
          </button>
          <span className="text-xs text-gray-500">
            {0 > 0 ? `${10} dipilih` : `${10} data`}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {}}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <IonIcon
              icon={
                true
                  ? "asc" === "asc"
                    ? arrowUpOutline
                    : arrowDownOutline
                  : optionsOutline
              }
              className="text-sm"
            />
            Urutkan
          </button>
          <button
            onClick={() => {}}
            className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors ${
              true
                ? "bg-blue-50 border-blue-200 text-blue-600"
                : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            <IonIcon icon={funnelOutline} className="text-sm" />
            Filter
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {1 === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <IonIcon icon={search} className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-gray-800 font-semibold text-lg mb-2">
              Tidak ada data
            </h3>
            <p className="text-gray-500 text-sm">
              Coba ubah filter atau kata kunci pencarian
            </p>
            <button
              onClick={() => {}}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <DetailCardCustomer />
        )}
      </div>
    </div>
  );
};

export default DataList;
