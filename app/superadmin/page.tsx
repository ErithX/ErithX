"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Download,
  ExternalLink,
  FileText,
  Loader2,
  Send,
  ShieldAlert,
  Users,
  XCircle,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { formatLastSeen } from "@/app/lib/lastSeenUtils";

type Tab = "users" | "pending" | "approved" | "create";

interface AdminUser {
  id: string;
  email: string | null;
  fullName: string | null;
  avatarUrl: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  provider: string | null;
  lastSeen: string | null;
}

interface AdminResource {
  id: string;
  title: string;
  body: string;
  tags: string[];
  resourceType: string;
  category: string;
  linkUrl: string | null;
  imageUrl: string | null;
  hasAttachment: boolean;
  attachmentName: string | null;
  slug: string;
  status: "pending" | "approved" | "rejected";
  source: "user" | "admin";
  submittedBy: {
    email: string | null;
    name: string | null;
  } | null;
  createdAt: string;
  approvedAt: string | null;
}

const tabs: { id: Tab; label: string }[] = [
  { id: "users", label: "Users" },
  { id: "pending", label: "Pending Resources" },
  { id: "approved", label: "Approved Resources" },
  { id: "create", label: "Create Resource" },
];

const categories = [
  "DSA",
  "Competitive Programming",
  "Interview Prep",
  "System Design",
  "Career",
  "Project Building",
  "Other",
];

const resourceTypes = ["Resource", "Blog", "PDF", "Roadmap", "Video", "Tool"];

function formatDate(value: string | null) {
  if (!value) return "Never";
  return new Date(value).toLocaleString();
}

export default function SuperadminPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [resources, setResources] = useState<AdminResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [creating, setCreating] = useState(false);

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      const first = new Date(a.createdAt).getTime();
      const second = new Date(b.createdAt).getTime();
      return sortNewestFirst ? second - first : first - second;
    });
  }, [sortNewestFirst, users]);

  const pendingResources = resources.filter(
    (resource) => resource.status === "pending",
  );
  const approvedResources = resources.filter(
    (resource) => resource.status === "approved",
  );

  const loadUsers = async () => {
    const response = await fetch("/api/superadmin/users");
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Failed to load users.");
    setUsers(data.users || []);
  };

  const loadResources = async () => {
    const response = await fetch("/api/superadmin/resources");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to load resources.");
    }

    setResources(data.resources || []);
  };

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([loadUsers(), loadResources()]);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load admin.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  // Approves or rejects one pending resource from the review queue.
  const updateResourceStatus = async (
    id: string,
    action: "approve" | "reject",
  ) => {
    setMessage(null);
    setError(null);

    try {
      const rejectionReason =
        action === "reject" ? window.prompt("Reason for rejection?") || "" : "";
      const response = await fetch(`/api/superadmin/resources/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, rejectionReason }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update resource.");
      }

      setMessage(
        action === "approve" ? "Resource approved." : "Resource rejected.",
      );
      await loadResources();
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Failed to update resource.",
      );
    }
  };

  const createResource = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreating(true);
    setMessage(null);
    setError(null);

    try {
      const form = event.currentTarget;
      const response = await fetch("/api/superadmin/resources", {
        method: "POST",
        body: new FormData(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create resource.");
      }

      form.reset();
      setMessage("Resource published directly.");
      setActiveTab("approved");
      await loadResources();
    } catch (createError) {
      setError(
        createError instanceof Error
          ? createError.message
          : "Failed to create resource.",
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fredoka:wght@400;600;700&display=swap");

        body {
          font-family: "Fredoka", sans-serif;
          background-color: ${darkMode ? "#0a0a0a" : "#f4f4f5"};
        }

        .cartoon-shadow {
          box-shadow: 4px 4px 0px 0px
            ${darkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 1)"};
        }
      `}</style>

      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      <main className="min-h-screen px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <header className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p
                className={`mb-2 text-sm font-black uppercase ${darkMode ? "text-blue-300" : "text-blue-600"
                  }`}
              >
                DSA Quest control room
              </p>
              <h1
                className={`text-4xl font-black md:text-6xl ${darkMode ? "text-white" : "text-black"
                  }`}
              >
                Superadmin
              </h1>
            </div>

            <Link
              href="/resources"
              className={`inline-flex items-center gap-2 rounded-xl border-2 px-4 py-3 font-black ${darkMode
                  ? "border-white bg-gray-900 text-white"
                  : "border-black bg-white text-black"
                } cartoon-shadow`}
            >
              Open resources
              <ExternalLink className="h-4 w-4" />
            </Link>
          </header>

          <div className="mb-6 flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded-xl border-2 px-4 py-3 font-black ${activeTab === tab.id
                    ? "border-black bg-yellow-300 text-black"
                    : darkMode
                      ? "border-white bg-gray-900 text-white"
                      : "border-black bg-white text-black"
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {message && (
            <p className="mb-4 rounded-xl border-2 border-green-700 bg-green-100 px-4 py-3 font-black text-green-900">
              {message}
            </p>
          )}

          {error && (
            <p className="mb-4 flex items-center gap-2 rounded-xl border-2 border-red-700 bg-red-100 px-4 py-3 font-black text-red-900">
              <ShieldAlert className="h-5 w-5" />
              {error}
            </p>
          )}

          {loading ? (
            <div
              className={`rounded-3xl border-4 p-8 ${darkMode
                  ? "border-white bg-gray-900 text-white"
                  : "border-black bg-white text-black"
                } cartoon-shadow`}
            >
              <Loader2 className="mb-3 h-8 w-8 animate-spin" />
              <p className="text-xl font-black">Loading admin data...</p>
            </div>
          ) : (
            <>
              {activeTab === "users" && (
                <section
                  className={`rounded-3xl border-4 p-5 ${darkMode
                      ? "border-white bg-gray-900 text-white"
                      : "border-black bg-white text-black"
                    } cartoon-shadow`}
                >
                  <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <div className="flex items-center gap-3">
                      <Users className="h-7 w-7" />
                      <h2 className="text-2xl font-black">
                        Users ({users.length})
                      </h2>
                    </div>
                    <button
                      onClick={() => setSortNewestFirst((value) => !value)}
                      className="rounded-xl border-2 border-black bg-blue-300 px-4 py-2 font-black text-black"
                    >
                      Sort: {sortNewestFirst ? "Newest first" : "Oldest first"}
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[780px] border-collapse text-left">
                      <thead>
                        <tr className={darkMode ? "bg-gray-800" : "bg-gray-100"}>
                          <th className="border-2 border-black p-3">User</th>
                          <th className="border-2 border-black p-3">Email</th>
                          <th className="border-2 border-black p-3">Signed up</th>
                          <th className="border-2 border-black p-3">Last login</th>
                          <th className="border-2 border-black p-3">Last seen</th>
                          <th className="border-2 border-black p-3">Provider</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedUsers.map((user) => (
                          <tr key={user.id}>
                            <td className="border-2 border-black p-3 font-bold">
                              {user.fullName || "Unnamed user"}
                            </td>
                            <td className="border-2 border-black p-3">
                              {user.email}
                            </td>
                            <td className="border-2 border-black p-3">
                              {formatDate(user.createdAt)}
                            </td>
                            <td className="border-2 border-black p-3">
                              {formatDate(user.lastSignInAt)}
                            </td>
                            <td className="border-2 border-black p-3">
                              {formatLastSeen(user.lastSeen)}
                            </td>
                            <td className="border-2 border-black p-3">
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-bold ${
                                  user.provider === "google"
                                    ? "bg-red-200 text-red-900"
                                    : user.provider === "github"
                                      ? "bg-gray-300 text-gray-900"
                                      : "bg-blue-200 text-blue-900"
                                }`}
                              >
                                {user.provider || "unknown"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {activeTab === "pending" && (
                <ResourceList
                  title={`Pending Resources (${pendingResources.length})`}
                  resources={pendingResources}
                  darkMode={darkMode}
                  showActions
                  onAction={updateResourceStatus}
                />
              )}

              {activeTab === "approved" && (
                <ResourceList
                  title={`Approved Resources (${approvedResources.length})`}
                  resources={approvedResources}
                  darkMode={darkMode}
                  onAction={updateResourceStatus}
                />
              )}

              {activeTab === "create" && (
                <CreateResourceForm
                  creating={creating}
                  darkMode={darkMode}
                  onSubmit={createResource}
                />
              )}
            </>
          )}
        </div>
      </main>
    </>
  );
}

function ResourceList({
  title,
  resources,
  darkMode,
  showActions = false,
  onAction,
}: {
  title: string;
  resources: AdminResource[];
  darkMode: boolean;
  showActions?: boolean;
  onAction: (id: string, action: "approve" | "reject") => void;
}) {
  return (
    <section
      className={`rounded-3xl border-4 p-5 ${darkMode
          ? "border-white bg-gray-900 text-white"
          : "border-black bg-white text-black"
        } cartoon-shadow`}
    >
      <div className="mb-5 flex items-center gap-3">
        <FileText className="h-7 w-7" />
        <h2 className="text-2xl font-black">{title}</h2>
      </div>

      {resources.length === 0 ? (
        <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
          Nothing here yet.
        </p>
      ) : (
        <div className="grid gap-5">
          {resources.map((resource) => (
            <article
              key={resource.id}
              className={`rounded-2xl border-2 p-5 ${darkMode
                  ? "border-white bg-gray-800"
                  : "border-black bg-zinc-50"
                }`}
            >
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="rounded-full border-2 border-black bg-blue-200 px-3 py-1 text-xs font-black text-black">
                  {resource.resourceType}
                </span>
                <span className="rounded-full border-2 border-black bg-green-200 px-3 py-1 text-xs font-black text-black">
                  {resource.category}
                </span>
                <span className="rounded-full border-2 border-black bg-yellow-200 px-3 py-1 text-xs font-black text-black">
                  {resource.status}
                </span>
              </div>

              <h3 className="mb-2 text-2xl font-black">{resource.title}</h3>
              <p
                className={`mb-3 whitespace-pre-wrap font-semibold ${darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
              >
                {resource.body}
              </p>

              <div className="mb-4 flex flex-wrap gap-2">
                {resource.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-lg border-2 border-black bg-pink-100 px-2 py-1 text-xs font-black text-black"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div
                className={`mb-4 text-sm font-bold ${darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
              >
                Submitted by {resource.submittedBy?.email || "admin"} on{" "}
                {formatDate(resource.createdAt)}
                {resource.hasAttachment ? (
                  <span>
                    {" | File: "}
                    <a
                      href={`/api/resources/${resource.id}/file`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-500 hover:text-blue-600 font-black inline-flex items-center gap-1"
                    >
                      <Download className="h-3.5 w-3.5 inline" />
                      {resource.attachmentName}
                    </a>
                  </span>
                ) : ""}
              </div>

              <div className="flex flex-wrap gap-3">
                {resource.linkUrl && (
                  <a
                    href={resource.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-blue-300 px-4 py-2 font-black text-black"
                  >
                    Open link
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}

                {resource.status === "approved" && (
                  <Link
                    href={`/resources/${resource.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-green-300 px-4 py-2 font-black text-black"
                  >
                    View page
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                )}

                {showActions && (
                  <>
                    <button
                      onClick={() => onAction(resource.id, "approve")}
                      className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-green-400 px-4 py-2 font-black text-black"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => onAction(resource.id, "reject")}
                      className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-red-300 px-4 py-2 font-black text-black"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function CreateResourceForm({
  creating,
  darkMode,
  onSubmit,
}: {
  creating: boolean;
  darkMode: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const inputClass = `w-full rounded-xl border-2 px-4 py-3 font-semibold outline-none ${darkMode
      ? "border-white bg-gray-800 text-white"
      : "border-black bg-white text-black"
    }`;

  return (
    <section
      className={`rounded-3xl border-4 p-5 ${darkMode
          ? "border-white bg-gray-900 text-white"
          : "border-black bg-white text-black"
        } cartoon-shadow`}
    >
      <h2 className="mb-5 text-2xl font-black">Create and publish resource</h2>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block font-black">Title *</label>
          <input name="title" required className={inputClass} />
        </div>

        <div>
          <label className="mb-2 block font-black">Body *</label>
          <textarea name="body" required rows={8} className={inputClass} />
        </div>

        <div>
          <label className="mb-2 block font-black">Tags *</label>
          <input
            name="tags"
            required
            placeholder="DSA, roadmap, beginner"
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-black">Type</label>
            <select name="resourceType" className={inputClass}>
              {resourceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-black">Category</label>
            <select name="category" className={inputClass}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block font-black">External link</label>
            <input name="linkUrl" type="url" className={inputClass} />
          </div>

          <div>
            <label className="mb-2 block font-black">Image link</label>
            <input name="imageUrl" type="url" className={inputClass} />
          </div>
        </div>

        <div>
          <label className="mb-2 block font-black">Optional file</label>
          <input
            name="attachment"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.txt,.md,.doc,.docx"
            className={inputClass}
          />
        </div>

        <button
          type="submit"
          disabled={creating}
          className="inline-flex items-center gap-2 rounded-2xl border-4 border-black bg-green-400 px-7 py-4 text-lg font-black text-black cartoon-shadow disabled:opacity-60"
        >
          {creating ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          {creating ? "Publishing..." : "Publish directly"}
        </button>
      </form>
    </section>
  );
}
