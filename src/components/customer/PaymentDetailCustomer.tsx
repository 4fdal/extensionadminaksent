import React from "react";
import { IonIcon } from "@ionic/react";
import { personOutline, calendarOutline, timeOutline, checkmarkCircle } from "ionicons/icons";
import { PaymentCustomer } from "@/types/customer";
import { formatDate } from "@/utils";
import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";

type PaymentDetailCustomerProp = {
  data?: PaymentCustomer;
};

const PaymentDetailCustomer: React.FC<PaymentDetailCustomerProp> = (props) => {
  return (
    <GlassCard className="!p-0 overflow-hidden border-white/5">
      {/* Gambar Bukti Bayar Section */}
      <div className="relative group h-64 sm:h-80 w-full bg-slate-900 flex items-center justify-center overflow-hidden">
        {props.data?.gambar ? (
          <>
            <img
              src={props.data?.gambar}
              alt="Bukti Bayar"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60" />
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-700">
            <IonIcon icon={personOutline} className="text-4xl" />
            <span className="text-xs font-bold uppercase tracking-tighter">No Preview Available</span>
          </div>
        )}
        
        <div className="absolute top-4 right-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-1.5 bg-green-500/20 backdrop-blur-md border border-green-500/30 text-green-400 px-3 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase"
          >
            <IonIcon icon={checkmarkCircle} />
            LUNAS
          </motion.div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Header Info */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white flex items-center gap-2">
              {props.data?.namapelanggan}
            </h3>
            <p className="text-slate-400 text-xs font-medium font-mono uppercase tracking-tight">
              #{props.data?.nolayanan}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Invoice</span>
            <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded-lg border border-primary/20">
              {props.data?.invoice}
            </span>
          </div>
        </div>

        {/* Transaction Details */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tanggal</span>
            <div className="flex items-center gap-2 text-white">
              <IonIcon icon={calendarOutline} className="text-slate-400 text-sm" />
              <span className="text-sm font-bold">
                {props.data?.tanggalbayar ? formatDate(new Date(props.data.tanggalbayar), "DD MMM YYYY") : "-"}
              </span>
            </div>
          </div>
          <div className="bg-white/5 rounded-2xl p-3 border border-white/5">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Waktu</span>
            <div className="flex items-center gap-2 text-white">
              <IonIcon icon={timeOutline} className="text-slate-400 text-sm" />
              <span className="text-sm font-bold font-mono">
                {props.data?.waktubayar ? formatDate(new Date(props.data.waktubayar), "HH:mm:ss") : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Total Highlight */}
        <div className="bg-gradient-to-r from-primary to-secondary p-0.5 rounded-2xl shadow-lg shadow-primary/20">
          <div className="bg-slate-900/90 backdrop-blur-xl rounded-[14px] p-4 flex justify-between items-center">
            <span className="text-xs font-black text-white/50 uppercase tracking-widest">Total Bayar</span>
            <span className="text-2xl font-black text-white tracking-tighter">
              Rp {(props.data?.total ?? 0).toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default React.memo(PaymentDetailCustomer);

