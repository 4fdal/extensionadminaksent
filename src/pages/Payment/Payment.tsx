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
  IonModal,
  IonBackdrop,
  IonLoading,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonImg,
  useIonToast,
} from "@ionic/react";
import { checkmarkCircle, arrowForward, warningOutline } from "ionicons/icons";
import ImagePicker from "@/components/input/ImagePicker";
import { useAppContext } from "@/context/app-context";
import { Customer } from "@/types/customer";
import {
  formatRupiah,
} from "@/utils";
import SelectCustomer from "@/components/customer/SelectCustomer";
import DateTimeInput from "@/components/input/DateTimeInput";
import { format } from "date-fns";
import BaseLayout from "@/components/layout/BaseLayout";
import { Capacitor } from "@capacitor/core";
import { Dialog } from "@capacitor/dialog";
import {
  HttpPaymentApi,
  HttpPaymentRlradius,
  Payment,
  PaymentList,
} from "@/utils/payment";
import { useHistory } from "react-router";
import DetailCardCustomer from "@/components/customer/DetailCardCustomer";

const PaymentPage: React.FC = () => {
  const [present] = useIonToast();
  const history = useHistory();
  const { customer: customerContext, imageShare } = useAppContext();

  const [paymentList, setPaymentList] = useState<Array<Payment> | null>(null);
  const [paymentExits, setPaymentExits] = useState<Array<Payment>>([]);
  const [loadingRequest, setLoadingRequest] = useState<boolean>(false);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [paymentDate, setPaymentDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd HH:ii:ss"),
  );
  const [imagePaymentSource, setImagePaymentSource] = useState<string | null>(
    null,
  );

  const [modalPaymentExits, setModalPaymentExits] = useState<boolean>(false);
  const [modalDataPaymentExits, setModalDataPaymentExits] =
    useState<Customer | null>(null);

  useEffect(() => {
    if (imageShare?.imageFile) {
      setImagePaymentSource(Capacitor.convertFileSrc(imageShare.imageFile.uri));
      imageShare.setImageFile(null);
    }
  }, [imageShare]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const invoice = searchParams.get("invoice");

    if ((customerContext?.customers?.length ?? 0) > 0 && invoice) {
      const selected = customerContext?.customers.find(
        (customer) => (customer.unpaid ?? customer.paid)?.invoice == invoice,
      );

      if (selected) setSelectedCustomer(selected);
    }
  }, [window.location, customerContext?.customers]);

  useEffect(() => {
    (async () => {
      if (customerContext?.customers.length == 0) {
        try {
          await customerContext?.reqAllCustomers(false);
        } catch (error) {
          console.error("[error] customerContext : ", error);
        }
      }

      if (paymentList == null) {
        try {
          const payments = await HttpPaymentApi.getAll();
          setPaymentList(payments);
        } catch (error) {
          console.error("[error] HttpPaymentApi.getAll : ", error);
        }
      }
    })();
    setPaymentDate(format(new Date(), "dd/MM/yyyy HH:ii:ss"));
  }, []);

  const handlePaymentSubmit = async () => {
    const splitStrDateTime = paymentDate.split(" ");
    const datePayment = splitStrDateTime?.[0];
    const timePayment = splitStrDateTime?.[1];

    if (selectedCustomer && imagePaymentSource) {
      const { value } = await Dialog.confirm({
        title: `Pembayaran ${selectedCustomer?.namapelanggan}`,
        message: `Apakah anda yakin ingin menyelesaikan pembayaran ini ? `,
      });

      if (value) {
        setLoadingRequest(true);
        try {
          if (selectedCustomer.unpaid) {
            const resRlradiusPayment = await HttpPaymentRlradius.setLunas(
              selectedCustomer.unpaid?.invoice,
            );

            if (!resRlradiusPayment?.success) {
              present({
                message: `Rlradius, ${resRlradiusPayment?.pesan}`,
                position: "bottom",
                duration: 1500,
                color: "danger",
              });
            }

            // selectedCustomer.paid = {
            //   invoice: selectedCustomer.unpaid.invoice,
            //   isrollback: 0,
            //   namakategoriinvoice: selectedCustomer.unpaid.namakategoriinvoice,
            //   nolayanan: selectedCustomer.unpaid.nolayanan,
            //   pelanggan: selectedCustomer.unpaid.pelanggan,
            //   username: selectedCustomer.unpaid.username,
            //   namapelanggan: selectedCustomer.unpaid.namapelanggan,
            //   namaprofile: selectedCustomer.unpaid.namaprofile,
            //   mitra: selectedCustomer.mitra.toString(),
            //   komisi: "",
            //   subtotal: selectedCustomer.unpaid.subtotal,
            //   diskon: selectedCustomer.unpaid.diskon,
            //   ppn: selectedCustomer.unpaid.ppn,
            //   kodeunik: selectedCustomer.unpaid.kodeunik,
            //   total: selectedCustomer.unpaid.total,
            //   biller: "",
            //   tglbayar: datePayment,
            //   jambayar: timePayment,
            //   carabayar: "",
            //   namachannel: "",
            //   paycode: "",
            //   catatan: selectedCustomer.unpaid.catatan,
            //   lastupdate: "",
            // };
            // selectedCustomer.ispaid = true;
            // selectedCustomer.unpaid = undefined;
          }

          if (!selectedCustomer.payment) {
            const reqPayment: Payment = {
              id: undefined,
              nolayanan: selectedCustomer?.nolayanan,
              namapelanggan: selectedCustomer?.namapelanggan,
              total: Number(
                (selectedCustomer?.unpaid ?? selectedCustomer?.paid)?.total,
              ),
              invoice: String(
                (selectedCustomer?.unpaid ?? selectedCustomer?.paid)?.invoice,
              ),
              tanggalbayar: datePayment,
              waktubayar: timePayment,
              gambar: imagePaymentSource,
              created_at: undefined,
              updated_at: undefined,
            };

            const resPayment = await HttpPaymentApi.create(reqPayment);

            console.log({ resPayment });

            // reqPayment.id = resPayment?.id;
            // selectedCustomer.payment = reqPayment;
          }

          // const findIndex = uc?.customers.findIndex(
          //   (item) => item.nolayanan == selectedCustomer.nolayanan,
          // );
          // if (findIndex && findIndex != -1 && uc) {
          //   uc.customers[findIndex] = selectedCustomer;
          //   uc.setCustomers([...uc.customers]);
          // }

          await customerContext?.reqAllCustomers(true);
          setImagePaymentSource(null);
          setSelectedCustomer(null);

          present({
            message: "Berhasil melakukan pembayaran",
            position: "bottom",
            duration: 1500,
            color: "primary",
          });

          history.replace("/customer");
        } catch (error) {
          console.error("[error] handlePaymentSubmit : ", { error });
          let message = "Ada sesuatu yang error! ";
          if (error instanceof Error) {
            message += " " + error.message;
          }
          present({
            message,
            position: "bottom",
            duration: 1500,
            color: "danger",
          });

          if (error instanceof Error) {
            // logError is deprecated, using console.error for now or a centralized logger if available
            console.error(error);
          }
        }
        setLoadingRequest(false);
      }
    }
  };

  const handleChangeDateTimeInput = (strDateTime: string) => {
    setPaymentDate(strDateTime);

    const currPaymentExits: Array<Payment> | undefined = paymentList?.filter(
      (item) => {
        // Using new date converter pattern or local formatting if specific
        const itemDate = new Date(item.tanggalbayar);
        const itemTime = new Date(item.waktubayar);
        
        // Manual formatting to match strDateTime format if needed, 
        // but ideally we use a centralized utility.
        const HH = String(itemTime.getHours()).padStart(2, "0");
        const mm = String(itemTime.getMinutes()).padStart(2, "0");
        const ss = String(itemTime.getSeconds()).padStart(2, "0");
        const yyyy = String(itemDate.getFullYear()).padStart(4, "0");
        const MM = String(itemDate.getMonth() + 1).padStart(2, "0");
        const dd = String(itemDate.getDate()).padStart(2, "0");
        
        const itemDateTime = `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
        return strDateTime == itemDateTime;
      },
    );

    if (currPaymentExits) setPaymentExits(currPaymentExits);
  };

  const handleClickPaymentExitsItem = (item: Payment) => {
    const customer = customerContext?.customers.find(
      (custItem) => custItem.nolayanan == item.nolayanan,
    );

    if (customer) {
      customer.payment = item;
      setModalDataPaymentExits(customer);
      setModalPaymentExits(true);
    }
  };

  return (
    <BaseLayout
      loadingPage={loadingRequest}
      headerTitle="Pembayaran"
      backHref="/customer"
    >
      <IonContent fullscreen className="bg-gray-100 ion-padding">
        {/* Image View Section */}
        <IonCard className="rounded-xl shadow-sm mb-4 bg-white m-0">
          <IonCardContent className="p-4">
            <IonText className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">
              Bukti Pembayaran
            </IonText>

            <ImagePicker
              src={imagePaymentSource}
              onChange={({ path }) => setImagePaymentSource(path)}
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
              <DateTimeInput
                value={paymentDate}
                onChange={handleChangeDateTimeInput}
              />
              {paymentExits.length > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <IonIcon
                      icon={warningOutline}
                      className="text-orange-600 text-xl"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-orange-800 text-sm">
                      Waktu Pembayaran
                    </h4>
                    <div className="flex flex-col">
                      {paymentExits.map((item) => {
                        return (
                          <span
                            key={item.invoice}
                            onClick={() => handleClickPaymentExitsItem(item)}
                            className="text-red-600 font-bold"
                          >
                            {item.nolayanan} / {item.namapelanggan}
                          </span>
                        );
                      })}
                    </div>
                    <p className="text-orage-500 text-xs mt-0.5">
                      Telah terpantau ada pelanggan yang melakukan pembayaran
                      pada waktu yang sama
                    </p>
                    <IonModal isOpen={modalPaymentExits}>
                      <IonHeader>
                        <IonToolbar>
                          <IonTitle style={{ "margin-left": "10px" }}>
                            {modalDataPaymentExits?.namapelanggan}
                          </IonTitle>
                          <IonButtons slot="end">
                            <IonButton
                              onClick={() => setModalPaymentExits(false)}
                            >
                              Close
                            </IonButton>
                          </IonButtons>
                        </IonToolbar>
                      </IonHeader>
                      <IonContent className="ion-padding flex flex-col gap-2">
                        <div
                          className="relative bg-white rounded-2xl shadow-sm border-2 transition-all duration-200 overflow-hidden border-transparent hover:border-gray-200"
                          style={{ animationDelay: `${1 * 50}ms` }}
                        >
                          <IonImg
                            src={modalDataPaymentExits?.payment?.gambar}
                          />
                        </div>
                        <div className="mt-3 mb-20">
                          {modalDataPaymentExits && (
                            <DetailCardCustomer
                              customer={modalDataPaymentExits}
                            />
                          )}
                        </div>
                      </IonContent>
                    </IonModal>
                  </div>
                </div>
              )}

            </div>

            {/* Select Nama Pelanggan dengan Search */}
            <SelectCustomer
              data={customerContext?.customers ?? []}
              selected={selectedCustomer}
              onChange={setSelectedCustomer}
            />

            {/* No Invoice */}
          </IonCardContent>
        </IonCard>

        {/* Submit Button */}
        <IonButton
          expand="block"
          size="large"
          onClick={handlePaymentSubmit}
          disabled={!selectedCustomer || !imagePaymentSource || !paymentDate}
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
                {!selectedCustomer?.ispaid
                  ? "Ringkasan Pembayaran"
                  : "Ringkasan Update Data Pembayaran"}
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
