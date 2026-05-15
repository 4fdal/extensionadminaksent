import React, { useEffect, useState } from "react";
import { IonIcon, IonLoading } from "@ionic/react";
import { personOutline, calendarOutline, timeOutline, checkmarkCircle, imageOutline } from "ionicons/icons";
import { PaymentCustomer } from "@/types/customer";
import { formatDate } from "@/utils";
import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";

type PaymentDetailCustomerProp = {
  data?: PaymentCustomer;
};

const PaymentDetailCustomer: React.FC<PaymentDetailCustomerProp> = (props) => {

  const [isLoadedImage, setIsLoadedImage] = useState<boolean>(false)
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {

    const fetchImage = async () => {
      if (isLoadedImage && props.data?.gambar) {
        setIsLoadedImage(false)
        const res = await fetch(props.data.gambar)
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        setImageSrc(url)
        setIsLoadedImage(true)
      }
    }

    fetchImage()

  }, [imageSrc, props.data?.gambar])

  return (
    <GlassCard className="!p-0 overflow-hidden border-slate-200">
      {/* Gambar Bukti Bayar Section */}
      <div className="relative group h-64 sm:h-80 w-full bg-slate-100 flex items-center justify-center overflow-hidden">

        {imageSrc ? (
          <>
            <img
              src={imageSrc}
              alt="Bukti Bayar"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-60" />
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            <IonIcon icon={imageOutline} className="text-4xl" />
            {isLoadedImage ? (
              <span className="text-xs font-bold uppercase tracking-tighter">No Preview Available</span>
            ) : (
              <span className="text-xs font-bold uppercase tracking-tighter">
                <IonLoading />
              </span>
            )}
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

      <div className="p-2 space-y-2">
        {/* Header Info */}
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
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
          <div className="bg-white/50 rounded-2xl p-3 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Tanggal</span>
            <div className="flex items-center gap-2 text-slate-800">
              <IonIcon icon={calendarOutline} className="text-slate-400 text-sm" />
              <span className="text-xs font-bold">
                {props.data?.tanggalbayar ? formatDate(new Date(props.data.tanggalbayar), "DD/MM/YYYY") : "-"}
              </span>
            </div>
          </div>
          <div className="bg-white/50 rounded-2xl p-3 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Waktu</span>
            <div className="flex items-center gap-2 text-slate-800">
              <IonIcon icon={timeOutline} className="text-slate-400 text-sm" />
              <span className="text-xs font-bold font-mono">
                {props.data?.waktubayar ? formatDate(new Date(props.data.waktubayar), "HH:mm:ss") : "-"}
              </span>
            </div>
          </div>
        </div>

        {/* Total Highlight */}
        <div className="bg-gradient-to-r from-primary to-secondary p-0.5 rounded-2xl shadow-lg shadow-primary/20">
          <div className="bg-white/90 backdrop-blur-xl rounded-[14px] p-4 flex justify-between items-center">
            <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Total Bayar</span>
            <span className="text-2xl font-black text-slate-800 tracking-tighter">
              Rp {(props.data?.total ?? 0).toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default React.memo(PaymentDetailCustomer);

