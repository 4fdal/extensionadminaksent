import { formatDate, formatRupiah } from "@/utils/helpers";
import { IonIcon } from "@ionic/react";
import {
  alertCircleOutline,
  businessOutline,
  calendarOutline,
  callOutline,
  cashOutline,
  checkboxOutline,
  checkmarkOutline,
  ellipsisVertical,
  eyeOutline,
  personOutline,
  timeOutline,
} from "ionicons/icons";
import React from "react";

const DetailCardCustomer: React.FC = () => {
  return (
    <div
      key={1}
      className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all duration-200 overflow-hidden ${
        false
          ? "border-blue-500 shadow-md"
          : "border-transparent hover:border-gray-200"
      }`}
      style={{ animationDelay: `${1 * 50}ms` }}
    >
      {/* Selection Checkbox */}
      <div
        className="absolute top-3 left-3 z-10"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div
          className={`w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
            false
              ? "bg-blue-500 text-white"
              : "bg-gray-100 border-2 border-gray-300"
          }`}
        >
          {false && <IonIcon icon={checkmarkOutline} className="text-sm" />}
        </div>
      </div>

      {/* More Options */}
      <button
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="absolute top-3 right-3 z-10 p-1 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <IonIcon icon={ellipsisVertical} className="text-gray-400 text-lg" />
      </button>

      {/* Card Header - Status & Invoice */}
      <div
        className={`px-4 pt-3 pb-2 border-b cursor-pointer`}
        onClick={() => {}}
      >
        <div className="flex items-center justify-between pl-8 pr-16">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full`}></span>
            <span className={`text-xs font-bold uppercase `}>status</span>
            <span className="text-gray-300">|</span>
            <span className="text-xs font-mono font-semibold text-gray-600">
              invoice
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 pl-12 cursor-pointer" onClick={() => {}}>
        {/* Pelanggan Info */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-xl  flex items-center justify-center text-white shadow-md flex-shrink-0`}
          >
            <IonIcon icon={personOutline} className="text-lg text-blue-400" />
          </div>
          <div className="flex-1 min-w-0 pr-8">
            <span className="font-bold text-gray-800 text-[18px] leading-6 block truncate">
              pelanggan
            </span>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded">
                label
              </span>
              <span className="text-[10px] text-gray-400 font-mono">
                noLayanan
              </span>
              {true && (
                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded animate-pulse">
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
            <span className="truncate">mitra</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <IonIcon icon={checkboxOutline} className="text-gray-400" />
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-600`}
            >
              kategori
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <IonIcon icon={calendarOutline} className="text-gray-400" />
            <span>Terbit: {formatDate("2026-02-17")}</span>
          </div>
          <div
            className={`flex items-center gap-2 text-xs font-semibold text-red-600`}
          >
            <IonIcon
              icon={timeOutline}
              className={true ? "text-red-500" : "text-gray-400"}
            />
            <span>
              {true ? `Terlambat ${Math.abs(12)} hari` : `${12} hari lagi`}
            </span>
          </div>
        </div>

        {/* Financial Summary */}
        <div className="bg-gray-50 rounded-xl p-3 space-y-1">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Subtotal</span>
            <span>{formatRupiah(120000)}</span>
          </div>
          {20 > 0 && (
            <div className="flex justify-between text-xs text-green-600">
              <span>Diskon 20%</span>
              <span>-{formatRupiah(12000)}</span>
            </div>
          )}
          <div className="flex justify-between text-xs text-gray-500">
            <span>PPN (11%)</span>
            <span>{formatRupiah(1200)}</span>
          </div>
          <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
            <span className="text-xs font-bold text-gray-700">TOTAL</span>
            <span className="text-sm font-bold text-gray-800">
              {formatRupiah(6000)}
            </span>
          </div>
        </div>

        {/* Note */}
        {true && (
          <div className="mt-3 p-2 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2">
            <IonIcon
              icon={alertCircleOutline}
              className="text-amber-500 text-sm flex-shrink-0 mt-0.5"
            />
            <p className="text-[11px] text-amber-700 leading-relaxed">note</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="px-4 pb-4 pl-12 flex-1 flex flex-row justify-between gap-2">
        <div className="grid grid-cols-2 flex-1 gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="col-span-1"
          >
            <span className=" px-3 py-2 flex-row  bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-1">
              <IonIcon icon={callOutline} className="text-sm" />
              Hubungi
            </span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="col-span-1"
          >
            <span className=" px-3 py-2 flex-row items-center bg-green-50 text-green-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors flex justify-center gap-1">
              <IonIcon icon={cashOutline} className="text-sm" />
              Bayar
            </span>
          </button>
        </div>
        {/* <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
        >
          <IonIcon icon={callOutline} className="text-sm" />
          Hubungi
        </button> */}
        {/* <button
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
        >
          <IonIcon icon={cashOutline} className="text-sm" />
          Bayar
        </button> */}
        <button
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <span className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
            <IonIcon icon={eyeOutline} className="text-sm" />
          </span>
        </button>
      </div>
    </div>
  );
};

export default DetailCardCustomer;
