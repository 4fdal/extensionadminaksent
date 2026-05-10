import { IonButton, IonIcon, IonSpinner } from "@ionic/react";
import {
  arrowDownOutline,
  arrowUpOutline,
  checkmarkOutline,
  funnelOutline,
  optionsOutline,
  search,
} from "ionicons/icons";
import React from "react";

export type DataListProp = {
  children?: React.ReactNode;
  loading?: boolean;
  loadingMessage?: string;
  dataNotFound?: boolean;
  totalData?: number;
  selectedCount?: number;
  onSelectAll?: () => void;
  isAllSelected?: boolean;
  onSort?: () => void;
  sortDirection?: "asc" | "desc";
  onFilter?: () => void;
  isFilterActive?: boolean;
};

const DataList: React.FC<DataListProp> = (props) => {
  return (
    <div className="h-100 flex flex-col">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {props.onSelectAll && (
            <button
              onClick={props.onSelectAll}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                props.isAllSelected
                  ? "bg-blue-500 border-blue-500 text-white"
                  : "bg-white border-gray-400 hover:border-blue-400"
              }`}
            >
              {props.isAllSelected && (
                <IonIcon icon={checkmarkOutline} className="text-xs" />
              )}
            </button>
          )}
          <span className="text-xs text-gray-500 font-medium">
            {props.selectedCount && props.selectedCount > 0
              ? `${props.selectedCount} dipilih`
              : `${props.totalData ?? 0} data`}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={props.onSort}
            className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <IonIcon
              icon={
                props.sortDirection
                  ? props.sortDirection === "asc"
                    ? arrowUpOutline
                    : arrowDownOutline
                  : optionsOutline
              }
              className="text-sm"
            />
            Urutkan
          </button>
          {props.onFilter && (
            <button
              onClick={props.onFilter}
              className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors ${
                props.isFilterActive
                  ? "bg-blue-50 border-blue-200 text-blue-600"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <IonIcon icon={funnelOutline} className="text-sm" />
              Filter
              {props.isFilterActive && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {props.loading && (
          <div className="text-center py-12">
            <div className="rounded-full flex items-center justify-center mx-auto mb-4">
              <IonSpinner
                name="circular"
                color="primary"
                className="w-20 h-20"
              />
            </div>
            <h3 className="text-gray-800 font-semibold text-lg mb-2">
              {props.loadingMessage || "Process load data"}
            </h3>
            <p className="text-gray-500 text-sm">
              Tunggu beberapa saat, jangan meninggalkan halaman ini!
            </p>
          </div>
        )}

        {props.dataNotFound && !props.loading ? (
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
            <IonButton
              className="mt-3"
              style={{
                "--border-radius": "10px",
              }}
            >
              Reset Filter
            </IonButton>
          </div>
        ) : (
          !props.loading && props.children
        )}
      </div>
    </div>
  );
};

export default React.memo(DataList);
