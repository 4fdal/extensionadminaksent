import { getCookieTungkaLilirAdmin } from "@/utils/cookie";
import { CapacitorHttp } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";
import { constructOutline } from "ionicons/icons";
import { useEffect, useState } from "react";

export default function useCustomer() {
  const [customer, setCustomer] = useState<any>(null);
  const [unpaidCustomer, setUnpaidCustomer] = useState<any>(null);
  const [paidCustomer, setPaidCustomer] = useState<any>(null);
  const [paidCustomer, setPaidCustomer] = useState<any>(null);
  const [homeCustomer, setHomeCustomer] = useState<any>(null);
  const [isload, setIsLoad] = useState<boolean>(false);

  const httpGetHomeCustomer = async () => {
    const cookie = await getCookieTungkaLilirAdmin();
    if (cookie) {
      setIsLoad(true);
      const response = await CapacitorHttp.get({
        url: "https://tungkalilir.rlradius.app/home/data",
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "X-Requested-With": "XMLHttpRequest",
          Cookie: cookie,
        },
      });

      setHomeCustomer(response.data);
      setIsLoad(false);
    }
  };

  const httpGetUnpaidCustomer = async () => {
    const cookie = await getCookieTungkaLilirAdmin();
    if (cookie) {
      setIsLoad(true);
      const response = await CapacitorHttp.post({
        url: "https://tungkalilir.rlradius.app/invoice/unpaid/data",
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          Cookie: cookie,
        },
        data: new URLSearchParams({
          draw: "2",

          "columns[0][data]": "invoice",
          "columns[0][name]": "",
          "columns[0][searchable]": "true",
          "columns[0][orderable]": "false",
          "columns[0][search][value]": "",
          "columns[0][search][regex]": "false",

          "columns[1][data]": "tgltempo",
          "columns[1][name]": "",
          "columns[1][searchable]": "true",
          "columns[1][orderable]": "true",
          "columns[1][search][value]": "",
          "columns[1][search][regex]": "false",

          "columns[2][data]": "invoice",
          "columns[2][name]": "",
          "columns[2][searchable]": "true",
          "columns[2][orderable]": "true",
          "columns[2][search][value]": "",
          "columns[2][search][regex]": "false",

          "columns[3][data]": "nolayanan",
          "columns[3][name]": "",
          "columns[3][searchable]": "true",
          "columns[3][orderable]": "true",
          "columns[3][search][value]": "",
          "columns[3][search][regex]": "false",

          "columns[4][data]": "namapelanggan",
          "columns[4][name]": "",
          "columns[4][searchable]": "true",
          "columns[4][orderable]": "true",
          "columns[4][search][value]": "",
          "columns[4][search][regex]": "false",

          "columns[5][data]": "namaprofile",
          "columns[5][name]": "",
          "columns[5][searchable]": "true",
          "columns[5][orderable]": "true",
          "columns[5][search][value]": "",
          "columns[5][search][regex]": "false",

          "columns[6][data]": "fullname",
          "columns[6][name]": "",
          "columns[6][searchable]": "true",
          "columns[6][orderable]": "true",
          "columns[6][search][value]": "",
          "columns[6][search][regex]": "false",

          "columns[7][data]": "namakategoriinvoice",
          "columns[7][name]": "",
          "columns[7][searchable]": "true",
          "columns[7][orderable]": "true",
          "columns[7][search][value]": "",
          "columns[7][search][regex]": "false",

          "columns[8][data]": "tglterbit",
          "columns[8][name]": "",
          "columns[8][searchable]": "true",
          "columns[8][orderable]": "true",
          "columns[8][search][value]": "",
          "columns[8][search][regex]": "false",

          "columns[9][data]": "tgltempo",
          "columns[9][name]": "",
          "columns[9][searchable]": "true",
          "columns[9][orderable]": "true",
          "columns[9][search][value]": "",
          "columns[9][search][regex]": "false",

          "columns[10][data]": "subtotal",
          "columns[10][name]": "",
          "columns[10][searchable]": "true",
          "columns[10][orderable]": "true",
          "columns[10][search][value]": "",
          "columns[10][search][regex]": "false",

          "columns[11][data]": "diskon",
          "columns[11][name]": "",
          "columns[11][searchable]": "true",
          "columns[11][orderable]": "true",
          "columns[11][search][value]": "",
          "columns[11][search][regex]": "false",

          "columns[12][data]": "ppn",
          "columns[12][name]": "",
          "columns[12][searchable]": "true",
          "columns[12][orderable]": "true",
          "columns[12][search][value]": "",
          "columns[12][search][regex]": "false",

          "columns[13][data]": "kodeunik",
          "columns[13][name]": "",
          "columns[13][searchable]": "true",
          "columns[13][orderable]": "true",
          "columns[13][search][value]": "",
          "columns[13][search][regex]": "false",

          "columns[14][data]": "total",
          "columns[14][name]": "",
          "columns[14][searchable]": "true",
          "columns[14][orderable]": "true",
          "columns[14][search][value]": "",
          "columns[14][search][regex]": "false",

          "columns[15][data]": "catatan",
          "columns[15][name]": "",
          "columns[15][searchable]": "true",
          "columns[15][orderable]": "true",
          "columns[15][search][value]": "",
          "columns[15][search][regex]": "false",

          "columns[16][data]": "tagih",
          "columns[16][name]": "",
          "columns[16][searchable]": "true",
          "columns[16][orderable]": "true",
          "columns[16][search][value]": "",
          "columns[16][search][regex]": "false",

          "order[0][column]": "2",
          "order[0][dir]": "desc",

          start: "0",
          length: "100",

          "search[value]": "",
          "search[regex]": "false",

          status: "1",
        }),
      });

      setUnpaidCustomer(response.data);
      setIsLoad(false);
    }
  };

  const httpGetPaidCustomer = async () => {
    const cookie = await getCookieTungkaLilirAdmin();
    if (cookie) {
      setIsLoad(true);
      const response = await CapacitorHttp.post({
        url: "https://tungkalilir.rlradius.app/invoice/paid/data",
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          Cookie: cookie,
        },
        data: new URLSearchParams({
          draw: "2",

          "columns[0][data]": "invoice",
          "columns[0][name]": "",
          "columns[0][searchable]": "false",
          "columns[0][orderable]": "false",
          "columns[0][search][value]": "",
          "columns[0][search][regex]": "false",

          "columns[1][data]": "lastupdate",
          "columns[1][name]": "",
          "columns[1][searchable]": "true",
          "columns[1][orderable]": "true",
          "columns[1][search][value]": "",
          "columns[1][search][regex]": "false",

          "columns[2][data]": "nolayanan",
          "columns[2][name]": "",
          "columns[2][searchable]": "true",
          "columns[2][orderable]": "true",
          "columns[2][search][value]": "",
          "columns[2][search][regex]": "false",

          "columns[3][data]": "namapelanggan",
          "columns[3][name]": "",
          "columns[3][searchable]": "true",
          "columns[3][orderable]": "true",
          "columns[3][search][value]": "",
          "columns[3][search][regex]": "false",

          "columns[4][data]": "namaprofile",
          "columns[4][name]": "",
          "columns[4][searchable]": "true",
          "columns[4][orderable]": "true",
          "columns[4][search][value]": "",
          "columns[4][search][regex]": "false",

          "columns[5][data]": "mitra",
          "columns[5][name]": "",
          "columns[5][searchable]": "true",
          "columns[5][orderable]": "true",
          "columns[5][search][value]": "",
          "columns[5][search][regex]": "false",

          "columns[6][data]": "namakategoriinvoice",
          "columns[6][name]": "",
          "columns[6][searchable]": "true",
          "columns[6][orderable]": "true",
          "columns[6][search][value]": "",
          "columns[6][search][regex]": "false",

          "columns[7][data]": "tglbayar",
          "columns[7][name]": "",
          "columns[7][searchable]": "true",
          "columns[7][orderable]": "true",
          "columns[7][search][value]": "",
          "columns[7][search][regex]": "false",

          "columns[8][data]": "biller",
          "columns[8][name]": "",
          "columns[8][searchable]": "true",
          "columns[8][orderable]": "true",
          "columns[8][search][value]": "",
          "columns[8][search][regex]": "false",

          "columns[9][data]": "carabayar",
          "columns[9][name]": "",
          "columns[9][searchable]": "true",
          "columns[9][orderable]": "true",
          "columns[9][search][value]": "",
          "columns[9][search][regex]": "false",

          "columns[10][data]": "namachannel",
          "columns[10][name]": "",
          "columns[10][searchable]": "true",
          "columns[10][orderable]": "true",
          "columns[10][search][value]": "",
          "columns[10][search][regex]": "false",

          "columns[11][data]": "paycode",
          "columns[11][name]": "",
          "columns[11][searchable]": "true",
          "columns[11][orderable]": "true",
          "columns[11][search][value]": "",
          "columns[11][search][regex]": "false",

          "columns[12][data]": "subtotal",
          "columns[12][name]": "",
          "columns[12][searchable]": "false",
          "columns[12][orderable]": "false",
          "columns[12][search][value]": "",
          "columns[12][search][regex]": "false",

          "columns[13][data]": "diskon",
          "columns[13][name]": "",
          "columns[13][searchable]": "false",
          "columns[13][orderable]": "false",
          "columns[13][search][value]": "",
          "columns[13][search][regex]": "false",

          "columns[14][data]": "ppn",
          "columns[14][name]": "",
          "columns[14][searchable]": "true",
          "columns[14][orderable]": "true",
          "columns[14][search][value]": "",
          "columns[14][search][regex]": "false",

          "columns[15][data]": "adm",
          "columns[15][name]": "",
          "columns[15][searchable]": "true",
          "columns[15][orderable]": "true",
          "columns[15][search][value]": "",
          "columns[15][search][regex]": "false",

          "columns[16][data]": "kodeunik",
          "columns[16][name]": "",
          "columns[16][searchable]": "true",
          "columns[16][orderable]": "true",
          "columns[16][search][value]": "",
          "columns[16][search][regex]": "false",

          "columns[17][data]": "total",
          "columns[17][name]": "",
          "columns[17][searchable]": "true",
          "columns[17][orderable]": "true",
          "columns[17][search][value]": "",
          "columns[17][search][regex]": "false",

          "columns[18][data]": "catatan",
          "columns[18][name]": "",
          "columns[18][searchable]": "true",
          "columns[18][orderable]": "true",
          "columns[18][search][value]": "",
          "columns[18][search][regex]": "false",

          "order[0][column]": "1",
          "order[0][dir]": "desc",

          start: "0",
          length: "25",

          "search[value]": "",
          "search[regex]": "false",

          bulan: "02",
          tahun: "2026",
        }),
      });

      setPaidCustomer(response.data);
      setIsLoad(false);
    }
  };

  const httpGetCustomer = async () => {
    const cookie = await getCookieTungkaLilirAdmin();
    if (cookie) {
      setIsLoad(true);
      const dataURL = new URLSearchParams({
        draw: "2",

        "columns[0][data]": "nolayanan",
        "columns[0][name]": "",
        "columns[0][searchable]": "false",
        "columns[0][orderable]": "false",
        "columns[0][search][value]": "",
        "columns[0][search][regex]": "false",

        "columns[1][data]": "username",
        "columns[1][name]": "",
        "columns[1][searchable]": "false",
        "columns[1][orderable]": "false",
        "columns[1][search][value]": "",
        "columns[1][search][regex]": "false",

        "columns[2][data]": "nourut",
        "columns[2][name]": "",
        "columns[2][searchable]": "false",
        "columns[2][orderable]": "false",
        "columns[2][search][value]": "",
        "columns[2][search][regex]": "false",

        "columns[3][data]": "namapelanggan",
        "columns[3][name]": "",
        "columns[3][searchable]": "false",
        "columns[3][orderable]": "true",
        "columns[3][search][value]": "",
        "columns[3][search][regex]": "false",

        "columns[4][data]": "namasubkategori",
        "columns[4][name]": "",
        "columns[4][searchable]": "false",
        "columns[4][orderable]": "true",
        "columns[4][search][value]": "",
        "columns[4][search][regex]": "false",

        "columns[5][data]": "namaprofile",
        "columns[5][name]": "",
        "columns[5][searchable]": "false",
        "columns[5][orderable]": "true",
        "columns[5][search][value]": "",
        "columns[5][search][regex]": "false",

        "columns[6][data]": "jenisbilling",
        "columns[6][name]": "",
        "columns[6][searchable]": "false",
        "columns[6][orderable]": "true",
        "columns[6][search][value]": "",
        "columns[6][search][regex]": "false",

        "columns[7][data]": "siklusbilling",
        "columns[7][name]": "",
        "columns[7][searchable]": "false",
        "columns[7][orderable]": "true",
        "columns[7][search][value]": "",
        "columns[7][search][regex]": "false",

        "columns[8][data]": "tglaktif",
        "columns[8][name]": "",
        "columns[8][searchable]": "false",
        "columns[8][orderable]": "true",
        "columns[8][search][value]": "",
        "columns[8][search][regex]": "false",

        "columns[9][data]": "tglisolir",
        "columns[9][name]": "",
        "columns[9][searchable]": "false",
        "columns[9][orderable]": "true",
        "columns[9][search][value]": "",
        "columns[9][search][regex]": "false",

        "columns[10][data]": "username",
        "columns[10][name]": "",
        "columns[10][searchable]": "false",
        "columns[10][orderable]": "true",
        "columns[10][search][value]": "",
        "columns[10][search][regex]": "false",

        "columns[11][data]": "password",
        "columns[11][name]": "",
        "columns[11][searchable]": "false",
        "columns[11][orderable]": "true",
        "columns[11][search][value]": "",
        "columns[11][search][regex]": "false",

        "columns[12][data]": "shortname",
        "columns[12][name]": "",
        "columns[12][searchable]": "false",
        "columns[12][orderable]": "true",
        "columns[12][search][value]": "",
        "columns[12][search][regex]": "false",

        "columns[13][data]": "servername",
        "columns[13][name]": "",
        "columns[13][searchable]": "false",
        "columns[13][orderable]": "true",
        "columns[13][search][value]": "",
        "columns[13][search][regex]": "false",

        "columns[14][data]": "addresslist",
        "columns[14][name]": "",
        "columns[14][searchable]": "false",
        "columns[14][orderable]": "true",
        "columns[14][search][value]": "",
        "columns[14][search][regex]": "false",

        "columns[15][data]": "lastipaddress",
        "columns[15][name]": "",
        "columns[15][searchable]": "false",
        "columns[15][orderable]": "true",
        "columns[15][search][value]": "",
        "columns[15][search][regex]": "false",

        "columns[16][data]": "mac",
        "columns[16][name]": "",
        "columns[16][searchable]": "false",
        "columns[16][orderable]": "true",
        "columns[16][search][value]": "",
        "columns[16][search][regex]": "false",

        "columns[17][data]": "namawilayah",
        "columns[17][name]": "",
        "columns[17][searchable]": "false",
        "columns[17][orderable]": "true",
        "columns[17][search][value]": "",
        "columns[17][search][regex]": "false",

        "columns[18][data]": "alamatpemasangan",
        "columns[18][name]": "",
        "columns[18][searchable]": "false",
        "columns[18][orderable]": "true",
        "columns[18][search][value]": "",
        "columns[18][search][regex]": "false",

        "columns[19][data]": "tgldaftar",
        "columns[19][name]": "",
        "columns[19][searchable]": "false",
        "columns[19][orderable]": "true",
        "columns[19][search][value]": "",
        "columns[19][search][regex]": "false",

        "columns[20][data]": "fullname",
        "columns[20][name]": "",
        "columns[20][searchable]": "false",
        "columns[20][orderable]": "true",
        "columns[20][search][value]": "",
        "columns[20][search][regex]": "false",

        "columns[21][data]": "kodeunik",
        "columns[21][name]": "",
        "columns[21][searchable]": "false",
        "columns[21][orderable]": "true",
        "columns[21][search][value]": "",
        "columns[21][search][regex]": "false",

        "columns[22][data]": "catatan",
        "columns[22][name]": "",
        "columns[22][searchable]": "false",
        "columns[22][orderable]": "true",
        "columns[22][search][value]": "",
        "columns[22][search][regex]": "false",

        "order[0][column]": "2",
        "order[0][dir]": "desc",

        start: "0",
        length: "0",

        "search[value]": "",
        "search[regex]": "false",

        nas: "",
        profile: "",
        status: "0",
        mitra: "",
      });
      const response = await CapacitorHttp.post({
        url: "https://tungkalilir.rlradius.app/berlangganan/data",
        headers: {
          Accept: "application/json, text/javascript, */*; q=0.01",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          "X-Requested-With": "XMLHttpRequest",
          Cookie: cookie,
        },
        data: dataURL.toString(),
      });

      setCustomer(response.data);
      setIsLoad(false);
    }
  };

  return {
    customer,
  };
}
