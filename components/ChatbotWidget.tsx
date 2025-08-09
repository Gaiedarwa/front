"use client";
import React, { useState, useEffect, useRef } from "react";

interface Message {
  from: "user" | "bot";
  text: string;
  audioUrl: string | null;
}

export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "Hello from DRÄXLMAIER! What can we help you with?",
      audioUrl: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  // Fonction pour lire l'audio
  const playAudio = async (audioUrl: string) => {
    if (playingAudio === audioUrl) return;
    
    setPlayingAudio(audioUrl);
    try {
      console.log('Trying to play audio URL:', audioUrl); // DEBUG
      const audio = new Audio(audioUrl);
      audio.onended = () => setPlayingAudio(null);
      audio.onerror = () => {
        setPlayingAudio(null);
        alert('Erreur lors de la lecture audio. Vérifiez la console pour plus de détails.');
      };
      await audio.play();
    } catch (error) {
      console.error("Erreur lors de la lecture audio:", error);
      setPlayingAudio(null);
      alert('Erreur JS lors de la lecture audio. Voir la console.');
    }
  };

  // Fonction pour envoyer le message à l'API Flask
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Ajoute le message utilisateur à l'historique
    setMessages((msgs) => [...msgs, { from: "user", text: input, audioUrl: null }]);
    setLoading(true);

    try {
      const res = await fetch("https://nbbdxj84-5000.euw.devtunnels.ms/ask_with_audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();
      
      // Construit l'URL audio basée sur le nom de fichier retourné
      const audioUrl = data.audio_saved_as 
        ? `https://nbbdxj84-5000.euw.devtunnels.ms/audio/${data.audio_saved_as}`
        : null;

      setMessages((msgs) => [
        ...msgs,
        { 
          from: "bot", 
          text: data.answer_text || data.answer || "Sorry, I didn't get that.",
          audioUrl: audioUrl
        },
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { from: "bot", text: "Error contacting the chatbot server.", audioUrl: null },
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
            className="group relative rounded-full shadow-2xl border-4 border-[#007a99] bg-gradient-to-br from-[#007a99] to-[#005f73] hover:from-[#005f73] hover:to-[#004d5f] transition-all duration-300 hover:scale-110 hover:shadow-3xl"
            aria-label="Open chatbot"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            {isClient && (
              <video
                src="/Dancing Chatbot.mp4"
                autoPlay
                loop
                muted
                className="w-20 h-20 rounded-full object-cover relative z-10"
              />
            )}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </button>
        )}

        {open && (
          <div className="w-[420px] bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden backdrop-blur-sm">
            {/* Header amélioré */}
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-[#007a99] to-[#005f73] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
              <div className="flex items-center gap-4 relative z-10">
                {isClient && (
                  <div className="relative">
                    <video
                      src="/Dancing Chatbot.mp4"
                      autoPlay
                      loop
                      muted
                      className="w-14 h-14 rounded-full object-cover border-3 border-white shadow-lg"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-white font-bold text-xl">DRÄXLMAIER Assistant</span>
                  <div className="text-white/80 text-sm">En ligne • Prêt à vous aider</div>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="relative z-10 text-white/80 hover:text-white text-3xl font-light hover:scale-110 transition-all duration-200 p-2 rounded-full hover:bg-white/10"
                aria-label="Close chatbot"
              >
                ×
              </button>
            </div>

            {/* Zone des messages améliorée */}
            <div className="flex-1 p-6 overflow-y-auto text-gray-700 bg-gradient-to-b from-gray-50 to-white max-h-[450px] space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  } animate-in slide-in-from-bottom-2 duration-300`}
                >
                  <div className={`flex items-start gap-3 max-w-[80%] ${
                    msg.from === "user" ? "flex-row-reverse" : "flex-row"
                  }`}>
                    {msg.from === "bot" && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-[#007a99] to-[#005f73] flex items-center justify-center shadow-md">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    
                    <div className={`flex items-start gap-2 ${
                      msg.from === "user" ? "flex-row-reverse" : "flex-row"
                    }`}>
                      {msg.from === "bot" && msg.audioUrl && (
                        <button
                          onClick={() => playAudio(msg.audioUrl!)}
                          disabled={playingAudio === msg.audioUrl}
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                            playingAudio === msg.audioUrl
                              ? "bg-red-500 text-white"
                              : "bg-[#007a99] text-white hover:bg-[#005f73]"
                          }`}
                          aria-label="Play audio with microphone"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                      
                      <div className={`px-4 py-3 rounded-2xl shadow-sm max-w-full ${
                        msg.from === "user"
                          ? "bg-gradient-to-br from-[#007a99] to-[#005f73] text-white"
                          : "bg-white text-gray-800 border border-gray-200"
                      }`}>
                        <span className="text-sm leading-relaxed">{msg.text}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {loading && (
                <div className="flex items-center gap-3 text-[#007a99] animate-pulse">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-[#007a99] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#007a99] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-2 h-2 bg-[#007a99] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                  <span className="text-sm font-medium">DRÄXLMAIER Assistant is typing...</span>
                </div>
              )}
            </div>

            {/* Formulaire amélioré */}
            <form className="flex border-t border-gray-200 bg-white p-4 gap-3" onSubmit={sendMessage}>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Tapez votre message..."
                  className="w-full px-4 py-3 text-base focus:outline-none border border-gray-300 rounded-2xl focus:border-[#007a99] focus:ring-2 focus:ring-[#007a99]/20 transition-all duration-200"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={loading}
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="px-6 py-3 bg-gradient-to-r from-[#007a99] to-[#005f73] text-white font-semibold rounded-2xl hover:from-[#005f73] hover:to-[#004d5f] transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                Envoyer
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}