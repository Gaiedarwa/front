"use client";
import React, { useState, useEffect, useRef } from "react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hello from DRÄXLMAIER! What can we help you with?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // Fonction pour envoyer le message à l’API Flask
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Ajoute le message utilisateur à l’historique
    setMessages((msgs) => [...msgs, { from: "user", text: input }]);
    setLoading(true);

    try {
      const res = await fetch("https://nbbdxj84-5000.euw.devtunnels.ms/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: data.answer || "Sorry, I didn't get that." },
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Error contacting the chatbot server." },
      ]);
    }
    setInput("");
    setLoading(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {!open && (
          <button
            onClick={() => setOpen(true)}
            className="rounded-full shadow-lg border-2 border-[#007a99] bg-white hover:scale-105 transition"
            aria-label="Open chatbot"
          >
            {isClient && (
              <video
                src="/Dancing Chatbot.mp4"
                autoPlay
                loop
                muted
                className="w-20 h-20 rounded-full object-cover"
              />
            )}
          </button>
        )}

        {open && (
          <div className="w-[400px] bg-white rounded-2xl shadow-2xl border border-[#007a99] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-4 bg-[#007a99]">
              <div className="flex items-center gap-3">
                {isClient && (
                  <video
                    src="/Dancing Chatbot.mp4"
                    autoPlay
                    loop
                    muted
                    className="w-12 h-12 rounded-full object-cover border-2 border-white"
                  />
                )}
                <span className="text-white font-semibold text-lg">Chatbot</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-white text-2xl font-bold hover:text-[#005f73]"
                aria-label="Close chatbot"
              >
                ×
              </button>
            </div>
            <div className="flex-1 p-5 overflow-y-auto text-gray-700 bg-gray-50 max-h-[400px]">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 ${
                    msg.from === "user" ? "text-right" : "text-left text-[#007a99]"
                  }`}
                >
                  <span
                    className={`inline-block px-3 py-2 rounded-lg ${
                      msg.from === "user"
                        ? "bg-[#e0f7fa] text-gray-800"
                        : "bg-[#007a99] text-white"
                    }`}
                  >
                    {msg.text}
                  </span>
                </div>
              ))}
              {loading && (
                <div className="text-[#007a99] mb-2">Bot is typing...</div>
              )}
            </div>
            <form className="flex border-t border-gray-200 bg-white" onSubmit={sendMessage}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 text-base focus:outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#007a99] text-white font-semibold hover:bg-[#005f73] transition"
                disabled={loading}
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}