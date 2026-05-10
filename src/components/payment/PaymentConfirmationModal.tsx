import React from "react";
import { IonModal, IonIcon } from "@ionic/react";
import { checkmarkCircle, close } from "ionicons/icons";
import GlassButton from "../ui/GlassButton";
import { motion } from "framer-motion";

type PaymentConfirmationModalProps = {
  isOpen: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  customerName: string | undefined;
};

const PaymentConfirmationModal: React.FC<PaymentConfirmationModalProps> = ({
  isOpen,
  onDismiss,
  onConfirm,
  customerName,
}) => {
  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onDismiss}
      className="glass-modal-confirm"
      breakpoints={[0, 0.5]}
      initialBreakpoint={0.5}
    >
      <div className="glass-dark h-full p-8 flex flex-col gap-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center border border-primary/30 relative">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-primary blur-2xl rounded-full"
            />
            <IonIcon icon={checkmarkCircle} className="text-4xl text-primary relative z-10" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Konfirmasi Bayar</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Apakah Anda yakin ingin memproses pelunasan untuk pelanggan{" "}
            <span className="text-slate-800 font-bold">{customerName}</span>?
          </p>
        </div>

        <div className="flex flex-col gap-3 mt-4">
          <GlassButton
            variant="primary"
            size="lg"
            className="w-full font-black tracking-widest"
            onClick={onConfirm}
          >
            YA, SELESAIKAN
          </GlassButton>
          <GlassButton
            variant="ghost"
            size="lg"
            className="w-full text-slate-500 font-bold"
            onClick={onDismiss}
          >
            Kembali
          </GlassButton>
        </div>
      </div>

      <style>{`
        .glass-modal-confirm::part(content) {
          background: transparent;
          backdrop-filter: blur(20px);
          border-radius: 32px 32px 0 0;
        }
      `}</style>
    </IonModal>
  );
};

export default React.memo(PaymentConfirmationModal);

