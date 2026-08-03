// AI Chatbox for assistance on pedal effects

"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";

export default function ChatBox() {
  const { messages, sendMessage, stop, status } = useChat({
    onFinish: (message) => {
      console.log("AI finished streaming message:", message);
    },
    onError: (err) => {
      console.error("useChat error stream:", err);
    }
  });
  const [textInput, setTextInput] = useState("");
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const isLoading = status === "streaming" || status === "submitted";

  // detect scroll position
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 30;
    setIsAtBottom(atBottom);
  };

  // auto scroll to bottom on new messages
  useEffect(() => {
    if (isAtBottom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAtBottom]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    sendMessage({ role: "user", parts: [{ type: "text", text: textInput }] });
    setTextInput("");
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden text-slate-100 my-8">
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <h3 className="font-semibold text-sm">Pedalboard Assistant</h3>
      </div>

      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {messages.length === 0 && (
          <div className="text-center text-slate-500 my-auto py-12">
            <p>Ask me about the pedalboard effects, delay, or filters!</p>
          </div>
        )}

        {messages.map((m: any) => {

          // extract raw string
          let textContent = "";
          if (typeof m.content === "string") { 
            textContent = m.content;
          } else if (Array.isArray(m.parts)) { 
            // extracted string from prompt images, function calls etc.
            textContent = m.parts
              .map((p: any) => (p.type === "text" ? p.text : ""))
              .join("");
          }

          return (
            <div key={m.id} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                m.role === "user" 
                  ? "bg-emerald-600 text-white rounded-br-none" 
                  : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/50"
              }`}>
                {textContent}
              </div>
            </div>
          );
        })}

        {/* display AI thinking animation */}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex items-start">
            <div className="bg-slate-800 text-slate-400 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-700/50 flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="p-3 border-t border-slate-800 bg-slate-950 flex items-center space-x-2">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {isLoading ? (
          <button type="button" onClick={stop} className="bg-rose-600 text-white px-4 py-2.5 rounded-xl font-semibold text-xs hover:bg-rose-500 transition">
            Stop
          </button>
        ) : (
          <button type="submit" className="bg-emerald-500 text-slate-950 px-4 py-2.5 rounded-xl font-semibold text-xs hover:bg-emerald-400 transition">
            Send
          </button>
        )}
      </form>
    </div>
  );
}