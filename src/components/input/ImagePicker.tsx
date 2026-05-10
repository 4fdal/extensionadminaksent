import { Capacitor } from "@capacitor/core";
import { FilePicker } from "@capawesome/capacitor-file-picker";
import { IonIcon, IonText } from "@ionic/react";
import { imageOutline, trashOutline, syncOutline } from "ionicons/icons";
import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import GlassButton from "./../ui/GlassButton";

type ImagePickerProp = {
  src?: string | null;
  onChange?: (ev: { path: string }) => void;
};

const ImagePicker: React.FC<ImagePickerProp> = (props) => {
  const [imageScr, setImageSrc] = useState<string | null>(null);
  const [scale, setScale] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialDistance = useRef<number | null>(null);

  const handleImageUpload = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      const result = await FilePicker.pickFiles({ types: ["image/*"] });
      if (result.files.length > 0) {
        const file = result.files[0];
        if (file.path) {
          const capFilePath = Capacitor.convertFileSrc(file.path);
          setImageSrc(capFilePath);
          setScale(1);
          if (props.onChange) props.onChange({ path: capFilePath });
        }
      }
    } catch (error) {
      console.error("Error picking file:", error);
    }
  };

  useEffect(() => {
    if (props.src !== undefined && imageScr !== props.src) {
      setImageSrc(props.src);
      setScale(1);
    }
  }, [props.src]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      initialDistance.current = dist / scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && initialDistance.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const newScale = Math.min(Math.max(1, dist / initialDistance.current), 4);
      setScale(newScale);
    }
  };

  const handleTouchEnd = () => {
    initialDistance.current = null;
  };

  return (
    <div className="flex flex-col gap-2 h-full">
      <div
        ref={containerRef}
        className={`w-full relative rounded-2xl flex-1 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 overflow-hidden ${
          imageScr
            ? "border-transparent bg-slate-100"
            : "border-slate-300 bg-white/50 hover:bg-white/80 cursor-pointer"
        }`}
        style={{ minHeight: "16rem", touchAction: "none" }}
        onClick={!imageScr ? handleImageUpload : undefined}
      >
        {!imageScr ? (
          <div className="text-center text-slate-400 p-6 flex flex-col items-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-3 border border-slate-100">
              <IonIcon icon={imageOutline} className="text-3xl text-primary" />
            </div>
            <IonText className="block text-sm font-bold text-slate-700 mb-1">
              Tap untuk upload bukti
            </IonText>
            <IonText className="block text-xs font-medium text-slate-400">
              Mendukung format JPG, PNG
            </IonText>
          </div>
        ) : (
          <>
            <motion.img
              src={imageScr}
              alt="Preview Bukti Pembayaran"
              drag={scale > 1}
              dragElastic={0.2}
              dragMomentum={false}
              animate={{ scale, x: scale === 1 ? 0 : undefined, y: scale === 1 ? 0 : undefined }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className={`w-full h-auto max-h-[60vh] object-contain ${
                scale > 1 ? "cursor-grab active:cursor-grabbing" : "cursor-default"
              }`}
              style={{ originX: 0.5, originY: 0.5 }}
            />

            {/* Hover Actions / Overlay Controls */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
              <button
                onClick={handleImageUpload}
                className="bg-white/90 backdrop-blur-md shadow-sm px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 text-[10px] font-bold hover:bg-white flex items-center gap-1.5 transition-colors"
              >
                <IonIcon icon={syncOutline} className="text-primary text-sm" />
                Ganti
              </button>
            </div>
          </>
        )}
      </div>

      {imageScr && (
        <GlassButton
          variant="danger"
          size="sm"
          onClick={() => {
            setImageSrc(null);
            setScale(1);
            if (props.onChange) props.onChange({ path: "" });
          }}
          className="w-full mt-1"
        >
          <IonIcon icon={trashOutline} className="text-base" />
          <span>Hapus Gambar</span>
        </GlassButton>
      )}
    </div>
  );
};

export default React.memo(ImagePicker);
