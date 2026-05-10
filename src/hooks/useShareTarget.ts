import {
  CapacitorShareTarget,
  SharedFile,
  ShareReceivedEvent,
} from "@capgo/capacitor-share-target";
import { useEffect, useState } from "react";

const useShareTargetLitener = (
  onShareReceived: (event: ShareReceivedEvent) => void,
) => {
  useEffect(() => {
    const handlePromise = CapacitorShareTarget.addListener(
      "shareReceived",
      onShareReceived,
    );

    return () => {
      handlePromise.then((handle) => handle.remove());
    };
  }, [onShareReceived]);
};

export function useShareTarget() {
  const [imageFile, setImageFile] = useState<SharedFile | null>(null);

  useShareTargetLitener((event: ShareReceivedEvent) => {
    if (event.files.length > 0) {
      setImageFile(event.files[0]);
    }
  });

  return {
    imageFile,
    setImageFile,
  };
}
