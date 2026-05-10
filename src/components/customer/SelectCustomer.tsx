import { Customer } from "@/types/customer";
import { IonContent, IonIcon, IonModal } from "@ionic/react";
import {
  briefcase,
  business,
  call,
  checkmarkCircle,
  chevronDown,
  close,
  home,
  locationOutline,
  people,
  person,
  search,
  storefront,
  trendingUp,
} from "ionicons/icons";
import React, { useEffect, useMemo, useState } from "react";
import DataListScrolling from "../list/DataListScrolling";
import { formatRupiah } from "@/utils";
import GlassCard from "../ui/GlassCard";
import GlassButton from "../ui/GlassButton";
import { motion, AnimatePresence } from "framer-motion";

const getCustomerStyle = (type: string) => {
  switch (type) {
    case "Perusahaan": return { icon: business, color: "text-blue-400" };
    case "CV": return { icon: briefcase, color: "text-purple-400" };
    case "Toko": return { icon: storefront, color: "text-orange-400" };
    case "UD": return { icon: home, color: "text-amber-400" };
    default: return { icon: person, color: "text-primary" };
  }
};

const getAvatarGradient = (name: string) => {
  const gradients = [
    "from-primary/40 to-accent/40",
    "from-secondary/40 to-primary/40",
    "from-accent/40 to-secondary/40",
  ];
  return gradients[name.length % gradients.length];
};

type SelectCustomerProp = {
  data: Array<Customer>;
  selected?: Customer | null;
  onChange?: (customer: Customer | null) => void;
};

export const SelectCustomer: React.FC<SelectCustomerProp> = (props) => {
  const [searchText, setSearchText] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customers, setCustomers] = useState<Array<Customer>>([]);

  useEffect(() => { setCustomers(props.data); }, [props.data]);

  useEffect(() => {
    if (props.selected != null &&
      (props.selected?.unpaid ?? props.selected?.paid)?.invoice !==
      (selectedCustomer?.unpaid ?? selectedCustomer?.paid)?.invoice) {
      setSelectedCustomer(props.selected);
    }
  }, [props.selected]);

  useEffect(() => {
    if (props.onChange &&
      (props.selected?.unpaid ?? props.selected?.paid)?.invoice !==
      (selectedCustomer?.unpaid ?? selectedCustomer?.paid)?.invoice) {
      props.onChange(selectedCustomer);
    }
  }, [selectedCustomer]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c =>
      c.namapelanggan.toLowerCase().includes(searchText.toLowerCase()) ||
      c.nolayanan.includes(searchText) ||
      c.unpaid?.invoice.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, customers]);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(false);
    setSearchText("");
  };

  return (
    <div className="space-y-3">
      {/* Compact Select Trigger */}
      <GlassCard
        className={`!p-3 cursor-pointer group relative overflow-hidden ${selectedCustomer ? "border-primary/50 bg-primary/5" : ""}`}
        onClick={() => setShowCustomerModal(true)}
      >
        <div className="flex items-center gap-3 relative z-10">
          {selectedCustomer ? (
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${getAvatarGradient(selectedCustomer.namapelanggan)} flex items-center justify-center text-white font-black text-xl shadow-inner border border-white/20`}>
              {selectedCustomer.namapelanggan.charAt(0)}
            </div>
          ) : (
            <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-600">
              <IonIcon icon={people} className="text-2xl" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <span className={`text-base font-bold truncate ${selectedCustomer ? "text-blue-500" : "text-slate-500"}`}>
              {selectedCustomer ? selectedCustomer.namapelanggan : "Pilih Pelanggan"}
            </span>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {selectedCustomer ? (
                <span className="flex items-center gap-1.5">
                  <IonIcon icon={call} className="text-primary text-[10px]" />
                  {selectedCustomer.profile?.phone}
                </span>
              ) : "Klik untuk membuka daftar"}
            </p>
          </div>

          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${selectedCustomer ? "bg-primary/20 text-primary" : "bg-white/5 text-slate-600"}`}>
            <IonIcon icon={chevronDown} className={`text-base transition-transform ${showCustomerModal ? "rotate-180" : ""}`} />
          </div>
        </div>

        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
      </GlassCard>

      <IonModal
        isOpen={showCustomerModal}
        onDidDismiss={() => { setShowCustomerModal(false); setSearchText(""); }}
        breakpoints={[0, 0.9, 1]}
        initialBreakpoint={0.9}
        className="glass-modal-full"
      >
        <div className="glass-dark h-full flex flex-col">
          {/* Modal Header - Compact */}
          <div className="p-4 border-b border-slate-200 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Daftar Pelanggan</h2>
                <p className="text-slate-500 text-xs font-medium">{customers.length} total tersedia</p>
              </div>
              <GlassButton variant="ghost" size="sm" onClick={() => setShowCustomerModal(false)} className="!p-1.5">
                <IonIcon icon={close} className="text-xl" />
              </GlassButton>
            </div>

            {/* Compact Search Input */}
            <div className="relative">
              <IonIcon icon={search} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-600 text-base" />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Cari nama, invoice, atau nomor layanan..."
                className="w-full bg-white/50 border border-slate-300 rounded-lg py-1.5 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
          </div>

          <IonContent className="transparent-content">
            <div className="p-3">
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-white/50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
                    <IonIcon icon={search} className="text-3xl text-slate-400" />
                  </div>
                  <h3 className="text-slate-800 font-bold text-base">Tidak Ditemukan</h3>
                  <p className="text-slate-600 text-xs mt-1">Coba gunakan kata kunci lain</p>
                </div>
              ) : (
                <DataListScrolling
                  default={{ start: 0, end: 15, length: 15, scrollDown: 100 }}
                  data={filteredCustomers}
                  itemRender={(item, index) => {
                    const customer = item as Customer;
                    const isSelected = selectedCustomer?.nolayanan === customer.nolayanan;

                    return (
                      <motion.div
                        key={customer.nolayanan}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => handleSelectCustomer(customer)}
                        className={`p-3 rounded-xl mb-2 cursor-pointer  border transition-all ${isSelected
                          ? "bg-primary/10 border-primary shadow-sm"
                          : "shadow-sm border-gray-50"
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getAvatarGradient(customer.namapelanggan)} flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                            {customer.namapelanggan.charAt(0)}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center gap-2">
                              <span className={`text-sm font-bold truncate ${isSelected ? "text-primary" : "text-slate-800"}`}>
                                {customer.namapelanggan}
                              </span>
                              {isSelected && <IonIcon icon={checkmarkCircle} className="text-primary text-lg" />}
                            </div>

                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-medium">
                              <span className="flex items-center gap-1">
                                <IonIcon icon={call} className="text-[9px]" /> {customer.profile?.phone}
                              </span>
                              <span className="w-0.5 h-0.5 bg-slate-800 rounded-full" />
                              <span className="truncate">
                                <IonIcon icon={locationOutline} className="text-[9px]" /> {customer.alamatpemasangan}
                              </span>
                            </div>

                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[9px] bg-white/50 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                                {customer.unpaid?.invoice}
                              </span>
                              <span className="text-[9px] font-black text-primary uppercase tracking-tighter">
                                {formatRupiah(Number(customer.unpaid?.total))}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  }}
                />
              )}
            </div>
          </IonContent>

          {/* Compact Footer Stats */}
          <div className="p-3 glass border-t border-slate-200 flex justify-between items-center">
            <span className="text-[10px] text-slate-600 font-medium uppercase tracking-tight">
              <span className="text-slate-800 font-bold">{filteredCustomers.length}</span> PELANGGAN
            </span>
            {searchText && (
              <GlassButton variant="secondary" size="sm" onClick={() => setSearchText("")} className="!py-1 !px-2.5">
                <span className="text-[10px]">Reset</span>
              </GlassButton>
            )}
          </div>
        </div>
      </IonModal>


      <style>{`
        .glass-modal-full::part(content) {
          background: transparent;
          backdrop-filter: blur(20px);
        }
        .transparent-content {
          --background: transparent;
        }
      `}</style>
    </div>
  );
};

export default React.memo(SelectCustomer);

