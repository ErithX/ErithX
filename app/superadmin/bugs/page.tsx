import { requireSuperadmin } from "@/app/lib/superadmin";
import { redirect } from "next/navigation";
import connectToDatabase from "@/app/lib/mongodb";
import { BugReport } from "@/models/BugReport";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Bug, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuperadminBugsPage() {
  const adminUser = await requireSuperadmin();

  if (!adminUser) {
    redirect("/");
  }

  await connectToDatabase();
  const bugs = await BugReport.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-zinc-800 selection:text-white font-sans flex flex-col">
      {/* Top Header Bar */}
      <header className="border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-30 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <span className="text-sm font-semibold tracking-tight text-white">ErithX Admin</span>
          <span className="text-zinc-600 font-mono text-xs">/</span>
          <span className="text-xs text-zinc-400 font-medium">Bug Reports</span>
        </div>
      </header>

      {/* Main Split Layout: Sidebar + Workspace */}
      <div className="flex flex-1">
        <AdminSidebar activeTab="bugs" />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Bug className="w-5 h-5 text-red-500" />
              Bug Reports
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              {bugs.length} Issues Reported
            </p>
          </div>

          <div className="space-y-4">
            {bugs.length === 0 ? (
              <div className="p-12 text-center text-zinc-500 bg-zinc-950/40 rounded-xl border border-zinc-800">
                <AlertCircle className="mb-2.5 h-6 w-6 mx-auto text-zinc-600" />
                <p className="text-xs font-mono">No bugs reported yet.</p>
              </div>
            ) : (
              bugs.map((bug: any) => (
                <div key={bug._id.toString()} className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-sm font-semibold text-white">{bug.email || bug.user_id}</span>
                      <span className="text-[10px] text-zinc-500 ml-2 font-mono">{new Date(bug.createdAt).toLocaleString()}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${bug.status === 'open' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                      {bug.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-zinc-300 mb-3 whitespace-pre-wrap">
                    {bug.message}
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono bg-black p-2 rounded border border-zinc-800/50">
                    Source Page: {bug.page || "Unknown"}
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
