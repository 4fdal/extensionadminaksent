import DataItemRender from "@/components/customer/DataItemRender";
import CustomerDetailModal from "@/components/customer/CustomerDetailModal";
import DetailCardCustomer from "@/components/customer/DetailCardCustomer";
import BaseLayout from "@/components/layout/BaseLayout";
import DataList from "@/components/list/DataList";
import HeaderFilterChipToolbar, {
  Tab,
} from "@/components/toolbars/HeaderFilterChip";
import TextSearchToolbar from "@/components/toolbars/TextSearch";
import { useAppContext } from "@/context/app-context";
import { Customer } from "@/types/customer";
import {
  IonActionSheet,
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
} from "@ionic/react";
import { ellipsisVertical, refreshCircle } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

const CustomerPage: React.FC = () => {
  const history = useHistory();

  const [isPageLoaded, hasPageLoaded] = useState<boolean>(false);
  const [showActionSheet, setShowActionSheet] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabFilter, setTabFilter] = useState<Tab | null>(null);
  const { customer: customerContext } = useAppContext();
  const [selectedNolayanan, setSelectedNolayanan] = useState<string[]>([]);

  const handleSelectAll = () => {
    const allNolayanan =
      customerContext?.filteredCustomers.map((c) => c.nolayanan) ?? [];
    if (selectedNolayanan.length === allNolayanan.length && allNolayanan.length > 0) {
      setSelectedNolayanan([]);
    } else {
      setSelectedNolayanan(allNolayanan);
    }
  };

  const handleSelectRow = (nolayanan: string) => {
    setSelectedNolayanan((prev) =>
      prev.includes(nolayanan)
        ? prev.filter((n) => n !== nolayanan)
        : [...prev, nolayanan],
    );
  };

  const [modalCustDetail, setModalCustDetail] = useState<Customer | null>(null);

  useEffect(() => {
    if (isPageLoaded || !customerContext) return;

    (async () => {
      setLoading(true);
      await customerContext.reqAllCustomers(false);
      hasPageLoaded(true);
      setLoading(false);
    })();
  }, [isPageLoaded, customerContext?.reqAllCustomers]);

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
          loadingMessage={customerContext?.loadingMessage}
          dataNotFound={(customerContext?.filteredCustomers?.length ?? 0) === 0}
          totalData={customerContext?.filteredCustomers?.length ?? 0}
          selectedCount={selectedNolayanan.length}
          onSelectAll={handleSelectAll}
          isAllSelected={
            selectedNolayanan.length > 0 &&
            selectedNolayanan.length ===
              (customerContext?.filteredCustomers?.length ?? 0)
          }
        >
          <DataItemRender
            onClickDetail={(item) => setModalCustDetail(item)}
            data={customerContext?.filteredCustomers ?? []}
            tab={tabFilter}
            selectedNolayanan={selectedNolayanan}
            onSelectRow={handleSelectRow}
          />
        </DataList>

        <CustomerDetailModal
          isOpen={modalCustDetail != null}
          customer={modalCustDetail}
          onDismiss={() => setModalCustDetail(null)}
        />
      </IonContent>
    </BaseLayout>
  );
};

export default React.memo(CustomerPage);
