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
import {
  IonActionSheet,
  IonButton,
  IonButtons,
  IonContent,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonModal,
} from "@ionic/react";
import { close, ellipsisVertical, refreshCircle, search } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

type DataItemRenderProp = {
  children?: React.ReactNode;
  data: Array<Customer>;
  tab?: Tab | null;
  onClickDetail?: (cust: Customer) => void;
};

// function DetailCardCustomerRow(
//   rowProps: RowComponentProps<{ data: Customer[] }>,
// ): React.ReactElement<RowComponentProps<{ data: Array<Customer> }>> {
//   return (
//     <div style={rowProps.style}>
//       <DetailCardCustomer customer={rowProps.data[rowProps.index]} />
//     </div>
//   );
// }

// const DataItemRender: React.FC<DataItemRenderProp> = (props) => {
//   const rowHeight = useDynamicRowHeight({
//     defaultRowHeight: 350,
//   });

//   return (
//     <List
//       rowComponent={DetailCardCustomerRow}
//       rowCount={props.data.length}
//       rowHeight={rowHeight}
//       rowProps={{ data: props.data }}
//     ></List>
//   );
// };

const DataItemRender: React.FC<DataItemRenderProp> = (props) => {
  const DEFAULT_START = 0;
  const DEFAULT_END = 5;
  const DEFAULT_LENGTH = 5;
  const SCROLL_DOWN_ACTIVE = 750;

  const [customerItems, setCustomerItems] = useState<Array<Customer>>([]);
  const [start, setStart] = useState<number>(DEFAULT_START);
  const [end, setEnd] = useState<number>(DEFAULT_END);

  const { tab, data } = props;

  useEffect(() => {
    setStart(DEFAULT_START);
    setEnd(DEFAULT_END);
    setCustomerItems([...props.data.slice(DEFAULT_START, DEFAULT_END)]);
  }, [tab, data]);

  return (
    <>
      <IonContent
        scrollEvents={true}
        scrollY={true}
        className="h-[65vh] flex flex-col gap-2"
      >
        <div>
          {customerItems.map((item) => (
            <div key={item.nolayanan} className="mb-2">
              <DetailCardCustomer
                customer={item}
                onClickDetail={() => {
                  if (props.onClickDetail) props.onClickDetail(item);
                }}
              />
            </div>
          ))}
        </div>
        {/* <div className="flex justify-center my-3">
          <span className="animate-bounce flex flex-row gap-2 items-center">
            <button
              onClick={() => {
                const currentStart = start + DEFAULT_LENGTH;
                const currentEnd = end + DEFAULT_LENGTH;

                setCustomerItems((prev) => [
                  ...prev,
                  ...props.data.slice(currentStart, currentEnd),
                ]);

                setStart(currentStart);
                setEnd(currentEnd);
              }}
            >
              <IonIcon
                className="h-10 w-10 text-blue-500"
                icon={arrowDownCircleOutline}
              />
            </button>
          </span>
        </div> */}
        <IonInfiniteScroll
          threshold={`${SCROLL_DOWN_ACTIVE}px`}
          onIonInfinite={(ev) => {
            const currentStart = start + DEFAULT_LENGTH;
            const currentEnd = end + DEFAULT_LENGTH;

            setCustomerItems([
              ...customerItems,
              ...props.data.slice(currentStart, currentEnd),
            ]);

            setStart(currentStart);
            setEnd(currentEnd);

            ev.target.complete();
          }}
        >
          <IonInfiniteScrollContent loadingText="Loading more..." />
        </IonInfiniteScroll>
      </IonContent>
    </>
  );
};

const CustomerPage: React.FC = () => {
  const history = useHistory();

  const [isPageLoaded, hasPageLoaded] = useState<boolean>(false);
  const [showActionSheet, setShowActionSheet] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabFilter, setTabFilter] = useState<Tab | null>(null);
  const { customer: uc } = useAppContext();

  const [modalCustDetail, setModalCustDetail] = useState<Customer | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!isPageLoaded) {
        await uc?.reqAllCustomers(true);
        hasPageLoaded(true);
      }
      setLoading(false);
    })();
  }, [isPageLoaded, uc]);

  const handleSyncCustomer = async () => {
    setLoading(true);
    setShowActionSheet(false);
    await uc?.reqAllCustomers(true);
    setLoading(false);
  };

  return (
    <BaseLayout
      headerTitle="Berlangganan"
      headerRender={
        <>
          {/* Search Bar */}
          <TextSearchToolbar
            onChange={(searchText) => uc?.setSearchFilter(searchText)}
          />

          {/* Status Filter Chips */}
          <HeaderFilterChipToolbar
            onChange={(tab) => {
              uc?.setTabFilter(tab.key);
              setTabFilter(tab);
            }}
            tabs={[
              {
                key: "UNPAID",
                label: "Unpaid",
                count: uc?.totalUnpaidCustomer ?? 0,
              },
              {
                key: "PAID",
                label: "Paid",
                count: uc?.totalPaidCustomer ?? 0,
              },
              {
                key: "PAID_NO_SYNC",
                label: "Paid (Not Sync)",
                count: uc?.countUnpaidNotSyncCustomer ?? 0,
              },
              {
                key: "ISOLIR",
                label: "Isolir",
                count: uc?.totalIsolirCustomer ?? 0,
              },
              {
                key: "NEW",
                label: "New",
                count: uc?.countNewCustomer ?? 0,
              },
              {
                key: "ALL",
                label: "Semua",
                count: uc?.totalCustomer ?? 0,
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
        <DataList loading={loading} dataNotFound={uc?.totalCustomer == 0}>
          <DataItemRender
            onClickDetail={(item) => setModalCustDetail(item)}
            data={uc?.filteredCustomers ?? []}
            tab={tabFilter}
          />
        </DataList>

        <IonModal
          isOpen={modalCustDetail != null}
          onDidDismiss={() => {
            setModalCustDetail(null);
          }}
          breakpoints={[0, 0.5, 0.8, 1]}
          initialBreakpoint={0.6}
          handleBehavior="cycle"
          className="customer-modal"
        >
          {modalCustDetail?.payment ? (
            <div className="p-2 mt-2   flex flex-col gap-2 h-full">
              <PaymentDetailCustomer data={modalCustDetail.payment} />
              <IonButton
                style={{
                  "--border-radius": "20px",
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
                    "--border-radius": "20px",
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
