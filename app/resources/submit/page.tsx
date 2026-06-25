"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import {
  ArrowLeft,
  CheckCircle,
  FileUp,
  Loader2,
  LogIn,
  Send,
} from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { createClient } from "@/app/lib/supabase/client";

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

export default function SubmitResourcePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingUser(false);
    });
  }, [supabase.auth]);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/resources/submit`,
      },
    });
  };

  // Sends the form as multipart data so optional files can travel with text.
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const response = await fetch("/api/resources", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit resource.");
      }

      event.currentTarget.reset();
      setSubmitted(true);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to submit resource.",
      );
    } finally {
      setSubmitting(false);
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

      <main className="min-h-screen px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/resources"
            className={`mb-8 inline-flex items-center gap-2 rounded-xl border-2 px-4 py-2 font-bold ${
              darkMode
                ? "border-white bg-gray-900 text-white"
                : "border-black bg-white text-black"
            } cartoon-shadow`}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to resources
          </Link>

          <section
            className={`rounded-3xl border-4 p-6 md:p-8 ${
              darkMode
                ? "border-white bg-gray-900 text-white"
                : "border-black bg-white text-black"
            } cartoon-shadow`}
          >
            <div className="mb-8">
              <p
                className={`mb-2 text-sm font-black uppercase ${
                  darkMode ? "text-blue-300" : "text-blue-600"
                }`}
              >
                Community submission
              </p>
              <h1 className="text-4xl font-black md:text-5xl">
                Submit your resource
              </h1>
              <p
                className={`mt-3 max-w-2xl text-base font-semibold ${
                  darkMode ? "text-gray-400" : "text-gray-600"
                }`}
              >
                Share a blog, roadmap, PDF, tool, or useful link. Title, body,
                and tags are required. Files and image links are optional.
              </p>
            </div>

            {loadingUser ? (
              <div className="flex items-center gap-3 font-bold">
                <Loader2 className="h-5 w-5 animate-spin" />
                Checking your account...
              </div>
            ) : !user ? (
              <div
                className={`rounded-2xl border-2 p-5 ${
                  darkMode
                    ? "border-white bg-gray-800"
                    : "border-black bg-yellow-100"
                }`}
              >
                <h2 className="mb-2 text-2xl font-black">Login required</h2>
                <p
                  className={`mb-5 font-semibold ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Please sign in first so the admin can verify who submitted the
                  resource.
                </p>
                <button
                  onClick={handleSignIn}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-green-400 px-5 py-3 font-black text-black cartoon-shadow"
                >
                  <LogIn className="h-5 w-5" />
                  Sign in with Google
                </button>
              </div>
            ) : submitted ? (
              <div
                className={`rounded-2xl border-2 p-6 ${
                  darkMode
                    ? "border-green-400 bg-green-950 text-green-100"
                    : "border-green-700 bg-green-100 text-green-900"
                }`}
              >
                <CheckCircle className="mb-3 h-10 w-10" />
                <h2 className="mb-2 text-2xl font-black">
                  Submitted for verification
                </h2>
                <p className="font-semibold">
                  Your resource is pending admin approval. Once approved, it
                  will appear in the latest community resources section.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => setSubmitted(false)}
                    className="rounded-xl border-2 border-black bg-yellow-300 px-5 py-3 font-black text-black"
                  >
                    Submit another
                  </button>
                  <button
                    onClick={() => router.push("/resources")}
                    className="rounded-xl border-2 border-black bg-blue-400 px-5 py-3 font-black text-black"
                  >
                    View resources
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block font-black">Header / Title *</label>
                  <input
                    name="title"
                    required
                    maxLength={160}
                    placeholder="Example: Best graph practice set for beginners"
                    className={`w-full rounded-xl border-2 px-4 py-3 font-semibold outline-none ${
                      darkMode
                        ? "border-white bg-gray-800 text-white"
                        : "border-black bg-white text-black"
                    }`}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-black">Body *</label>
                  <textarea
                    name="body"
                    required
                    rows={9}
                    placeholder="Explain why this is useful, who should read it, and what students will learn."
                    className={`w-full resize-y rounded-xl border-2 px-4 py-3 font-semibold outline-none ${
                      darkMode
                        ? "border-white bg-gray-800 text-white"
                        : "border-black bg-white text-black"
                    }`}
                  />
                </div>

                <div>
                  <label className="mb-2 block font-black">
                    Tags * <span className="font-semibold">(comma separated)</span>
                  </label>
                  <input
                    name="tags"
                    required
                    placeholder="DSA, graphs, beginner"
                    className={`w-full rounded-xl border-2 px-4 py-3 font-semibold outline-none ${
                      darkMode
                        ? "border-white bg-gray-800 text-white"
                        : "border-black bg-white text-black"
                    }`}
                  />
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block font-black">Type</label>
                    <select
                      name="resourceType"
                      className={`w-full rounded-xl border-2 px-4 py-3 font-semibold outline-none ${
                        darkMode
                          ? "border-white bg-gray-800 text-white"
                          : "border-black bg-white text-black"
                      }`}
                    >
                      {resourceTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block font-black">Category</label>
                    <select
                      name="category"
                      className={`w-full rounded-xl border-2 px-4 py-3 font-semibold outline-none ${
                        darkMode
                          ? "border-white bg-gray-800 text-white"
                          : "border-black bg-white text-black"
                      }`}
                    >
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
                    <label className="mb-2 block font-black">
                      External link
                    </label>
                    <input
                      name="linkUrl"
                      type="url"
                      placeholder="https://..."
                      className={`w-full rounded-xl border-2 px-4 py-3 font-semibold outline-none ${
                        darkMode
                          ? "border-white bg-gray-800 text-white"
                          : "border-black bg-white text-black"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-black">Image link</label>
                    <input
                      name="imageUrl"
                      type="url"
                      placeholder="https://..."
                      className={`w-full rounded-xl border-2 px-4 py-3 font-semibold outline-none ${
                        darkMode
                          ? "border-white bg-gray-800 text-white"
                          : "border-black bg-white text-black"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 font-black">
                    <FileUp className="h-5 w-5" />
                    Optional PDF / image / document
                  </label>
                  <input
                    name="attachment"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.webp,.gif,.txt,.md,.doc,.docx"
                    className={`w-full rounded-xl border-2 px-4 py-3 font-semibold ${
                      darkMode
                        ? "border-white bg-gray-800 text-white"
                        : "border-black bg-white text-black"
                    }`}
                  />
                  <p
                    className={`mt-2 text-sm font-semibold ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Max file size: 8 MB.
                  </p>
                </div>

                {error && (
                  <p className="rounded-xl border-2 border-red-500 bg-red-100 px-4 py-3 font-bold text-red-800">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 rounded-2xl border-4 border-black bg-green-400 px-7 py-4 text-lg font-black text-black cartoon-shadow disabled:opacity-60"
                >
                  {submitting ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                  {submitting ? "Submitting..." : "Submit for verification"}
                </button>
              </form>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
