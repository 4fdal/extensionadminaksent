
// Format currency
export const formatRupiah = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format tanggal
export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Hitung hari jatuh tempo
export const getDaysUntilDue = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const timeConvertToString = (date: Date): string => {
  const HH = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${HH}:${mm}:${ss}`;
};

export const dateConvertToString = (date: Date): string => {
  const yyyy = String(date.getFullYear()).padStart(4, "0");
  const MM = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  return `${yyyy}-${MM}-${dd}`;
};

export const dateTimeConvertToString = (date: Date, time: Date): string => {
  return `${dateConvertToString(date)} ${timeConvertToString(time)}`;
};

import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

export const logError = async (error: { message: string; stack: string }) => {
  const log = {
    message: error.message,
    stack: error.stack,
    date: new Date().toISOString(),
  };

  console.error(log);

  await Filesystem.appendFile({
    path: "error-log.txt",
    data: JSON.stringify(log) + "\n",
    directory: Directory.Data,
    encoding: Encoding.UTF8,
  });
  
};

