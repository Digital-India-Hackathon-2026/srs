"use client";

import { useEffect, useState } from "react";
import LoadingScreen from "./LoadingScreen";

/**
 * Shows the premium loading screen on initial app load,
 * then fades out and renders children.
 */
export default function AppLoader({ children }) {
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Show loading for at least 2.2 seconds
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setLoading(false), 500);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && (
        <div
          style={{
            opacity: fadeOut ? 0 : 1,
            transition: "opacity 0.5s ease-out",
            pointerEvents: fadeOut ? "none" : "auto",
          }}
        >
          <LoadingScreen />
        </div>
      )}
      <div style={{ opacity: loading && !fadeOut ? 0 : 1, transition: "opacity 0.3s ease-in" }}>
        {children}
      </div>
    </>
  );
}
