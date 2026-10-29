"use client";

import { useState } from "react";
import { X, Send } from "lucide-react";

export default function ChatModal({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState([
    { sender: "guide", text: "Hey there! Excited for your layover!" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: "traveler", text: input }]);
    setInput("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full h-[500px] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-indigo-600 text-white">
          <h4 className="font-semibold text-sm">Elena (Verified Guide)</h4>
          <button onClick={onClose}><X className="w-5 h-5" /></button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.sender === "traveler" ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2.5 rounded-2xl text-sm ${m.sender === "traveler" ? "bg-indigo-600 text-white" : "bg-white text-slate-800 border"}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="p-3 bg-white border-t flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type message..."
            className="flex-1 px-4 py-2 text-sm border rounded-xl"
          />
          <button type="submit" className="p-2.5 bg-indigo-600 text-white rounded-xl"><Send className="w-4 h-4" /></button>
        </form>
      </div>
    </div>
  );
}
