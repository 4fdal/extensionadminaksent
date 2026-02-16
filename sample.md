Siap 👍
Kalau **Ionic React**, konsepnya sama tapi implementasinya beda dikit. Aku kasih **versi yang benar-benar umum dipakai & stabil** untuk:

👉 **Terima image dari Share aplikasi lain**
👉 **Tampilkan image**
👉 **Simpan ke database (lokal / backend)**

Fokus **Android + Ionic React + Capacitor**.

---

## 1️⃣ Setup dasar

Pastikan:

```bash
ionic start shareImage blank --type=react
cd shareImage
ionic cap add android
```

Install plugin:

```bash
npm install @capacitor/app @capacitor/filesystem
npx cap sync
```

---

## 2️⃣ Tangkap Share Image (Share Intent)

Di **`App.tsx`**:

```tsx
import React, { useEffect, useState } from 'react';
import { App } from '@capacitor/app';
import { Filesystem } from '@capacitor/filesystem';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    App.addListener('appUrlOpen', async (data: any) => {
      console.log('Share intent:', data);

      if (data?.url) {
        handleSharedImage(data.url);
      }
    });
  }, []);

  const handleSharedImage = async (uri: string) => {
    // Cara aman untuk content:// URI
    const base64 = await uriToBase64(uri);
    setImage(base64);
  };

  const uriToBase64 = async (uri: string): Promise<string> => {
    const response = await fetch(uri);
    const blob = await response.blob();

    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Shared Image</h2>
      {image && <img src={image} style={{ width: '100%' }} />}
    </div>
  );
};

export default App;
```

✅ Ini **bisa handle `content://` & `file://`**

---

## 3️⃣ Android Manifest (WAJIB)

Buka:

```
android/app/src/main/AndroidManifest.xml
```

Tambahkan **intent-filter** di `<activity>` utama:

```xml
<intent-filter>
    <action android:name="android.intent.action.SEND" />
    <category android:name="android.intent.category.DEFAULT" />
    <data android:mimeType="image/*" />
</intent-filter>
```

Kalau mau multiple image:

```xml
<action android:name="android.intent.action.SEND_MULTIPLE" />
```

---

## 4️⃣ Simpan ke Database

### ✅ Opsi A — SQLite (Offline, paling umum)

Install:

```bash
npm install @capacitor-community/sqlite
npx cap sync
```

Contoh simpan:

```ts
await db.execute(`
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image TEXT
  );
`);

await db.execute(
  'INSERT INTO images (image) VALUES (?)',
  [image]
);
```

---

### ✅ Opsi B — IndexedDB (paling simpel)

```ts
const request = indexedDB.open('ImageDB', 1);

request.onupgradeneeded = () => {
  const db = request.result;
  db.createObjectStore('images', { autoIncrement: true });
};

request.onsuccess = () => {
  const db = request.result;
  const tx = db.transaction('images', 'readwrite');
  tx.objectStore('images').add(image);
};
```

---

### ✅ Opsi C — Kirim ke Backend (Recommended)

```ts
fetch('https://api-kamu/upload', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ image })
});
```

---

## 5️⃣ Testing

1. `ionic cap run android`
2. Buka Gallery / WhatsApp
3. Pilih gambar → **Share**
4. Pilih app Ionic kamu
5. Image langsung muncul 🎉

---

## Catatan Penting

⚠️ Emulator sering gagal untuk share intent → **pakai device fisik**
⚠️ Image besar → kompres dulu sebelum simpan DB
⚠️ Jangan simpan Base64 di SQLite kalau image sangat besar → simpan file path

---

Kalau mau, aku bisa:

* 🔥 Buatin **full sample repo Ionic React**
* 🔥 Versi **multiple image share**
* 🔥 Simpan image sebagai **file + path di SQLite**
* 🔥 iOS share image (Share Extension)

Tinggal bilang mau yang mana 🚀
