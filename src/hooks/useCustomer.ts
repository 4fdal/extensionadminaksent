import {
  Customer,
  DataTableResponse,
  FilterCustomerStatus,
  PaidCustomerItem,
  PaymentCustomer,
  ProfileCustomerItem,
  UnpaidCustomerItem,
} from "@/types/customer";
import {
  httpGetAllCustomer,
  httpGetHomeCustomer,
  httpGetPaidCustomer,
  httpGetProfileCustomer,
  httpGetUnpaidCustomer,
} from "@/api/customer";
import { dateTimeConvertToString } from "@/utils/helpers";
import { HttpPaymentApi } from "@/utils/payment";
import { getOrFetchPreference } from "@/utils/storage";
import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react";

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
  totalUnpaidNotSyncCustomer: number;
  totalNewCustomer: number;
  totalIsolirCustomer: number;
  loadingMessage: string;
  setTabFilter: Dispatch<SetStateAction<FilterCustomerStatus>>;
  setSearchFilter: Dispatch<SetStateAction<string>>;
  syncAllCustomers(): Promise<void>;
  reqAllCustomers(resync: boolean): Promise<void>;
};

/**
 * Main Hook: useCustomer
 * Manages customer state, filtering, and data synchronization.
 */
export const useCustomer = (): ResultUseCustomer => {
  const [customers, setCustomers] = useState<Array<Customer>>([]);
  const [totalCustomer, setTotalCustomer] = useState<number>(0);
  const [totalPaidCustomer, setTotalPaidCustomer] = useState<number>(0);
  const [totalUnpaidNotSyncCustomer, setTotalUnpaidNotSyncCustomer] = useState<number>(0);
  const [totalNewCustomer, setTotalNewCustomer] = useState<number>(0);
  const [totalUnpaidCustomer, setTotalUnpaidCustomer] = useState<number>(0);
  const [totalIsolirCustomer, setTotalIsolirCustomer] = useState<number>(0);

  const [tabFilter, setTabFilter] = useState<FilterCustomerStatus>("UNPAID");
  const [searchFilter, setSearchFilter] = useState<string>("");
  const [loadingMessage, setLoadingMessage] = useState<string>("");

  /**
   * Filtered Data Memo
   */
  // ... (omitting memo for brevity in instruction, but keeping it in replacement)
  const filteredCustomers = useMemo(() => {
    let dataFilter = customers;

    if (tabFilter === "UNPAID") {
      dataFilter = dataFilter.filter((c) => !c.ispaid);
    } else if (tabFilter === "PAID") {
      dataFilter = dataFilter.filter((c) => c.ispaid);
    } else if (tabFilter === "PAID_NO_SYNC") {
      dataFilter = dataFilter.filter((c) => c.ispaid && !c.payment);
    } else if (tabFilter === "NEW") {
      dataFilter = dataFilter.filter((c) => c.unpaid == null && c.paid == null);
    } else if (tabFilter === "ISOLIR") {
      dataFilter = dataFilter.filter((c) => !c.aktif);
    }

    if (searchFilter) {
      const searchLower = searchFilter.toLowerCase();
      dataFilter = dataFilter.filter(
        (customer) =>
          customer.namapelanggan.toLowerCase().includes(searchLower) ||
          customer.nolayanan.includes(searchFilter) ||
          customer.unpaid?.invoice.toLowerCase().includes(searchLower),
      );
    }

    return dataFilter;
  }, [customers, tabFilter, searchFilter]);

  /**
   * Data Loading Logic
   */
  const reqAllCustomers = useCallback(async (resync: boolean = false) => {
    try {
      setLoadingMessage("Checking session...");
      const check = await httpGetHomeCustomer();
      if (!check) return;

      const length = (check?.expired ?? 0) + (check.totallanggananonline ?? 0);

      // 1. Fetch main customers list
      setLoadingMessage("Fetching customer list...");
      const allDataCustomers = await getOrFetchPreference("allDataCustomers", httpGetAllCustomer, resync);

      // 2. Fetch payments from Google Script
      setLoadingMessage("Fetching local payments...");
      const allDataCustomerPayments = await getOrFetchPreference("allDataCustomerPayments", () => HttpPaymentApi.getAll(), resync);

      // 3. Fetch enrichment data (Profile, Unpaid, Paid)
      setLoadingMessage("Enriching customer profiles...");
      const dtProfileCustomer = await getOrFetchPreference("dtProfileCustomer", () => httpGetProfileCustomer({ length }), resync);

      setLoadingMessage("Checking unpaid invoices...");
      const dtUnpaidCustomer = await getOrFetchPreference("dtUnpaidCustomer", () => httpGetUnpaidCustomer({ length }), resync);

      setLoadingMessage("Retrieving payment history...");
      const dtPaidCustomer = await getOrFetchPreference("dtPaidCustomer", () => httpGetPaidCustomer({ length }), resync);

      // 4. Merging and stats calculation
      setLoadingMessage("Finalizing and merging data...");
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
            if (cusItem.unpaid == null && cusItem.paid == null) countNewCustomer += 1;
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
        setTotalUnpaidNotSyncCustomer(countUnpaidNotSyncCustomer);
        setTotalNewCustomer(countNewCustomer);
        setTotalUnpaidCustomer(countUnpaidCustomer);
        setTotalIsolirCustomer(countIsolirCustomer);
      }
      setLoadingMessage("");
    } catch (error) {
      console.error("[Error] reqAllCustomers: ", error);
      setLoadingMessage("Error occurred during load");
    }
  }, []);

  return useMemo(
    () => ({
      customers,
      filteredCustomers,
      setCustomers,
      totalCustomer,
      totalPaidCustomer,
      totalUnpaidCustomer,
      totalUnpaidNotSyncCustomer,
      totalNewCustomer,
      totalIsolirCustomer,
      loadingMessage,
      setTabFilter,
      setSearchFilter,
      syncAllCustomers: async () => { },
      reqAllCustomers,
    }),
    [
      customers,
      filteredCustomers,
      totalCustomer,
      totalPaidCustomer,
      totalUnpaidCustomer,
      totalUnpaidNotSyncCustomer,
      totalNewCustomer,
      totalIsolirCustomer,
      loadingMessage,
      reqAllCustomers,
    ],
  );
};
