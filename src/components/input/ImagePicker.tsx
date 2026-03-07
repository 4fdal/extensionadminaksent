import { Capacitor } from "@capacitor/core";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { IonButton, IonIcon, IonImg, IonText } from "@ionic/react";
import { imageOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";

type ImagePickerProp = {
  src?: string | null;
  onChange?: (ev: { path: string }) => void;
};

const ImagePicker: React.FC<ImagePickerProp> = (props) => {
  const [imageScr, setImageSrc] = useState<string | null>(null);
  const [hight, setHight] = useState<number | undefined>(undefined);

  const handleImageUpload = async () => {
    // const result = await FilePicker.pickFiles({
    //   readData: true,
    // });
    // const file = result.files[0];
    // file.data = `data:${file.mimeType};base64,${file.data}`;
    // const path = Capacitor.convertFileSrc(file.path ?? "");
    // console.log(file);
    // if (file.blob) {
    //   setImageFile(
    //     new File([file.blob], file.name, {
    //       type: file.mimeType,
    //       lastModified: Date.now(),
    //     }),
    //   );
    //   setImageSrc(path);
    //   setHight(file.height);
    // }
    // if (props.onChange) props.onChange({ file, path });

    const result = await FilePicker.pickFiles({ types: ["image/*"] });
    if (result.files.length > 0) {
      const file = result.files[0];
      if (file.path) {
        const capFilePath = Capacitor.convertFileSrc(file.path);
        setImageSrc(capFilePath);
        setHight(file.height);
        if (props.onChange) props.onChange({ path: capFilePath });
      }
    }
  };

  useEffect(() => {
    if (imageScr == null && props.src) setImageSrc(props.src);
  }, [props.src]);

  console.log({ imageScr });

  return (
    <div className="">
      <div
        onClick={handleImageUpload}
        className={`w-full ${imageScr ? `h-[${hight}px]` : "h-48"} rounded-lg flex items-center justify-center border-2 border-dashed border-blue-500 cursor-pointer overflow-hidden relative transition-all duration-200 ${imageScr ? "bg-transparent" : "bg-blue-50"}`}
      >
        {imageScr ? (
          <IonImg src={imageScr} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-blue-500">
            <IonIcon icon={imageOutline} className="text-5xl mb-2" />
            <IonText className="block text-sm font-medium">
              Tap untuk upload bukti
            </IonText>
          </div>
        )}
      </div>

      {imageScr && (
        <IonButton
          expand="block"
          fill="clear"
          size="small"
          onClick={() => {
            setImageSrc(null);
          }}
          className="mt-2 text-red-500"
        >
          Hapus Gambar
        </IonButton>
      )}
    </div>
  );
};

export default React.memo(ImagePicker);
