// PaymentPage.tsx
import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonLabel,
  IonCard,
  IonCardContent,
  IonIcon,
  IonButton,
  IonText,
} from "@ionic/react";
import { checkmarkCircle, arrowForward } from "ionicons/icons";
import ImagePicker from "@/components/input/ImagePicker";
import { useAppContext } from "@/context/app-context";
import { Customer } from "@/types/customer";
import { formatRupiah } from "@/utils/helpers";
import SelectCustomer from "@/components/customer/SelectCustomer";
import DateTimeInput from "@/components/input/DateTimeInput";
import { format } from "date-fns";
import BaseLayout from "@/components/layout/BaseLayout";
import { Capacitor } from "@capacitor/core";

const PaymentPage: React.FC = () => {
  const { customer: uc, imageShare } = useAppContext();

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [paymentDate, setPaymentDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd HH:ii:ss"),
  );
  const [imagePaymentFile, setImagePaymentFile] = useState<string | null>(null);

  useEffect(() => {
    if (imageShare?.imageFile) {
      setImagePaymentFile(Capacitor.convertFileSrc(imageShare.imageFile.uri));
      imageShare.setImageFile(null);
    }
  }, [imageShare]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const invoice = searchParams.get("invoice");

    if ((uc?.customers?.length ?? 0) > 0 && invoice) {
      const selected = uc?.customers.find(
        (customer) => customer.unpaid?.invoice == invoice,
      );

      if (selected) setSelectedCustomer(selected);
    }
  }, [window.location, uc?.customers]);

  useEffect(() => {
    if (uc?.customers.length == 0) {
      uc?.reqAllCustomers(false);
      uc?.setTabFilter("UNPAID");
    }
    setPaymentDate(format(new Date(), "dd/MM/yyyy HH:ii:ss"));
  }, []);

  const handleSubmit = () => {};

  return (
    <BaseLayout headerTitle="Pembayaran" backHref="/customer">
      <IonContent fullscreen className="bg-gray-100 ion-padding">
        {/* Image View Section */}
        <IonCard className="rounded-xl shadow-sm mb-4 bg-white m-0">
          <IonCardContent className="p-4">
            <IonText className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">
              Bukti Pembayaran
            </IonText>

            <ImagePicker
              src={imagePaymentFile}
              onChange={({ path }) => setImagePaymentFile(path)}
            />
          </IonCardContent>
        </IonCard>

        {/* Form Section */}
        <IonCard className="rounded-xl shadow-sm mb-4 bg-white m-0">
          <IonCardContent className="p-4">
            {/* Tanggal dan Waktu Pembayaran */}
            <div className="mb-5">
              <IonLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                Tanggal & Waktu Pembayaran
              </IonLabel>
              <DateTimeInput value={paymentDate} onChange={setPaymentDate} />

              {/* <DateTimeInputText
                value={paymentDate}
                onChange={setPaymentDate}
              /> */}
              {/* <IonItem
                lines="none"
                className="bg-gray-100 rounded-xl px-4 py-1"
              >
                <IonIcon
                  icon={calendar}
                  slot="start"
                  className="mr-3 text-blue-500 text-xl"
                />

                <IonDatetime
                  presentation="time"
                  hourCycle="h23"
                  onIonChange={(e) => console.log(e.detail.value)}
                />
                <IonDatetimeButton datetime="datetime"></IonDatetimeButton>
                <IonModal keepContentsMounted={true}>
                  <IonDatetime
                    id="datetime"
                    value={paymentDate}
                    onIonChange={(e) =>
                      setPaymentDate(e.detail.value as string)
                    }
                    showDefaultButtons={true}
                    presentation="time"
                    hourCycle="h23"
                    locale="id-ID"
                  />
                </IonModal>
              </IonItem> */}
            </div>

            {/* Select Nama Pelanggan dengan Search */}
            <SelectCustomer
              data={uc?.customers ?? []}
              selected={selectedCustomer}
              onChange={setSelectedCustomer}
            />

            {/* No Invoice */}
            {/* <div className="mb-5">
              <IonLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                Nomor Invoice
              </IonLabel>
              <IonItem
                lines="none"
                className="bg-gray-100 rounded-xl px-4 py-1"
              >
                <IonIcon
                  icon={receipt}
                  slot="start"
                  className="mr-3 text-blue-500 text-xl"
                />
                <IonInput
                  readonly={true}
                  placeholder="INV-2024-XXXX"
                  value={selectedCustomer?.unpaid?.invoice}
                  onIonChange={(e) => setInvoiceNumber(e.detail.value!)}
                  className="font-medium text-gray-700"
                />
              </IonItem>
            </div> */}

            {/* Total Pembayaran */}
            {/* <div className="mb-2">
              <IonLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                Total Pembayaran
              </IonLabel>
              <IonItem
                lines="none"
                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl px-4 py-2 border-2 border-green-400"
              >
                <IonIcon
                  icon={cash}
                  slot="start"
                  className="mr-3 text-green-600 text-2xl"
                />
                <IonInput
                  placeholder="0"
                  type="number"
                  value={totalPayment}
                  onIonChange={(e) => setTotalPayment(e.detail.value!)}
                  className="font-bold text-2xl text-green-800 placeholder-green-300"
                />
              </IonItem>
              {totalPayment && (
                <IonText className="block mt-2 text-sm text-green-600 font-bold bg-green-50 inline-block px-3 py-1 rounded-full">
                  {formatRupiah(Number(totalPayment))}
                </IonText>
              )}
            </div> */}
          </IonCardContent>
        </IonCard>

        {/* Submit Button */}
        <IonButton
          expand="block"
          size="large"
          onClick={handleSubmit}
          disabled={!selectedCustomer}
          className={`rounded-2xl mt-2 h-14 font-bold text-base tracking-wide shadow-xl shadow-blue-500/30 ${!selectedCustomer ? "opacity-50" : "hover:shadow-2xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all"}`}
        >
          <IonIcon icon={checkmarkCircle} slot="start" className="mr-2" />
          Simpan Pembayaran
          <IonIcon icon={arrowForward} slot="end" className="ml-2" />
        </IonButton>

        {/* Summary Card */}
        {selectedCustomer && (
          <IonCard className="rounded-2xl shadow-lg my-4 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 m-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full -mr-16 -mt-16 opacity-50" />
            <IonCardContent className="p-5 relative">
              <IonText className="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                Ringkasan Pembayaran
              </IonText>
              <div className="space-y-3">
                {selectedCustomer?.unpaid?.invoice && (
                  <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                    <span className="text-gray-600 text-sm font-medium">
                      No. Invoice
                    </span>
                    <span className="font-bold text-gray-800 text-sm font-mono">
                      {selectedCustomer?.unpaid?.invoice}
                    </span>
                  </div>
                )}
                {selectedCustomer?.namapelanggan && (
                  <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                    <span className="text-gray-600 text-sm font-medium">
                      Pelanggan
                    </span>
                    <span className="font-bold text-gray-800 text-sm">
                      {selectedCustomer?.namapelanggan}
                    </span>
                  </div>
                )}

                {selectedCustomer?.namaprofile && (
                  <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                    <span className="text-gray-600 text-sm font-medium">
                      Profile Internet
                    </span>
                    <span className="font-bold text-gray-800 text-sm font-mono">
                      {selectedCustomer?.namaprofile}
                    </span>
                  </div>
                )}

                {selectedCustomer?.unpaid?.total && (
                  <div className="flex justify-between items-center p-3 bg-green-100 rounded-xl border border-green-200">
                    <span className="text-green-800 text-sm font-bold">
                      Total Pembayaran
                    </span>
                    <span className="text-green-700 text-lg font-extrabold">
                      {formatRupiah(Number(selectedCustomer?.unpaid?.total))}
                    </span>
                  </div>
                )}
              </div>
            </IonCardContent>
          </IonCard>
        )}

        <div className="mb-10"></div>
      </IonContent>

      {/* CSS untuk animasi */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .customer-modal {
          --border-radius: 24px 24px 0 0;
        }
      `}</style>
    </BaseLayout>
  );
};

export default React.memo(PaymentPage);
