import DetailCardCustomer from "@/components/customer/DetailCardCustomer";
import DataList from "@/components/list/DataList";
import HeaderFilterChipToolbar, {
  Tab,
} from "@/components/toolbars/HeaderFilterChip";
import TextSearchToolbar from "@/components/toolbars/TextSearch";
import { useAppContext } from "@/context/app-context";
import { Customer } from "@/types/customer";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { ellipsisVertical } from "ionicons/icons";
import React, { useEffect, useState } from "react";

type DataItemRenderProp = {
  children?: React.ReactNode;
  data: Array<Customer>;
  tab?: Tab | null;
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
              <DetailCardCustomer customer={item} />
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
  const [isPageLoaded, hasPageLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabFilter, setTabFilter] = useState<Tab | null>(null);
  const { customer: uc } = useAppContext();

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!isPageLoaded) {
        await uc?.reqAllCustomers();
        hasPageLoaded(true);
      }
      setLoading(false);
    })();
  }, [isPageLoaded, uc]);

  return (
    <IonPage className="bg-gray-50">
      <IonLoading isOpen={false} message="Memproses..." />

      {/* Header */}
      <IonHeader className="ion-no-border shadow-sm">
        <IonToolbar className="bg-white">
          <IonTitle className="text-white font-bold text-lg mx-5">
            Berlangganan
          </IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => {}}>
              <IonIcon icon={ellipsisVertical} className="text-gray-600" />
            </IonButton>
          </IonButtons>
        </IonToolbar>

        {/* Search Bar */}
        <TextSearchToolbar />

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
              key: "ALL",
              label: "Semua",
              count: uc?.totalCustomer ?? 0,
            },
          ]}
        />

        {/* Sort & Filter Bar */}
      </IonHeader>

      <IonContent>
        <DataList loading={loading} dataNotFound={uc?.totalCustomer == 0}>
          <DataItemRender data={uc?.customers ?? []} tab={tabFilter} />
        </DataList>
      </IonContent>
    </IonPage>
  );
};

export default React.memo(CustomerPage);
