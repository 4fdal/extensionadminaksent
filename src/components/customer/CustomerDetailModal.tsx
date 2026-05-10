import React from "react";
import { IonModal, IonButton, IonIcon } from "@ionic/react";
import { search } from "ionicons/icons";
import { Customer } from "@/types/customer";
import { UI_CONFIG } from "@/config";
import PaymentDetailCustomer from "./PaymentDetailCustomer";
import { useHistory } from "react-router";

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
      breakpoints={[...UI_CONFIG.MODAL_BREAKPOINTS]}
      initialBreakpoint={UI_CONFIG.MODAL_INITIAL_BREAKPOINT}
      handleBehavior="cycle"
      className="customer-modal"
    >
      {customer.payment ? (
        <div className="p-2 mt-2 flex flex-col gap-2 h-full">
          <PaymentDetailCustomer data={customer.payment} />
          <IonButton
            style={{
              "--border-radius": UI_CONFIG.BORDER_RADIUS_ROUNDED,
            }}
            onClick={onDismiss}
          >
            Close
          </IonButton>
          <div className="mb-10"></div>
        </div>
      ) : (
        <div className="text-center p-12">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <IonIcon icon={search} className="text-4xl text-gray-400" />
          </div>
          <h3 className="text-gray-800 font-semibold text-lg mb-2">
            Tidak ada data pembayaran
          </h3>
          <p className="text-gray-500 text-sm">
            Coba lakukan proses sync pembayaran terlebih dahulu!
          </p>
          <IonButton
            className="mt-3"
            style={{
              "--border-radius": UI_CONFIG.BORDER_RADIUS_ROUNDED,
            }}
            onClick={() => {
              history.push("/payment?invoice=" + customer.paid?.invoice);
              onDismiss();
            }}
          >
            Sync Pembayaran
          </IonButton>
        </div>
      )}
    </IonModal>
  );
};

export default React.memo(CustomerDetailModal);
