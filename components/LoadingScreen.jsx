"use client";

import "../app/loading-screen.css";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div className="loader-emblem-glow" />

      <div className="emblem-scene">
        <div className="emblem-medallion">
          <div className="emblem-front">
            <img
              src="/assets/national-emblem-india.png"
              alt="National Emblem of India - Ashoka Lion Capital"
              width={110}
              height={110}
            />
          </div>
          <div className="emblem-back">
            <div className="back-symbol">
              <span className="back-text-ts">TS</span>
              <span className="back-text-sub">Government of Telangana</span>
            </div>
          </div>
        </div>
      </div>

      <div className="emblem-shadow" />

      <h1 className="loader-title">SevaSetu</h1>
      <p className="loader-subtitle">Telangana Public Service Navigator</p>

      <div className="loader-track">
        <div className="loader-progress" />
      </div>

      <p className="loader-status">Loading government services...</p>
    </div>
  );
}
