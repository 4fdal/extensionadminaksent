import DetailCardCustomer from "@/components/customer/DetailCardCustomer";
import DataList from "@/components/list/DataList";
import HeaderFilterChipToolbar from "@/components/toolbars/HeaderFilterChip";
import TextSearchToolbar from "@/components/toolbars/TextSearch";
import { useCustomer } from "@/hook/requests/customer";
import { Customer } from "@/types/customer";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { ellipsisVertical } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { List, RowComponentProps, useDynamicRowHeight } from "react-window";

type DataItemRenderProp = {
  children?: React.ReactNode;
  data: Array<Customer>;
};

function DetailCardCustomerRow(
  rowProps: RowComponentProps<{ data: Customer[] }>,
): React.ReactElement<RowComponentProps<{ data: Array<Customer> }>> {
  return (
    <div style={rowProps.style}>
      <DetailCardCustomer customer={rowProps.data[rowProps.index]} />
    </div>
  );
}

const DataItemRender: React.FC<DataItemRenderProp> = (props) => {
  const rowHeight = useDynamicRowHeight({
    defaultRowHeight: 350,
  });

  return (
    <List
      rowComponent={DetailCardCustomerRow}
      rowCount={props.data.length}
      rowHeight={rowHeight}
      rowProps={{ data: props.data }}
    ></List>
  );
};

const CustomerPage: React.FC = () => {
  const [isPageLoaded, hasPageLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const uc = useCustomer();

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!isPageLoaded) {
        await uc.reqAllCustomers();
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
          onClick={(tap) => uc.setTapFilter(tap.key)}
          taps={[
            {
              key: "UNPAID",
              label: "Unpaid",
              count: uc.totalUnpaidCustomer,
            },
            {
              key: "PAID",
              label: "Paid",
              count: uc.totalPaidCustomer,
            },
            {
              key: "ALL",
              label: "Semua",
              count: uc.totalCustomer,
            },
          ]}
        />

        {/* Sort & Filter Bar */}
      </IonHeader>

      <IonContent>
        <DataList loading={loading} dataNotFound={uc.totalCustomer == 0}>
          <DataItemRender data={uc.customers} />
        </DataList>
      </IonContent>
    </IonPage>
  );
};

export default CustomerPage;
