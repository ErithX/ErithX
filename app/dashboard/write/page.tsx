"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@/app/lib/supabase/client';
import TiptapEditor from '@/components/editor/TiptapEditor';
import TagsInput from '@/components/editor/TagsInput';
import { Circle, X, UploadCloud } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function WritePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaved, setIsSaved] = useState(true);
  const [wordCount, setWordCount] = useState(0);

  // Publish Modal State
  const [showModal, setShowModal] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState('Blogs');
  const [coverUrl, setCoverUrl] = useState('');
  const [modalError, setModalError] = useState('');
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        fetch('/api/documents')
          .then(res => res.json())
          .then(data => {
            if (data._id) {
              setDocumentId(data._id);
              if (data.title) setTitle(data.title);
              if (data.content) setContent(data.content);
            }
            setLoading(false);
          })
          .catch(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  }, []);

  // Simple Word Counter
  useEffect(() => {
    setIsSaved(false);
    const plainText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
    const fullText = (title + ' ' + plainText).trim();
    const count = fullText ? fullText.split(/\s+/).length : 0;
    setWordCount(count);

    if (!documentId) return;

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/documents/${documentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, content, wordCount: count })
        });
        if (res.ok) setIsSaved(true);
      } catch (e) {
        console.error("Auto-save failed", e);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [title, content, documentId]);

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

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentId) return;
    setModalError('');

    // --- Validation Rules ---
    if (!title || title.trim().length < 3) {
      return setModalError("Title must be at least 3 characters long.");
    }
    
    // Quick and dirty way to check real text length vs HTML tags
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    if (textContent.trim().length < 20) {
      return setModalError("Content must be at least 20 characters long.");
    }

    if (category === 'Career' && !coverUrl) {
      return setModalError("A Cover Image is STRICTLY MANDATORY for the 'Career' category.");
    }
    // ------------------------

    setIsPublishing(true);
    try {
      const res = await fetch(`/api/documents/${documentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: 'pending', 
          category, 
          tags,
          coverImage: coverUrl,
          title,
          content,
          wordCount
        })
      });

      if (res.ok) {
        setShowModal(false);
        router.push('/resources');
      } else {
        alert("Failed to submit document");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting document");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        setCoverUrl(data.url);
      }
    } catch (error) {
      console.error("Cover upload failed", error);
    } finally {
      setIsUploadingCover(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-500 font-mono text-sm">
        <span className="animate-pulse">Loading editor...</span>
      </div>
    );
  }

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
          <div className="article-body pb-20">
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
                <div className="relative w-full h-32 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-zinc-500 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all overflow-hidden">
                  <input type="file" accept="image/*" onChange={handleCoverUpload} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                  {isUploadingCover ? (
                    <span className="text-xs font-medium">Uploading...</span>
                  ) : coverUrl ? (
                    <img src={coverUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover opacity-60" />
                  ) : (
                    <>
                      <UploadCloud className="w-6 h-6 mb-2" />
                      <span className="text-xs font-medium">Click to upload cover image</span>
                    </>
                  )}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Category</label>
                <select
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setModalError(''); // Clear error on change
                  }}
                  className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                >
                  <option value="Blogs">Blogs</option>
                  <option value="Study Materials">Study Materials</option>
                  <option value="Career">Career</option>
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">Tags</label>
                <TagsInput tags={tags} setTags={setTags} />
              </div>

              {/* Error Message */}
              {modalError && (
                <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-lg flex items-start gap-2">
                  <span className="font-bold">Error:</span>
                  <span>{modalError}</span>
                </div>
              )}

              {/* Submit Actions */}
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isPublishing} className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                  {isPublishing ? 'Submitting...' : 'Submit for Approval'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
