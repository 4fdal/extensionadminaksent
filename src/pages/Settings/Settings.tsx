import React, { useState, useEffect } from "react";
import BaseLayout from "@/components/layout/BaseLayout";
import { useIonToast } from "@ionic/react";
import { Preferences } from "@capacitor/preferences";
import { API_CONFIG, getApiConfig } from "@/config";
import { IonIcon } from "@ionic/react";
import { saveOutline, reloadOutline } from "ionicons/icons";
import GlassButton from "@/components/ui/GlassButton";
import GlassCard from "@/components/ui/GlassCard";

const SettingsPage: React.FC = () => {
  const [baseUrl, setBaseUrl] = useState("");
  const [dbUrl, setDbUrl] = useState("");
  const [present] = useIonToast();

  useEffect(() => {
    const loadPrefs = async () => {
      const config = await getApiConfig();
      setBaseUrl(config.BASE_URL);
      setDbUrl(config.DB_EXTENSION_API_URL);
    };
    loadPrefs();
  }, []);

  const handleSave = async () => {
    try {
      await Preferences.set({ key: "SETTINGS_BASE_URL", value: baseUrl });
      await Preferences.set({ key: "SETTINGS_DB_EXTENSION_API_URL", value: dbUrl });


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
  };

  const handleReset = () => {
    setBaseUrl("");
    setDbUrl("");
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
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                className="w-full h-24 bg-white/50 border border-gray-100/60 rounded-xl px-4 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm resize-none"
                placeholder="https://example.com"
              />
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">DB Extension API URL</label>
              <textarea
                value={dbUrl}
                onChange={(e) => setDbUrl(e.target.value)}
                className="w-full h-24 bg-white/50 border border-gray-100/60 rounded-xl px-4 py-2 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-sm resize-none"
                placeholder="https://script.google.com/..."
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
