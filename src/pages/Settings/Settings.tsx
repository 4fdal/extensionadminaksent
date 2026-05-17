import React, { useState, useEffect } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { useIonToast } from "@ionic/react";
import { getApiConfig, setApiConfig } from "@/config";
import { IonIcon } from "@ionic/react";
import { saveOutline, reloadOutline } from "ionicons/icons";
import GlassButton from "@/components/ui/GlassButton";
import GlassCard from "@/components/ui/GlassCard";
import { useLocation } from "react-router-dom";

const SettingsPage: React.FC = () => {
  const location = useLocation();
  const [baseUrl, setBaseUrl] = useState<string | null>(null);
  const [dbUrl, setDbUrl] = useState<string | null>(null);
  const [dbUsername, setDbUsername] = useState<string | null>(null);
  const [dbPassword, setDbPassword] = useState<string | null>(null);
  const [present] = useIonToast();

  useEffect(() => {
    const loadPrefs = async () => {
      const config = await getApiConfig();

      setBaseUrl(config.BASE_URL);
      setDbUrl(config.DB_EXTENSION_API_URL);
      setDbUsername(config.DB_EXTENSION_USERNAME);
      setDbPassword(config.DB_EXTENSION_PASSWORD);

    };
    loadPrefs();
  }, [location]);

  const handleSave = async () => {
    if (baseUrl && dbUrl) {
      try {
        await setApiConfig({
          SETTINGS_BASE_URL: baseUrl,
          SETTINGS_DB_EXTENSION_API_URL: dbUrl,
          SETTINGS_DB_EXTENSION_USERNAME: dbUsername || "",
          SETTINGS_DB_EXTENSION_PASSWORD: dbPassword || "",
        });

        present({
          message: "Settings saved successfully",
          duration: 2000,
          color: "success",
        });
      } catch (error) {
        console.error(error);
        present({
          message: "Failed to save settings",
          duration: 2000,
          color: "danger",
        });
      }
    }
  };

  const handleReset = () => {
    setBaseUrl(null);
    setDbUrl(null);
    setDbUsername(null);
    setDbPassword(null);
  };

  return (
    <BaseLayout headerTitle="Settings" backHref="/customer">
      <div className="flex flex-col gap-4 max-w-xl mx-auto mt-4 w-full mb-30 pb-32">
        <GlassCard>
          <div className="flex flex-col gap-4 p-2">
            <span className="text-lg font-bold text-slate-800 border-b border-white/20 pb-2">
              API Configuration
            </span>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Base URL</label>
              <textarea
                value={baseUrl || undefined}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full h-24 bg-white/50 border border-gray-100/60 rounded-xl px-4 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm resize-none"
                placeholder="https://example.com"
              />
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Masukkan alamat utama server web/API Anda tanpa garis miring di akhir (/). URL ini adalah domain tempat aplikasi radius Anda berjalan.
              </p>
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">DB Extension API URL</label>
              <textarea
                value={dbUrl || undefined}
                onChange={(e) => setDbUrl(e.target.value)}
                className="w-full h-24 bg-white/50 border border-gray-100/60 rounded-xl px-4 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm resize-none"
                placeholder="https://script.google.com/..."
              />
              <p className="text-xs text-slate-500 leading-relaxed mt-1">
                Masukkan URL dari <b>Google Apps Script</b> (biasanya berakhiran <code className="bg-slate-100 px-1 rounded">/exec</code>). Didapatkan dengan cara <i>Deploy as Web App</i> pada Google Sheets extension Anda.
              </p>
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">DB Extension Username</label>
              <input
                value={dbUsername || ""}
                onChange={(e) => setDbUsername(e.target.value)}
                className="w-full bg-white/50 border border-gray-100/60 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm"
                placeholder="Username (Opsional jika tidak diamankan)"
              />
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">DB Extension Password</label>
              <input
                type="password"
                value={dbPassword || ""}
                onChange={(e) => setDbPassword(e.target.value)}
                className="w-full bg-white/50 border border-gray-100/60 rounded-xl px-4 py-3 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm"
                placeholder="Password (Opsional)"
              />
            </div>

            <div className="flex justify-between gap-2 mt-4 pt-4 border-t border-white/20">
              <GlassButton variant="secondary" size="sm" onClick={handleReset}>
                <IonIcon icon={reloadOutline} />
                <span>Reset Defaults</span>
              </GlassButton>
              <GlassButton variant="primary" size="sm" onClick={handleSave}>
                <IonIcon icon={saveOutline} />
                <span>Save Configuration</span>
              </GlassButton>
            </div>
          </div>
        </GlassCard>
      </div>
    </BaseLayout>
  );
};

export default SettingsPage;
