import { Customer } from "@/types/customer";
import { formatRupiah, formatDate, dateTimeConvertToString } from "@/utils";
import { IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonTextarea, IonButton, IonButtons } from "@ionic/react";
import {
  alertCircleOutline,
  businessOutline,
  calendarOutline,
  callOutline,
  cashOutline,
  eyeOutline,
  homeOutline,
  personOutline,
  timeOutline,
  checkmarkOutline,
  closeCircleOutline,
  warningOutline,
} from "ionicons/icons";
import React, { useMemo, useState } from "react";
import { differenceInDays } from "date-fns";
import { useHistory } from "react-router";
import { AppLauncher } from "@capacitor/app-launcher";
import { sendBilToWhatsapp } from "@/utils/payment";
import GlassCard from "../ui/GlassCard";
import GlassButton from "../ui/GlassButton";
import { motion } from "framer-motion";

type DetailCardCustomerProp = {
  customer?: Customer;
  onClickDetail?: () => void | undefined;
  isSelected?: boolean;
  onSelect?: () => void;
};

const DetailCardCustomer: React.FC<DetailCardCustomerProp> = (props) => {
  const history = useHistory();
  const { customer } = props;

  const { overdueDays, isOverdue } = useMemo(() => {
    if (!customer?.tglisolir) return { overdueDays: 0, isOverdue: false };
    const isolirDate = new Date(customer.tglisolir);
    const now = new Date();
    const diff = differenceInDays(isolirDate, now);
    return {
      overdueDays: Math.abs(diff),
      isOverdue: now > isolirDate,
    };
  }, [customer?.tglisolir]);

  const [showComplaintModal, setShowComplaintModal] = useState<boolean>(false);
  const [complaintText, setComplaintText] = useState<string>("");

  const statusLabel = useMemo(() => {
    if (customer?.isolirmanual) return "Isolir";
    if (customer?.aktif) return "Active";
    return "Deactive";
  }, [customer?.isolirmanual, customer?.aktif]);

  const sendComplaintToWhatsapp = async () => {
    if (!props.customer || !complaintText) return;
    const message = `Halo, saya ingin melaporkan keluhan untuk pelanggan:\nNama: ${props.customer.namapelanggan}\nLayanan: ${props.customer.nolayanan}\nKeluhan: ${complaintText}`;
    const encodedMessage = encodeURIComponent(message);
    const phone = props.customer.profile?.phone;
    const formattedPhone = phone ? `62${phone.substring(1)}` : "";
    if (formattedPhone) {
      await AppLauncher.openUrl({
        url: `whatsapp://send?phone=${formattedPhone}&text=${encodedMessage}`,
      });
    }
    setShowComplaintModal(false);
    setComplaintText("");
  };

  return (
    <GlassCard 
      className={customer?.isolirmanual ? "border-red-500/30 bg-red-500/5" : ""}
      animate
    >
      <div className="flex flex-col gap-3">
        {/* Compact Card Header */}
        <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-2.5">
          <div className="flex items-center gap-2.5">
            {props.onSelect && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  props.onSelect?.();
                }}
                className={`w-4.5 h-4.5 rounded-md border-2 flex items-center justify-center transition-all ${
                  props.isSelected
                    ? "bg-primary border-primary text-white"
                    : "bg-white/5 border-white/10 hover:border-white/30"
                }`}
              >
                {props.isSelected && <IonIcon icon={checkmarkOutline} className="text-[9px]" />}
              </button>
            )}
            <div className="flex items-center gap-1.5">
              <span className={`text-[9px] font-bold uppercase tracking-tight ${customer?.isolirmanual ? "text-red-400" : "text-primary"}`}>
                {statusLabel}
              </span>
              <span className="w-0.5 h-0.5 bg-white/10 rounded-full"></span>
              <span className="text-[10px] font-mono font-medium text-slate-500">
                {props.customer?.unpaid?.invoice ?? props.customer?.paid?.invoice}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {props.customer?.payment ? (
              <span className="text-[9px] font-black bg-green-500/10 text-green-400 px-2 py-0.5 rounded border border-green-500/20">
                LUNAS
              </span>
            ) : (
              !props.customer?.ispaid && (
                <motion.span 
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-[9px] font-black bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20"
                >
                  UNPAID
                </motion.span>
              )
            )}
          </div>
        </div>

        {/* Compact Card Body */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border border-white/10 shadow-inner flex-shrink-0">
            <IonIcon icon={personOutline} className="text-base text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-white truncate leading-tight">
              {props.customer?.namapelanggan}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-slate-400 font-medium">
                {props.customer?.namasubkategori}
              </span>
              <span className="w-0.5 h-0.5 bg-white/10 rounded-full"></span>
              <span className="text-[10px] text-slate-500 font-mono">
                {props.customer?.nolayanan}
              </span>
            </div>
          </div>
        </div>

        {/* Tight Details Grid */}
        <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 py-1">
          {[
            { icon: homeOutline, value: props.customer?.alamatpemasangan },
            { icon: timeOutline, value: isOverdue ? `Telat ${overdueDays}d` : `${overdueDays}d lagi`, color: isOverdue ? "text-red-400" : "" },
            { icon: businessOutline, value: props.customer?.namaprofile },
            { icon: calendarOutline, value: `Sejak ${formatDate(props.customer?.tglaktif ?? "")}` }
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5 min-w-0">
              <IonIcon icon={item.icon} className={`text-xs ${item.color || "text-slate-500"}`} />
              <span className={`text-[11px] truncate ${item.color || "text-slate-400"}`}>{item.value}</span>
            </div>
          ))}
        </div>

        {/* Compact Financial Info */}
        {props.customer?.unpaid && (
          <div className="bg-white/5 rounded-xl px-3 py-2 border border-white/5 flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter leading-none">TOTAL TAGIHAN</span>
              <span className="text-xs font-black text-accent mt-0.5">
                {formatRupiah(Number(props.customer?.unpaid?.total))}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium opacity-50">
              {formatRupiah(Number(props.customer?.unpaid?.total))}
            </div>
          </div>
        )}

        {/* Tight Action Bar */}
        <div className="flex items-center gap-1.5 pt-1">
          <GlassButton
            variant="secondary"
            size="sm"
            className="flex-1 !py-2"
            onClick={(e) => { e.stopPropagation(); setShowComplaintModal(true); }}
          >
            <IonIcon icon={warningOutline} className="text-xs" />
            <span className="text-[10px]">Keluhan</span>
          </GlassButton>
          
          <GlassButton
            variant="secondary"
            size="sm"
            className="flex-1 !py-2"
            onClick={async (e) => {
              e.stopPropagation();
              await AppLauncher.openUrl({
                url: `whatsapp://send?phone=62${props.customer?.profile?.phone.substring(1)}`,
              });
            }}
          >
            <IonIcon icon={callOutline} className="text-xs" />
            <span className="text-[10px]">Chat</span>
          </GlassButton>

          {!props.customer?.ispaid && (
            <GlassButton
              variant="primary"
              size="sm"
              className="flex-[1.2] !py-2"
              onClick={(e) => {
                e.stopPropagation();
                history.push("/payment?invoice=" + props.customer?.unpaid?.invoice);
              }}
            >
              <IonIcon icon={cashOutline} className="text-xs" />
              <span className="text-[10px]">Bayar</span>
            </GlassButton>
          )}

          {props.customer?.paid && (
            <GlassButton
              variant="secondary"
              size="sm"
              className="!p-2"
              onClick={(e) => {
                e.stopPropagation();
                if (props.onClickDetail) props.onClickDetail();
              }}
            >
              <IonIcon icon={eyeOutline} className="text-base" />
            </GlassButton>
          )}
        </div>
      </div>


      {/* Glass Complaint Modal */}
      <IonModal
        isOpen={showComplaintModal}
        onDidDismiss={() => setShowComplaintModal(false)}
        breakpoints={[0, 0.6, 0.8]}
        initialBreakpoint={0.6}
        className="glass-modal"
      >
        <div className="glass-dark h-full p-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-white">Lapor Keluhan</h2>
              <p className="text-slate-400 text-sm">Pelanggan: {props.customer?.namapelanggan}</p>
            </div>
            <GlassButton variant="ghost" size="sm" onClick={() => setShowComplaintModal(false)} className="!p-2">
              <IonIcon icon={closeCircleOutline} className="text-2xl" />
            </GlassButton>
          </div>

          <div className="flex-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Detail Masalah</label>
            <textarea
              placeholder="Jelaskan kendala yang dialami pelanggan..."
              className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              value={complaintText}
              onChange={(e) => setComplaintText(e.target.value)}
            />
          </div>

          <GlassButton 
            variant="primary" 
            size="lg" 
            className="w-full"
            disabled={!complaintText.trim()}
            onClick={sendComplaintToWhatsapp}
          >
            Kirim Laporan ke WhatsApp
          </GlassButton>
        </div>
      </IonModal>

      <style>{`
        .glass-modal {
          --background: transparent;
          --border-radius: 32px 32px 0 0;
        }
        .glass-modal::part(content) {
          background: transparent;
          backdrop-filter: blur(20px);
        }
      `}</style>
    </GlassCard>
  );
};

export default React.memo(DetailCardCustomer);

