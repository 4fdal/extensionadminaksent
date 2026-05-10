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
import GlassButton from "../ui/GlassButton";
import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";

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
    <div className="h-full flex flex-col gap-3">
      <div className="glass glass-shadow rounded-xl px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {props.onSelectAll && (
            <button
              onClick={props.onSelectAll}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                props.isAllSelected
                  ? "bg-primary border-primary text-white scale-105"
                  : "bg-white/5 border-white/20 hover:border-white/40"
              }`}
            >
              {props.isAllSelected && (
                <IonIcon icon={checkmarkOutline} className="text-[9px] font-bold" />
              )}
            </button>
          )}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-white leading-none">
              {props.selectedCount && props.selectedCount > 0
                ? `${props.selectedCount} Terpilih`
                : "Daftar Data"}
            </span>
            <span className="text-[9px] text-slate-500 font-medium uppercase tracking-tight mt-0.5">
              {props.totalData ?? 0} TOTAL DATA
            </span>
          </div>
        </div>
        
        <div className="flex gap-1.5">
          <GlassButton
            variant="secondary"
            size="sm"
            onClick={props.onSort}
            className="!px-3 !py-1.5"
          >
            <IonIcon
              icon={
                props.sortDirection
                  ? props.sortDirection === "asc"
                    ? arrowUpOutline
                    : arrowDownOutline
                  : optionsOutline
              }
              className="text-base"
            />
            <span className="hidden sm:inline text-[11px]">Urutkan</span>
          </GlassButton>
          
          {props.onFilter && (
            <GlassButton
              variant={props.isFilterActive ? "primary" : "secondary"}
              size="sm"
              onClick={props.onFilter}
              className="!px-3 !py-1.5 relative"
            >
              <IonIcon icon={funnelOutline} className="text-base" />
              <span className="hidden sm:inline text-[11px]">Filter</span>
              {props.isFilterActive && (
                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-accent rounded-full border-2 border-[#0F172A] animate-pulse"></span>
              )}
            </GlassButton>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {props.loading && (
          <GlassCard className="text-center py-10 flex flex-col items-center">
            <div className="relative mb-4">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
              <IonSpinner
                name="crescent"
                color="primary"
                className="w-12 h-12 relative z-10"
              />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">
              {props.loadingMessage || "Memuat Data..."}
            </h3>
            <p className="text-slate-500 text-xs max-w-xs mx-auto">
              Mohon tunggu sejenak sementara kami menyiapkan informasi untuk Anda.
            </p>
          </GlassCard>
        )}

        {props.dataNotFound && !props.loading ? (
          <GlassCard className="text-center py-12 flex flex-col items-center">
            <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-4 border border-white/10">
              <IonIcon icon={search} className="text-3xl text-slate-600" />
            </div>
            <h3 className="text-white font-bold text-lg mb-1">
              Data Tidak Ditemukan
            </h3>
            <p className="text-slate-500 text-xs max-w-xs mx-auto mb-6">
              Coba sesuaikan filter atau kata kunci pencarian Anda untuk melihat hasil lain.
            </p>
            <GlassButton variant="primary" size="sm" onClick={() => window.location.reload()}>
              Reset Filter
            </GlassButton>
          </GlassCard>
        ) : (
          !props.loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-2"
            >
              {props.children}
            </motion.div>
          )
        )}
      </div>
    </div>

  );
};

export default React.memo(DataList);

