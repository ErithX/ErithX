import { requireSuperadmin } from "@/app/lib/superadmin";
import { redirect } from "next/navigation";
import connectToDatabase from "@/app/lib/mongodb";
import { User } from "@/models/User";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Settings2, User as UserIcon } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SuperadminPreferencesPage() {
  const adminUser = await requireSuperadmin();

  if (!adminUser) {
    redirect("/");
  }

  await connectToDatabase();
  // Fetch users that have some mentorPrefs set
  const users = await User.find({ mentorPrefs: { $exists: true, $ne: null } })
    .sort({ createdAt: -1 })
    .lean();

  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-zinc-800 selection:text-white font-sans flex flex-col">
      {/* Top Header Bar */}
      <header className="border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-xl sticky top-0 z-30 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="text-sm font-semibold tracking-tight text-white">ErithX Admin</span>
          <span className="text-zinc-600 font-mono text-xs">/</span>
          <span className="text-xs text-zinc-400 font-medium">User Preferences</span>
        </div>
      </header>

      {/* Main Split Layout: Sidebar + Workspace */}
      <div className="flex flex-1">
        <AdminSidebar activeTab="preferences" />

        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl">
          <div className="mb-6">
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-blue-500" />
              User Preferences
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              {users.length} Users with custom preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {users.length === 0 ? (
              <div className="col-span-full p-12 text-center text-zinc-500 bg-zinc-950/40 rounded-xl border border-zinc-800">
                <p className="text-xs font-mono">No user preferences found.</p>
              </div>
            ) : (
              users.map((user: any) => (
                <div key={user._id.toString()} className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/40 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    {user.avatar ? (
                      <img src={user.avatar} className="w-8 h-8 rounded-full border border-zinc-700" alt="" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-zinc-400" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-semibold text-white">{user.name || "Unknown User"}</h3>
                      <p className="text-xs font-mono text-zinc-500">{user.email || user.supabaseId}</p>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Career Goal</span>
                      <p className="text-sm text-zinc-200 mt-0.5 font-medium">{user.mentorPrefs?.goal || "None"}</p>
                    </div>
                    
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500">Focus Area</span>
                      <p className="text-sm text-zinc-300 mt-0.5 bg-black p-2.5 rounded-lg border border-zinc-800/50 italic min-h-[60px]">
                        {user.mentorPrefs?.focus || "No specific focus area provided."}
                      </p>
                    </div>

                    <div className="pt-1">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 mr-2">Strictness:</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold border bg-zinc-800/50 text-zinc-300 border-zinc-700">
                        {user.mentorPrefs?.strictness || "Normal"}
                      </span>
                    </div>
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
