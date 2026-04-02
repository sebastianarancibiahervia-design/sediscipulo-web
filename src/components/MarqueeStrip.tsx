import React from "react";

const items = [
  "MODELOS DISPONIBLES",
  "FE Y ESTILO",
  "VERDAD BÍBLICA",
  "HECHO PARA VIVIR Y VESTIR LA FE",
  "CONFECCIÓN NACIONAL",
];

const Dot = () => (
  <span className="text-skin/60 mx-4 select-none text-xs">✦</span>
);

export default function MarqueeStrip() {
  return (
    <div className="w-full bg-charcoal border-y border-white/5 overflow-hidden py-3 select-none">
      <style>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marquee-left 28s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="marquee-track">
        {/* Duplicamos el array para loop seamless */}
        {[...items, ...items].map((text, i) => (
          <span key={i} className="flex items-center">
            <span className="font-mono text-[11px] font-medium tracking-[0.2em] text-white/50 uppercase">
              {text}
            </span>
            <Dot />
          </span>
        ))}
      </div>
    </div>
  );
}
