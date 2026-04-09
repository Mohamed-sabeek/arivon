import React, { useState, useRef, useEffect } from "react";
import botLogo from "../../assets/bot.png";
import api from "../../api/axios";

const DEFAULT_MESSAGE = {
  id: "welcome",
  role: "assistant",
  text: "Hi! I'm your Arivon AI Career Twin 👋  \nI'm here to help you grow your career with personalized guidance. Ask me anything!",
  timestamp: new Date(),
};

const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

/* ── Typing indicator ── */
const TypingIndicator = () => (
  <div
    className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl rounded-bl-sm"
    style={{
      background: "rgba(249,115,22,0.08)",
      border: "1px solid rgba(249,115,22,0.15)",
      width: "fit-content",
    }}
  >
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        style={{
          display: "inline-block",
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#f97316",
          animation: `arivon-bounce 1s ease-in-out ${i * 0.18}s infinite`,
        }}
      />
    ))}
    <style>{`
      @keyframes arivon-bounce {
        0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
        40%            { transform: translateY(-6px); opacity: 1; }
      }
    `}</style>
  </div>
);

/* ── Message bubble ── */
const MessageBubble = ({ msg }) => {
  const isUser = msg.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-3`}>
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            boxShadow: "0 0 8px rgba(249,115,22,0.4)",
          }}
        >
          <img src={botLogo} alt="AI" className="w-full h-full object-cover" />
        </div>
      )}
      <div className={`flex flex-col gap-0.5 max-w-[78%]`}>
        <div
          className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
          style={
            isUser
              ? {
                  background: "linear-gradient(135deg, #f97316, #ea580c)",
                  color: "#ffffff",
                  borderBottomRightRadius: "4px",
                  boxShadow: "0 4px 16px rgba(249,115,22,0.3)",
                }
              : {
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(249,115,22,0.12)",
                  color: "#e2e8f0",
                  borderBottomLeftRadius: "4px",
                }
          }
        >
          {msg.text}
        </div>
        <span
          className={`text-[10px] ${isUser ? "text-right" : "text-left"}`}
          style={{ color: "rgba(255,255,255,0.25)" }}
        >
          {formatTime(msg.timestamp)}
        </span>
      </div>
    </div>
  );
};

/* ── Chatbot ── */
const Chatbot = ({ studentProfile = {} }) => {
  const [messages, setMessages] = useState([DEFAULT_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 370);
    return () => clearTimeout(t);
  }, []);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const userMsg = { id: Date.now(), role: "user", text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await api.post("/chat", { message: text });
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: res.data.reply || "Sorry, I couldn't understand that.",
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: "⚠️ Couldn't reach the server. Please check your connection.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">

      {/* ── Header ── */}
      <div
        className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
        style={{
          background: "linear-gradient(135deg, rgba(249,115,22,0.15) 0%, rgba(14,17,23,0.95) 100%)",
          borderBottom: "1px solid rgba(249,115,22,0.2)",
        }}
      >
        {/* Logo icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #f97316, #ea580c)",
            boxShadow: "0 4px 12px rgba(249,115,22,0.4)",
          }}
        >
          <img src={botLogo} alt="Logo" className="w-full h-full object-cover" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white tracking-wide truncate">Arivon AI Career Twin</p>
          <p className="flex items-center gap-1.5 text-[10px]" style={{ color: "#f97316" }}>
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ background: "#22c55e", boxShadow: "0 0 4px #22c55e" }}
            />
            Online · Powered by Groq
          </p>
        </div>

        {/* Clear button */}
        <button
          onClick={() => setMessages([DEFAULT_MESSAGE])}
          title="Clear chat"
          className="text-xs px-2 py-1 rounded-lg transition-all duration-200"
          style={{
            color: "rgba(249,115,22,0.6)",
            border: "1px solid rgba(249,115,22,0.15)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#f97316";
            e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)";
            e.currentTarget.style.background = "rgba(249,115,22,0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "rgba(249,115,22,0.6)";
            e.currentTarget.style.borderColor = "rgba(249,115,22,0.15)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          ↺ Clear
        </button>
      </div>

      {/* ── Messages ── */}
      <div
        className="flex-1 overflow-y-auto px-4 py-4"
        style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(249,115,22,0.3) transparent" }}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-start mb-3">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0 overflow-hidden"
            style={{ background: "linear-gradient(135deg, #f97316, #ea580c)" }}
          >
            <img src={botLogo} alt="AI" className="w-full h-full object-cover" />
          </div>
            <TypingIndicator />
          </div>
        )}
        <div ref={bottomRef} />
      </div>


      {/* ── Input ── */}
      <div
        className="px-3 py-3 flex-shrink-0"
        style={{ borderTop: "1px solid rgba(249,115,22,0.12)" }}
      >
        <div
          className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all duration-200"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(249,115,22,0.18)",
          }}
          onFocusCapture={(e) =>
            (e.currentTarget.style.borderColor = "rgba(249,115,22,0.5)")
          }
          onBlurCapture={(e) =>
            (e.currentTarget.style.borderColor = "rgba(249,115,22,0.18)")
          }
        >
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your career..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm resize-none outline-none leading-relaxed"
            style={{
              color: "#e2e8f0",
              maxHeight: "80px",
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm
                       flex-shrink-0 transition-all duration-200"
            style={{
              background:
                input.trim() && !isLoading
                  ? "linear-gradient(135deg, #f97316, #ea580c)"
                  : "rgba(249,115,22,0.2)",
              boxShadow:
                input.trim() && !isLoading
                  ? "0 4px 12px rgba(249,115,22,0.4)"
                  : "none",
              cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
            }}
            aria-label="Send"
          >
            ➤
          </button>
        </div>
        <p
          className="text-[10px] text-center mt-1.5"
          style={{ color: "rgba(255,255,255,0.2)" }}
        >
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  );
};

export default Chatbot;
