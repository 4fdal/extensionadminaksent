import React from "react";
import {
  IonCard,
  IonCardContent,
  IonImg,
  IonIcon,
  IonBadge,
} from "@ionic/react";
import { personOutline, calendarOutline, timeOutline } from "ionicons/icons";
import { PaymentCustomer } from "@/types/customer";
import { formatDate } from "@/utils";

type PaymentDetailCustomerProp = {
  data?: PaymentCustomer;
};

const PaymentDetailCustomer: React.FC<PaymentDetailCustomerProp> = (props) => {
  return (
    <IonCard className="m-0 rounded-2xl shadow-sm overflow-y-auto border border-gray-50">
      {/* Gambar Bukti Bayar */}
      <div className="relative">
        {props.data?.gambar ? (
          <IonImg
            src={props.data?.gambar}
            alt="Bukti Bayar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="mt-10"></div>
        )}
        <div className="absolute top-2 right-2">
          <IonBadge
            color="success"
            className="rounded-lg px-2 py-1 text-xs font-bold"
          >
            Lunas
          </IonBadge>
        </div>
      </div>

      <IonCardContent className="p-4">
        {/* Info Utama */}
        <div className="flex justify-between items-start mb-3 border-b border-dashed border-gray-200 pb-3">
          <div>
            <h3 className="font-bold text-gray-800 text-base flex items-center gap-2">
              <IonIcon icon={personOutline} className="text-indigo-500" />
              {props.data?.namapelanggan}
            </h3>
            <p className="text-gray-500 text-xs ml-6">
              No. Layanan: {props.data?.nolayanan}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Invoice</p>
            <p className="text-xs font-mono text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
              {props.data?.invoice}
            </p>
          </div>
        </div>

        {/* Detail Waktu & Status */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            {props.data?.tanggalbayar && (
              <span className="flex items-center gap-1">
                <IonIcon icon={calendarOutline} className="text-gray-400" />
                {formatDate(new Date(props.data.tanggalbayar), "DD/MM/YYYY")}
              </span>
            )}
            {props.data?.waktubayar && (
              <span className="flex items-center gap-1">
                <IonIcon icon={timeOutline} className="text-gray-400" />
                {formatDate(new Date(props.data.waktubayar), "HH:mm:ss")}
              </span>
            )}
          </div>
        </div>

        {/* Total Pembayaran */}
        <div className="flex justify-between items-center bg-indigo-50 rounded-xl p-3">
          <span className="text-sm text-indigo-800 font-medium">
            Total Bayar
          </span>
          <span className="text-lg font-bold text-indigo-700">
            Rp {(props.data?.total ?? 0).toLocaleString("id-ID")}
          </span>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default React.memo(PaymentDetailCustomer);
