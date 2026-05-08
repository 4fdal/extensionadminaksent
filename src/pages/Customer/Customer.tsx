import DataItemRender from "@/components/customer/DataItemRender";
import DetailCardCustomer from "@/components/customer/DetailCardCustomer";
import PaymentDetailCustomer from "@/components/customer/PaymentDetailCustomer";
import BaseLayout from "@/components/layout/BaseLayout";
import DataList from "@/components/list/DataList";
import HeaderFilterChipToolbar, {
  Tab,
} from "@/components/toolbars/HeaderFilterChip";
import TextSearchToolbar from "@/components/toolbars/TextSearch";
import { useAppContext } from "@/context/app-context";
import { Customer } from "@/types/customer";
import { UI_CONFIG } from "@/config";
import {
  IonActionSheet,
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonModal,
} from "@ionic/react";
import { ellipsisVertical, refreshCircle, search } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

const CustomerPage: React.FC = () => {
  const history = useHistory();

  const [isPageLoaded, hasPageLoaded] = useState<boolean>(false);
  const [showActionSheet, setShowActionSheet] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabFilter, setTabFilter] = useState<Tab | null>(null);
  const { customer: customerContext } = useAppContext();

  const [modalCustDetail, setModalCustDetail] = useState<Customer | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!isPageLoaded) {
        await customerContext?.reqAllCustomers(true);
        hasPageLoaded(true);
      }
      setLoading(false);
    })();
  }, [isPageLoaded, customerContext]);

  const handleSyncCustomer = async () => {
    setLoading(true);
    setShowActionSheet(false);
    await customerContext?.reqAllCustomers(true);
    setLoading(false);
  };


  return (
    <BaseLayout
      headerTitle="Berlangganan"
      headerRender={
        <>
          {/* Search Bar */}
          <TextSearchToolbar
            onChange={(searchText) => customerContext?.setSearchFilter(searchText)}
          />

          {/* Status Filter Chips */}
          <HeaderFilterChipToolbar
            onChange={(tab) => {
              customerContext?.setTabFilter(tab.key);
              setTabFilter(tab);
            }}
            tabs={[
              {
                key: "UNPAID",
                label: "Unpaid",
                count: customerContext?.totalUnpaidCustomer ?? 0,
              },
              {
                key: "PAID",
                label: "Paid",
                count: customerContext?.totalPaidCustomer ?? 0,
              },
              {
                key: "PAID_NO_SYNC",
                label: "Paid (Not Sync)",
                count: customerContext?.countUnpaidNotSyncCustomer ?? 0,
              },
              {
                key: "ISOLIR",
                label: "Isolir",
                count: customerContext?.totalIsolirCustomer ?? 0,
              },
              {
                key: "NEW",
                label: "New",
                count: customerContext?.countNewCustomer ?? 0,
              },
              {
                key: "ALL",
                label: "Semua",
                count: customerContext?.totalCustomer ?? 0,
              },
            ]}
          />
        </>
      }
      headerToolbarEndRender={
        <IonButtons slot="end">
          <IonButton onClick={() => setShowActionSheet(true)}>
            <IonIcon icon={ellipsisVertical} className="text-gray-600" />
          </IonButton>
          <IonActionSheet
            isOpen={showActionSheet}
            onDidDismiss={() => setShowActionSheet(false)}
            buttons={[
              {
                text: "Synchronize",
                icon: refreshCircle,
                handler: handleSyncCustomer,
              },

              {
                text: "Batal",
                role: "cancel",
              },
            ]}
          />
        </IonButtons>
      }
    >
      <IonContent>
        <DataList
          loading={loading}
          dataNotFound={customerContext?.totalCustomer == 0}
        >
          <DataItemRender
            onClickDetail={(item) => setModalCustDetail(item)}
            data={customerContext?.filteredCustomers ?? []}
            tab={tabFilter}
          />
        </DataList>

        <IonModal
          isOpen={modalCustDetail != null}
          onDidDismiss={() => {
            setModalCustDetail(null);
          }}
          breakpoints={[...UI_CONFIG.MODAL_BREAKPOINTS]}
          initialBreakpoint={UI_CONFIG.MODAL_INITIAL_BREAKPOINT}
          handleBehavior="cycle"
          className="customer-modal"
        >
          {modalCustDetail?.payment ? (
            <div className="p-2 mt-2   flex flex-col gap-2 h-full">
              <PaymentDetailCustomer data={modalCustDetail.payment} />
              <IonButton
                style={{
                  "--border-radius": UI_CONFIG.BORDER_RADIUS_ROUNDED,
                }}
                onClick={() => setModalCustDetail(null)}
              >
                Close
              </IonButton>
              <div className="mb-10"></div>
            </div>
          ) : (
            <>
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
                    history.push(
                      "/payment?invoice=" + modalCustDetail?.paid?.invoice,
                    );
                    setModalCustDetail(null);
                  }}
                >
                  Sync Pembayaran
                </IonButton>
              </div>
            </>
          )}
        </IonModal>
      </IonContent>
    </BaseLayout>
  );
};

export default React.memo(CustomerPage);
