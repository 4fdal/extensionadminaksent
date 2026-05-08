import {
  Customer,
  DataTableResponse,
  FilterCustomerStatus,
  HomeCustomer,
  PaidCustomerItem,
  PaymentCustomer,
  ProfileCustomerItem,
  RequestCustomerParams,
  UnpaidCustomerItem,
} from "@/types/customer";
import { API_CONFIG, LIST_CONFIG } from "@/config";
import { getCookieTungkaLilirAdmin } from "@/utils/cookie";
import { dateTimeConvertToString } from "@/utils/helpers";
import { HttpPaymentApi } from "@/utils/payment";
import { validateHttpResponse } from "@/utils/http";
import { buildDataTableParams, DataTableColumn } from "@/utils/validators";
import { CapacitorHttp } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { Dispatch, SetStateAction, useMemo, useState } from "react";

/**
 * Column definitions for various customer data tables
 */
const PROFILE_COLUMNS: DataTableColumn[] = [
  { data: "id", searchable: true, orderable: false },
  { data: "id", searchable: true, orderable: true },
  { data: "namapelanggan", searchable: true, orderable: true },
  { data: "phone", searchable: true, orderable: false },
  { data: "alamat", searchable: true, orderable: false },
  { data: "saldo", searchable: true, orderable: false },
  { data: "fullname", searchable: true, orderable: true },
  { data: "phone", searchable: true, orderable: false },
];

const UNPAID_COLUMNS: DataTableColumn[] = [
  { data: "invoice", searchable: true, orderable: false },
  { data: "tgltempo", searchable: true, orderable: true },
  { data: "invoice", searchable: true, orderable: true },
  { data: "nolayanan", searchable: true, orderable: true },
  { data: "namapelanggan", searchable: true, orderable: true },
  { data: "namaprofile", searchable: true, orderable: true },
  { data: "fullname", searchable: true, orderable: true },
  { data: "namakategoriinvoice", searchable: true, orderable: true },
  { data: "tglterbit", searchable: true, orderable: true },
  { data: "tgltempo", searchable: true, orderable: true },
  { data: "subtotal", searchable: true, orderable: true },
  { data: "diskon", searchable: true, orderable: true },
  { data: "ppn", searchable: true, orderable: true },
  { data: "kodeunik", searchable: true, orderable: true },
  { data: "total", searchable: true, orderable: true },
  { data: "catatan", searchable: true, orderable: true },
  { data: "tagih", searchable: true, orderable: true },
];

const PAID_COLUMNS: DataTableColumn[] = [
  { data: "invoice", searchable: false, orderable: false },
  { data: "lastupdate", searchable: true, orderable: true },
  { data: "nolayanan", searchable: true, orderable: true },
  { data: "namapelanggan", searchable: true, orderable: true },
  { data: "namaprofile", searchable: true, orderable: true },
  { data: "mitra", searchable: true, orderable: true },
  { data: "namakategoriinvoice", searchable: true, orderable: true },
  { data: "tglbayar", searchable: true, orderable: true },
  { data: "biller", searchable: true, orderable: true },
  { data: "carabayar", searchable: true, orderable: true },
  { data: "namachannel", searchable: true, orderable: true },
  { data: "paycode", searchable: true, orderable: true },
  { data: "subtotal", searchable: false, orderable: false },
  { data: "diskon", searchable: false, orderable: false },
  { data: "ppn", searchable: true, orderable: true },
  { data: "adm", searchable: true, orderable: true },
  { data: "kodeunik", searchable: true, orderable: true },
  { data: "total", searchable: true, orderable: true },
  { data: "catatan", searchable: true, orderable: true },
];

const CUSTOMER_COLUMNS: DataTableColumn[] = [
  { data: "nolayanan", searchable: false, orderable: false },
  { data: "username", searchable: false, orderable: false },
  { data: "nourut", searchable: false, orderable: false },
  { data: "namapelanggan", searchable: false, orderable: true },
  { data: "namasubkategori", searchable: false, orderable: true },
  { data: "namaprofile", searchable: false, orderable: true },
  { data: "jenisbilling", searchable: false, orderable: true },
  { data: "siklusbilling", searchable: false, orderable: true },
  { data: "tglaktif", searchable: false, orderable: true },
  { data: "tglisolir", searchable: false, orderable: true },
  { data: "username", searchable: false, orderable: true },
  { data: "password", searchable: false, orderable: true },
  { data: "shortname", searchable: false, orderable: true },
  { data: "servername", searchable: false, orderable: true },
  { data: "addresslist", searchable: false, orderable: true },
  { data: "lastipaddress", searchable: false, orderable: true },
  { data: "mac", searchable: false, orderable: true },
  { data: "namawilayah", searchable: false, orderable: true },
  { data: "alamatpemasangan", searchable: false, orderable: true },
  { data: "tgldaftar", searchable: false, orderable: true },
  { data: "fullname", searchable: false, orderable: true },
  { data: "kodeunik", searchable: false, orderable: true },
  { data: "catatan", searchable: false, orderable: true },
];

/**
 * Common Headers Helper
 */
const getHeaders = (cookie: string, contentType?: string) => {
  const headers: Record<string, string> = {
    Accept: "application/json, text/javascript, */*; q=0.01",
    "X-Requested-With": "XMLHttpRequest",
    Cookie: cookie,
  };
  if (contentType) headers["Content-Type"] = contentType;
  return headers;
};

/**
 * API Fetchers
 */
export const httpGetHomeCustomer = async (): Promise<HomeCustomer | null> => {
  try {
    const cookie = await getCookieTungkaLilirAdmin();
    if (!cookie) return null;

    const response = await CapacitorHttp.get({
      url: `${API_CONFIG.BASE_URL}/home/data`,
      headers: getHeaders(cookie),
    });

    return validateHttpResponse(response, "GetHomeCustomer");
  } catch (error) {
    console.error("httpGetHomeCustomer failed:", error);
    return null;
  }
};

export const httpGetProfileCustomer = async (
  params: RequestCustomerParams,
): Promise<DataTableResponse<ProfileCustomerItem> | null> => {
  try {
    const cookie = await getCookieTungkaLilirAdmin();
    if (!cookie) return null;

    const data = buildDataTableParams({
      columns: PROFILE_COLUMNS,
      start: params?.start ?? 0,
      length: params?.length ?? LIST_CONFIG.DEFAULT_PAGE_SIZE,
      search: params?.search ?? "",
      order: [{ column: 1, dir: "desc" }],
    });

    const response = await CapacitorHttp.post({
      url: `${API_CONFIG.BASE_URL}/pelanggan/data`,
      headers: getHeaders(cookie, "application/x-www-form-urlencoded; charset=UTF-8"),
      data: data.toString(),
    });

    return validateHttpResponse(response, "GetProfileCustomer");
  } catch (error) {
    console.error("httpGetProfileCustomer failed:", error);
    return null;
  }
};

export const httpGetUnpaidCustomer = async (
  params: RequestCustomerParams,
): Promise<DataTableResponse<UnpaidCustomerItem> | null> => {
  try {
    const cookie = await getCookieTungkaLilirAdmin();
    if (!cookie) return null;

    const data = buildDataTableParams({
      columns: UNPAID_COLUMNS,
      start: params?.start ?? 0,
      length: params?.length ?? LIST_CONFIG.DEFAULT_PAGE_SIZE,
      search: params?.search ?? "",
      order: [{ column: 2, dir: "desc" }],
    });
    data.append("status", "1");

    const response = await CapacitorHttp.post({
      url: `${API_CONFIG.BASE_URL}/invoice/unpaid/data`,
      headers: getHeaders(cookie, "application/x-www-form-urlencoded; charset=UTF-8"),
      data: data.toString(),
    });

    return validateHttpResponse(response, "GetUnpaidCustomer");
  } catch (error) {
    console.error("httpGetUnpaidCustomer failed:", error);
    return null;
  }
};

export const httpGetPaidCustomer = async (
  params: RequestCustomerParams,
): Promise<DataTableResponse<PaidCustomerItem> | null> => {
  try {
    const cookie = await getCookieTungkaLilirAdmin();
    if (!cookie) return null;

    const data = buildDataTableParams({
      columns: PAID_COLUMNS,
      start: params?.start ?? 0,
      length: params?.length ?? LIST_CONFIG.DEFAULT_PAGE_SIZE,
      search: params?.search ?? "",
      order: [{ column: 1, dir: "desc" }],
    });

    data.append("bulan", String(new Date().getMonth() + 1).padStart(2, "0"));
    data.append("tahun", String(new Date().getFullYear()));

    const response = await CapacitorHttp.post({
      url: `${API_CONFIG.BASE_URL}/invoice/paid/data`,
      headers: getHeaders(cookie, "application/x-www-form-urlencoded; charset=UTF-8"),
      data: data.toString(),
    });

    return validateHttpResponse(response, "GetPaidCustomer");
  } catch (error) {
    console.error("httpGetPaidCustomer failed:", error);
    return null;
  }
};

export const httpGetCustomer = async (
  params?: RequestCustomerParams,
): Promise<DataTableResponse<Customer> | null> => {
  try {
    const cookie = await getCookieTungkaLilirAdmin();
    if (!cookie) return null;

    const data = buildDataTableParams({
      columns: CUSTOMER_COLUMNS,
      start: params?.start ?? 0,
      length: params?.length ?? LIST_CONFIG.DEFAULT_PAGE_SIZE,
      search: params?.search ?? "",
      order: [{ column: 2, dir: "desc" }],
    });

    data.append("nas", "");
    data.append("profile", "");
    data.append("status", "0");
    data.append("mitra", "");

    const response = await CapacitorHttp.post({
      url: `${API_CONFIG.BASE_URL}/berlangganan/data`,
      headers: getHeaders(cookie, "application/x-www-form-urlencoded; charset=UTF-8"),
      data: data.toString(),
    });

    return validateHttpResponse(response, "GetCustomer");
  } catch (error) {
    console.error("httpGetCustomer failed:", error);
    return null;
  }
};

export const httpGetAllCustomer = async (): Promise<Array<Customer>> => {
  const allDataCustomers = [];
  let res: DataTableResponse<Customer> | null = null;
  let startDraw = 0;
  const lengthDraw = 100;

  do {
    res = await httpGetCustomer({ start: startDraw, length: lengthDraw });
    if (res?.data) {
      allDataCustomers.push(...res.data);
      startDraw += lengthDraw;
    }
  } while (res && res.data && res.data.length > 0);

  return allDataCustomers;
};

/**
 * Result Interface for Hook
 */
export type ResultUseCustomer = {
  customers: Customer[];
  filteredCustomers: Customer[];
  setCustomers: Dispatch<SetStateAction<Customer[]>>;
  totalCustomer: number;
  totalPaidCustomer: number;
  totalUnpaidCustomer: number;
  countUnpaidNotSyncCustomer: number;
  countNewCustomer: number;
  totalIsolirCustomer: number;
  setTabFilter: Dispatch<SetStateAction<FilterCustomerStatus>>;
  setSearchFilter: Dispatch<SetStateAction<string>>;
  syncAllCustomers(): Promise<void>;
  reqAllCustomers(resync: boolean): Promise<void>;
};

/**
 * Main Hook: useCustomer
 */
export const useCustomer = (): ResultUseCustomer => {
  const [customers, setCustomers] = useState<Array<Customer>>([]);
  const [totalCustomer, setTotalCustomer] = useState<number>(0);
  const [totalPaidCustomer, setTotalPaidCustomer] = useState<number>(0);
  const [countUnpaidNotSyncCustomer, setCountUnpaidNotSyncCustomer] = useState<number>(0);
  const [countNewCustomer, setCountNewCustomer] = useState<number>(0);
  const [totalUnpaidCustomer, setTotalUnpaidCustomer] = useState<number>(0);
  const [totalIsolirCustomer, setTotalIsolirCustomer] = useState<number>(0);

  const [tabFilter, setTabFilter] = useState<FilterCustomerStatus>("UNPAID");
  const [searchFilter, setSearchFilter] = useState<string>("");

  /**
   * Filtered Data Memo (Matching original logic exactly)
   */
  const filteredCustomers = useMemo(() => {
    let dataFilter = customers;

    dataFilter = dataFilter.filter(
      (customer) =>
        customer.namapelanggan.toLowerCase().includes(searchFilter.toLowerCase()) ||
        customer.nolayanan.includes(searchFilter) ||
        customer.unpaid?.invoice.toLowerCase().includes(searchFilter.toLowerCase()),
    );

    if (tabFilter === "UNPAID") {
      dataFilter = dataFilter.filter((c) => !c.ispaid);
    } else if (tabFilter === "PAID") {
      dataFilter = dataFilter.filter((c) => c.ispaid);
    } else if (tabFilter === "PAID_NO_SYNC") {
      dataFilter = dataFilter.filter((c) => c.ispaid && !c.payment);
    } else if (tabFilter === "NEW") {
      dataFilter = dataFilter.filter((c) => !c.ispaid && !c.paid);
    } else if (tabFilter === "ISOLIR") {
      dataFilter = dataFilter.filter((c) => !c.aktif);
    }

    return dataFilter;
  }, [customers, tabFilter, searchFilter]);

  /**
   * Data Loading Logic (Matching original logic exactly)
   */
  const reqAllCustomers = async (resync: boolean = false) => {
    try {
      const check = await httpGetHomeCustomer();
      if (!check) return;

      const length = (check?.expired ?? 0) + (check.totallanggananonline ?? 0);

      let allDataCustomers: Array<Customer> = [];
      let allDataCustomerPayments: Array<PaymentCustomer> = [];
      let dtUnpaidCustomer: DataTableResponse<UnpaidCustomerItem> | null = null;
      let dtProfileCustomer: DataTableResponse<ProfileCustomerItem> | null = null;
      let dtPaidCustomer: DataTableResponse<PaidCustomerItem> | null = null;

      // 1. Fetch main customers list
      let pref = await Preferences.get({ key: "allDataCustomers" });
      if (pref.value && !resync) {
        allDataCustomers = JSON.parse(pref.value);
      } else {
        allDataCustomers = await httpGetAllCustomer();
        await Preferences.set({
          key: "allDataCustomers",
          value: JSON.stringify(allDataCustomers),
        });
      }

      // 2. Fetch payments from Google Script
      pref = await Preferences.get({ key: "allDataCustomerPayments" });
      if (pref.value && !resync) {
        allDataCustomerPayments = JSON.parse(pref.value);
      } else {
        allDataCustomerPayments = await HttpPaymentApi.getAll();
        await Preferences.set({
          key: "allDataCustomerPayments",
          value: JSON.stringify(allDataCustomerPayments),
        });
      }

      // 3. Fetch enrichment data (Profile, Unpaid, Paid)
      pref = await Preferences.get({ key: "dtProfileCustomer" });
      if (pref.value && !resync) {
        dtProfileCustomer = JSON.parse(pref.value);
      } else {
        dtProfileCustomer = await httpGetProfileCustomer({ length });
        await Preferences.set({
          key: "dtProfileCustomer",
          value: JSON.stringify(dtProfileCustomer),
        });
      }

      pref = await Preferences.get({ key: "dtUnpaidCustomer" });
      if (pref.value && !resync) {
        dtUnpaidCustomer = JSON.parse(pref.value);
      } else {
        dtUnpaidCustomer = await httpGetUnpaidCustomer({ length });
        await Preferences.set({
          key: "dtUnpaidCustomer",
          value: JSON.stringify(dtUnpaidCustomer),
        });
      }

      pref = await Preferences.get({ key: "dtPaidCustomer" });
      if (pref.value && !resync) {
        dtPaidCustomer = JSON.parse(pref.value);
      } else {
        dtPaidCustomer = await httpGetPaidCustomer({ length });
        await Preferences.set({
          key: "dtPaidCustomer",
          value: JSON.stringify(dtPaidCustomer),
        });
      }

      // 4. Merging and stats calculation
      if (allDataCustomers.length > 0 && dtProfileCustomer && dtPaidCustomer && dtUnpaidCustomer) {
        const profileMap = new Map(dtProfileCustomer.data.map((item) => [item.id, item]));
        const unpaidMap = new Map(dtUnpaidCustomer.data.map((item) => [item.nolayanan, item]));
        const paidMap = new Map(dtPaidCustomer.data.map((item) => [item.nolayanan, item]));
        const paymentMap = new Map(allDataCustomerPayments.map((item) => [item.nolayanan.toString(), item]));

        let countAllData = 0;
        let countPaidCustomer = 0;
        let countUnpaidNotSyncCustomer = 0;
        let countNewCustomer = 0;
        let countUnpaidCustomer = 0;
        let countIsolirCustomer = 0;

        const merged: Array<Customer> = allDataCustomers
          .map((cusItem) => {
            cusItem.profile = profileMap.get(cusItem.pelanggan);
            cusItem.unpaid = unpaidMap.get(cusItem.nolayanan);
            cusItem.ispaid = !cusItem.unpaid;
            cusItem.paid = paidMap.get(cusItem.nolayanan);
            cusItem.payment = paymentMap.get(cusItem.nolayanan);

            countAllData += 1;
            if (cusItem.ispaid) countPaidCustomer += 1;
            else countUnpaidCustomer += 1;

            if (cusItem.ispaid && !cusItem.payment) countUnpaidNotSyncCustomer += 1;
            if (!cusItem.unpaid && !cusItem.paid) countNewCustomer += 1;
            if (!cusItem.aktif) countIsolirCustomer += 1;

            return cusItem;
          })
          .sort((a, b) => {
            if (!a.payment && !b.payment) return 0;
            if (!a.payment) return 1;
            if (!b.payment) return -1;

            const aDateTime = new Date(
              dateTimeConvertToString(new Date(a.payment.tanggalbayar), new Date(a.payment.waktubayar)),
            );
            const bDateTime = new Date(
              dateTimeConvertToString(new Date(b.payment.tanggalbayar), new Date(b.payment.waktubayar)),
            );

            return bDateTime.getTime() - aDateTime.getTime();
          });

        setCustomers(merged);
        setTotalCustomer(countAllData);
        setTotalPaidCustomer(countPaidCustomer);
        setCountUnpaidNotSyncCustomer(countUnpaidNotSyncCustomer);
        setCountNewCustomer(countNewCustomer);
        setTotalUnpaidCustomer(countUnpaidCustomer);
        setTotalIsolirCustomer(countIsolirCustomer);
      }
    } catch (error) {
      console.error("[Error] reqAllCustomers: ", error);
    }
  };

  return {
    customers,
    filteredCustomers,
    setCustomers,
    totalCustomer,
    totalPaidCustomer,
    totalUnpaidCustomer,
    countUnpaidNotSyncCustomer,
    countNewCustomer,
    totalIsolirCustomer,
    setTabFilter,
    setSearchFilter,
    syncAllCustomers: async () => {},
    reqAllCustomers,
  };
};
