import { PaymentCustomer } from "@/types/customer";
import { CapacitorHttp } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { getCookieTungkaLilirAdmin } from "./cookie";

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
  static baseURL = "https://tungkalilir.rlradius.app/csrf";

  static async getCSRF(): Promise<{ status: boolean; token: string } | null> {
    try {
      const cookie = await getCookieTungkaLilirAdmin();
      if (!cookie)
        return Promise.reject(
          new Error("HttpPaymentRlradius.getCSRF : Cookie not found"),
        );

      const res = await CapacitorHttp.get({
        url: `${this.baseURL}/csrf`,
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "X-Requested-With": "XMLHttpRequest",
          Cookie: cookie,
        },
      });

      if (res.status != 200) Promise.reject(res);

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
      if (!csrf?.token) Promise.reject(csrf);

      const formData = new FormData();
      if (csrf?.token) formData.append("_token", csrf?.token);
      formData.append("invoice", invoice);
      formData.append("carabayar", "2");
      formData.append("rekening", "7975 0100 0814 504");

      const res = await CapacitorHttp.post({
        url: `${this.baseURL}/invoice/setlunas`,
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Content-Type": "multipart/form-data; boundary=----",
          "X-Requested-With": "XMLHttpRequest",
          Cookie: cookie,
        },
        dataType: "formData",
        data: formData,
      });

      if (res.status != 200) Promise.reject(res);

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
  static baseURL: string =
    "https://script.google.com/macros/s/AKfycbyHqUZHwWPsJQCH28KLezVMN3S_E5KpPhDuZEhnNkUT3vKKeAhjHxt80mpO40zosvHouw/exec";

  static async getAll(): Promise<Array<Payment>> {
    try {
      const res = await CapacitorHttp.get({
        url: `${this.baseURL}?table=payment`,
      });

      if (res.status != 200) return Promise.reject({ res });
      if (res.headers["Content-Type"].search("application/json") == -1)
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
      const res = await CapacitorHttp.post({
        url: this.baseURL,
        data: {
          action: "read",
          table: "payment",
          data: {
            id: id,
          },
        },
      });

      if (res.status != 200) return Promise.reject({ res });
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
      const res = await CapacitorHttp.post({
        headers: {
          "Content-Type": "application/json",
        },
        url: this.baseURL,
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
      });

      if (res.status != 200) return Promise.reject({ res });
      if (res.headers["Content-Type"].search("application/json") == -1)
        return Promise.reject({ res });

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
      const res = await CapacitorHttp.post({
        headers: {
          "Content-Type": "application/json",
        },
        url: this.baseURL,
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
      });
      if (res.status != 200) return Promise.reject({ res });
      if (res.headers["Content-Type"].search("application/json") == -1)
        return Promise.reject({ res });

      return Promise.resolve(res.data);
    } catch (err) {
      return Promise.reject({
        err,
      });
    }
  }
  static async delete(id: string): Promise<boolean> {
    try {
      const res = await CapacitorHttp.post({
        headers: {
          "Content-Type": "application/json",
        },
        url: this.baseURL,
        data: {
          action: "read",
          table: "payment",
          data: {
            id: id,
          },
        },
      });

      if (res.status != 200) return Promise.reject({ res });
      if (res.headers["Content-Type"].search("application/json") == -1)
        return Promise.reject({ res });

      return true;
    } catch (err) {
      return Promise.reject({
        err,
      });
    }
  }
}
