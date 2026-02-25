// UnpaidPage.tsx
import React, { useState, useMemo, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonIcon,
  IonButton,

  IonModal,
  IonButtons,
  IonBackButton,

  IonRefresher,
  IonRefresherContent,

  IonActionSheet,
  IonAlert,
  IonToast,
  IonLoading
} from '@ionic/react';
import {
  search,
  arrowDownOutline,
  arrowUpOutline,
  funnelOutline,
  optionsOutline,
  callOutline,
  mailOutline,
  locationOutline,
  calendarOutline,
  timeOutline,
  cashOutline,
  receiptOutline,
  checkmarkCircleOutline,
  personOutline,
  businessOutline,
  documentTextOutline,
  printOutline,
  shareOutline,
  ellipsisVertical,
  alertCircleOutline,
  createOutline,
  trashOutline,
  eyeOutline,
  checkmarkOutline,
  closeOutline,
  sendOutline,
  logoWhatsapp,
  call,
  mail,
  time,
  qrCodeOutline,
  cardOutline,
  flagOutline,
  starOutline,
  star,
  checkboxOutline,
  arrowForward,
} from 'ionicons/icons';

// Interface untuk data pelanggan
interface UnpaidCustomer {
  id: string;
  status: 'BELUM' | 'PROSES' | 'PENDING';
  invoice: string;
  noLayanan: string;
  pelanggan: string;
  email: string;
  telepon: string;
  alamat: string;
  profile: 'REGULER' | 'VIP' | 'CORPORATE';
  mitra: string;
  kategori: 'INTERNET' | 'TV' | 'VOICE' | 'BUNDLE';
  tglTerbit: string;
  jthTempo: string;
  subtotal: number;
  diskon: number;
  ppn: number;
  kode: string;
  total: number;
  note: string;
  tagih: boolean;
  history: PaymentHistory[];
  isFavorite: boolean;
}

interface PaymentHistory {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: string;
}

// Data dummy yang lebih lengkap
const unpaidData: UnpaidCustomer[] = [
  {
    id: '1',
    status: 'BELUM',
    invoice: 'INV-202402-0001',
    noLayanan: 'LYN-001-2024',
    pelanggan: 'PT Maju Jaya Digital',
    email: 'finance@majujaya.co.id',
    telepon: '0812-3456-7890',
    alamat: 'Jl. Sudirman No. 123, Jakarta Pusat',
    profile: 'CORPORATE',
    mitra: 'Mitra A',
    kategori: 'BUNDLE',
    tglTerbit: '2024-02-01',
    jthTempo: '2024-02-15',
    subtotal: 2500000,
    diskon: 250000,
    ppn: 247500,
    kode: 'PROMO-001',
    total: 2497500,
    note: 'Menunggu konfirmasi pembayaran dari bagian keuangan',
    tagih: true,
    isFavorite: true,
    history: [
      { id: 'h1', date: '2024-01-15', amount: 2500000, method: 'Transfer', status: 'Lunas' },
    ],
  },
  {
    id: '2',
    status: 'PROSES',
    invoice: 'INV-202402-0002',
    noLayanan: 'LYN-002-2024',
    pelanggan: 'CV Sukses Abadi',
    email: 'admin@suksesabadi.com',
    telepon: '0813-9876-5432',
    alamat: 'Jl. Ahmad Yani No. 45, Surabaya',
    profile: 'VIP',
    mitra: 'Mitra B',
    kategori: 'INTERNET',
    tglTerbit: '2024-02-05',
    jthTempo: '2024-02-20',
    subtotal: 1500000,
    diskon: 0,
    ppn: 165000,
    kode: '-',
    total: 1665000,
    note: 'Sudah dihubungi, akan bayar minggu depan',
    tagih: false,
    isFavorite: false,
    history: [],
  },
  {
    id: '3',
    status: 'BELUM',
    invoice: 'INV-202402-0003',
    noLayanan: 'LYN-003-2024',
    pelanggan: 'Toko Sejahtera',
    email: 'toko.sejahtera@gmail.com',
    telepon: '0814-5678-9012',
    alamat: 'Jl. Merdeka No. 78, Bandung',
    profile: 'REGULER',
    mitra: 'Mitra A',
    kategori: 'TV',
    tglTerbit: '2024-02-10',
    jthTempo: '2024-02-25',
    subtotal: 350000,
    diskon: 35000,
    ppn: 34650,
    kode: 'DISKON-10',
    total: 349650,
    note: 'Pelanggan sulit dihubungi',
    tagih: true,
    isFavorite: false,
    history: [],
  },
  {
    id: '4',
    status: 'PENDING',
    invoice: 'INV-202402-0004',
    noLayanan: 'LYN-004-2024',
    pelanggan: 'UD Makmur Sejahtera',
    email: 'ud.makmur@yahoo.com',
    telepon: '0815-1234-5678',
    alamat: 'Jl. Malioboro No. 12, Yogyakarta',
    profile: 'REGULER',
    mitra: 'Mitra C',
    kategori: 'VOICE',
    tglTerbit: '2024-02-12',
    jthTempo: '2024-02-27',
    subtotal: 500000,
    diskon: 0,
    ppn: 55000,
    kode: '-',
    total: 555000,
    note: 'Masalah teknis, menunggu perbaikan',
    tagih: false,
    isFavorite: false,
    history: [],
  },
  {
    id: '5',
    status: 'BELUM',
    invoice: 'INV-202402-0005',
    noLayanan: 'LYN-005-2024',
    pelanggan: 'PT Sinar Terang Abadi',
    email: 'billing@sinarterang.co.id',
    telepon: '0816-8765-4321',
    alamat: 'Jl. Thamrin No. 88, Jakarta Selatan',
    profile: 'CORPORATE',
    mitra: 'Mitra A',
    kategori: 'BUNDLE',
    tglTerbit: '2024-02-15',
    jthTempo: '2024-03-01',
    subtotal: 5000000,
    diskon: 500000,
    ppn: 495000,
    kode: 'CORP-2024',
    total: 4995000,
    note: 'Invoice sudah dikirim email',
    tagih: true,
    isFavorite: true,
    history: [
      { id: 'h2', date: '2024-01-20', amount: 5000000, method: 'Transfer', status: 'Lunas' },
    ],
  },
  {
    id: '6',
    status: 'BELUM',
    invoice: 'INV-202402-0006',
    noLayanan: 'LYN-006-2024',
    pelanggan: 'Bapak Ahmad Sudirman',
    email: 'ahmad.sudirman@gmail.com',
    telepon: '0817-3456-7890',
    alamat: 'Jl. Diponegoro No. 56, Surabaya',
    profile: 'REGULER',
    mitra: 'Mitra B',
    kategori: 'INTERNET',
    tglTerbit: '2024-02-18',
    jthTempo: '2024-03-05',
    subtotal: 450000,
    diskon: 0,
    ppn: 49500,
    kode: '-',
    total: 499500,
    note: 'Pelanggan minta ditagih akhir bulan',
    tagih: false,
    isFavorite: false,
    history: [],
  },
  {
    id: '7',
    status: 'PROSES',
    invoice: 'INV-202402-0007',
    noLayanan: 'LYN-007-2024',
    pelanggan: 'Ibu Siti Aminah',
    email: 'siti.aminah@outlook.com',
    telepon: '0818-8765-4321',
    alamat: 'Jl. Gatot Subroto No. 23, Jakarta',
    profile: 'VIP',
    mitra: 'Mitra C',
    kategori: 'INTERNET',
    tglTerbit: '2024-02-20',
    jthTempo: '2024-03-07',
    subtotal: 750000,
    diskon: 75000,
    ppn: 74250,
    kode: 'LOYAL-001',
    total: 749250,
    note: 'Proses transfer bank',
    tagih: false,
    isFavorite: true,
    history: [],
  },
];

type SortField = keyof UnpaidCustomer | null;
type SortDirection = 'asc' | 'desc';

const UnpaidPage: React.FC = () => {
  const [customers, setCustomers] = useState<UnpaidCustomer[]>(unpaidData);
  const [searchText, setSearchText] = useState('');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<UnpaidCustomer | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [newNote, setNewNote] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [showBarcodeModal, setShowBarcodeModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [filterMitra, setFilterMitra] = useState<string>('ALL');
  const [filterKategori, setFilterKategori] = useState<string>('ALL');
  const [filterProfile, setFilterProfile] = useState<string>('ALL');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [dateRange, setDateRange] = useState<'all' | 'today' | 'week' | 'month' | 'overdue'>('all');

  // Filter dan Sort data
  const filteredAndSortedData = useMemo(() => {
    let result = [...customers];

    // Filter berdasarkan status
    if (selectedStatus !== 'ALL') {
      result = result.filter(item => item.status === selectedStatus);
    }

    // Filter berdasarkan mitra
    if (filterMitra !== 'ALL') {
      result = result.filter(item => item.mitra === filterMitra);
    }

    // Filter berdasarkan kategori
    if (filterKategori !== 'ALL') {
      result = result.filter(item => item.kategori === filterKategori);
    }

    // Filter berdasarkan profile
    if (filterProfile !== 'ALL') {
      result = result.filter(item => item.profile === filterProfile);
    }

    // Filter berdasarkan range nominal
    if (minAmount) {
      result = result.filter(item => item.total >= parseInt(minAmount));
    }
    if (maxAmount) {
      result = result.filter(item => item.total <= parseInt(maxAmount));
    }

    // Filter berdasarkan tanggal
    const today = new Date();
    if (dateRange === 'today') {
      result = result.filter(item => item.jthTempo === today.toISOString().split('T')[0]);
    } else if (dateRange === 'week') {
      const weekLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      result = result.filter(item => new Date(item.jthTempo) <= weekLater);
    } else if (dateRange === 'month') {
      const monthLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      result = result.filter(item => new Date(item.jthTempo) <= monthLater);
    } else if (dateRange === 'overdue') {
      result = result.filter(item => new Date(item.jthTempo) < today);
    }

    // Filter berdasarkan pencarian
    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      result = result.filter(item =>
        item.invoice.toLowerCase().includes(lowerSearch) ||
        item.pelanggan.toLowerCase().includes(lowerSearch) ||
        item.noLayanan.toLowerCase().includes(lowerSearch) ||
        item.mitra.toLowerCase().includes(lowerSearch) ||
        item.kategori.toLowerCase().includes(lowerSearch) ||
        item.email.toLowerCase().includes(lowerSearch) ||
        item.telepon.includes(searchText)
      );
    }

    // Sorting
    if (sortField) {
      result.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];

        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();

        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [customers, searchText, sortField, sortDirection, selectedStatus, filterMitra, filterKategori, filterProfile, minAmount, maxAmount, dateRange]);

  // Handler untuk sorting
  const handleSort = (field: keyof UnpaidCustomer) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Format currency
  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Format tanggal
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Hitung hari jatuh tempo
  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Toggle selection
  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Select all
  const selectAll = () => {
    if (selectedItems.length === filteredAndSortedData.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredAndSortedData.map(item => item.id));
    }
  };

  // Handle refresh
  const handleRefresh = (e: any) => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      e.detail.complete();
    }, 2000);
  };

  // Show toast
  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  // Update status
  const updateStatus = (id: string, newStatus: string) => {
    setCustomers(prev => prev.map(item => 
      item.id === id ? { ...item, status: newStatus as any } : item
    ));
    showToastMessage(`Status diubah menjadi ${newStatus}`);
  };

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    setCustomers(prev => prev.map(item => 
      item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
    ));
  };

  // Toggle tagih
  const toggleTagih = (id: string) => {
    setCustomers(prev => prev.map(item => 
      item.id === id ? { ...item, tagih: !item.tagih } : item
    ));
  };

  // Delete customer
  const deleteCustomer = (id: string) => {
    setCustomers(prev => prev.filter(item => item.id !== id));
    setShowDeleteAlert(false);
    showToastMessage('Data berhasil dihapus');
  };

  // Process payment
  const processPayment = () => {
    if (!selectedCustomer || !paymentAmount) return;
    
    setLoading(true);
    setTimeout(() => {
      setCustomers(prev => prev.map(item => 
        item.id === selectedCustomer.id 
          ? { ...item, status: 'PROSES', history: [...item.history, {
              id: `h${Date.now()}`,
              date: new Date().toISOString().split('T')[0],
              amount: parseInt(paymentAmount),
              method: paymentMethod,
              status: 'Proses'
            }] }
          : item
      ));
      setLoading(false);
      setShowPaymentModal(false);
      setPaymentAmount('');
      showToastMessage('Pembayaran berhasil diproses');
    }, 1500);
  };

  // Add note
  const addNote = () => {
    if (!selectedCustomer || !newNote) return;
    
    setCustomers(prev => prev.map(item => 
      item.id === selectedCustomer.id 
        ? { ...item, note: newNote }
        : item
    ));
    setShowAddNoteModal(false);
    setNewNote('');
    showToastMessage('Catatan berhasil ditambahkan');
  };

  // Send WhatsApp
  const sendWhatsApp = (phone: string, message: string) => {
    const url = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    showToastMessage('Membuka WhatsApp...');
  };

  // Send Email
  const sendEmail = (email: string, subject: string, body: string) => {
    const url = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, '_blank');
    showToastMessage('Membuka email client...');
  };

  // Export to Excel
  const exportToExcel = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToastMessage('Data berhasil diekspor ke Excel');
    }, 2000);
  };

  // Print invoice
  const printInvoice = (customer: UnpaidCustomer) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      window.print();
      showToastMessage('Mencetak invoice...');
    }, 1000);
  };

  // Share invoice
  const shareInvoice = async (customer: UnpaidCustomer) => {
    const shareData = {
      title: `Invoice ${customer.invoice}`,
      text: `Tagihan untuk ${customer.pelanggan} - ${formatRupiah(customer.total)}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        showToastMessage('Fitur share tidak tersedia');
      }
    } catch (err) {
      console.log('Error sharing:', err);
    }
  };

  // Status config
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'BELUM':
        return { color: 'bg-red-500', text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' };
      case 'PROSES':
        return { color: 'bg-blue-500', text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' };
      case 'PENDING':
        return { color: 'bg-amber-500', text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' };
      default:
        return { color: 'bg-gray-500', text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' };
    }
  };

  // Profile config
  const getProfileConfig = (profile: string) => {
    switch (profile) {
      case 'CORPORATE':
        return { icon: businessOutline, color: 'bg-purple-500', label: 'CORP' };
      case 'VIP':
        return { icon: personOutline, color: 'bg-amber-500', label: 'VIP' };
      default:
        return { icon: personOutline, color: 'bg-gray-500', label: 'REG' };
    }
  };

  // Get unique values for filters
  const uniqueMitra = [...new Set(customers.map(c => c.mitra))];
  const uniqueKategori = [...new Set(customers.map(c => c.kategori))];

  return (
    <IonPage className="bg-gray-50">
      {/* Loading Overlay */}
      <IonLoading isOpen={loading} message="Memproses..." />

      {/* Toast */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        position="top"
        color="success"
      />

      {/* Header */}
      <IonHeader className="ion-no-border shadow-sm">
        <IonToolbar className="bg-white">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" className="text-gray-700" />
          </IonButtons>
          <IonTitle className="text-gray-800 font-bold text-lg">Belum Bayar</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowActionSheet(true)}>
              <IonIcon icon={ellipsisVertical} className="text-gray-600" />
            </IonButton>
          </IonButtons>
        </IonToolbar>

        {/* Search Bar */}
        <IonToolbar className="bg-white pb-2">
          <div className="px-4">
            <div className="relative">
              <IonSearchbar
                value={searchText}
                onIonChange={(e) => setSearchText(e.detail.value!)}
                placeholder="Cari invoice, pelanggan, layanan..."
                className="!p-0 !bg-gray-100 !rounded-xl"
                style={{ '--box-shadow': 'none' }}
              />
            </div>
          </div>
        </IonToolbar>

        {/* Status Filter Chips */}
        <div className="bg-white px-4 pb-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            {[
              { key: 'ALL', label: 'Semua', count: customers.length },
              { key: 'BELUM', label: 'Belum Bayar', count: customers.filter(d => d.status === 'BELUM').length },
              { key: 'PROSES', label: 'Dalam Proses', count: customers.filter(d => d.status === 'PROSES').length },
              { key: 'PENDING', label: 'Pending', count: customers.filter(d => d.status === 'PENDING').length },
            ].map((status) => (
              <button
                key={status.key}
                onClick={() => setSelectedStatus(status.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedStatus === status.key
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status.label}
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  selectedStatus === status.key ? 'bg-white/30' : 'bg-gray-200'
                }`}>
                  {status.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort & Filter Bar */}
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={selectAll}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                selectedItems.length === filteredAndSortedData.length && filteredAndSortedData.length > 0
                  ? 'bg-blue-500 border-blue-500 text-white'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              {selectedItems.length === filteredAndSortedData.length && filteredAndSortedData.length > 0 && (
                <IonIcon icon={checkmarkOutline} className="text-xs" />
              )}
            </button>
            <span className="text-xs text-gray-500">
              {selectedItems.length > 0 ? `${selectedItems.length} dipilih` : `${filteredAndSortedData.length} data`}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSortModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <IonIcon icon={sortField ? (sortDirection === 'asc' ? arrowUpOutline : arrowDownOutline) : optionsOutline} className="text-sm" />
              Urutkan
            </button>
            <button
              onClick={() => setShowFilterModal(true)}
              className={`flex items-center gap-1 px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors ${
                filterMitra !== 'ALL' || filterKategori !== 'ALL' || filterProfile !== 'ALL' || minAmount || maxAmount || dateRange !== 'all'
                  ? 'bg-blue-50 border-blue-200 text-blue-600'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <IonIcon icon={funnelOutline} className="text-sm" />
              Filter
              {(filterMitra !== 'ALL' || filterKategori !== 'ALL' || filterProfile !== 'ALL' || minAmount || maxAmount || dateRange !== 'all') && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>
      </IonHeader>

      <IonContent className="bg-gray-50">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent />
        </IonRefresher>

        {/* List Content */}
        <div className="p-4 space-y-3">
          {filteredAndSortedData.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <IonIcon icon={search} className="text-4xl text-gray-400" />
              </div>
              <h3 className="text-gray-800 font-semibold text-lg mb-2">Tidak ada data</h3>
              <p className="text-gray-500 text-sm">Coba ubah filter atau kata kunci pencarian</p>
              <button
                onClick={() => {
                  setSearchText('');
                  setSelectedStatus('ALL');
                  setFilterMitra('ALL');
                  setFilterKategori('ALL');
                  setFilterProfile('ALL');
                  setMinAmount('');
                  setMaxAmount('');
                  setDateRange('all');
                }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            filteredAndSortedData.map((item, index) => {
              const statusConfig = getStatusConfig(item.status);
              const profileConfig = getProfileConfig(item.profile);
              const daysUntilDue = getDaysUntilDue(item.jthTempo);
              const isOverdue = daysUntilDue < 0;
              const isSelected = selectedItems.includes(item.id);

              return (
                <div
                  key={item.id}
                  className={`relative bg-white rounded-2xl shadow-sm border-2 transition-all duration-200 overflow-hidden ${
                    isSelected ? 'border-blue-500 shadow-md' : 'border-transparent hover:border-gray-200'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Selection Checkbox */}
                  <div 
                    className="absolute top-3 left-3 z-10"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSelection(item.id);
                    }}
                  >
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${
                      isSelected ? 'bg-blue-500 text-white' : 'bg-gray-100 border-2 border-gray-300'
                    }`}>
                      {isSelected && <IonIcon icon={checkmarkOutline} className="text-sm" />}
                    </div>
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(item.id);
                    }}
                    className="absolute top-3 right-12 z-10 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <IonIcon 
                      icon={item.isFavorite ? star : starOutline} 
                      className={`text-lg ${item.isFavorite ? 'text-amber-400' : 'text-gray-400'}`}
                    />
                  </button>

                  {/* More Options */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCustomer(item);
                      setShowActionSheet(true);
                    }}
                    className="absolute top-3 right-3 z-10 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <IonIcon icon={ellipsisVertical} className="text-gray-400 text-lg" />
                  </button>

                  {/* Card Header - Status & Invoice */}
                  <div 
                    className={`px-4 pt-3 pb-2 ${statusConfig.bg} border-b ${statusConfig.border} cursor-pointer`}
                    onClick={() => {
                      setSelectedCustomer(item);
                      setShowDetailModal(true);
                    }}
                  >
                    <div className="flex items-center justify-between pl-8 pr-16">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${statusConfig.color}`}></span>
                        <span className={`text-xs font-bold uppercase ${statusConfig.text}`}>
                          {item.status}
                        </span>
                        <span className="text-gray-300">|</span>
                        <span className="text-xs font-mono font-semibold text-gray-600">
                          {item.invoice}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div 
                    className="p-4 pl-12 cursor-pointer"
                    onClick={() => {
                      setSelectedCustomer(item);
                      setShowDetailModal(true);
                    }}
                  >
                    {/* Pelanggan Info */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl ${profileConfig.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                        <IonIcon icon={profileConfig.icon} className="text-lg" />
                      </div>
                      <div className="flex-1 min-w-0 pr-8">
                        <h3 className="font-bold text-gray-800 text-sm leading-tight truncate">
                          {item.pelanggan}
                        </h3>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-semibold rounded">
                            {profileConfig.label}
                          </span>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {item.noLayanan}
                          </span>
                          {item.tagih && (
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
                        <span className="truncate">{item.mitra}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <IonIcon icon={checkboxOutline} className="text-gray-400" />
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          item.kategori === 'INTERNET' ? 'bg-blue-100 text-blue-600' :
                          item.kategori === 'TV' ? 'bg-purple-100 text-purple-600' :
                          item.kategori === 'VOICE' ? 'bg-green-100 text-green-600' :
                          'bg-orange-100 text-orange-600'
                        }`}>
                          {item.kategori}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <IonIcon icon={calendarOutline} className="text-gray-400" />
                        <span>Terbit: {formatDate(item.tglTerbit)}</span>
                      </div>
                      <div className={`flex items-center gap-2 text-xs font-semibold ${
                        isOverdue ? 'text-red-600' : daysUntilDue <= 3 ? 'text-amber-600' : 'text-gray-600'
                      }`}>
                        <IonIcon icon={timeOutline} className={isOverdue ? 'text-red-500' : 'text-gray-400'} />
                        <span>
                          {isOverdue ? `Terlambat ${Math.abs(daysUntilDue)} hari` : `${daysUntilDue} hari lagi`}
                        </span>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-gray-50 rounded-xl p-3 space-y-1">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Subtotal</span>
                        <span>{formatRupiah(item.subtotal)}</span>
                      </div>
                      {item.diskon > 0 && (
                        <div className="flex justify-between text-xs text-green-600">
                          <span>Diskon ({item.kode})</span>
                          <span>-{formatRupiah(item.diskon)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>PPN (11%)</span>
                        <span>{formatRupiah(item.ppn)}</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-700">TOTAL</span>
                        <span className="text-sm font-bold text-gray-800">{formatRupiah(item.total)}</span>
                      </div>
                    </div>

                    {/* Note */}
                    {item.note && (
                      <div className="mt-3 p-2 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2">
                        <IonIcon icon={alertCircleOutline} className="text-amber-500 text-sm flex-shrink-0 mt-0.5" />
                        <p className="text-[11px] text-amber-700 leading-relaxed">{item.note}</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="px-4 pb-4 pl-12 flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCustomer(item);
                        setShowContactModal(true);
                      }}
                      className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <IonIcon icon={callOutline} className="text-sm" />
                      Hubungi
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCustomer(item);
                        setShowPaymentModal(true);
                      }}
                      className="flex-1 py-2 bg-green-50 text-green-600 rounded-lg text-xs font-semibold hover:bg-green-100 transition-colors flex items-center justify-center gap-1"
                    >
                      <IonIcon icon={cashOutline} className="text-sm" />
                      Bayar
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCustomer(item);
                        setShowDetailModal(true);
                      }}
                      className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <IonIcon icon={eyeOutline} className="text-sm" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Spacer */}
        <div className="h-20" />
      </IonContent>

      {/* Floating Action Button for Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 bg-white rounded-2xl shadow-lg border border-gray-200 p-4 flex items-center justify-between z-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <IonIcon icon={checkmarkCircleOutline} className="text-blue-600 text-xl" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{selectedItems.length} dipilih</p>
              <p className="text-xs text-gray-500">Total: {formatRupiah(
                selectedItems.reduce((acc, id) => {
                  const item = customers.find(d => d.id === id);
                  return acc + (item?.total || 0);
                }, 0)
              )}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedItems([])}
              className="px-4 py-2 text-gray-500 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  setLoading(false);
                  setSelectedItems([]);
                  showToastMessage(`${selectedItems.length} invoice diproses`);
                }, 1500);
              }}
              className="px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/30"
            >
              Proses Massal
            </button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <IonModal isOpen={showDetailModal} onDidDismiss={() => setShowDetailModal(false)} className="detail-modal">
        {selectedCustomer && (
          <div className="h-full flex flex-col bg-gray-50">
            {/* Modal Header */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-b-3xl shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => setShowDetailModal(false)}
                  className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <IonIcon icon={arrowDownOutline} className="text-xl rotate-90" />
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleFavorite(selectedCustomer.id)}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <IonIcon icon={selectedCustomer.isFavorite ? star : starOutline} className="text-xl" />
                  </button>
                  <button 
                    onClick={() => setShowActionSheet(true)}
                    className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <IonIcon icon={ellipsisVertical} className="text-xl" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl`}>
                  {selectedCustomer.pelanggan.charAt(0)}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold leading-tight">{selectedCustomer.pelanggan}</h2>
                  <p className="text-blue-100 text-sm mt-1">{selectedCustomer.invoice}</p>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  selectedCustomer.status === 'BELUM' ? 'bg-red-500' :
                  selectedCustomer.status === 'PROSES' ? 'bg-blue-400' : 'bg-amber-400'
                }`}>
                  {selectedCustomer.status}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20">
                  {selectedCustomer.profile}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {/* Contact Info */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <IonIcon icon={personOutline} className="text-blue-500" />
                  Informasi Kontak
                </h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => sendWhatsApp(selectedCustomer.telepon, `Halo ${selectedCustomer.pelanggan}, mengenai tagihan ${selectedCustomer.invoice} sebesar ${formatRupiah(selectedCustomer.total)}`)}
                    className="w-full flex items-center gap-3 p-3 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white">
                      <IonIcon icon={logoWhatsapp} className="text-lg" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-gray-800">{selectedCustomer.telepon}</p>
                      <p className="text-xs text-gray-500">Kirim WhatsApp</p>
                    </div>
                    <IonIcon icon={sendOutline} className="text-green-600" />
                  </button>

                  <button 
                    onClick={() => sendEmail(selectedCustomer.email, `Tagihan ${selectedCustomer.invoice}`, `Yth. ${selectedCustomer.pelanggan}, berikut tagihan Anda...`)}
                    className="w-full flex items-center gap-3 p-3 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white">
                      <IonIcon icon={mailOutline} className="text-lg" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-gray-800 truncate">{selectedCustomer.email}</p>
                      <p className="text-xs text-gray-500">Kirim Email</p>
                    </div>
                    <IonIcon icon={sendOutline} className="text-blue-600" />
                  </button>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white">
                      <IonIcon icon={locationOutline} className="text-lg" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">{selectedCustomer.alamat}</p>
                      <p className="text-xs text-gray-500">Alamat</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <IonIcon icon={receiptOutline} className="text-blue-500" />
                  Detail Layanan
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">No. Layanan</p>
                    <p className="text-sm font-bold text-gray-800 font-mono">{selectedCustomer.noLayanan}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Kategori</p>
                    <p className="text-sm font-bold text-gray-800">{selectedCustomer.kategori}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Mitra</p>
                    <p className="text-sm font-bold text-gray-800">{selectedCustomer.mitra}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Kode Promo</p>
                    <p className="text-sm font-bold text-gray-800">{selectedCustomer.kode}</p>
                  </div>
                </div>
              </div>

              {/* Financial Details */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <IonIcon icon={cashOutline} className="text-green-500" />
                  Rincian Pembayaran
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">{formatRupiah(selectedCustomer.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Diskon</span>
                    <span className="font-semibold text-green-600">-{formatRupiah(selectedCustomer.diskon)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">PPN (11%)</span>
                    <span className="font-semibold">{formatRupiah(selectedCustomer.ppn)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                    <span className="font-bold text-gray-800">TOTAL</span>
                    <span className="text-xl font-bold text-green-600">{formatRupiah(selectedCustomer.total)}</span>
                  </div>
                </div>
              </div>

              {/* Dates */}
              <div className="bg-white rounded-2xl p-4 shadow-sm">
                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <IonIcon icon={timeOutline} className="text-amber-500" />
                  Informasi Jatuh Tempo
                </h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1 p-3 bg-gray-50 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Tanggal Terbit</p>
                    <p className="text-sm font-bold text-gray-800">{formatDate(selectedCustomer.tglTerbit)}</p>
                  </div>
                  <IonIcon icon={arrowForward} className="text-gray-400" />
                  <div className={`flex-1 p-3 rounded-xl ${
                    getDaysUntilDue(selectedCustomer.jthTempo) < 0 ? 'bg-red-50' : 'bg-amber-50'
                  }`}>
                    <p className="text-xs text-gray-500 mb-1">Jatuh Tempo</p>
                    <p className={`text-sm font-bold ${
                      getDaysUntilDue(selectedCustomer.jthTempo) < 0 ? 'text-red-600' : 'text-amber-600'
                    }`}>
                      {formatDate(selectedCustomer.jthTempo)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Note */}
              {selectedCustomer.note && (
                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                  <h3 className="text-sm font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <IonIcon icon={documentTextOutline} />
                    Catatan
                  </h3>
                  <p className="text-sm text-amber-700">{selectedCustomer.note}</p>
                </div>
              )}

              {/* History */}
              {selectedCustomer.history.length > 0 && (
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <IonIcon icon={time} className="text-purple-500" />
                    Riwayat Pembayaran
                  </h3>
                  <div className="space-y-2">
                    {selectedCustomer.history.map((h) => (
                      <div key={h.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{formatDate(h.date)}</p>
                          <p className="text-xs text-gray-500">{h.method}</p>
                        </div>
                        <span className="text-sm font-bold text-green-600">{formatRupiah(h.amount)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-white border-t border-gray-200 flex gap-3">
              <button 
                onClick={() => {
                  setShowDetailModal(false);
                  setShowPaymentModal(true);
                }}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-green-500/30 flex items-center justify-center gap-2"
              >
                <IonIcon icon={cashOutline} className="text-lg" />
                Proses Pembayaran
              </button>
              <button 
                onClick={() => printInvoice(selectedCustomer)}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                <IonIcon icon={printOutline} className="text-lg" />
              </button>
            </div>
          </div>
        )}
      </IonModal>

      {/* Payment Modal */}
      <IonModal isOpen={showPaymentModal} onDidDismiss={() => setShowPaymentModal(false)}>
        <div className="p-6 bg-white h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Proses Pembayaran</h2>
            <button 
              onClick={() => setShowPaymentModal(false)}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <IonIcon icon={closeOutline} className="text-xl text-gray-600" />
            </button>
          </div>

          {selectedCustomer && (
            <>
              <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Total Tagihan</p>
                <p className="text-2xl font-bold text-gray-800">{formatRupiah(selectedCustomer.total)}</p>
                <p className="text-xs text-gray-500 mt-1">{selectedCustomer.invoice}</p>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Nominal Pembayaran</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">Rp</span>
                    <input
                      type="number"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      placeholder={selectedCustomer.total.toString()}
                      className="w-full pl-12 pr-4 py-4 bg-gray-100 rounded-xl text-lg font-bold text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">Metode Pembayaran</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'transfer', icon: cardOutline, label: 'Transfer' },
                      { id: 'cash', icon: cashOutline, label: 'Tunai' },
                      { id: 'qris', icon: qrCodeOutline, label: 'QRIS' },
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id)}
                        className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                          paymentMethod === method.id
                            ? 'border-blue-500 bg-blue-50 text-blue-600'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <IonIcon icon={method.icon} className="text-2xl" />
                        <span className="text-xs font-semibold">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {paymentMethod === 'qris' && (
                  <div className="p-4 bg-gray-100 rounded-xl flex flex-col items-center">
                    <div className="w-32 h-32 bg-white rounded-lg flex items-center justify-center mb-2">
                      <IonIcon icon={qrCodeOutline} className="text-6xl text-gray-400" />
                    </div>
                    <p className="text-xs text-gray-500">Scan QRIS untuk pembayaran</p>
                  </div>
                )}
              </div>

              <button
                onClick={processPayment}
                disabled={!paymentAmount}
                className={`w-full py-4 rounded-xl font-bold text-white mt-6 flex items-center justify-center gap-2 ${
                  paymentAmount
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg shadow-green-500/30'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <IonIcon icon={checkmarkCircleOutline} className="text-xl" />
                Konfirmasi Pembayaran
              </button>
            </>
          )}
        </div>
      </IonModal>

      {/* Contact Modal */}
      <IonModal isOpen={showContactModal} onDidDismiss={() => setShowContactModal(false)}>
        <div className="p-6 bg-white h-full">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Hubungi Pelanggan</h2>
            <button 
              onClick={() => setShowContactModal(false)}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <IonIcon icon={closeOutline} className="text-xl text-gray-600" />
            </button>
          </div>

          {selectedCustomer && (
            <div className="space-y-4">
              <button
                onClick={() => sendWhatsApp(selectedCustomer.telepon, `Halo ${selectedCustomer.pelanggan}...`)}
                className="w-full flex items-center gap-4 p-4 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition-colors"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <IonIcon icon={logoWhatsapp} className="text-2xl" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold">WhatsApp</p>
                  <p className="text-sm opacity-90">{selectedCustomer.telepon}</p>
                </div>
                <IonIcon icon={sendOutline} className="text-xl" />
              </button>

              <button
                onClick={() => window.open(`tel:${selectedCustomer.telepon}`, '_blank')}
                className="w-full flex items-center gap-4 p-4 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-colors"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <IonIcon icon={call} className="text-2xl" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold">Telepon Langsung</p>
                  <p className="text-sm opacity-90">{selectedCustomer.telepon}</p>
                </div>
                <IonIcon icon={callOutline} className="text-xl" />
              </button>

              <button
                onClick={() => sendEmail(selectedCustomer.email, 'Tagihan', '...')}
                className="w-full flex items-center gap-4 p-4 bg-gray-800 text-white rounded-2xl hover:bg-gray-900 transition-colors"
              >
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <IonIcon icon={mail} className="text-2xl" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-bold">Email</p>
                  <p className="text-sm opacity-90 truncate">{selectedCustomer.email}</p>
                </div>
                <IonIcon icon={sendOutline} className="text-xl" />
              </button>
            </div>
          )}
        </div>
      </IonModal>

      {/* Sort Modal */}
      <IonModal isOpen={showSortModal} onDidDismiss={() => setShowSortModal(false)} className="auto-height">
        <div className="p-4 bg-white rounded-t-2xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Urutkan Berdasarkan</h3>
            <button onClick={() => setShowSortModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <IonIcon icon={closeOutline} className="text-gray-500" />
            </button>
          </div>
          <div className="space-y-2">
            {[
              { field: 'invoice', label: 'Nomor Invoice' },
              { field: 'pelanggan', label: 'Nama Pelanggan' },
              { field: 'tglTerbit', label: 'Tanggal Terbit' },
              { field: 'jthTempo', label: 'Jatuh Tempo' },
              { field: 'total', label: 'Total Tagihan' },
              { field: 'status', label: 'Status' },
              { field: 'mitra', label: 'Mitra' },
            ].map((item) => (
              <button
                key={item.field}
                onClick={() => {
                  handleSort(item.field as keyof UnpaidCustomer);
                  setShowSortModal(false);
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                  sortField === item.field ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="font-medium text-sm">{item.label}</span>
                {sortField === item.field && (
                  <IonIcon icon={sortDirection === 'asc' ? arrowUpOutline : arrowDownOutline} className="text-sm" />
                )}
              </button>
            ))}
          </div>
        </div>
      </IonModal>

      {/* Filter Modal */}
      <IonModal isOpen={showFilterModal} onDidDismiss={() => setShowFilterModal(false)}>
        <div className="p-6 bg-white h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Filter Lanjutan</h2>
            <button 
              onClick={() => setShowFilterModal(false)}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center"
            >
              <IonIcon icon={closeOutline} className="text-xl text-gray-600" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-6">
            {/* Mitra Filter */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Mitra</label>
              <select
                value={filterMitra}
                onChange={(e) => setFilterMitra(e.target.value)}
                className="w-full p-3 bg-gray-100 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="ALL">Semua Mitra</option>
                {uniqueMitra.map(mitra => (
                  <option key={mitra} value={mitra}>{mitra}</option>
                ))}
              </select>
            </div>

            {/* Kategori Filter */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Kategori</label>
              <div className="flex flex-wrap gap-2">
                {['ALL', 'INTERNET', 'TV', 'VOICE', 'BUNDLE'].map((kat) => (
                  <button
                    key={kat}
                    onClick={() => setFilterKategori(kat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                      filterKategori === kat
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {kat === 'ALL' ? 'Semua' : kat}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Filter */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Profile</label>
              <div className="flex flex-wrap gap-2">
                {['ALL', 'REGULER', 'VIP', 'CORPORATE'].map((prof) => (
                  <button
                    key={prof}
                    onClick={() => setFilterProfile(prof)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                      filterProfile === prof
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {prof === 'ALL' ? 'Semua' : prof}
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Range */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Range Nominal</label>
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
                  <input
                    type="number"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    placeholder="Min"
                    className="w-full pl-8 pr-3 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Rp</span>
                  <input
                    type="number"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    placeholder="Max"
                    className="w-full pl-8 pr-3 py-3 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Jatuh Tempo</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'all', label: 'Semua' },
                  { key: 'today', label: 'Hari Ini' },
                  { key: 'week', label: 'Minggu Ini' },
                  { key: 'month', label: 'Bulan Ini' },
                  { key: 'overdue', label: 'Terlambat' },
                ].map((range) => (
                  <button
                    key={range.key}
                    onClick={() => setDateRange(range.key as any)}
                    className={`p-3 rounded-xl text-xs font-semibold transition-colors ${
                      dateRange === range.key
                        ? 'bg-amber-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => {
                setFilterMitra('ALL');
                setFilterKategori('ALL');
                setFilterProfile('ALL');
                setMinAmount('');
                setMaxAmount('');
                setDateRange('all');
              }}
              className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setShowFilterModal(false)}
              className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
            >
              Terapkan
            </button>
          </div>
        </div>
      </IonModal>

      {/* Delete Alert */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => setShowDeleteAlert(false)}
        header="Hapus Data"
        message="Apakah Anda yakin ingin menghapus data ini?"
        buttons={[
          {
            text: 'Batal',
            role: 'cancel',
          },
          {
            text: 'Hapus',
            role: 'destructive',
            handler: () => {
              if (selectedCustomer) {
                deleteCustomer(selectedCustomer.id);
              }
            },
          },
        ]}
      />

      {/* Action Sheet */}
      <IonActionSheet
        isOpen={showActionSheet}
        onDidDismiss={() => setShowActionSheet(false)}
        buttons={[
          {
            text: 'Lihat Detail',
            icon: eyeOutline,
            handler: () => {
              if (selectedCustomer) setShowDetailModal(true);
            }
          },
          {
            text: 'Edit Data',
            icon: createOutline,
            handler: () => {
              setShowEditModal(true);
            }
          },
          {
            text: 'Proses Pembayaran',
            icon: cashOutline,
            handler: () => {
              if (selectedCustomer) setShowPaymentModal(true);
            }
          },
          {
            text: 'Cetak Invoice',
            icon: printOutline,
            handler: () => {
              if (selectedCustomer) printInvoice(selectedCustomer);
            }
          },
          {
            text: 'Bagikan',
            icon: shareOutline,
            handler: () => {
              if (selectedCustomer) shareInvoice(selectedCustomer);
            }
          },
          {
            text: 'Tandai Tagih',
            icon: flagOutline,
            handler: () => {
              if (selectedCustomer) {
                toggleTagih(selectedCustomer.id);
                showToastMessage('Status tagih diperbarui');
              }
            }
          },
          {
            text: 'Hapus',
            icon: trashOutline,
            role: 'destructive',
            handler: () => {
              setShowDeleteAlert(true);
            }
          },
          {
            text: 'Batal',
            role: 'cancel',
          }
        ]}
      />

      {/* CSS Styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
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
        .animate-slide-in {
          animation: slideIn 0.3s ease-out forwards;
        }
        ion-modal.auto-height {
          --height: auto;
          --width: 100%;
          --max-width: 400px;
          --border-radius: 16px 16px 0 0;
          align-items: flex-end;
        }
        ion-modal.detail-modal {
          --border-radius: 0;
        }
        @media print {
          body * {
            visibility: hidden;
          }
          .print-area, .print-area * {
            visibility: visible;
          }
          .print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </IonPage>
  );
};

export default UnpaidPage;