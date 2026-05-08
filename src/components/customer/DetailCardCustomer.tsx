import { Customer } from "@/types/customer";
import { formatRupiah, formatDate, dateTimeConvertToString } from "@/utils";
import { IonIcon } from "@ionic/react";
import {
  alertCircleOutline,
  businessOutline,
  calendarOutline,
  callOutline,
  cashOutline,
  eyeOutline,
  homeOutline,
  personOutline,
  timeOutline,
} from "ionicons/icons";
import React from "react";
import { differenceInDays } from "date-fns";
import { useHistory } from "react-router";
import { AppLauncher } from "@capacitor/app-launcher";
import { sendBilToWhatsapp } from "@/utils/payment";

type DetailCardCustomerProp = {
  customer?: Customer;
  onClickDetail?: () => void | undefined;
};

const DetailCardCustomer: React.FC<DetailCardCustomerProp> = (props) => {
  const history = useHistory();

  const latePaymentDateDiff = () => {
    return differenceInDays(
      new Date(props.customer?.tglisolir ?? ""),
      new Date(),
    );
  };

  const getStatusLabel = () => {
    if (props.customer?.isolirmanual) return "Isolir";
    if (props.customer?.aktif) return "Active";
    return "Deactive";
  };

  const getCardClassName = () => {
    const baseClass =
      "relative bg-white rounded-2xl shadow-sm border-2 transition-all duration-200 overflow-hidden";
    const statusClass = props.customer?.isolirmanual
      ? "border-red-500 shadow-md"
      : "border-transparent hover:border-gray-200";
    return `${baseClass} ${statusClass}`;
  };

  return (
    <div
      key={1}
      className={getCardClassName()}
      style={{ animationDelay: `${1 * 50}ms` }}
    >

      {/* Card Header - Status & Invoice */}
      <div
        className={`px-4 pt-3 pb-2 border-b cursor-pointer`}
        onClick={() => {}}
      >
        <div className="flex items-center justify-between pl-2 pr-1">
          <div className="flex items-center gap-2">
            {/* <span className={`w-2 h-2 rounded-full`}></span> */}
            <span
              className={`text-xs font-bold uppercase ${!props.customer?.isolirmanual ? "text-blue-500" : ""}`}
            >
              {getStatusLabel()}
            </span>
            <span className="text-gray-300">|</span>
            <span className="text-xs font-mono font-semibold text-gray-600">
              {props.customer?.unpaid?.invoice ?? props.customer?.paid?.invoice}
            </span>
            {props.customer?.payment && (
              <>
                <span className="text-gray-300">|</span>
                <span className="text-xs font-mono font-semibold  flex-1 bg-green-100 text-green-800 px-2 rounded-4xl">
                  {dateTimeConvertToString(
                    new Date(props.customer?.payment.tanggalbayar),
                    new Date(props.customer?.payment.waktubayar),
                  )}
                </span>
              </>
            )}
            {!props.customer?.payment && props.customer?.paid && (
              <>
                <button
                  onClick={() => {
                    history.push(
                      "/payment?invoice=" + props.customer?.paid?.invoice,
                    );
                  }}
                >
                  <div className="text-xs bg-orange-100 px-2 rounded-2xl text-orange-800 hover:bg-orange-200 active:bg-orange-200 ">
                    Sync Pembayaran
                  </div>
                </button>
              </>
            )}
            {!props.customer?.paid && !props.customer?.unpaid && (
              <div className="text-xs bg-black text-white rounded-4xl px-2 font-bold ">
                Pelanggan Baru
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 pl-10 cursor-pointer" onClick={() => {}}>
        {/* Pelanggan Info */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-xl  flex items-center justify-center text-white shadow-md flex-shrink-0`}
          >
            <IonIcon icon={personOutline} className="text-lg text-blue-400" />
          </div>
          <div className="flex-1 min-w-0 pr-8">
            <span className="font-bold text-gray-800 text-[18px] leading-6 block truncate">
              {props.customer?.namapelanggan}
            </span>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded">
                {props.customer?.namasubkategori}
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                {props.customer?.nolayanan}
              </span>
              {!props.customer?.ispaid && (
                <span
                  onClick={() => {
                    if (props.customer) sendBilToWhatsapp(props.customer);
                  }}
                  className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded animate-pulse"
                >
                  TAGIH
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <IonIcon icon={businessOutline} className="text-gray-400" />
            <span className="truncate">{props.customer?.namaprofile}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <IonIcon icon={homeOutline} className="text-gray-400" />
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-600`}
            >
              {props.customer?.alamatpemasangan}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <IonIcon icon={calendarOutline} className="text-gray-400" />
            <span>Aktif: {formatDate(props.customer?.tglaktif ?? "")}</span>
          </div>
          <div
            className={`flex items-center gap-2 text-xs font-semibold ${
              new Date() > new Date(props.customer?.tglisolir ?? "")
                ? "text-red-500"
                : "text-gray-400"
            }`}
          >
            <IonIcon
              icon={timeOutline}
              className={
                new Date() > new Date(props.customer?.tglisolir ?? "")
                  ? "text-red-500"
                  : "text-gray-400"
              }
            />
            <span>
              {new Date() > new Date(props.customer?.tglisolir ?? "")
                ? `Terlambat ${Math.abs(latePaymentDateDiff())} hari`
                : `${latePaymentDateDiff()} hari lagi`}
            </span>
          </div>
        </div>

        {/* Financial Summary */}
        {props.customer?.unpaid && (
          <div className="bg-gray-50 rounded-xl p-3 space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtotal</span>
              <span>
                {formatRupiah(Number(props.customer?.unpaid?.subtotal))}
              </span>
            </div>
            {Number(props.customer?.unpaid?.diskon) > 0 && (
              <div className="flex justify-between text-xs text-green-600">
                <span>Diskon 20%</span>
                <span>
                  -{formatRupiah(Number(props.customer?.unpaid?.diskon))}
                </span>
              </div>
            )}
            <div className="flex justify-between text-xs text-gray-500">
              <span>PPN (11%)</span>
              <span>{formatRupiah(Number(props.customer?.unpaid?.ppn))}</span>
            </div>
            <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-700">TOTAL</span>
              <span className="text-sm font-bold text-gray-800">
                {formatRupiah(Number(props.customer?.unpaid?.total))}
              </span>
            </div>
          </div>
        )}

        {/* Note */}
        {props.customer?.catatan && (
          <div className="mt-3 p-2 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2">
            <IonIcon
              icon={alertCircleOutline}
              className="text-amber-500 text-sm flex-shrink-0 mt-0.5"
            />
            <p className="text-[11px] text-amber-700 leading-relaxed">
              {props.customer?.catatan}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 pl-10 flex-1 flex flex-row justify-between gap-2">
        <div className="flex-1 flex flex-row gap-2">
          <button
            onClick={async (e) => {
              e.stopPropagation();
              await AppLauncher.openUrl({
                url: `whatsapp://send?phone=62${props.customer?.profile?.phone.substring(1)}`,
              });
            }}
            className="flex-1"
          >
            <span className=" px-3 py-2 flex-row  bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-1">
              <IonIcon icon={callOutline} className="text-sm" />
              Hubungi
            </span>
          </button>
          {!props.customer?.ispaid && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                history.push(
                  "/payment?invoice=" + props.customer?.unpaid?.invoice,
                );
              }}
              className="flex-1"
            >
              <span className=" px-3 py-2 flex-row items-center bg-green-50 text-green-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors flex justify-center gap-1">
                <IonIcon icon={cashOutline} className="text-sm" />
                Bayar
              </span>
            </button>
          )}
        </div>
        {props.customer?.paid && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (props.onClickDetail) props.onClickDetail();
            }}
          >
            <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
              <IonIcon icon={eyeOutline} className="text-sm" />
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default React.memo(DetailCardCustomer);
