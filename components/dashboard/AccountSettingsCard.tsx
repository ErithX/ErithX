import React from 'react';
import Link from 'next/link';
import { Settings, PenTool, ChevronRight } from 'lucide-react';

export default function AccountSettingsCard() {
  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="font-light text-lg tracking-wide text-zinc-100 mb-4">Account & Preferences</h3>
      
      <div className="space-y-2">
        {/* Settings Link */}
        <Link href="/dashboard/settings" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-white/5 border border-white/5 flex items-center justify-center">
              <Settings className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <div className="text-sm text-zinc-200 font-light tracking-wide">Settings</div>
              <div className="text-[11px] text-zinc-500 font-light mt-0.5 max-w-[180px]">Manage infrastructure & profile.</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
        </Link>

        {/* Creator Studio Link */}
        <Link href="/dashboard/write" className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/[0.02] transition-colors group">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-white/5 border border-white/5 flex items-center justify-center">
              <PenTool className="w-4 h-4 text-zinc-400" />
            </div>
            <div>
              <div className="text-sm text-zinc-200 font-light tracking-wide">Creator Studio</div>
              <div className="text-[11px] text-zinc-500 font-light mt-0.5 max-w-[180px]">Publish notes, manage blogs.</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
        </Link>
      </div>
    </div>
  );
}
