import { Capacitor } from "@capacitor/core";
import { FilePicker, PickedFile } from "@capawesome/capacitor-file-picker";
import { IonButton, IonIcon, IonImg, IonText } from "@ionic/react";
import { imageOutline } from "ionicons/icons";
import React, { useState } from "react";

type ImagePickerProp = {
  onChange?: (ev : { file : PickedFile, path : string }) => void;
};

const ImagePicker: React.FC<ImagePickerProp> = (props) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<PickedFile | null>(null);

  const handleImageUpload = async () => {
    const result = await FilePicker.pickFiles({
      readData: true,
    });
    const file = result.files[0];
    file.data = `data:${file.mimeType};base64,${file.data}`;

    const path = Capacitor.convertFileSrc(file.path ?? "");

    setImageFile(file);
    setImagePreview(path);

    if(props.onChange) props.onChange({ file, path });
  }; 

  return (
    <div className="">
      <div
        onClick={handleImageUpload}
        className={`w-full ${imageFile ? `h-[${imageFile.height}px]` : "h-48"} rounded-lg flex items-center justify-center border-2 border-dashed border-blue-500 cursor-pointer overflow-hidden relative transition-all duration-200 ${imagePreview ? "bg-transparent" : "bg-blue-50"}`}
      >
        {imagePreview ? (
          <IonImg src={imagePreview} className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-blue-500">
            <IonIcon icon={imageOutline} className="text-5xl mb-2" />
            <IonText className="block text-sm font-medium">
              Tap untuk upload bukti
            </IonText>
          </div>
        )}
      </div>

      {imagePreview && (
        <IonButton
          expand="block"
          fill="clear"
          size="small"
          onClick={() => {
            setImagePreview(null);
            setImageFile(null);
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
