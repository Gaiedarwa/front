"use client";
import React, { useState, useEffect, useRef } from "react";

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Add state for messages
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hello from DRÄXLMAIER! What can we help you with?",
    },
  ]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Focus input when chatbot opens
  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // Optionally handle sending messages (not required for now)

  return (
    <>
      {/* Floating button with video avatar */}
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

        {/* Chatbot window */}
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
            <div className="flex-1 p-5 overflow-y-auto text-gray-700 bg-gray-50">
              <div className="text-[#007a99] mb-3">
                Hello from DRÄXLMAIER! What can we help you with?
              </div>
            </div>
            <form className="flex border-t border-gray-200 bg-white" onSubmit={e => e.preventDefault()}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 text-base focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-[#007a99] text-white font-semibold hover:bg-[#005f73] transition"
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
