import React from "react";
import botLogo from "../../assets/bot.png";

const FloatingDoll = ({ isOpen, onClick, hasNotification }) => {
  return (
    <div
      className="fixed top-0 right-8 z-50 flex flex-col items-center cursor-pointer group"
      onClick={onClick}
      aria-label="Open Arivon AI Career Twin chatbot"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      style={{ userSelect: "none" }}
    >
      {/* ── Hanging wire ── */}
      <div
        style={{
          width: "2px",
          height: "44px",
          background: "linear-gradient(to bottom, transparent, #f97316aa, #f97316)",
          opacity: 0.6,
        }}
      />

      {/* ── Doll body wrapper — swing animation ── */}
      <div
        className="relative flex flex-col items-center"
        style={{ animation: "arivon-swing 3.5s ease-in-out infinite" }}
      >
        {/* AI Badge */}
        <div
          className="absolute -left-3 -top-2 z-10 px-1.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest text-white"
          style={{
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            boxShadow: "0 0 10px 3px rgba(249,115,22,0.65)",
            animation: "orange-pulse 2s ease-in-out infinite",
          }}
        >
          AI
        </div>

        {/* Notification dot */}
        {hasNotification && !isOpen && (
          <span
            className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full border-2 z-20"
            style={{
              background: "#f97316",
              borderColor: "#0e1117",
              animation: "orange-ping 1s cubic-bezier(0,0,0.2,1) infinite",
            }}
          />
        )}

        {/* Main doll circle */}
        <div
          className="relative flex items-center justify-center w-14 h-14 rounded-full overflow-hidden transition-all duration-300 ease-out group-hover:scale-110"
          style={{
            background: "linear-gradient(135deg, #1a1f2e 0%, #0e1117 100%)",
            border: isOpen
              ? "2px solid #f97316"
              : "2px solid rgba(249,115,22,0.35)",
            boxShadow: isOpen
              ? "0 0 28px 8px rgba(249,115,22,0.45), 0 8px 32px rgba(0,0,0,0.5)"
              : "0 0 16px 4px rgba(249,115,22,0.25), 0 6px 20px rgba(0,0,0,0.4)",
          }}
        >
          {/* Inner orange ring */}
          <div
            className="absolute inset-1.5 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }}
          />
          
          <img src={botLogo} alt="AI Bot" className="w-full h-full object-cover relative z-10" />
        </div>


        {/* Legs */}
        <div className="flex gap-1.5 mt-0.5">
          <div
            className="w-1.5 h-3 rounded-b-full"
            style={{ background: "#f97316", opacity: 0.7 }}
          />
          <div
            className="w-1.5 h-3 rounded-b-full"
            style={{ background: "#ea580c", opacity: 0.7 }}
          />
        </div>
      </div>

      {/* Tooltip */}
      <div
        className="mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap
                   opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        style={{
          background: "rgba(14,17,23,0.9)",
          border: "1px solid rgba(249,115,22,0.3)",
          color: "#f97316",
        }}
      >
        {isOpen ? "Close" : "Ask AI Twin"}
      </div>

      <style>{`
        @keyframes arivon-swing {
          0%   { transform: rotate(-5deg); }
          50%  { transform: rotate(5deg); }
          100% { transform: rotate(-5deg); }
        }
        @keyframes orange-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 10px 3px rgba(249,115,22,0.65); }
          50%       { opacity: 0.75; box-shadow: 0 0 18px 6px rgba(249,115,22,0.85); }
        }
        @keyframes orange-ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default FloatingDoll;
