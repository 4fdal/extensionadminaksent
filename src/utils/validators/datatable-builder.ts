/**
 * DataTable Parameter Builder
 * Eliminates 150+ lines of duplicate URLSearchParams building
 */

export interface DataTableColumn {
  data: string;
  name?: string;
  searchable?: boolean;
  orderable?: boolean;
}

export interface DataTableConfig {
  columns: DataTableColumn[];
  draw?: number;
  start?: number;
  length?: number;
  search?: string;
  order?: Array<{ column: number; dir: "asc" | "desc" }>;
}

/**
 * Builds URLSearchParams for DataTable API requests
 * Replaces repetitive parameter building in customer.ts
 *
 * Usage:
 * const params = buildDataTableParams({
 *   columns: customerColumns,
 *   start: 0,
 *   length: 25,
 *   search: "searchText"
 * });
 */
export const buildDataTableParams = (config: DataTableConfig): URLSearchParams => {
  const params = new URLSearchParams();

  // Set draw (for DataTable protocol)
  params.append("draw", (config.draw ?? 1).toString());

  // Set pagination
  params.append("start", (config.start ?? 0).toString());
  params.append("length", (config.length ?? 25).toString());

  // Set search
  if (config.search) {
    params.append("search[value]", config.search);
    params.append("search[regex]", "false");
  }

  // Add columns
  config.columns.forEach((col, index) => {
    params.append(`columns[${index}][data]`, col.data);
    params.append(`columns[${index}][name]`, col.name ?? col.data);
    params.append(`columns[${index}][searchable]`, (col.searchable ?? true).toString());
    params.append(`columns[${index}][orderable]`, (col.orderable ?? true).toString());
  });

  // Add ordering if specified
  if (config.order && config.order.length > 0) {
    config.order.forEach((ord, index) => {
      params.append(`order[${index}][column]`, ord.column.toString());
      params.append(`order[${index}][dir]`, ord.dir);
    });
  }

  return params;
};

/**
 * Common column definitions
 * Reduces code duplication for frequently used columns
 */
export const COMMON_COLUMNS = {
  customer: [
    { data: "nolayanan", name: "No. Layanan", searchable: true, orderable: true },
    { data: "nama", name: "Nama", searchable: true, orderable: true },
    { data: "alamat", name: "Alamat", searchable: true, orderable: false },
    { data: "telepon", name: "Telepon", searchable: true, orderable: true },
    { data: "status", name: "Status", searchable: false, orderable: true },
  ] as DataTableColumn[],

  payment: [
    { data: "invoice", name: "Invoice", searchable: true, orderable: true },
    { data: "amount", name: "Amount", searchable: false, orderable: true },
    { data: "payment_date", name: "Payment Date", searchable: false, orderable: true },
    { data: "status", name: "Status", searchable: false, orderable: true },
  ] as DataTableColumn[],

  unpaid: [
    { data: "nolayanan", name: "No. Layanan", searchable: true, orderable: true },
    { data: "nama", name: "Nama", searchable: true, orderable: true },
    { data: "outstanding", name: "Outstanding", searchable: false, orderable: true },
  ] as DataTableColumn[],
} as const;
