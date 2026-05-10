import React from "react";
import { IonIcon, IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonContent, IonImg } from "@ionic/react";
import { warningOutline } from "ionicons/icons";
import { Payment } from "@/utils/payment";
import { Customer } from "@/types/customer";
import DetailCardCustomer from "@/components/customer/DetailCardCustomer";

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
    <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 flex items-start gap-3">
      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
        <IonIcon icon={warningOutline} className="text-orange-600 text-xl" />
      </div>
      <div>
        <h4 className="font-bold text-orange-800 text-sm">Waktu Pembayaran</h4>
        <div className="flex flex-col">
          {payments.map((item) => (
            <span
              key={item.invoice}
              onClick={() => onItemClick(item)}
              className="text-red-600 font-bold cursor-pointer"
            >
              {item.nolayanan} / {item.namapelanggan}
            </span>
          ))}
        </div>
        <p className="text-orange-500 text-xs mt-0.5">
          Telah terpantau ada pelanggan yang melakukan pembayaran pada waktu yang sama
        </p>

        <IonModal isOpen={showModal} onDidDismiss={onCloseModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle className="px-4">
                {modalData?.namapelanggan}
              </IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={onCloseModal}>Close</IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding flex flex-col gap-2">
            {modalData?.payment?.gambar && (
              <div className="relative bg-white rounded-2xl shadow-sm border-2 overflow-hidden border-transparent mb-4">
                <IonImg src={modalData.payment.gambar} />
              </div>
            )}
            <div className="mt-3 mb-20">
              {modalData && <DetailCardCustomer customer={modalData} />}
            </div>
          </IonContent>
        </IonModal>
      </div>
    </div>
  );
};

export default React.memo(PaymentExistsWarning);
