import {
  Customer,
  DataTableResponse,
  HomeCustomer,
  PaidCustomerItem,
  ProfileCustomerItem,
  RequestCustomerParams,
  UnpaidCustomerItem,
} from "@/types/customer";
import { getApiConfig, LIST_CONFIG } from "@/config";
import { getCookieTungkaLilirAdmin } from "@/utils/cookie";
import { validateHttpResponse } from "@/utils/http";
import { buildDataTableParams, DataTableColumn } from "@/utils/validators";
import { CapacitorHttp } from "@capacitor/core";

/**
 * Column definitions for various customer data tables
 */
export const PROFILE_COLUMNS: DataTableColumn[] = [
  { data: "id", searchable: true, orderable: false },
  { data: "id", searchable: true, orderable: true },
  { data: "namapelanggan", searchable: true, orderable: true },
  { data: "phone", searchable: true, orderable: false },
  { data: "alamat", searchable: true, orderable: false },
  { data: "saldo", searchable: true, orderable: false },
  { data: "fullname", searchable: true, orderable: true },
  { data: "phone", searchable: true, orderable: false },
];

export const UNPAID_COLUMNS: DataTableColumn[] = [
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

export const PAID_COLUMNS: DataTableColumn[] = [
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

export const CUSTOMER_COLUMNS: DataTableColumn[] = [
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

    const API_CONFIG = await getApiConfig();
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

    const API_CONFIG = await getApiConfig();
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

    const API_CONFIG = await getApiConfig();
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

    const API_CONFIG = await getApiConfig();
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

    const API_CONFIG = await getApiConfig();
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
