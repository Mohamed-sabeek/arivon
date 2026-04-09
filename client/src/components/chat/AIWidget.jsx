import React, { useState, useEffect, useRef } from "react";
import FloatingDoll from "./FloatingDoll";
import Chatbot from "./Chatbot";

const AIWidget = ({ studentProfile = {}, hasNotification = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef(null);

  const toggleChat = () => setIsOpen((prev) => !prev);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && isOpen && setIsOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Outside click to close
  useEffect(() => {
    const onClickOutside = (e) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        !e.target.closest("[data-doll-trigger]")
      )
        setIsOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isOpen]);

  return (
    <>
      {/* ── Floating doll ── */}
      <div data-doll-trigger>
        <FloatingDoll
          isOpen={isOpen}
          onClick={toggleChat}
          hasNotification={hasNotification}
        />
      </div>

      {/* ── Chat panel ── */}
      <div
        ref={panelRef}
        role="dialog"
        aria-label="Arivon AI Career Twin Chatbot"
        aria-modal="true"
        aria-hidden={!isOpen}
        style={{
          position: "fixed",
          top: "108px",
          right: "16px",
          width: "355px",
          height: "72vh",
          maxHeight: "680px",
          minHeight: "420px",
          zIndex: 49,
          borderRadius: "16px",
          overflow: "hidden",

          /* Arivon dark theme */
          background:
            "linear-gradient(160deg, #13171f 0%, #0e1117 100%)",
          border: isOpen
            ? "1px solid rgba(249,115,22,0.35)"
            : "1px solid rgba(249,115,22,0.12)",
          boxShadow: isOpen
            ? "0 30px 70px rgba(0,0,0,0.6), 0 0 0 1px rgba(249,115,22,0.2), 0 0 40px rgba(249,115,22,0.08)"
            : "none",

          /* Slide-down animation */
          transform: isOpen ? "translateY(0)" : "translateY(-16px)",
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          transition:
            "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease, visibility 0.25s, border-color 0.3s",
        }}
      >
        {/* Orange top glow bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "2px",
            background:
              "linear-gradient(90deg, transparent, #f97316, #ea580c, transparent)",
            zIndex: 1,
          }}
        />

        {isOpen && <Chatbot studentProfile={studentProfile} />}
      </div>
    </>
  );
};

export default AIWidget;
