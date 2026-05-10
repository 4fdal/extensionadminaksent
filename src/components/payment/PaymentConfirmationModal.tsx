import React from "react";
import { IonModal, IonButton, IonIcon } from "@ionic/react";
import { checkmarkCircle } from "ionicons/icons";
import { Customer } from "@/types/customer";

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
      className="confirm-modal"
      breakpoints={[0, 0.45]}
      initialBreakpoint={0.45}
    >
      <div className="p-6 bg-white flex flex-col  h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <IonIcon icon={checkmarkCircle} className="text-4xl text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Konfirmasi Pembayaran
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Apakah anda yakin ingin menyelesaikan pembayaran untuk{" "}
            <span className="font-bold text-gray-800">
              {customerName}
            </span>?
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <IonButton
            expand="block"
            className="h-12 font-bold"
            style={{ "--border-radius": "14px" }}
            onClick={onConfirm}
          >
            Ya, Selesaikan
          </IonButton>
          <IonButton
            expand="block"
            fill="clear"
            className="h-12 font-bold text-gray-500"
            onClick={onDismiss}
          >
            Batal
          </IonButton>
        </div>
      </div>
    </IonModal>
  );
};

export default React.memo(PaymentConfirmationModal);
