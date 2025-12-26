"use client"

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SplashProps = {
  durationMs?: number;
  oncePerSession?: boolean;
};

export default function Splash({ durationMs = 1200, oncePerSession = true }: SplashProps) {
  const [visible, setVisible] = useState(false);
  const [hiding, setHiding] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const seen = sessionStorage.getItem("collab_splash_seen");
      if (oncePerSession && seen) return;
    } catch (e) {
      // ignore sessionStorage errors in SSR/strict environments
    }

    // show splash then hide
    setVisible(true);
    const t1 = window.setTimeout(() => setHiding(true), durationMs);
    const t2 = window.setTimeout(() => {
      setVisible(false);
      try {
        sessionStorage.setItem("collab_splash_seen", "1");
      } catch (e) {
        /* noop */
      }
      // If the user is on the root path, navigate to /login
      try {
        const pathname = window.location?.pathname || "/";
        if (pathname === "/" || pathname === "") {
          router.push("/login");
        }
      } catch (e) {
        /* noop */
      }
    }, durationMs + 300);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [durationMs, oncePerSession]);

  if (!visible) return null;

  return (
    <div
      onClick={() => {
        setHiding(true);
        window.setTimeout(() => {
          setVisible(false);
          try {
            sessionStorage.setItem("collab_splash_seen", "1");
          } catch (e) {}
          try {
            const pathname = window.location?.pathname || "/";
            if (pathname === "/" || pathname === "") {
              router.push("/login");
            }
          } catch (e) {}
        }, 240);
      }}
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-white/95 backdrop-blur-sm transition-opacity duration-300 ${
        hiding ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      role="dialog"
      aria-modal="true"
    >
      <div className={`flex items-center gap-6 transform transition-transform duration-400 ${hiding ? "scale-95" : "scale-100"}`}>
        <img src="/collab-logo.svg" alt="Collab logo" className="w-44 h-auto drop-shadow-md" />
      </div>
    </div>
  );
}
