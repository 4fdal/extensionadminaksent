import React from "react";
import { IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonImg } from "@ionic/react";
import { warningOutline, eyeOutline, closeCircleOutline } from "ionicons/icons";
import { Payment } from "@/utils/payment";
import { Customer } from "@/types/customer";
import DetailCardCustomer from "@/components/customer/DetailCardCustomer";
import GlassButton from "@/components/ui/GlassButton";

type PaymentExistsWarningProps = {
  payments: Payment[];
  onItemClick: (item: Payment) => void;
  showModal: boolean;
  modalData: Customer | null;
  onCloseModal: () => void;
};

const PaymentExistsWarning: React.FC<PaymentExistsWarningProps> = ({
  payments,
  onItemClick,
  showModal,
  modalData,
  onCloseModal,
}) => {
  if (payments.length === 0) return null;

  return (
    <div className="mt-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
      <div className="flex items-start gap-2.5">
        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
          <IonIcon icon={warningOutline} className="text-orange-600 text-base" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-bold text-orange-800 text-xs">Waktu Pembayaran Sama</span>
          <p className="text-orange-500 text-[10px] mt-0.5">
            {payments.length} pelanggan membayar pada waktu yang sama
          </p>
        </div>
      </div>

      <div className="mt-2 space-y-1.5">
        {payments.map((item) => (
          <div
            key={item.invoice}
            className="flex items-center justify-between bg-white/70 rounded-lg px-2.5 py-1.5 border border-orange-100"
          >
            <div className="flex-1 min-w-0">
              <span className="text-xs font-bold text-slate-800 truncate block">
                {item.namapelanggan}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {item.nolayanan}
              </span>
            </div>
            <button
              onClick={() => onItemClick(item)}
              className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-md text-[10px] font-bold hover:bg-primary/20 transition-colors flex-shrink-0"
            >
              <IonIcon icon={eyeOutline} className="text-xs" />
              Detail
            </button>
          </div>
        ))}
      </div>

      <IonModal
        isOpen={showModal}
        breakpoints={[0, 0.6, 0.8, 0.95]}
        initialBreakpoint={0.6}
        onDidDismiss={onCloseModal}
        className="payment-detail-modal"
      >
        <IonContent className="ion-padding !bg-slate-50">
          <div className="flex flex-col gap-4">
            {/* Modal Header Handle & Close */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col pt-4">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Detail Pembayaran</span>
                <h2 className="text-xl font-black text-slate-800 leading-tight">
                  {modalData?.namapelanggan}
                </h2>
              </div>
              <GlassButton
                variant="ghost"
                size="sm"
                className="!p-2 mt-4"
                onClick={onCloseModal}
              >
                <IonIcon icon={closeCircleOutline} className="text-2xl text-slate-400" />
              </GlassButton>
            </div>

            {/* Image Preview with better framing */}
            {modalData?.payment?.gambar && (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-400/20 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white rounded-[1.5rem] shadow-sm border border-slate-100 overflow-hidden aspect-[4/3] flex items-center justify-center">
                  <IonImg
                    src={modalData.payment.gambar}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            )}

            {/* Customer Details */}
            <div className="mt-2 mb-10">
              {modalData && (
                <div className="space-y-4">
                  <DetailCardCustomer
                    customer={modalData}
                    hiddenShowDetailButton={true}
                  />

                  {/* Status Indicator inside Modal */}
                  <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-100">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <IonIcon icon={eyeOutline} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-tighter">Status Transaksi</p>
                      <p className="text-xs font-bold text-green-800">Pembayaran Terverifikasi</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </IonContent>
      </IonModal>
    </div>
  );
};

export default React.memo(PaymentExistsWarning);
