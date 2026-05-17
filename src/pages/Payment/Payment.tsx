// PaymentPage.tsx
import React, { useState, useEffect } from "react";
import {
  IonContent,
  IonIcon,
  useIonToast,
  IonActionSheet,
} from "@ionic/react";
import { checkmarkCircle, arrowForward, image, calendar, person, cameraOutline, syncOutline } from "ionicons/icons";
import ImagePicker from "@/components/input/ImagePicker";
import { useAppContext } from "@/context/app-context";
import { Customer } from "@/types/customer";
import SelectCustomer from "@/components/customer/SelectCustomer";
import DateTimeInput from "@/components/input/DateTimeInput";
import { extractTimeFromImage } from "@/utils/ocr";
import { format, parse, parseISO } from "date-fns";
import BaseLayout from "@/components/layout/BaseLayout";
import { Capacitor } from "@capacitor/core";
import {
  HttpPaymentApi,
  HttpPaymentRlradius,
  Payment,
} from "@/utils/payment";
import { useHistory, useLocation } from "react-router";
import PaymentSummaryCard from "@/components/payment/PaymentSummaryCard";
import PaymentConfirmationModal from "@/components/payment/PaymentConfirmationModal";
import PaymentExistsWarning from "@/components/payment/PaymentExistsWarning";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import { motion } from "framer-motion";

const PaymentPage: React.FC = () => {
  const [present] = useIonToast();
  const history = useHistory();
  const location = useLocation();
  const { customer: customerContext, imageShare } = useAppContext();

  const [paymentList, setPaymentList] = useState<Array<Payment> | null>(null);
  const [paymentExits, setPaymentExits] = useState<Array<Payment>>([]);
  const [loadingRequest, setLoadingRequest] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);

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
    const searchParams = new URLSearchParams(location.search);
    const invoice = searchParams.get("invoice");

    if ((customerContext?.customers?.length ?? 0) > 0 && invoice) {
      const selected = customerContext?.customers.find(
        (customer) => (customer.unpaid ?? customer.paid)?.invoice == invoice,
      );
      if (selected) {
        setSelectedCustomer(selected);

        if (selected?.payment) {
          const rawTanggal = selected?.payment?.tanggalbayar || "";
          const rawWaktu = selected?.payment?.waktubayar || "";

          const tanggalBayar = rawTanggal.includes("T") ? format(new Date(rawTanggal), "yyyy-MM-dd") : rawTanggal;
          const waktuBayar = rawWaktu.includes("T") ? format(new Date(rawWaktu), "HH:mm:ss") : rawWaktu;

          setPaymentDate(`${tanggalBayar} ${waktuBayar}`)
          setImagePaymentSource(selected?.payment?.gambar)
        }
      }
    }
  }, [location.search, customerContext?.customers]);

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
    setPaymentDate(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
  }, []);

  const handlePaymentSubmit = () => {
    if (selectedCustomer && imagePaymentSource) {
      setShowConfirmModal(true);
    }
  };

  const handleScanTime = async () => {
    if (!imagePaymentSource) return;
    setIsScanning(true);
    present({ message: "Memindai gambar...", duration: 2000 });
    const time = await extractTimeFromImage(imagePaymentSource);
    setIsScanning(false);

    if (time) {
      const splitStrDateTime = paymentDate.split(" ");
      const datePart = splitStrDateTime[0] || format(new Date(), "yyyy-MM-dd");

      let newTime = time;
      if (newTime.length === 5) newTime += ":00";

      const newDatetime = `${datePart} ${newTime}`;
      handleChangeDateTimeInput(newDatetime);
      setPaymentDate(newDatetime);
      present({ message: `Waktu terdeteksi: ${newTime}`, color: "success", duration: 2000 });
    } else {
      present({ message: "Waktu tidak terdeteksi pada gambar", color: "warning", duration: 2000 });
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

        let resPayment = null

        if (!selectedCustomer.payment) {
          resPayment = await HttpPaymentApi.create(reqPayment);
          reqPayment.id = resPayment?.id;
        } else if (selectedCustomer.payment && selectedCustomer?.ispaid) {
          reqPayment.id = selectedCustomer.payment.id;
          resPayment = await HttpPaymentApi.update(reqPayment);
        }

        updatedCustomer.payment = reqPayment;

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
    const [inputDate, inputTime] = strDateTime.split(" ");
    if (!inputDate || !inputTime) { setPaymentExits([]); return; }

    const currPaymentExits = paymentList?.filter(item => {
      // Compare directly against stored string values
      const dateMatch = format(parseISO(item.tanggalbayar), "yyyy-MM-dd") === inputDate;
      const timeMatch = format(parseISO(item.waktubayar), "HH:mm:ss") === inputTime;

      return dateMatch && timeMatch;
    });

    if (currPaymentExits) setPaymentExits(currPaymentExits);
  };

  const handleClickPaymentExitsItem = (item: Payment) => {
    const customer = customerContext?.customers.find(c => c.nolayanan == item.nolayanan);
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
          <div className="space-y-2 flex flex-col h-full mt-2">
            <div className="flex  items-center gap-2 px-1">
              <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
                <span className="text-[9px] font-bold text-primary">01</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Bukti Pembayaran</span>
            </div>
            <ImagePicker
              src={imagePaymentSource}
              onChange={({ path }) => setImagePaymentSource(path)}
              className="max-h-[240px] !min-h-0"
            />
          </div>

          {/* Step 2: Customer & Date */}
          <section className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center border border-primary/30">
                <span className="text-[9px] font-bold text-primary">02</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Informasi Transaksi</span>
            </div>
            <GlassCard className="space-y-3 !p-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                    <IonIcon icon={calendar} className="text-xs" /> Waktu Pembayaran
                  </label>
                  {imagePaymentSource && (
                    <button
                      onClick={handleScanTime}
                      disabled={isScanning}
                      className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded flex items-center gap-1 disabled:opacity-50 hover:bg-primary/20 transition-colors"
                    >
                      <IonIcon icon={isScanning ? syncOutline : cameraOutline} className={isScanning ? "animate-spin" : ""} />
                      {isScanning ? "Memindai..." : "Scan Waktu"}
                    </button>
                  )}
                </div>
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
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Ringkasan & Konfirmasi</span>
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
