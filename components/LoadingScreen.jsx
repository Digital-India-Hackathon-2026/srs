"use client";

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      {/* Gold glow behind emblem */}
      <div className="loader-emblem-glow" />

      {/* 3D Emblem Scene */}
      <div className="emblem-scene">
        <div className="emblem-medallion">
          {/* Front side — Official Telangana Emblem */}
          <div className="emblem-front">
            <img
              src="/assets/telangana-emblem.png"
              alt="Telangana State Emblem"
              width={110}
              height={110}
            />
          </div>
          {/* Back side */}
          <div className="emblem-back">
            <div className="back-symbol">
              <span className="back-text-ts">TS</span>
              <span className="back-text-sub">Government of Telangana</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shadow below medallion */}
      <div className="emblem-shadow" />

      {/* Title */}
      <h1 className="loader-title">SevaSetu</h1>
      <p className="loader-subtitle">Telangana Public Service Navigator</p>

      {/* Loading line */}
      <div className="loader-track">
        <div className="loader-progress" />
      </div>

      <p className="loader-status">Loading government services...</p>

      <style>{`
        .loading-screen {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 50% 40%, rgba(35,77,116,0.9) 0%, rgba(16,45,77,0.98) 46%, #081c32 100%);
        }

        .loader-emblem-glow {
          position: absolute;
          width: 230px;
          height: 230px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(224,164,46,0.16), transparent 68%);
          filter: blur(8px);
          pointer-events: none;
        }

        /* ── 3D Scene ── */
        .emblem-scene {
          width: 140px;
          height: 140px;
          perspective: 900px;
          position: relative;
          z-index: 2;
        }

        .emblem-medallion {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: emblem-3d-turn 5s ease-in-out infinite;
          will-change: transform;
        }

        /* Medallion thickness/rim */
        .emblem-medallion::before {
          content: "";
          position: absolute;
          inset: 4px;
          border-radius: 50%;
          transform: translateZ(-7px);
          background: linear-gradient(90deg, #8a5a0d, #f4c75d, #9a630f);
          box-shadow: 0 0 0 5px #b97913;
        }

        /* ── Front ── */
        .emblem-front {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          border-radius: 50%;
          overflow: hidden;
          backface-visibility: hidden;
          background: radial-gradient(circle at 35% 28%, #ffffff 0%, #f7f1df 48%, #d6b76f 100%);
          border: 4px solid #d99a21;
          box-shadow:
            inset 0 0 0 3px rgba(255,238,181,0.8),
            inset -12px -12px 24px rgba(80,45,0,0.18),
            inset 8px 8px 18px rgba(255,255,255,0.65),
            0 18px 45px rgba(0,0,0,0.35),
            0 0 28px rgba(217,154,33,0.25);
        }

        .emblem-front img {
          width: 82%;
          height: 82%;
          object-fit: contain;
          filter: drop-shadow(0 3px 4px rgba(0,0,0,0.18));
        }

        /* Light reflection */
        .emblem-front::after {
          content: "";
          position: absolute;
          top: -20%;
          left: -70%;
          width: 40%;
          height: 140%;
          transform: rotate(20deg);
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          animation: emblem-shine 5s ease-in-out infinite;
          pointer-events: none;
        }

        /* ── Back ── */
        .emblem-back {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          border-radius: 50%;
          backface-visibility: hidden;
          transform: rotateY(180deg);
          background: radial-gradient(circle at 35% 25%, #244c73, #102d4d 58%, #071b31);
          border: 4px solid #d99a21;
          box-shadow:
            inset 0 0 0 3px rgba(255,215,125,0.32),
            inset -14px -14px 24px rgba(0,0,0,0.28),
            0 18px 45px rgba(0,0,0,0.35);
        }

        .back-symbol {
          text-align: center;
          color: #d4a843;
        }
        .back-text-ts {
          display: block;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: 4px;
        }
        .back-text-sub {
          display: block;
          font-size: 8px;
          letter-spacing: 1px;
          opacity: 0.7;
          margin-top: 4px;
        }

        /* ── Shadow ── */
        .emblem-shadow {
          width: 105px;
          height: 15px;
          margin: 13px auto 0;
          border-radius: 50%;
          background: rgba(0,0,0,0.35);
          filter: blur(7px);
          animation: emblem-shadow-motion 5s ease-in-out infinite;
          position: relative;
          z-index: 1;
        }

        /* ── Text ── */
        .loader-title {
          font-size: clamp(28px, 4vw, 38px);
          font-weight: 750;
          color: #ffffff;
          letter-spacing: 0.3px;
          margin-top: 20px;
        }
        .loader-subtitle {
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.8px;
          color: rgba(255,255,255,0.68);
          margin-top: 7px;
        }

        /* ── Loading line ── */
        .loader-track {
          position: relative;
          width: min(250px, 68vw);
          height: 3px;
          margin: 30px auto 0;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,0.13);
        }
        .loader-progress {
          position: absolute;
          inset-block: 0;
          left: -45%;
          width: 45%;
          border-radius: inherit;
          background: linear-gradient(90deg, transparent, #d58b16, #ffd777, #d58b16, transparent);
          animation: loader-line-motion 1.45s ease-in-out infinite;
        }

        .loader-status {
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-top: 16px;
          letter-spacing: 0.5px;
        }

        /* ── Animations ── */
        @keyframes emblem-3d-turn {
          0%   { transform: rotateX(2deg) rotateY(0deg); }
          20%  { transform: rotateX(2deg) rotateY(24deg); }
          40%  { transform: rotateX(0deg) rotateY(0deg); }
          60%  { transform: rotateX(-2deg) rotateY(-24deg); }
          80%  { transform: rotateX(0deg) rotateY(0deg); }
          100% { transform: rotateX(2deg) rotateY(0deg); }
        }

        @keyframes emblem-shine {
          0%, 20% { left: -70%; opacity: 0; }
          35% { opacity: 0.65; }
          55% { left: 130%; opacity: 0; }
          100% { left: 130%; opacity: 0; }
        }

        @keyframes emblem-shadow-motion {
          0%, 40%, 80%, 100% { transform: scaleX(1); opacity: 0.34; }
          20%, 60% { transform: scaleX(0.82); opacity: 0.24; }
        }

        @keyframes loader-line-motion {
          from { left: -45%; }
          to { left: 105%; }
        }

        /* ── Reduced motion ── */
        @media (prefers-reduced-motion: reduce) {
          .emblem-medallion { animation: none; transform: none; }
          .emblem-front::after { animation: none; }
          .emblem-shadow { animation: none; }
          .loader-progress { animation-duration: 3s; }
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .emblem-scene { width: 100px; height: 100px; }
          .loader-emblem-glow { width: 160px; height: 160px; }
          .emblem-shadow { width: 75px; }
        }
      `}</style>
    </div>
  );
}
