export type RequestCustomerParams = {
  start?: number;
  length?: number;
  search?: string;
};

export type HomeCustomer = {
  totalvouchertoday: number;
  totalinvoicetoday: number;
  totalpengeluarantoday: number;
  pemasukanthismonth: number;
  pengeluaranthismonth: number;
  totalvconline: number;
  totallanggananonline: number;
  expired: number;
};

export type DataTableResponse<T> = {
  draw: number;
  recordsTotal: number;
  recordsFiltered: number;
  data: Array<T>;
};

export type PaidCustomerItem = {
  invoice: string;
  isrollback: number;
  namakategoriinvoice: string;
  nolayanan: string;
  pelanggan: string;
  username: string;
  namapelanggan: string;
  namaprofile: string;
  mitra: string;
  komisi: string;
  subtotal: string;
  diskon: string;
  ppn: string;
  kodeunik: string;
  total: string;
  biller: string;
  tglbayar: string;
  jambayar: string;
  carabayar: string;
  namachannel: string;
  paycode: string;
  catatan: string | null;
  lastupdate: string;
};

export type UnpaidCustomerItem = {
  invoice: string;
  namakategoriinvoice: string;
  tglterbit: string;
  tgltempo: string;
  username: string;
  nolayanan: string;
  pelanggan: string;
  namapelanggan: string;
  namaprofile: string;
  fullname: string;
  subtotal: string;
  diskon: string;
  ppn: string;
  kodeunik: string;
  total: string;
  catatan: string | null;
  tagih: number;
  isolir: number;
};

export type PaymentCustomer = {
  id: string | null;
  nolayanan: string;
  invoice: string;
  tanggalbayar: string;
  waktubayar: string;
  gambar: string;
  create_at: string;
  updated_at: string;
};

export type Customer = {
  nolayanan: string;
  pelanggan: string;
  namapelanggan: string;
  namasubkategori: string;
  namaprofile: string;
  username: string;
  password: string;
  tglaktif: string;
  tglisolir: string;
  tgldaftar: string;
  shortname: string;
  servername: string | null;
  lastipaddress: string;
  mac: string;
  namawilayah: string;
  jenisbilling: number;
  siklusbilling: number;
  fullname: string;
  aktif: number;
  mitra: number;
  kodeunik: number;
  lockmac: number;
  addresslist: string | null;
  alamatpemasangan: string;
  nourut: number;
  isolirmanual: number;
  catatan: string | null;
  ispaid: boolean;
  paid?: PaidCustomerItem;
  unpaid?: UnpaidCustomerItem;
  paymenthistory?: PaymentCustomer;
};

// Interface untuk data pelanggan
export type UnpaidCustomer = {
  id: string;
  status: "BELUM" | "PROSES" | "PENDING";
  invoice: string;
  nolayanan: string;
  pelanggan: string;
  email: string;
  telepon: string;
  alamat: string;
  profile: "REGULER" | "VIP" | "CORPORATE";
  mitra: string;
  kategori: "INTERNET" | "TV" | "VOICE" | "BUNDLE";
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
};

export type PaymentHistory = {
  id: string;
  date: string;
  amount: number;
  method: string;
  status: string;
};
