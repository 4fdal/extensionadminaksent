import { Customer, PaymentCustomer } from "@/types/customer";
import { CapacitorHttp } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { getCookieTungkaLilirAdmin } from "./cookie";
import { AppLauncher } from "@capacitor/app-launcher";
import { getApiConfig, ACCOUNT_CONFIG } from "@/config";

export const KEY_PAYMENT_PREFERENCE = "PAYMENT_HISTORY";

export class Payment implements PaymentCustomer {
  id?: string | null = null;
  nolayanan: string = "";
  namapelanggan: string = "";
  total: number = 0;
  invoice: string = "";
  tanggalbayar: string = "";
  waktubayar: string = "";
  gambar: string = "";
  created_at?: string = "";
  updated_at?: string = "";

  constructor(payment: PaymentCustomer) {
    this.id = payment.id;
    this.nolayanan = payment.nolayanan;
    this.namapelanggan = payment.namapelanggan;
    this.total = payment.total;
    this.invoice = payment.invoice;
    this.tanggalbayar = payment.tanggalbayar;
    this.waktubayar = payment.waktubayar;
    this.gambar = payment.gambar;
    this.created_at = payment.created_at;
    this.updated_at = payment.updated_at;
  }
}

export class PaymentList {
  data: Map<string, Payment> = new Map();

  constructor() {
    this.fetchAllData();
  }
  async create(payment: Payment) {
    try {
      const result = await HttpPaymentApi.create(payment);

      this.data.set(payment.invoice, payment);
      await this.save();

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async update(payment: Payment) {
    try {
      const result = await HttpPaymentApi.update(payment);

      let currentPayment = this.data.get(payment.invoice);
      if (currentPayment) {
        currentPayment = {
          ...currentPayment,
          ...payment,
        };
        this.data.set(payment.invoice, currentPayment);
        await this.save();
      }

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async delete(invoice: string) {
    try {
      const currentPayment = this.data.get(invoice);

      let result = false;
      if (currentPayment?.id) {
        result = await HttpPaymentApi.delete(currentPayment?.id);
      }

      const status = this.data.delete(invoice);
      if (status) await this.save();

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async read(invoice: string) {
    try {
      const payment = this.data.get(invoice);

      let result: Payment | null = null;
      if (payment?.id) {
        result = await HttpPaymentApi.read(payment?.id);
      }

      return Promise.resolve(result);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  async save() {
    await Preferences.set({
      key: KEY_PAYMENT_PREFERENCE,
      value: JSON.stringify(Object.fromEntries(this.data)),
    });
  }
  async fetchAllData() {
    // let prefData: Map<string, Payment> = new Map();
    // const { value } = await Preferences.get({ key: KEY_PAYMENT_PREFERENCE });
    // if (value) {
    //   prefData = new Map<string, Payment>(Object.entries(JSON.parse(value)));
    // }

    try {
      const paymentCustomers = await HttpPaymentApi.getAll();
      this.data = new Map(paymentCustomers.map((item) => [item.invoice, item]));
      await this.save();

      return Promise.resolve(true);
    } catch (error) {
      return Promise.reject(error);
    }

    // for (let paymentCustomer of paymentCustomers) {

    // }
  }
  static async exec(
    paymentList: PaymentList,
    callback: (paymentList: PaymentList) => void,
  ) {
    callback(paymentList);
  }
}

export class HttpPaymentRlradius {

  static async getCSRF(): Promise<{ status: boolean; token: string } | null> {
    try {
      const cookie = await getCookieTungkaLilirAdmin();
      if (!cookie)
        return Promise.reject(
          new Error("HttpPaymentRlradius.getCSRF : Cookie not found"),
        );

      const API_CONFIG = await getApiConfig();
      const res = await CapacitorHttp.get({
        url: `${API_CONFIG.BASE_URL}/csrf`,
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          Cookie: cookie,
        },
      });

      if (res.status != 200)
        return Promise.reject(
          new Error("Response not status 200 : " + JSON.stringify(res)),
        );

      return res.status == 200
        ? typeof res.data == "string"
          ? JSON.parse(res.data)
          : res.data
        : null;
    } catch (err) {
      return Promise.reject(err);
    }
  }
  static async setLunas(invoice: string): Promise<{
    success: boolean;
    type: string;
    title: string;
    pesan: string;
    invoice: string;
  } | null> {
    try {
      const cookie = await getCookieTungkaLilirAdmin();
      if (!cookie)
        return Promise.reject(
          new Error("HttpPaymentRlradius.getCSRF : Cookie not found"),
        );

      const csrf = await this.getCSRF();
      if (!csrf?.token)
        Promise.reject(
          new Error("Token csrf not found : " + JSON.stringify(csrf)),
        );

      const body = new URLSearchParams({
        _token: String(csrf?.token),
        invoice: invoice,
        carabayar: "2",
        rekening: ACCOUNT_CONFIG.ACCOUNT_NUMBER,
      }).toString();

      const API_CONFIG = await getApiConfig();
      const res = await CapacitorHttp.post({
        url: `${API_CONFIG.BASE_URL}/invoice/setlunas`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "X-Requested-With": "XMLHttpRequest",
          Cookie: cookie,
        },
        data: body,
      });

      if (res.status != 200)
        return Promise.reject(
          new Error("Response not status 200 : " + JSON.stringify(res)),
        );

      return res.status == 200
        ? typeof res.data == "string"
          ? JSON.parse(res.data)
          : res.data
        : null;
    } catch (err) {
      return Promise.reject(err);
    }
  }
}

export class HttpPaymentApi {

  static async getAll(): Promise<Array<Payment>> {
    try {
      const API_CONFIG = await getApiConfig();
      const res = await CapacitorHttp.get({
        url: `${API_CONFIG.DB_EXTENSION_API_URL}?table=payment`,
        responseType: "json",
      });

      if (res.status != 200)
        return Promise.reject(
          new Error("Response not status 200 : " + JSON.stringify(res)),
        );

      const contentType =
        res.headers["Content-Type"] || res.headers["content-type"] || "";
      if (contentType.toLowerCase().indexOf("application/json") == -1)
        return Promise.reject({ res });


      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject({
        err,
      });
    }
  }
  static async read(id: string): Promise<Payment | null> {
    try {
      const API_CONFIG = await getApiConfig();
      const res = await CapacitorHttp.post({
        url: API_CONFIG.DB_EXTENSION_API_URL,
        data: {
          action: "read",
          table: "payment",
          data: {
            id: id,
          },
        },
        responseType: "json",
      });

      if (res.status != 200)
        return Promise.reject(
          new Error("Response not status 200 : " + JSON.stringify(res)),
        );

      if (res.headers["Content-Type"].search("application/json") == -1)
        return Promise.reject({ res });

      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject({
        err,
      });
    }
  }
  static async create(payment: Payment): Promise<Payment | null> {
    try {
      const API_CONFIG = await getApiConfig();
      const res = await CapacitorHttp.post({
        headers: {
          "Content-Type": "application/json",
        },
        url: API_CONFIG.DB_EXTENSION_API_URL,
        data: {
          action: "create",
          table: "payment",
          data: {
            nolayanan: payment.nolayanan,
            namapelanggan: payment.namapelanggan,
            total: payment.total,
            invoice: payment.invoice,
            tanggalbayar: payment.tanggalbayar,
            waktubayar: payment.waktubayar,
            gambar: payment.gambar,
          },
        },
        responseType: "json",
      });

      if (res.status != 200)
        return Promise.reject(
          new Error("Response not status 200 : " + JSON.stringify(res)),
        );

      if (res.headers["Content-Type"].search("application/json") == -1)
        return Promise.reject(
          new Error("Response not json format : " + JSON.stringify(res)),
        );

      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject({
        err,
      });
    }
    return null;
  }
  static async update(payment: Payment): Promise<Payment | null> {
    try {
      const API_CONFIG = await getApiConfig();
      const res = await CapacitorHttp.post({
        headers: {
          "Content-Type": "application/json",
        },
        url: API_CONFIG.DB_EXTENSION_API_URL,
        data: {
          action: "update",
          table: "payment",
          data: {
            id: payment.id,
            nolayanan: payment.nolayanan,
            namapelanggan: payment.namapelanggan,
            total: payment.total,
            invoice: payment.invoice,
            tanggalbayar: payment.tanggalbayar,
            waktubayar: payment.waktubayar,
            gambar: payment.gambar,
          },
        },
        responseType: "json",
      });
      if (res.status != 200)
        return Promise.reject(
          new Error("Response not status 200 : " + JSON.stringify(res)),
        );

      if (res.headers["Content-Type"].search("application/json") == -1)
        return Promise.reject(
          new Error("Response not json format : " + JSON.stringify(res)),
        );

      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject({
        err,
      });
    }
  }
  static async delete(id: string): Promise<boolean> {
    try {
      const API_CONFIG = await getApiConfig();
      const res = await CapacitorHttp.post({
        headers: {
          "Content-Type": "application/json",
        },
        url: API_CONFIG.DB_EXTENSION_API_URL,
        data: {
          action: "read",
          table: "payment",
          data: {
            id: id,
          },
        },
        responseType: "json",
      });

      if (res.status != 200)
        return Promise.reject(
          new Error("Response not status 200 : " + JSON.stringify(res)),
        );

      if (res.headers["Content-Type"].search("application/json") == -1)
        return Promise.reject(
          new Error("Response not json format : " + JSON.stringify(res)),
        );

      return true;
    } catch (err) {
      return Promise.reject({
        err,
      });
    }
  }
}

export const sendBilToWhatsapp = async (cust: Customer) => {
  let message = `Pelanggan yang terhormat,
Berikut kami sampaikan tagihan anda bulan ini :

Invoice : {invoice}
Pelanggan : {nama_pelanggan}
No.Layanan : {nolayanan}
Profil Internet : {profile}

Total Tagihan : *{total}*
*Pembayaran paling lambat : {jatuh_tempo}*

Silahkan klik link di bawah ini untuk melihat rincian invoice dan pembayaran :
{link_invoice}

Jika anda mengalami kesulitan dalam melakukan pembayaran silahkan hubungi kami kembali.
Terima kasih`;

  const date = new Date();
  const month = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ][date.getMonth()];
  const year = date.getFullYear() + 1;

  message = message.replaceAll("{invoice}", String(cust.unpaid?.invoice));
  message = message.replaceAll("{nama_pelanggan}", String(cust.namapelanggan));
  message = message.replaceAll("{nolayanan}", String(cust.nolayanan));
  message = message.replaceAll("{profile}", String(cust.namaprofile));
  message = message.replaceAll(
    "{total}",
    Number(cust.unpaid?.total).toLocaleString("id-ID"),
  );
  message = message.replaceAll("{jatuh_tempo}", String(`10 ${month} ${year}`));
  const API_CONFIG = await getApiConfig();
  message = message.replaceAll(
    "{link_invoice}",
    String(
      `${API_CONFIG.BASE_URL}/i/${btoa(`${cust.unpaid?.invoice}${cust.profile?.phone}`)}`,
    ),
  );
  message = encodeURIComponent(message);

  await AppLauncher.openUrl({
    url: `whatsapp://send?phone=62${cust?.profile?.phone.substring(1)}&text=${message}`,
  });
};
