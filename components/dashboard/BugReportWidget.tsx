"use client";

import React, { useState } from 'react';
import { Bug, Send, X, CheckCircle2 } from 'lucide-react';

export default function BugReportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async () => {
    if (!message.trim()) return;
    
    setStatus('loading');
    try {
      const res = await fetch('/api/user/bug', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          page: window.location.pathname
        })
      });

      if (res.ok) {
        setStatus('success');
        setTimeout(() => {
          setIsOpen(false);
          setMessage('');
          setStatus('idle');
        }, 2000);
      } else {
        setStatus('error');
      }
    } catch (e) {
      setStatus('error');
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-3 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 shadow-xl transition-all z-50 group flex items-center justify-center"
        title="Report a Bug"
      >
        <Bug className="w-5 h-5 group-hover:scale-110 transition-transform" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 rounded-2xl glass shadow-2xl p-4 z-50 animate-in slide-in-from-bottom-4 duration-200">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-semibold text-white flex items-center gap-2 uppercase tracking-widest">
          <Bug className="w-3.5 h-3.5 text-emerald-400" />
          Report an Issue
        </h3>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-zinc-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {status === 'success' ? (
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mb-2" />
          <p className="text-sm font-medium text-white">System Logged</p>
          <p className="text-xs text-zinc-400 mt-1">Thanks for the telemetry. We'll fix it.</p>
        </div>
      ) : (
        <div className="space-y-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's broken? Give us the raw logs..."
            className="w-full h-24 bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-emerald-500/50 resize-none thin-scrollbar"
          />
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-500">
              {status === 'error' ? <span className="text-red-400">Transmission failed.</span> : 'Context attached.'}
            </span>
            <button
              onClick={handleSubmit}
              disabled={status === 'loading' || !message.trim()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500 text-zinc-950 text-xs font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Sending...' : 'Transmit'}
              <Send className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
