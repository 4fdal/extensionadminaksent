// PaymentPage.tsx
import React, { useState, useMemo } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonCard,
  IonCardContent,
  IonIcon,
  IonButton,
  IonImg,
  IonText,
  IonList,
  IonSearchbar,
  IonAvatar,
  IonChip,
  IonBadge,
  IonSkeletonText,
  IonThumbnail,
  IonRippleEffect,
} from "@ionic/react";
import {
  person,
  receipt,
  calendar,
  cash,
  checkmarkCircle,
  arrowForward,
  imageOutline,
  search,
  close,
  chevronDown,
  call,
  business,
  locationOutline,
  star,
  trendingUp,
  people,
  storefront,
  home,
  briefcase,
} from "ionicons/icons";

// Data dummy pelanggan yang lebih lengkap
const customers = [
  {
    id: 1,
    name: "PT Maju Jaya",
    phone: "0812-3456-7890",
    type: "Perusahaan",
    location: "Jakarta",
    transactions: 24,
    rating: 4.8,
  },
  {
    id: 2,
    name: "CV Sukses Abadi",
    phone: "0813-9876-5432",
    type: "CV",
    location: "Surabaya",
    transactions: 18,
    rating: 4.5,
  },
  {
    id: 3,
    name: "Toko Sejahtera",
    phone: "0814-5678-9012",
    type: "Toko",
    location: "Bandung",
    transactions: 156,
    rating: 4.9,
  },
  {
    id: 4,
    name: "UD Makmur",
    phone: "0815-1234-5678",
    type: "UD",
    location: "Yogyakarta",
    transactions: 42,
    rating: 4.6,
  },
  {
    id: 5,
    name: "PT Sinar Terang",
    phone: "0816-8765-4321",
    type: "Perusahaan",
    location: "Jakarta",
    transactions: 67,
    rating: 4.7,
  },
  {
    id: 6,
    name: "CV Berkah Selalu",
    phone: "0817-2345-6789",
    type: "CV",
    location: "Semarang",
    transactions: 31,
    rating: 4.4,
  },
  {
    id: 7,
    name: "Toko Barokah",
    phone: "0818-9876-1234",
    type: "Toko",
    location: "Malang",
    transactions: 203,
    rating: 4.9,
  },
  {
    id: 8,
    name: "Bapak Ahmad",
    phone: "0819-3456-7890",
    type: "Perorangan",
    location: "Surabaya",
    transactions: 12,
    rating: 5.0,
  },
  {
    id: 9,
    name: "Ibu Siti Aminah",
    phone: "0821-8765-4321",
    type: "Perorangan",
    location: "Jakarta",
    transactions: 8,
    rating: 4.8,
  },
  {
    id: 10,
    name: "PT Delta Nusantara",
    phone: "0822-1234-5678",
    type: "Perusahaan",
    location: "Medan",
    transactions: 89,
    rating: 4.6,
  },
  {
    id: 11,
    name: "Toko Rezeki",
    phone: "0823-4567-8901",
    type: "Toko",
    location: "Palembang",
    transactions: 134,
    rating: 4.7,
  },
  {
    id: 12,
    name: "CV Karya Mandiri",
    phone: "0824-7890-1234",
    type: "CV",
    location: "Makassar",
    transactions: 27,
    rating: 4.5,
  },
];

const PaymentPage: React.FC = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [paymentDate, setPaymentDate] = useState<string>(
    new Date().toISOString(),
  );
  const [totalPayment, setTotalPayment] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Filter customers berdasarkan search
  const filteredCustomers = useMemo(() => {
    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.phone.includes(searchText) ||
        customer.type.toLowerCase().includes(searchText.toLowerCase()) ||
        customer.location.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText]);

  // Format currency Indonesia
  const formatRupiah = (value: string) => {
    const number = value.replace(/[^0-9]/g, "");
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(number));
  };

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setShowCustomerModal(false);
    setSearchText("");
  };

  const handleImageUpload = () => {
    setImagePreview(
      "https://via.placeholder.com/300x200/4CAF50/FFFFFF?text=Bukti+Transfer",
    );
  };

  const handleSubmit = () => {
    console.log({
      customer: selectedCustomer,
      invoice: invoiceNumber,
      date: paymentDate,
      total: totalPayment,
      image: imagePreview,
    });
  };

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

  return (
    <IonPage>
      {/* Header */}
      <IonHeader className="ion-no-border">
        <IonToolbar className="!bg-blue-500">
          <IonTitle className="text-center font-semibold tracking-wide text-white">
            Pembayaran
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="bg-gray-100 ion-padding">
        {/* Image View Section */}
        <IonCard className="rounded-xl shadow-sm mb-4 bg-white m-0">
          <IonCardContent className="p-4">
            <IonText className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-3">
              Bukti Pembayaran
            </IonText>

            <div
              onClick={handleImageUpload}
              className={`w-full h-48 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-500 cursor-pointer overflow-hidden relative transition-all duration-200 ${imagePreview ? "bg-transparent" : "bg-blue-50"}`}
            >
              {imagePreview ? (
                <IonImg
                  src={imagePreview}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-blue-500">
                  <IonIcon icon={imageOutline} className="text-5xl mb-2" />
                  <IonText className="block text-sm font-medium">
                    Tap untuk upload bukti
                  </IonText>
                </div>
              )}
            </div>

            {imagePreview && (
              <IonButton
                expand="block"
                fill="clear"
                size="small"
                onClick={() => setImagePreview(null)}
                className="mt-2 text-red-500"
              >
                Hapus Gambar
              </IonButton>
            )}
          </IonCardContent>
        </IonCard>

        {/* Form Section */}
        <IonCard className="rounded-xl shadow-sm mb-4 bg-white m-0">
          <IonCardContent className="p-4">
            {/* Select Nama Pelanggan dengan Search */}
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
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${getAvatarGradient(selectedCustomer.name)} flex items-center justify-center text-white font-bold text-xl shadow-lg transform transition-transform duration-300`}
                    >
                      {selectedCustomer.name.charAt(0)}
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gray-200 flex items-center justify-center text-gray-400">
                      <IonIcon icon={people} className="text-2xl" />
                    </div>
                  )}
                  <div>
                    <div
                      className={`font-bold text-lg ${selectedCustomer ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {selectedCustomer
                        ? selectedCustomer.name
                        : "Pilih Pelanggan"}
                    </div>
                    {selectedCustomer ? (
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-sm text-gray-600 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full shadow-sm">
                          <IonIcon
                            icon={call}
                            className="text-xs text-blue-500"
                          />
                          {selectedCustomer.phone}
                        </span>
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full text-white shadow-sm"
                          style={{
                            backgroundColor: getCustomerStyle(
                              selectedCustomer.type,
                            ).color,
                          }}
                        >
                          {selectedCustomer.type}
                        </span>
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
                <div className="px-4 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {[
                      "Semua",
                      "Perusahaan",
                      "Toko",
                      "CV",
                      "UD",
                      "Perorangan",
                    ].map((filter, idx) => (
                      <button
                        key={filter}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${idx === 0 ? "bg-blue-500 text-white shadow-md" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <IonContent className="bg-gray-50">
                  <div className="p-4 space-y-3">
                    {filteredCustomers.length === 0 ? (
                      <div className="text-center py-12 px-6">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                          <IonIcon
                            icon={search}
                            className="text-4xl text-gray-400"
                          />
                        </div>
                        <h3 className="text-gray-800 font-semibold text-lg mb-2">
                          Tidak ditemukan
                        </h3>
                        <p className="text-gray-500 text-sm">
                          Coba cari dengan kata kunci lain
                        </p>
                      </div>
                    ) : (
                      filteredCustomers.map((customer, index) => {
                        const style = getCustomerStyle(customer.type);
                        const isSelected = selectedCustomer?.id === customer.id;

                        return (
                          <div
                            key={customer.id}
                            onClick={() => handleSelectCustomer(customer)}
                            className={`relative overflow-hidden rounded-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${isSelected ? "ring-2 ring-blue-500 shadow-lg" : "shadow-sm hover:shadow-md"}`}
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
                                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getAvatarGradient(customer.name)} flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0 ${isSelected ? "ring-4 ring-blue-200" : ""}`}
                              >
                                {customer.name.charAt(0)}
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
                                  <h3
                                    className={`font-bold text-base truncate ${isSelected ? "text-blue-700" : "text-gray-800"}`}
                                  >
                                    {customer.name}
                                  </h3>
                                  <span
                                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${style.lightBg}`}
                                    style={{ color: style.color }}
                                  >
                                    {customer.type}
                                  </span>
                                </div>

                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                  <span className="flex items-center gap-1.5">
                                    <IonIcon
                                      icon={call}
                                      className="text-gray-400"
                                    />
                                    {customer.phone}
                                  </span>
                                  <span className="flex items-center gap-1.5">
                                    <IonIcon
                                      icon={locationOutline}
                                      className="text-gray-400"
                                    />
                                    {customer.location}
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
                                      {customer.transactions} transaksi
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <IonIcon
                                      icon={star}
                                      className="text-yellow-400 text-sm"
                                    />
                                    <span className="text-xs font-semibold text-gray-700">
                                      {customer.rating}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Hover Effect Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/0 to-white/0 hover:via-white/5 transition-all duration-300 pointer-events-none" />
                          </div>
                        );
                      })
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
                      {selectedCustomer.name} • {selectedCustomer.phone}
                    </p>
                    <p className="text-green-500 text-xs mt-0.5">
                      Klik kotak di atas untuk mengganti
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* No Invoice */}
            <div className="mb-5">
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
                  placeholder="INV-2024-XXXX"
                  value={invoiceNumber}
                  onIonChange={(e) => setInvoiceNumber(e.detail.value!)}
                  className="font-medium text-gray-700"
                />
              </IonItem>
            </div>

            {/* Tanggal dan Waktu Pembayaran */}
            <div className="mb-5">
              <IonLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
                Tanggal & Waktu Pembayaran
              </IonLabel>
              <IonItem
                lines="none"
                className="bg-gray-100 rounded-xl px-4 py-1"
              >
                <IonIcon
                  icon={calendar}
                  slot="start"
                  className="mr-3 text-blue-500 text-xl"
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
                    presentation="date-time"
                    locale="id-ID"
                  />
                </IonModal>
              </IonItem>
            </div>

            {/* Total Pembayaran */}
            <div className="mb-2">
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
                  {formatRupiah(totalPayment)}
                </IonText>
              )}
            </div>
          </IonCardContent>
        </IonCard>

        {/* Submit Button */}
        <IonButton
          expand="block"
          size="large"
          onClick={handleSubmit}
          disabled={!selectedCustomer || !invoiceNumber || !totalPayment}
          className={`rounded-2xl mt-2 h-14 font-bold text-base tracking-wide shadow-xl shadow-blue-500/30 ${!selectedCustomer || !invoiceNumber || !totalPayment ? "opacity-50" : "hover:shadow-2xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all"}`}
        >
          <IonIcon icon={checkmarkCircle} slot="start" className="mr-2" />
          Simpan Pembayaran
          <IonIcon icon={arrowForward} slot="end" className="ml-2" />
        </IonButton>

        {/* Summary Card */}
        {(selectedCustomer || invoiceNumber || totalPayment) && (
          <IonCard className="rounded-2xl shadow-lg my-4 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 m-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full -mr-16 -mt-16 opacity-50" />
            <IonCardContent className="p-5 relative">
              <IonText className="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                Ringkasan Pembayaran
              </IonText>
              <div className="space-y-3">
                {selectedCustomer && (
                  <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                    <span className="text-gray-600 text-sm font-medium">
                      Pelanggan
                    </span>
                    <span className="font-bold text-gray-800 text-sm">
                      {selectedCustomer.name}
                    </span>
                  </div>
                )}
                {invoiceNumber && (
                  <div className="flex justify-between items-center p-2 bg-white/60 rounded-lg">
                    <span className="text-gray-600 text-sm font-medium">
                      No. Invoice
                    </span>
                    <span className="font-bold text-gray-800 text-sm font-mono">
                      {invoiceNumber}
                    </span>
                  </div>
                )}
                {totalPayment && (
                  <div className="flex justify-between items-center p-3 bg-green-100 rounded-xl border border-green-200">
                    <span className="text-green-800 text-sm font-bold">
                      Total Pembayaran
                    </span>
                    <span className="text-green-700 text-lg font-extrabold">
                      {formatRupiah(totalPayment)}
                    </span>
                  </div>
                )}
              </div>
            </IonCardContent>
          </IonCard>
        )}
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
    </IonPage>
  );
};

export default PaymentPage;
