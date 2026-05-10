// PaymentPage.tsx
import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonIcon,
  useIonToast,
  IonActionSheet,
} from "@ionic/react";
import { checkmarkCircle, arrowForward, image, calendar, person } from "ionicons/icons";
import ImagePicker from "@/components/input/ImagePicker";
import { useAppContext } from "@/context/app-context";
import { Customer } from "@/types/customer";
import SelectCustomer from "@/components/customer/SelectCustomer";
import DateTimeInput from "@/components/input/DateTimeInput";
import { format } from "date-fns";
import BaseLayout from "@/components/layout/BaseLayout";
import { Capacitor } from "@capacitor/core";
import {
  HttpPaymentApi,
  HttpPaymentRlradius,
  Payment,
} from "@/utils/payment";
import { useHistory } from "react-router";
import PaymentSummaryCard from "@/components/payment/PaymentSummaryCard";
import PaymentConfirmationModal from "@/components/payment/PaymentConfirmationModal";
import PaymentExistsWarning from "@/components/payment/PaymentExistsWarning";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import { motion } from "framer-motion";

const PaymentPage: React.FC = () => {
  const [present] = useIonToast();
  const history = useHistory();
  const { customer: customerContext, imageShare } = useAppContext();

  const [paymentList, setPaymentList] = useState<Array<Payment> | null>(null);
  const [paymentExits, setPaymentExits] = useState<Array<Payment>>([]);
  const [loadingRequest, setLoadingRequest] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [paymentDate, setPaymentDate] = useState<string>(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
  const [imagePaymentSource, setImagePaymentSource] = useState<string | null>(null);

  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [modalPaymentExits, setModalPaymentExits] = useState<boolean>(false);
  const [modalDataPaymentExits, setModalDataPaymentExits] = useState<Customer | null>(null);

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
        try { await customerContext?.reqAllCustomers(false); } catch (error) { console.error(error); }
      }
      if (paymentList == null) {
        try {
          const payments = await HttpPaymentApi.getAll();
          setPaymentList(payments);
        } catch (error) { console.error(error); }
      }
    })();
    setPaymentDate(format(new Date(), "dd/MM/yyyy HH:mm:ss"));
  }, []);

  const handlePaymentSubmit = () => {
    if (selectedCustomer && imagePaymentSource) {
      setShowConfirmModal(true);
    }
  };

  const processPayment = async () => {
    const splitStrDateTime = paymentDate.split(" ");
    const datePayment = splitStrDateTime?.[0];
    const timePayment = splitStrDateTime?.[1];

    if (selectedCustomer && imagePaymentSource) {
      const updatedCustomer = { ...selectedCustomer };
      setShowConfirmModal(false);
      setLoadingRequest(true);
      setLoadingMessage("Menghubungkan ke server...");
      try {
        if (updatedCustomer.unpaid) {
          const resRlradiusPayment = await HttpPaymentRlradius.setLunas(updatedCustomer.unpaid?.invoice);
          if (!resRlradiusPayment?.success) {
            present({ message: `Gagal: ${resRlradiusPayment?.pesan}`, color: "danger", duration: 2000 });
          }
          updatedCustomer.paid = {
            invoice: updatedCustomer.unpaid.invoice,
            nolayanan: updatedCustomer.unpaid.nolayanan,
            pelanggan: updatedCustomer.unpaid.pelanggan,
            username: updatedCustomer.unpaid.username,
            namapelanggan: updatedCustomer.unpaid.namapelanggan,
            namaprofile: updatedCustomer.unpaid.namaprofile,
            mitra: updatedCustomer.mitra.toString(),
            subtotal: updatedCustomer.unpaid.subtotal,
            diskon: updatedCustomer.unpaid.diskon,
            ppn: updatedCustomer.unpaid.ppn,
            kodeunik: updatedCustomer.unpaid.kodeunik.toString(),
            total: updatedCustomer.unpaid.total,
            tglbayar: datePayment,
            jambayar: timePayment,
            catatan: updatedCustomer.unpaid.catatan,
            lastupdate: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
            namakategoriinvoice: updatedCustomer.unpaid.namakategoriinvoice,
            isrollback: 0,
            komisi: "",
            biller: "",
            carabayar: "",
            namachannel: "",
            paycode: "",
          };
          updatedCustomer.ispaid = true;
          updatedCustomer.unpaid = undefined;
        }

        if (!updatedCustomer.payment) {
          const reqPayment: Payment = {
            id: undefined,
            nolayanan: updatedCustomer?.nolayanan,
            namapelanggan: updatedCustomer?.namapelanggan,
            total: Number((updatedCustomer?.unpaid ?? updatedCustomer?.paid)?.total),
            invoice: String((updatedCustomer?.unpaid ?? updatedCustomer?.paid)?.invoice),
            tanggalbayar: datePayment,
            waktubayar: timePayment,
            gambar: imagePaymentSource,
            created_at: undefined,
            updated_at: undefined,
          };
          const resPayment = await HttpPaymentApi.create(reqPayment);
          reqPayment.id = resPayment?.id;
          updatedCustomer.payment = reqPayment;
        }

        const findIndex = customerContext?.customers.findIndex(item => item.nolayanan == updatedCustomer.nolayanan);
        if (findIndex !== undefined && findIndex !== -1 && customerContext) {
          const updatedCustomers = [...customerContext.customers];
          updatedCustomers[findIndex] = updatedCustomer;
          customerContext.setCustomers(updatedCustomers);
        }

        setLoadingMessage("Selesai!");
        setImagePaymentSource(null);
        setSelectedCustomer(null);
        present({ message: "Berhasil melakukan pembayaran", color: "primary", duration: 1500 });
        history.replace("/customer");
      } catch (error) {
        console.error(error);
        present({ message: "Terjadi kesalahan sistem", color: "danger", duration: 2000 });
      }
      setLoadingRequest(false);
    }
  };

  const handleChangeDateTimeInput = (strDateTime: string) => {
    setPaymentDate(strDateTime);
    const currPaymentExits = paymentList?.filter(item => {
      const itemTime = new Date(item.waktubayar);
      const itemDate = new Date(item.tanggalbayar);
      const HH = String(itemTime.getHours()).padStart(2, "0");
      const mm = String(itemTime.getMinutes()).padStart(2, "0");
      const ss = String(itemTime.getSeconds()).padStart(2, "0");
      const yyyy = String(itemDate.getFullYear()).padStart(4, "0");
      const MM = String(itemDate.getMonth() + 1).padStart(2, "0");
      const dd = String(itemDate.getDate()).padStart(2, "0");
      return strDateTime === `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
    });
    if (currPaymentExits) setPaymentExits(currPaymentExits);
  };

  const handleClickPaymentExitsItem = (item: Payment) => {
    const customer = customerContext?.customers.find(c => c.nolayanan === item.nolayanan);
    if (customer) {
      customer.payment = item;
      setModalDataPaymentExits(customer);
      setModalPaymentExits(true);
    }
  };

  return (
    <BaseLayout
      loadingPage={loadingRequest}
      loadingMessage={loadingMessage}
      headerTitle="Transaksi Pembayaran"
      backHref="/customer"
    >
      <div className="space-y-3">
        {/* Step 1 & 2 Grid on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Step 1: Upload Proof */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
                <span className="text-[9px] font-bold text-primary">01</span>
              </div>
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Bukti Pembayaran</h2>
            </div>
            <GlassCard className="!p-3 h-[200px] md:h-full flex flex-col">
              <ImagePicker
                src={imagePaymentSource}
                onChange={({ path }) => setImagePaymentSource(path)}
              />
            </GlassCard>
          </section>

          {/* Step 2: Customer & Date */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
                <span className="text-[9px] font-bold text-primary">02</span>
              </div>
              <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Informasi Transaksi</h2>
            </div>
            <GlassCard className="space-y-3 !p-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <IonIcon icon={calendar} className="text-xs" /> Waktu Pembayaran
                </label>
                <DateTimeInput
                  value={paymentDate}
                  onChange={handleChangeDateTimeInput}
                />
                <PaymentExistsWarning
                  payments={paymentExits}
                  onItemClick={handleClickPaymentExitsItem}
                  showModal={modalPaymentExits}
                  modalData={modalDataPaymentExits}
                  onCloseModal={() => setModalPaymentExits(false)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <IonIcon icon={person} className="text-xs" /> Pilih Pelanggan
                </label>
                <SelectCustomer
                  data={customerContext?.customers.filter((cust) => cust.unpaid || !cust.payment) ?? []}
                  selected={selectedCustomer}
                  onChange={setSelectedCustomer}
                />
              </div>
            </GlassCard>
          </section>
        </div>

        {/* Step 3: Summary & Action */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 px-1">
            <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
              <span className="text-[9px] font-bold text-primary">03</span>
            </div>
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Ringkasan & Konfirmasi</h2>
          </div>
          
          <PaymentSummaryCard customer={selectedCustomer} />

          <GlassButton
            size="lg"
            className="w-full h-14 text-base font-black tracking-wide group !rounded-xl"
            disabled={!selectedCustomer || !imagePaymentSource || !paymentDate}
            onClick={handlePaymentSubmit}
          >
            <IonIcon icon={checkmarkCircle} className="text-xl" />
            SIMPAN PEMBAYARAN
            <IonIcon icon={arrowForward} className="text-xl group-hover:translate-x-1 transition-transform" />
          </GlassButton>
        </section>

        <div className="h-4" />
      </div>


      <PaymentConfirmationModal
        isOpen={showConfirmModal}
        onDismiss={() => setShowConfirmModal(false)}
        onConfirm={processPayment}
        customerName={selectedCustomer?.namapelanggan}
      />
    </BaseLayout>
  );
};

export default React.memo(PaymentPage);
