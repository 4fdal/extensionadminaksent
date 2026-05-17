import DataItemRender from "@/components/customer/DataItemRender";
import CustomerDetailModal from "@/components/customer/CustomerDetailModal";
import BaseLayout from "@/components/layout/BaseLayout";
import DataList from "@/components/list/DataList";
import HeaderFilterChipToolbar, {
  Tab,
} from "@/components/toolbars/HeaderFilterChip";
import TextSearchToolbar from "@/components/toolbars/TextSearch";
import { useAppContext } from "@/context/app-context";
import { Customer } from "@/types/customer";
import {
  IonActionSheet,
} from "@ionic/react";
import { ellipsisVertical, refreshCircle, people, card, alertCircle, hourglass, syncOutline, settingsOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import { IonIcon } from "@ionic/react";
import { motion } from "framer-motion";
import { useHistory } from "react-router";

const CustomerPage: React.FC = () => {
  const history = useHistory();
  const [isPageLoaded, hasPageLoaded] = useState<boolean>(false);
  const [showActionSheet, setShowActionSheet] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabFilter, setTabFilter] = useState<Tab | null>(null);
  const { customer: customerContext } = useAppContext();
  const [selectedNolayanan, setSelectedNolayanan] = useState<string[]>([]);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>(null);

  const handleSelectAll = () => {
    const allNolayanan =
      customerContext?.filteredCustomers.map((c) => c.nolayanan) ?? [];
    if (selectedNolayanan.length === allNolayanan.length && allNolayanan.length > 0) {
      setSelectedNolayanan([]);
    } else {
      setSelectedNolayanan(allNolayanan);
    }
  };

  const handleSelectRow = (nolayanan: string) => {
    setSelectedNolayanan((prev) =>
      prev.includes(nolayanan)
        ? prev.filter((n) => n !== nolayanan)
        : [...prev, nolayanan],
    );
  };

  const [modalCustDetail, setModalCustDetail] = useState<Customer | null>(null);

  const handleSort = () => {
    if (!sortDirection) setSortDirection("asc");
    else if (sortDirection === "asc") setSortDirection("desc");
    else setSortDirection(null);
  };

  const sortedCustomers = React.useMemo(() => {
    const data = customerContext?.filteredCustomers ?? [];
    if (!sortDirection) return data;
    return [...data].sort((a, b) => {
      const typeA = (a.namasubkategori ?? "").toLowerCase();
      const typeB = (b.namasubkategori ?? "").toLowerCase();
      if (sortDirection === "asc") return typeA.localeCompare(typeB);
      return typeB.localeCompare(typeA);
    });
  }, [customerContext?.filteredCustomers, sortDirection]);

  useEffect(() => {
    if (isPageLoaded || !customerContext) return;
    (async () => {
      setLoading(true);
      await customerContext.reqAllCustomers(false);
      hasPageLoaded(true);
      setLoading(false);
    })();
  }, [isPageLoaded, customerContext?.reqAllCustomers]);

  const handleSyncCustomer = async () => {
    setLoading(true);
    setShowActionSheet(false);
    await customerContext?.reqAllCustomers(true);
    setLoading(false);
  };

  const stats = [
    { label: "Total", count: customerContext?.totalCustomer ?? 0, icon: people, color: "from-blue-500/20 to-indigo-500/20", textColor: "text-blue-400" },
    { label: "Unpaid", count: customerContext?.totalUnpaidCustomer ?? 0, icon: alertCircle, color: "from-red-500/20 to-pink-500/20", textColor: "text-red-400" },
    { label: "Paid", count: customerContext?.totalPaidCustomer ?? 0, icon: card, color: "from-green-500/20 to-emerald-500/20", textColor: "text-green-400" },
    { label: "Isolir", count: customerContext?.totalIsolirCustomer ?? 0, icon: hourglass, color: "from-orange-500/20 to-amber-500/20", textColor: "text-orange-400" },
  ];

  return (
    <BaseLayout
      headerTitle="Customer Dashboard"
      headerRender={
        <div className="space-y-2 max-w-7xl mx-auto">
          {/* Compact Stats Grid */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {stats.map((stat, i) => (
              <GlassCard 
                key={stat.label} 
                className={`!p-2.5 border-white/60 bg-gradient-to-br ${stat.color} hover:scale-[1.01]`}
                delay={i * 0.05}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg bg-white/50 border border-white/60 ${stat.textColor}`}>
                    <IonIcon icon={stat.icon} className="text-lg" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{stat.label}</span>
                    <span className="text-base font-black text-slate-800 leading-tight">{stat.count}</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div> */}

          <div className="glass glass-shadow rounded-xl p-1.5 flex flex-col md:flex-row gap-1.5">
            <TextSearchToolbar
              onChange={(searchText) => customerContext?.setSearchFilter(searchText)}
            />
            <HeaderFilterChipToolbar
              onChange={(tab) => {
                customerContext?.setTabFilter(tab.key);
                setTabFilter(tab);
              }}
              tabs={[
                { key: "UNPAID", label: "Unpaid", count: customerContext?.totalUnpaidCustomer ?? 0 },
                { key: "PAID", label: "Paid", count: customerContext?.totalPaidCustomer ?? 0 },
                { key: "PAID_NO_SYNC", label: "Paid (No Sync)", count: customerContext?.totalUnpaidNotSyncCustomer ?? 0 },
                { key: "ISOLIR", label: "Isolir", count: customerContext?.totalIsolirCustomer ?? 0 },
                { key: "NEW", label: "New", count: customerContext?.totalNewCustomer ?? 0 },
                { key: "ALL", label: "Semua", count: customerContext?.totalCustomer ?? 0 },
              ]}
            />
          </div>
        </div>
      }


      headerToolbarEndRender={
        <div className="flex items-center gap-2">
          <GlassButton variant="ghost" size="sm" onClick={() => setShowActionSheet(true)} className="!p-2">
            <IonIcon icon={ellipsisVertical} className="text-slate-600 text-xl" />
          </GlassButton>
          <IonActionSheet
            isOpen={showActionSheet}
            onDidDismiss={() => setShowActionSheet(false)}
            buttons={[
              { text: "Synchronize", icon: syncOutline, handler: handleSyncCustomer },
              { text: "Settings", icon: settingsOutline, handler: () => { setShowActionSheet(false); history.push('/settings'); } },
              { text: "Batal", role: "cancel" },
            ]}
          />
        </div>
      }
    >
      <DataList
        loading={loading}
        loadingMessage={customerContext?.loadingMessage}
        dataNotFound={(sortedCustomers.length) === 0}
        totalData={sortedCustomers.length}
        selectedCount={selectedNolayanan.length}
        onSelectAll={handleSelectAll}
        isAllSelected={
          selectedNolayanan.length > 0 &&
          selectedNolayanan.length === (sortedCustomers.length)
        }
        onSort={handleSort}
        sortDirection={sortDirection ?? undefined}
      >
        <DataItemRender
          onClickDetail={(item) => setModalCustDetail(item)}
          data={sortedCustomers}
          tab={tabFilter}
          selectedNolayanan={selectedNolayanan}
          onSelectRow={handleSelectRow}
        />
      </DataList>

      <CustomerDetailModal
        isOpen={modalCustDetail != null}
        customer={modalCustDetail}
        onDismiss={() => setModalCustDetail(null)}
      />
    </BaseLayout>
  );
};

export default React.memo(CustomerPage);

