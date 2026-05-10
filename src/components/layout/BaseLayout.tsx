import { useAppContext } from "@/context/app-context";
import {
  IonButtons,
  IonContent,
  IonLoading,
  IonPage,
} from "@ionic/react";
import React, { useEffect } from "react";
import { useHistory } from "react-router";
import BackgroundOrbit from "./BackgroundOrbit";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import GlassButton from "../ui/GlassButton";

type BaseLayoutProp = {
  children?: React.ReactNode;
  headerRender?: React.ReactNode;
  headerToolbarEndRender?: React.ReactNode;
  headerTitle?: string;
  loadingPage?: boolean;
  loadingMessage?: string;
  backHref?: string | undefined;
};

const BaseLayout: React.FC<BaseLayoutProp> = ({
  children,
  headerRender,
  headerToolbarEndRender,
  headerTitle,
  loadingPage = false,
  loadingMessage,
  backHref,
}) => {
  const history = useHistory();
  const app = useAppContext();

  useEffect(() => {
    if (app.imageShare?.imageFile && location.pathname != "/payment") {
      history.push("/payment");
    }
  }, [app.imageShare?.imageFile, history]);

  return (
    <IonPage>
      <BackgroundOrbit />

      <IonLoading
        isOpen={loadingPage || (!!app.customer?.loadingMessage && loadingPage)}
        message={loadingMessage || app.customer?.loadingMessage || "Memproses..."}
      />

      <IonContent className="transparent-content" scrollEvents={true}>
        <div className="min-h-screen flex flex-col">
          {/* Compact Floating Header */}
          <header className="sticky top-0 z-50  space-y-2 pointer-events-none">
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="glass glass-shadow pt-5 rounded-xl px-4 py-2.5 flex items-center justify-between max-w-7xl mx-auto pointer-events-auto"
            >
              <div className="flex items-center gap-3">
                {backHref && (
                  <GlassButton
                    variant="ghost"
                    size="sm"
                    onClick={() => history.push(backHref)}
                    className="!p-1.5 mt-3"
                  >
                    <ChevronLeft size={18} />
                  </GlassButton>
                )}
                <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight">
                  {headerTitle}
                </h1>
              </div>

              <div className="flex items-center gap-2">
                {headerToolbarEndRender}
              </div>
            </motion.div>

            {headerRender && (
              <motion.div
                initial={{ y: -5, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.05 }}
                className="max-w-7xl mx-auto pointer-events-auto p-2 sm:p-4"
              >
                {headerRender}
              </motion.div>
            )}
          </header>

          <main className="flex-1 pb-6 px-2 sm:px-4 max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </IonContent>


      <style>{`
        .transparent-content {
          --background: transparent;
        }
      `}</style>
    </IonPage>

  );
};

export default React.memo(BaseLayout);

