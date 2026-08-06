// AI Chatbox for assistance on pedal effects

"use client";

import { useChat } from "@ai-sdk/react";
import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatBoxProps {
  onApplyPreset?: (preset: { boostEngaged: boolean; filterEngaged: boolean; delayEngaged: boolean }) => void;
}

export default function ChatBox({ onApplyPreset }: ChatBoxProps) {
  const { messages, sendMessage, stop, status } = useChat();
  const [textInput, setTextInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const isLoading = status === "streaming" || status === "submitted";

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 30;
    setIsAtBottom(atBottom);
  };

  useEffect(() => {
    if (isAtBottom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isAtBottom]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    if (onApplyPreset) {
      const lower = textInput.toLowerCase();
      if (lower.includes("indie") || lower.includes("preset") || lower.includes("tone")) {
        onApplyPreset({ boostEngaged: true, filterEngaged: true, delayEngaged: true });
      } else {
        onApplyPreset({ boostEngaged: true, filterEngaged: false, delayEngaged: true });
      }
    }

    sendMessage({ role: "user", parts: [{ type: "text", text: textInput }] });
    setTextInput("");
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden text-slate-100 my-8">
      <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
        <h3 className="font-semibold text-md w-full text-center">Sound Assistant</h3>
      </div>

      <div ref={scrollRef} onScroll={handleScroll} className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
        {messages.map((m: any) => {
          return (
            <div key={m.id} className={`flex flex-col my-2 ${m.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed text-sm ${m.role === "user"
                  ? "bg-emerald-600 text-white rounded-br-none"
                  : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/50"
                }`}>

                {!m.parts && <span>{typeof m.content === "string" ? m.content : JSON.stringify(m.content)}</span>}

                {m.parts && m.parts.map((part: any, index: number) => {
                  if (part.type === "text") {
                    return <span key={index}>{part.text}</span>;
                  }

                  // handle text or tool invocation
                  const isToolPart = part.type === "tool-suggestPedalPreset" || part.type === "tool-invocation" || part.toolName === "suggestPedalPreset";
                  
                  if (isToolPart) {
                    const state = part.state || (part.output ? "result" : "call");
                    const result = part.output || part.result;
                    const inputData = part.input || part.args;

                    return (
                      <div key={index} className="mt-2 p-3 bg-slate-900/90 border border-amber-500/40 rounded-xl min-h-[80px]">
                        <div className="text-[10px] font-mono uppercase text-amber-400 mb-2 flex items-center justify-between">
                          <span>🎛️ Pedal Preset Tool</span>
                          <span className="text-slate-500">({state})</span>
                        </div>

                        {/* Loading state */}
                        <AnimatePresence mode="wait">
                          {(state === "call" || state === "partial-call" || state === "input-streaming") && (
                            <motion.div 
                              key="loading"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.2 }}
                              className="flex items-center space-x-2 text-slate-400 text-xs italic py-2"
                            >
                              <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-ping"></span>
                              <span>Dialing in knobs and calculating tone...</span>
                            </motion.div>
                          )}

                          {/* Result state */}
                          {((state === "result" || result) && (result?.success || result?.preset || inputData)) && (
                            <motion.div 
                              key="result"
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <p className="font-bold text-slate-100 text-sm">
                                {result?.preset?.styleName || inputData?.styleName || "Custom Preset"}
                              </p>
                              <div className="grid grid-cols-3 gap-1 text-[11px] text-slate-400 mt-2 bg-slate-950 p-2 rounded-lg">
                                <div>Boost: <span className="text-slate-200">On</span></div>
                                <div>Filter: <span className="text-slate-200">On</span></div>
                                <div>Delay: <span className="text-slate-200">On</span></div>
                              </div>
                            </motion.div>
                          )}

                          {/* Error state */}
                          {state === "result" && result && !result.success && (
                            <motion.div 
                              key="error"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="p-2 bg-rose-950/50 border border-rose-800 rounded-lg text-rose-300 text-xs mt-2"
                            >
                              ⚠️ Failed to generate preset configuration. Please try asking again.
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          );
        })}

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
          placeholder="Ask me about pedalboard effects"
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