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
import { ellipsisVertical, refreshCircle, people, card, alertCircle, hourglass } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import { IonIcon } from "@ionic/react";
import { motion } from "framer-motion";

const CustomerPage: React.FC = () => {
  const [isPageLoaded, hasPageLoaded] = useState<boolean>(false);
  const [showActionSheet, setShowActionSheet] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabFilter, setTabFilter] = useState<Tab | null>(null);
  const { customer: customerContext } = useAppContext();
  const [selectedNolayanan, setSelectedNolayanan] = useState<string[]>([]);

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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {stats.map((stat, i) => (
              <GlassCard 
                key={stat.label} 
                className={`!p-2.5 border-white/5 bg-gradient-to-br ${stat.color} hover:scale-[1.01]`}
                delay={i * 0.05}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded-lg bg-white/5 border border-white/10 ${stat.textColor}`}>
                    <IonIcon icon={stat.icon} className="text-lg" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">{stat.label}</span>
                    <span className="text-base font-black text-white leading-tight">{stat.count}</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

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
                { key: "ISOLIR", label: "Isolir", count: customerContext?.totalIsolirCustomer ?? 0 },
                { key: "NEW", label: "New", count: customerContext?.countNewCustomer ?? 0 },
                { key: "ALL", label: "Semua", count: customerContext?.totalCustomer ?? 0 },
              ]}
            />
          </div>
        </div>
      }


      headerToolbarEndRender={
        <div className="flex items-center gap-2">
          <GlassButton variant="ghost" size="sm" onClick={() => setShowActionSheet(true)} className="!p-2">
            <IonIcon icon={ellipsisVertical} className="text-white text-xl" />
          </GlassButton>
          <IonActionSheet
            isOpen={showActionSheet}
            onDidDismiss={() => setShowActionSheet(false)}
            buttons={[
              { text: "Synchronize", icon: refreshCircle, handler: handleSyncCustomer },
              { text: "Batal", role: "cancel" },
            ]}
          />
        </div>
      }
    >
      <DataList
        loading={loading}
        loadingMessage={customerContext?.loadingMessage}
        dataNotFound={(customerContext?.filteredCustomers?.length ?? 0) === 0}
        totalData={customerContext?.filteredCustomers?.length ?? 0}
        selectedCount={selectedNolayanan.length}
        onSelectAll={handleSelectAll}
        isAllSelected={
          selectedNolayanan.length > 0 &&
          selectedNolayanan.length === (customerContext?.filteredCustomers?.length ?? 0)
        }
      >
        <DataItemRender
          onClickDetail={(item) => setModalCustDetail(item)}
          data={customerContext?.filteredCustomers ?? []}
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

