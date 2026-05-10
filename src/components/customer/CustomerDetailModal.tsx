import React from "react";
import { IonModal, IonIcon } from "@ionic/react";
import { search, close } from "ionicons/icons";
import { Customer } from "@/types/customer";
import PaymentDetailCustomer from "./PaymentDetailCustomer";
import { useHistory } from "react-router";
import GlassButton from "../ui/GlassButton";

type CustomerDetailModalProps = {
  customer: Customer | null;
  isOpen: boolean;
  onDismiss: () => void;
};

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  customer,
  isOpen,
  onDismiss,
}) => {
  const history = useHistory();

  if (!customer) return null;

  return (
    <IonModal
      isOpen={isOpen}
      onDidDismiss={onDismiss}
      breakpoints={[0, 0.8, 1]}
      initialBreakpoint={0.8}
      className="glass-modal"
    >
      <div className="glass-dark h-full p-4 flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Detail Pembayaran</h2>
            <p className="text-slate-500 text-xs">{customer.namapelanggan}</p>
          </div>
          <GlassButton variant="ghost" size="sm" onClick={onDismiss} className="!p-1.5">
            <IonIcon icon={close} className="text-xl" />
          </GlassButton>
        </div>

        <div className="flex-1 overflow-y-auto">
          {customer.payment ? (
            <div className="space-y-4">
              <PaymentDetailCustomer data={customer.payment} />
              <GlassButton variant="secondary" size="sm" className="w-full" onClick={onDismiss}>
                Tutup Detail
              </GlassButton>
            </div>
          ) : (
            <div className="text-center py-8 px-4">
              <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
                <IonIcon icon={search} className="text-3xl text-slate-400" />
              </div>
              <h3 className="text-slate-800 font-bold text-base mb-1">
                Tidak Ada Riwayat
              </h3>
              <p className="text-slate-600 text-xs mb-6">
                Data pembayaran digital belum tersedia untuk pelanggan ini.
              </p>
              
              {customer.paid && (
                <GlassButton
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    history.push("/payment?invoice=" + customer.paid?.invoice);
                    onDismiss();
                  }}
                >
                  Sinkronisasi Pembayaran
                </GlassButton>
              )}
            </div>
          )}
        </div>
        <div className="pb-2" />
      </div>

      <style>{`
        .glass-modal::part(content) {
          background: transparent;
          backdrop-filter: blur(20px);
          border-radius: 24px 24px 0 0;
        }
      `}</style>

    </IonModal>
  );
};

export default React.memo(CustomerDetailModal);

