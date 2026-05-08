import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/react";
import { Customer } from "@/types/customer";
import { LIST_CONFIG } from "@/config";
import DetailCardCustomer from "./DetailCardCustomer";
import { Tab } from "@/components/toolbars/HeaderFilterChip";

type DataItemRenderProp = {
  children?: React.ReactNode;
  data: Array<Customer>;
  tab?: Tab | null;
  onClickDetail?: (cust: Customer) => void;
};

const DataItemRender: React.FC<DataItemRenderProp> = (props) => {
  const DEFAULT_START = 0;
  const DEFAULT_END = LIST_CONFIG.INITIAL_LOAD_ITEMS;
  const DEFAULT_LENGTH = LIST_CONFIG.LOAD_MORE_ITEMS;
  const SCROLL_DOWN_ACTIVE = LIST_CONFIG.SCROLL_THRESHOLD_PX;

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

export default React.memo(DataItemRender);
