"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/app/lib/supabase/client';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { Circle, X, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WritePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaved, setIsSaved] = useState(true);
  const [wordCount, setWordCount] = useState(0);

  // Publish Modal State
  const [showModal, setShowModal] = useState(false);
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('blog');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  // Simple Word Counter
  useEffect(() => {
    setIsSaved(false);
    const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const fullText = (title + ' ' + plainText).trim();
    const count = fullText ? fullText.split(/\s+/).length : 0;
    setWordCount(count);

    // Mock auto-save
    const timer = setTimeout(() => {
      setIsSaved(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [title, content]);

  // Ctrl + Enter to Submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        setShowModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Published Successfully!\nCategory: ${category}\nTags: ${tags}`);
    setShowModal(false);
    router.push('/resources');
  };

  return (
    <div className="min-h-screen relative selection:bg-emerald-800 selection:text-white">
      {/* Ambient Background Elements */}
      <div className="grid-texture" />
      <div className="ambient-glow" />

      {/* Editor Container */}
      <main className="relative z-10 min-h-screen flex flex-col items-center px-6 py-20">

        {/* The Writing Canvas */}
        <div className="editor-container group w-full max-w-2xl bg-transparent rounded-2xl">

          {/* Document Type Tag & Status */}
          <div className="mb-12 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs text-zinc-600 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-emerald-500/50"></span>
              <span>document.dsa</span>
              <span className="text-zinc-700">·</span>
              <span>draft</span>
            </div>

            {/* Submit Button */}
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-1.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider opacity-30 hover:opacity-100 group-focus-within:opacity-100 transition-all cursor-pointer"
            >
              Submit
            </button>
          </div>

          {/* Title Area */}
          <input
            type="text"
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="editor-title-input w-full bg-transparent text-4xl md:text-5xl font-bold tracking-tighter text-white border-none focus:outline-none focus:ring-0 mb-6 px-0"
          />

          {/* Body Content Area (Tiptap Editor) */}
          <div className="editor-content pb-20">
            <TiptapEditor content={content} onChange={setContent} />
          </div>

        </div>
      </main>

      {/* Floating Meta Info */}
      <div className="fixed bottom-6 right-6 font-mono text-[10px] uppercase tracking-widest text-white-500 opacity-50 flex flex-col items-end gap-1.5 pointer-events-none z-50 transition-opacity hover:opacity-100">
        <div className="flex items-center gap-1.5">
          <Circle className={`w-1.5 h-1.5 ${isSaved ? 'fill-emerald-500 text-emerald-500' : 'fill-amber-500 text-amber-500'}`} />
          {isSaved ? 'Saved' : 'Saving...'}
        </div>
        <div>{wordCount} Words</div>
        <div>Press Ctrl + Enter to submit</div>
      </div>

      {/* Publish Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />

          <div className="relative w-full max-w-md bg-[#18181b] border border-white/10 rounded-2xl shadow-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Final Review & Publish</h2>
              <button onClick={() => setShowModal(false)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFinalSubmit} className="space-y-5">
              {/* Cover Image */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Cover Image</label>
                <div className="w-full h-32 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-zinc-500 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer">
                  <UploadCloud className="w-6 h-6 mb-2" />
                  <span className="text-xs font-medium">Click to upload cover image</span>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="blog">Blog Post</option>
                  <option value="notes">Study Notes / PDF</option>
                  <option value="diagram">Diagram / Flowchart</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="e.g. dp, graph, google-interview"
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              {/* Submit Action */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                >
                  Publish Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
