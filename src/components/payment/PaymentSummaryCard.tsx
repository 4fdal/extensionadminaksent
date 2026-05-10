import React from "react";
import { Customer } from "@/types/customer";
import { formatRupiah } from "@/utils";
import GlassCard from "../ui/GlassCard";
import { motion } from "framer-motion";

type PaymentSummaryCardProps = {
  customer: Customer | null;
};

const PaymentSummaryCard: React.FC<PaymentSummaryCardProps> = ({ customer }) => {
  if (!customer) return null;

  return (
    <GlassCard className="relative overflow-hidden bg-gradient-to-br from-accent/10 to-transparent border-accent/10 !p-3.5">
      {/* Decorative Glow */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-accent/20 blur-3xl rounded-full" />
      
      <div className="relative space-y-2.5">
        <div className="flex items-center gap-2">
          <motion.span 
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-accent rounded-full shadow-[0_0_8px_rgba(0,212,255,0.4)]" 
          />
          <h3 className="text-[9px] font-black text-accent uppercase tracking-wider">
            {!customer?.ispaid ? "Ringkasan Tagihan" : "Detail Transaksi"}
          </h3>
        </div>

        <div className="space-y-1.5">
          {[
            { label: "Invoice", value: customer?.unpaid?.invoice ?? customer?.paid?.invoice, mono: true },
            { label: "Pelanggan", value: customer?.namapelanggan },
            { label: "Layanan", value: customer?.namaprofile, mono: true },
          ].map((item, i) => item.value && (
            <div key={i} className="flex justify-between items-center px-3 py-2 bg-white/5 rounded-lg border border-white/5">
              <span className="text-[11px] font-medium text-slate-500">{item.label}</span>
              <span className={`text-[11px] font-bold text-white ${item.mono ? "font-mono" : ""}`}>{item.value}</span>
            </div>
          ))}

          {(customer?.unpaid?.total ?? customer?.paid?.total) && (
            <div className="mt-2 px-3 py-2.5 bg-accent/10 rounded-xl border border-accent/20 flex justify-between items-center">
              <span className="text-[10px] font-black text-accent uppercase tracking-tighter">Total Bayar</span>
              <span className="text-lg font-black text-white leading-none">
                {formatRupiah(Number(customer?.unpaid?.total ?? customer?.paid?.total))}
              </span>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
};


export default React.memo(PaymentSummaryCard);

