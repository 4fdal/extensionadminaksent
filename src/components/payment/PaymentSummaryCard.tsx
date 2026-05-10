import React from "react";
import { IonCard, IonCardContent, IonText } from "@ionic/react";
import { Customer } from "@/types/customer";
import { formatRupiah } from "@/utils";

type PaymentSummaryCardProps = {
  customer: Customer | null;
};

const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({ customer }) => {
  if (!customer) return null;

  return (
    <IonCard className="rounded-2xl shadow-lg my-4 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 m-0 overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full -mr-16 -mt-16 opacity-50" />
      <IonCardContent className="p-5 relative">
        <IonText className="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
          {!customer?.ispaid
            ? "Ringkasan Pembayaran"
            : "Ringkasan Update Data Pembayaran"}
        </IonText>
        <div className="space-y-3">
          {customer?.unpaid?.invoice && (
            <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
              <span className="text-gray-600 text-sm font-medium">
                No. Invoice
              </span>
              <span className="font-bold text-gray-800 text-sm font-mono">
                {customer?.unpaid?.invoice}
              </span>
            </div>
          )}
          {customer?.namapelanggan && (
            <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
              <span className="text-gray-600 text-sm font-medium">
                Pelanggan
              </span>
              <span className="font-bold text-gray-800 text-sm">
                {customer?.namapelanggan}
              </span>
            </div>
          )}

          {customer?.namaprofile && (
            <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
              <span className="text-gray-600 text-sm font-medium">
                Profile Internet
              </span>
              <span className="font-bold text-gray-800 text-sm font-mono">
                {customer?.namaprofile}
              </span>
            </div>
          )}

          {customer?.unpaid?.total && (
            <div className="flex justify-between items-center p-3 bg-green-100 rounded-xl border border-green-200">
              <span className="text-green-800 text-sm font-bold">
                Total Pembayaran
              </span>
              <span className="text-green-700 text-lg font-extrabold">
                {formatRupiah(Number(customer?.unpaid?.total))}
              </span>
            </div>
          )}
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default React.memo(PaymentSummaryCard);
