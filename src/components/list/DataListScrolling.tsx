import {
  IonContent,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
} from "@ionic/react";
import React, { useEffect, useState } from "react";

type DataListScrollingProp = {
  default?: {
    start?: number;
    end?: number;
    length?: number;
    scrollDown?: number;
  };
  data: Array<object>;
  itemRender: (item: object, index: number) => React.ReactElement;
};

const DataListScrolling: React.FC<DataListScrollingProp> = (props) => {
  const [data, setData] = useState<Array<object>>([]);
  const [currentStart, setCurrentStart] = useState<number | null>(null);
  const [currentEnd, setCurrentEnd] = useState<number | null>(null);

  useEffect(() => {
    setCurrentStart(props.default?.start ?? 0);
    setCurrentEnd(props.default?.end ?? 5);
    setData([
      ...props.data.slice(props.default?.start ?? 0, props.default?.end ?? 5),
    ]);
  }, [props.data]);

  return (
    <IonContent
      scrollEvents={true}
      scrollY={true}
      className="h-[65vh] flex flex-col gap-2"
    >
      {data.map(props.itemRender)}
      <IonInfiniteScroll
        threshold={`${props.default?.scrollDown ?? 100}px`}
        onIonInfinite={(ev) => {
          const start = (currentStart ?? 0) + (props.default?.length ?? 5);
          const end = (currentEnd ?? 5) + (props.default?.length ?? 5);

          setData([...data, ...props.data.slice(start, end)]);

          console.log({
            start,
            end,
            currentStart,
            currentEnd,
            default: props.default,
          });

          setCurrentStart(start);
          setCurrentEnd(end);

          ev.target.complete();
        }}
      >
        <IonInfiniteScrollContent loadingText="Loading more..." />
      </IonInfiniteScroll>
    </IonContent>
  );
};

export default React.memo(DataListScrolling);
