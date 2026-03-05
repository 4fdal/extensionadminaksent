import { Customer } from "@/types/customer";
import { IonContent, IonIcon, IonLabel, IonModal } from "@ionic/react";
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
import { formatRupiah } from "@/utils/helpers";

// Warna dan icon berdasarkan tipe pelanggan
const getCustomerStyle = (type: string) => {
  switch (type) {
    case "Perusahaan":
      return {
        color: "#2196F3",
        bg: "bg-blue-500",
        lightBg: "bg-blue-50",
        border: "border-blue-200",
        icon: business,
        gradient: "from-blue-500 to-blue-600",
      };
    case "CV":
      return {
        color: "#9C27B0",
        bg: "bg-purple-500",
        lightBg: "bg-purple-50",
        border: "border-purple-200",
        icon: briefcase,
        gradient: "from-purple-500 to-purple-600",
      };
    case "Toko":
      return {
        color: "#FF9800",
        bg: "bg-orange-500",
        lightBg: "bg-orange-50",
        border: "border-orange-200",
        icon: storefront,
        gradient: "from-orange-500 to-orange-600",
      };
    case "UD":
      return {
        color: "#795548",
        bg: "bg-amber-700",
        lightBg: "bg-amber-50",
        border: "border-amber-200",
        icon: home,
        gradient: "from-amber-600 to-amber-700",
      };
    default:
      return {
        color: "#4CAF50",
        bg: "bg-green-500",
        lightBg: "bg-green-50",
        border: "border-green-200",
        icon: person,
        gradient: "from-green-500 to-green-600",
      };
  }
};

// Generate avatar gradient berdasarkan nama
const getAvatarGradient = (name: string) => {
  const gradients = [
    "from-pink-500 to-rose-500",
    "from-purple-500 to-indigo-500",
    "from-blue-500 to-cyan-500",
    "from-green-500 to-emerald-500",
    "from-yellow-500 to-orange-500",
    "from-red-500 to-pink-500",
    "from-indigo-500 to-purple-500",
    "from-teal-500 to-green-500",
  ];
  const index = name.length % gradients.length;
  return gradients[index];
};

type SelectCustomerProp = {
  data: Array<Customer>;
  selected?: Customer | null;
  onChange?: (customer: Customer | null) => void;
};

export const SelectCustomer: React.FC<SelectCustomerProp> = (props) => {
  const [searchText, setSearchText] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [customers, setCustomers] = useState<Array<Customer>>([]);

  useEffect(() => {
    setCustomers(props.data);
  }, [props.data]);

  useEffect(() => {
    if (
      props.selected != null &&
      props.selected?.unpaid?.invoice != selectedCustomer?.unpaid?.invoice
    )
      setSelectedCustomer(props.selected);
  }, [props.selected]);

  useEffect(() => {
    if (
      props.onChange &&
      props.selected?.unpaid?.invoice != selectedCustomer?.unpaid?.invoice
    )
      props.onChange(selectedCustomer);
  }, [selectedCustomer]);

  // Filter customers berdasarkan search
  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (customer) =>
        customer.namapelanggan
          .toLowerCase()
          .includes(searchText.toLowerCase()) ||
        customer.nolayanan.includes(searchText) ||
        customer.unpaid?.invoice
          .toLowerCase()
          .includes(searchText.toLowerCase()),
    );
  }, [searchText, customers]);

  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(false);
    setSearchText("");
  };

  return (
    <>
      <div className="mb-5">
        <IonLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
          Nama Pelanggan
        </IonLabel>

        {/* Custom Select Trigger */}
        <div
          onClick={() => setShowCustomerModal(true)}
          className={`rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md ${selectedCustomer ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-400" : "bg-gray-50 border-2 border-gray-200 hover:border-gray-300"}`}
        >
          <div className="flex items-center gap-4">
            {selectedCustomer ? (
              <div
                className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${getAvatarGradient(selectedCustomer.namapelanggan)} flex items-center justify-center text-white font-bold text-xl shadow-lg transform transition-transform duration-300`}
              >
                {selectedCustomer.namapelanggan.charAt(0)}
              </div>
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-400">
                <IonIcon icon={people} className="text-2xl" />
              </div>
            )}
            <div>
              <div
                className={`font-bold text-md ${selectedCustomer ? "text-gray-800" : "text-gray-400"}`}
              >
                {selectedCustomer
                  ? selectedCustomer.namapelanggan
                  : "Pilih Pelanggan"}
              </div>
              {selectedCustomer ? (
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-sm text-gray-600 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full shadow-sm">
                    <IonIcon icon={call} className="text-xs text-blue-500" />
                    {selectedCustomer.profile?.phone}
                  </span>
                  {/* <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full text-white shadow-sm"
                    style={{
                      backgroundColor: getCustomerStyle("person").color,
                    }}
                  >
                    {selectedCustomer.kodeunik}
                  </span> */}
                </div>
              ) : (
                <div className="text-sm text-gray-400 mt-1">
                  Klik untuk memilih dari daftar
                </div>
              )}
            </div>
          </div>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${selectedCustomer ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-400"}`}
          >
            <IonIcon
              icon={chevronDown}
              className={`text-xl transition-transform duration-300 ${showCustomerModal ? "rotate-180" : ""}`}
            />
          </div>
        </div>

        {/* Modal untuk Search & Select Pelanggan - DESAIN BARU */}
        <IonModal
          isOpen={showCustomerModal}
          onDidDismiss={() => {
            setShowCustomerModal(false);
            setSearchText("");
          }}
          breakpoints={[0, 0.5, 0.8, 1]}
          initialBreakpoint={0.8}
          handleBehavior="cycle"
          className="customer-modal"
        >
          {/* Header dengan Gradient */}
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 pt-12 pb-6 px-4 rounded-b-3xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-white text-xl font-bold">
                  Pilih Pelanggan
                </h2>
                <p className="text-blue-100 text-sm mt-1">
                  {customers.length} pelanggan tersedia
                </p>
              </div>
              <button
                onClick={() => {
                  setShowCustomerModal(false);
                  setSearchText("");
                }}
                className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <IonIcon icon={close} className="text-xl" />
              </button>
            </div>

            {/* Search Bar yang lebih cantik */}
            <div className="relative">
              <IonIcon
                icon={search}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg"
              />
              <input
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Cari nama, telepon, lokasi..."
                className="w-full bg-white rounded-2xl py-4 pl-12 pr-4 shadow-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all"
              />
              {searchText && (
                <button
                  onClick={() => setSearchText("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-300 transition-colors"
                >
                  <IonIcon icon={close} className="text-xs" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Chips */}
          {/* <div className="px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {["Semua", "Perusahaan", "Toko", "CV", "UD", "Perorangan"].map(
                (filter, idx) => (
                  <button
                    key={filter}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${idx === 0 ? "bg-blue-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                  >
                    {filter}
                  </button>
                ),
              )}
            </div>
          </div> */}

          <IonContent className="bg-gray-50">
            <div className="p-4 space-y-3">
              {filteredCustomers.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IonIcon icon={search} className="text-4xl text-gray-400" />
                  </div>
                  <h3 className="text-gray-800 font-semibold text-lg mb-2">
                    Tidak ditemukan
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Coba cari dengan kata kunci lain
                  </p>
                </div>
              ) : (
                <DataListScrolling
                  default={{ start: 0, end: 5, length: 5, scrollDown: 100 }}
                  data={filteredCustomers}
                  itemRender={(item, index) => {
                    const customer = item as Customer;
                    const style = getCustomerStyle("person");
                    const isSelected =
                      selectedCustomer?.nolayanan === customer.nolayanan;

                    return (
                      <div
                        key={index}
                        onClick={() => handleSelectCustomer(customer)}
                        className={`relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${isSelected ? "pr-2 p-2 border-1 border-blue-500 shadow-lg" : "shadow-sm hover:shadow-md"} mb-2`}
                        style={{
                          animationDelay: `${index * 50}ms`,
                          animation: "slideIn 0.3s ease-out forwards",
                        }}
                      >
                        {/* Background Card */}
                        <div
                          className={`absolute inset-0 bg-white ${isSelected ? "bg-blue-50/50" : ""}`}
                        />

                        {/* Selected Indicator */}
                        {isSelected && (
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-400 to-blue-600" />
                        )}

                        <div className="relative p-4 flex items-center gap-4">
                          {/* Avatar dengan Gradient */}
                          <div
                            className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${getAvatarGradient(customer.namapelanggan)} flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0 ${isSelected ? "ring-4 ring-blue-200" : ""}`}
                          >
                            {customer.namapelanggan.charAt(0)}
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                <IonIcon
                                  icon={checkmarkCircle}
                                  className="text-white text-xs"
                                />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <span
                                className={`font-bold text-base truncate ${isSelected ? "text-blue-700" : "text-gray-800"}`}
                              >
                                {customer.namapelanggan}
                              </span>
                              <span
                                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${style.lightBg}`}
                                style={{ color: style.color }}
                              >
                                Personal
                              </span>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1.5">
                                <IonIcon
                                  icon={call}
                                  className="text-gray-400"
                                />
                                {customer.profile?.phone}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <IonIcon
                                  icon={locationOutline}
                                  className="text-gray-400"
                                />
                                {customer.alamatpemasangan}
                              </span>
                            </div>

                            {/* Stats Row */}
                            <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-1.5">
                                <IonIcon
                                  icon={trendingUp}
                                  className="text-green-500 text-sm"
                                />
                                <span className="text-xs font-semibold text-gray-700">
                                  {customer.unpaid?.invoice} •{" "}
                                  {formatRupiah(Number(customer.unpaid?.total))}{" "}
                                  • {customer.namaprofile}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Hover Effect Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-white/0 hover:via-white/5 transition-all duration-300 pointer-events-none" />
                      </div>
                    );
                  }}
                />
              )}
            </div>

            {/* Bottom Spacer */}
            <div className="h-8" />
          </IonContent>

          {/* Footer */}
          <div className="bg-white border-t border-gray-200 p-4 flex justify-between items-center shadow-lg">
            <div className="text-sm text-gray-600">
              <span className="font-bold text-blue-600">
                {filteredCustomers.length}
              </span>{" "}
              pelanggan ditemukan
            </div>
            {searchText && (
              <button
                onClick={() => setSearchText("")}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold text-gray-700 transition-colors"
              >
                Reset Pencarian
              </button>
            )}
          </div>
        </IonModal>

        {/* Info Pelanggan Terpilih */}
        {selectedCustomer && (
          <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <IonIcon
                icon={checkmarkCircle}
                className="text-green-600 text-xl"
              />
            </div>
            <div>
              <h4 className="font-bold text-green-800 text-sm">
                Pelanggan Terpilih
              </h4>
              <p className="text-green-600 text-xs mt-1">
                {selectedCustomer.unpaid?.invoice} •{" "}
                {selectedCustomer.namapelanggan} •{" "}
                {selectedCustomer.namaprofile}
              </p>
              <p className="text-green-500 text-xs mt-0.5">
                Klik kotak di atas untuk mengganti
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(SelectCustomer);
