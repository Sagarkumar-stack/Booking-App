import React, { useState, useEffect, useRef } from "react";
import API from "./api";
import { motion, AnimatePresence } from "framer-motion";

function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([
        { role: "bot", content: "Hi! I'm your TravelX assistant. How can I help you today?" }
    ]);
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chat]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        const userMsg = { role: "user", content: message };
        setChat(prev => [...prev, userMsg]);
        setMessage("");
        setLoading(true);

        try {
            const userId = localStorage.getItem("userId"); // Assuming userId is stored in localStorage
            const res = await API.post("/chatbot/query", { message, userId });
            setChat(prev => [...prev, { role: "bot", content: res.data.response }]);
        } catch (err) {
            setChat(prev => [...prev, { role: "bot", content: "Sorry, I'm having trouble connecting right now." }]);
        }
        setLoading(false);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="bg-dark-900 border border-white/10 w-80 md:w-96 h-[500px] rounded-3xl shadow-2xl flex flex-col overflow-hidden mb-4 backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-accent-indigo to-accent-violet flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                </div>
                                <span className="font-bold text-white tracking-tight">TravelX Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/60 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                            {chat.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap ${msg.role === "user" ? "bg-accent-indigo text-white rounded-tr-none" : "bg-white/5 text-slate-300 border border-white/10 rounded-tl-none"}`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/5 p-3 rounded-2xl rounded-tl-none">
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} className="p-4 border-t border-white/10 bg-white/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 pr-12 text-sm focus:outline-none focus:border-accent-indigo transition-all"
                                />
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-accent-indigo hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-indigo to-accent-violet flex items-center justify-center shadow-glow-indigo text-white"
            >
                {isOpen ? (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                ) : (
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                )}
            </motion.button>
        </div>
    );
}

export default Chatbot;
