import { Zap } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-[#09090b] flex items-center justify-center z-50">
      <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse at center, rgba(16,185,129,0.15), #09090b 60%)'}}></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* Advanced Rotating Logo */}
        <div className="relative mb-8 w-28 h-28 flex items-center justify-center">
          {/* Outer rotating dashed ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-500/30 animate-spin-slow"></div>
          
          {/* Middle rotating gradient ring */}
          <div className="absolute inset-2.5 rounded-full border-2 border-transparent border-t-emerald-400 border-l-emerald-400/50 animate-spin-reverse opacity-80"></div>
          
          {/* Inner fast ring */}
          <div className="absolute inset-5 rounded-full border-2 border-transparent border-b-emerald-300 animate-spin-fast"></div>
          
          {/* Central Logo */}
          <div className="absolute inset-0 animate-ping opacity-[0.05] rounded-full bg-emerald-500"></div>
          <div className="relative z-10 w-12 h-12 rounded-full bg-[#09090b] border border-emerald-500/40 flex items-center justify-center shadow-[0_0_25px_rgba(16,185,129,0.4)] backdrop-blur-md">
            <Zap className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="text-center">
          <h2 className="text-xl font-medium tracking-tight text-white mb-2">
            DSA Quest
          </h2>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400/70">Connecting</span>
            <div className="flex items-center gap-1">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:0s]"></div>
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.15s]"></div>
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.3s]"></div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 5s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin 3s linear infinite reverse;
        }
        .animate-spin-fast {
          animation: spin 1.5s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}