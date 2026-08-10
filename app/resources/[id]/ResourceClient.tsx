"use client";

import React, { useEffect, useState } from 'react';
import { 
  Zap, ChevronRight, Bookmark, Share2, Type, 
  FileText, Clock, ArrowUp, MessageSquare, Download,
  Lightbulb, Info, AlertTriangle, Target, User, Twitter,
  Github, Linkedin, Eye
} from 'lucide-react';
import { createClient } from '@/app/lib/supabase/client';
import { useAuthStore } from '@/store/authStore';
import TiptapEditor from '@/components/editor/TiptapEditor';
import RelatedResources from '@/components/RelatedResources';

export default function ResourceClient({ 
  initialDoc, 
  initialComments,
  resourceId 
}: { 
  initialDoc: any, 
  initialComments: any[],
  resourceId: string 
}) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [fontSize, setFontSize] = useState('medium');
  const [isUpvoted, setIsUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState<number>(initialDoc?.upvotes || 0);
  const [toasts, setToasts] = useState<{ id: number, message: string, type: string }[]>([]);
  
  const [doc, setDoc] = useState<any>(initialDoc);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(initialDoc ? '' : 'Resource not found');
  
  const { user } = useAuthStore();
  const [comments, setComments] = useState<any[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const supabase = createClient();

  // Initialize upvote state if user is logged in
  useEffect(() => {
    if (user && doc?.upvotedBy?.includes(user.id)) {
      setIsUpvoted(true);
    } else {
      setIsUpvoted(false);
    }
  }, [user, doc]);

  useEffect(() => {
    if (!doc) return;
    
    // Real Views tracking (once per user/session per 24 hours)
    const actualDocId = doc._id;
    const viewKey = `viewed_${actualDocId}`;
    const lastViewed = localStorage.getItem(viewKey);
    const now = Date.now();
    const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
    
    if (!lastViewed || (now - parseInt(lastViewed, 10)) > TWENTY_FOUR_HOURS) {
      fetch(`/api/resources/${actualDocId}/view`, { method: 'POST' }).catch(console.error);
      localStorage.setItem(viewKey, now.toString());
    }

    const handleScroll = () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [doc]);

  const [toc, setToc] = useState<{ id: string, text: string, level: number }[]>([]);
  const [activeSection, setActiveSection] = useState('');
  const [cleanContent, setCleanContent] = useState('');
  const [extractedPdfs, setExtractedPdfs] = useState<{src: string, filename: string}[]>([]);

  useEffect(() => {
    if (!doc?.content) return;
    
    // 1. EXTRACT PDFs
    const parser = new DOMParser();
    const parsedDoc = parser.parseFromString(doc.content, 'text/html');
    const pdfNodes = Array.from(parsedDoc.querySelectorAll('div[data-type="pdf-block"]'));
    
    const pdfs = pdfNodes.map(node => ({
      src: node.getAttribute('src') || '',
      filename: node.getAttribute('filename') || 'document.pdf'
    }));
    setExtractedPdfs(pdfs);
    
    // Remove PDFs from content so they don't render inside Tiptap
    pdfNodes.forEach(node => node.remove());
    setCleanContent(parsedDoc.body.innerHTML);

    // 2. TOC EXTRACTION (Polling to wait for Tiptap DOM)
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const articleBody = document.querySelector('.article-body');
      if (articleBody) {
        const headings = Array.from(articleBody.querySelectorAll('h2, h3'));
        if (headings.length > 0) {
          const newToc = headings.map((heading: any) => {
            if (!heading.id) {
              heading.id = heading.innerText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            }
            return {
              id: heading.id,
              text: heading.innerText,
              level: parseInt(heading.tagName.substring(1), 10)
            };
          });
          setToc(newToc);
          clearInterval(interval);
          return;
        }
      }
      if (attempts > 30) clearInterval(interval); // Give up after 3 seconds
    }, 100);

    return () => clearInterval(interval);
  }, [doc?.content]);

  useEffect(() => {
    if (toc.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -80% 0px' }
    );
    
    toc.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, [toc]);

  const showToast = (message: string, type: string = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleUpvote = async () => {
    if (!user) {
      showToast('Please login to upvote! 🔒', 'error');
      return;
    }
    
    // Optimistic UI update
    const previousState = isUpvoted;
    const previousCount = upvoteCount;
    
    setIsUpvoted(!isUpvoted);
    setUpvoteCount(prev => isUpvoted ? prev - 1 : prev + 1);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const actualDocId = doc?._id || resourceId;
      const res = await fetch(`/api/resources/${actualDocId}/upvote`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`
        }
      });
      
      if (!res.ok) throw new Error();
      if (!isUpvoted) showToast('Upvoted! 🚀', 'success');
    } catch (e) {
      // Revert on error
      setIsUpvoted(previousState);
      setUpvoteCount(previousCount);
      showToast('Failed to upvote', 'error');
    }
  };

  const handleSubmitComment = async () => {
    if (!user) {
      showToast('Please login to comment! 🔒', 'error');
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const actualDocId = doc?._id || resourceId;
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token}`
        },
        body: JSON.stringify({ resourceId: actualDocId, content: newComment })
      });

      if (res.ok) {
        const comment = await res.json();
        setComments(prev => [comment, ...prev]);
        setNewComment('');
        showToast('Comment posted! 💬', 'success');
        // Update local doc state for comment count
        setDoc((prev: any) => ({...prev, commentsCount: (prev.commentsCount || 0) + 1}));
      } else {
        throw new Error();
      }
    } catch (e) {
      showToast('Failed to post comment', 'error');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: doc?.title || 'DSA Quest Resource',
      text: 'Check out this awesome resource on DSA Quest!',
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        showToast('Shared successfully! 🔗', 'success');
      } catch (err) {
        console.log('User cancelled share or error occurred');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard! 🔗', 'success');
    }
  };

  const toggleFont = () => {
    setFontSize(prev => {
      if (prev === 'medium') return 'large';
      if (prev === 'large') return 'small';
      return 'medium';
    });
  };

  const getFontSizeClass = () => {
    if (fontSize === 'small') return 'text-[15px]';
    if (fontSize === 'large') return 'text-[19px]';
    return 'text-[17px]'; // medium
  };

  const getFontLabel = () => {
    if (fontSize === 'small') return 'aa';
    if (fontSize === 'large') return 'AA';
    return 'Aa';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-zinc-500">
        <span className="animate-pulse font-mono text-sm">Loading resource...</span>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-white">
        <AlertTriangle className="w-12 h-12 text-rose-500 mb-4 opacity-80" />
        <h2 className="text-xl font-bold mb-2">Resource Not Found</h2>
        <p className="text-sm text-zinc-400 mb-6">The resource you're looking for doesn't exist or isn't published yet.</p>
        <a href="/resources" className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors">Go Back to Feed</a>
      </div>
    );
  }

  // Calculate read time
  const readTimeStr = `${Math.max(1, Math.ceil((doc.wordCount || 0) / 200))} min read`;

  return (
    <div className="min-h-screen">
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
        {toasts.map(toast => (
          <div key={toast.id} className="toast flex items-center gap-2.5 px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl">
            {toast.type === 'success' ? (
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              </div>
            ) : (
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-cyan-500"></div>
              </div>
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        ))}
      </div>

      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] z-[60] bg-transparent">
        <div className="h-full bg-emerald-500 transition-all duration-75" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#09090b]/90 backdrop-blur-[12px]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/resources" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-400" />
              </div>
              <span className="font-semibold text-sm tracking-tight hidden sm:inline">DSA Quest</span>
            </a>
            <div className="hidden md:flex items-center gap-1 text-xs text-zinc-600">
              <ChevronRight className="w-3 h-3" />
              <a href="/resources" className="hover:text-zinc-400 transition-colors">Resources</a>
              <ChevronRight className="w-3 h-3" />
              <span className="text-zinc-400 truncate max-w-[200px] capitalize">{doc.category || 'Article'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => showToast('Bookmark saved! 📌', 'success')} className="p-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-white" title="Bookmark">
              <Bookmark className="w-4 h-4" />
            </button>
            <button onClick={handleShare} className="p-2 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-white" title="Share">
              <Share2 className="w-4 h-4" />
            </button>
            <button onClick={toggleFont} className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-zinc-400 hover:text-white text-xs" title="Toggle font size">
              <Type className="w-3.5 h-3.5" />
              <span>{getFontLabel()}</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <div className="pt-14 flex flex-col lg:flex-row max-w-7xl mx-auto">
        {/* LEFT: Table of Contents */}
        <aside className="hidden xl:block w-56 flex-shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto py-8 pl-6">
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3 px-3">On this page</div>
          <nav className="space-y-0.5 text-[13px]">
            {toc.length > 0 ? toc.map((item) => (
              <a 
                key={item.id}
                href={`#${item.id}`} 
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`toc-link block px-3 py-1.5 rounded-r-md transition-colors ${activeSection === item.id ? 'bg-white/10 text-white font-medium border-l-2 border-emerald-500 -ml-[2px]' : 'text-zinc-500 hover:text-white hover:bg-white/5'} ${item.level === 3 ? 'pl-6' : ''}`}
              >
                {item.text}
              </a>
            )) : (
              <div className="text-zinc-600 px-3 py-2 italic text-xs">No sections found</div>
            )}
          </nav>
        </aside>

        {/* CENTER: Article */}
        <main className="flex-1 min-w-0">
          <article className="max-w-3xl mx-auto px-6 py-12">
            {/* Type badge + meta */}
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 ${doc.category === 'Study Materials' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                <FileText className="w-3 h-3" /> {doc.category}
              </span>
              <span className="text-[10px] text-zinc-600">•</span>
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Eye className="w-3 h-3" /> {doc.views || 0} views
              </span>

              <span className="text-[10px] text-zinc-600">•</span>
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {readTimeStr}
              </span>
              <span className="text-[10px] text-zinc-600">•</span>
              <span className="text-xs text-zinc-500">{new Date(doc.createdAt).toLocaleDateString()}</span>
            </div>

            <h1 className={`text-3xl md:text-4xl font-semibold tracking-tight leading-[1.15] ${doc.subtitle ? 'mb-3' : 'mb-8'}`}>
              {doc.title}
            </h1>

            {doc.subtitle && (
              <h2 className="text-lg md:text-xl font-medium tracking-tight text-zinc-400 mb-8 leading-relaxed">
                {doc.subtitle}
              </h2>
            )}

            {/* Author + Actions row */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-white/5 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-lg overflow-hidden shrink-0">
                  {doc.authorImg && doc.authorImg.startsWith('http') ? (
                    <img 
                      src={doc.authorImg} 
                      alt="Author" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(doc.authorName || 'Author')}`;
                      }}
                    />
                  ) : (
                    (doc.authorName || 'Anonymous').charAt(0).toUpperCase()
                  )}
                </div>

                <div>
                  <div className="text-sm font-medium flex items-center gap-1.5">
                    {doc.authorName || 'Anonymous'}
                    {doc.isVerified && <img src="/VerifiedBadge.svg" alt="Verified" className="w-3.5 h-3.5 inline-block" />}
                    {doc.isPro && !doc.isVerified && (
                      <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">PRO</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleUpvote} 
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs transition-all ${isUpvoted ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'}`}
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                  <span>{upvoteCount}</span>
                </button>
                <button onClick={() => showToast('Saved to bookmarks! 📌', 'success')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-zinc-400 hover:bg-white/10 transition-all">
                  <Bookmark className="w-3.5 h-3.5" /> Save
                </button>
                <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-zinc-400 hover:bg-white/10 transition-all">
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>



            {/* Project Blueprints Aspirational Banner */}
            {doc.category === 'Project Blueprints' && doc.projectMeta?.targetCompanies?.length > 0 && (
              <div className="mb-10 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-md flex items-start gap-4 shadow-[0_0_30px_rgba(16,185,129,0.05)]">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 border border-emerald-500/30">
                  <Target className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-emerald-400 font-bold mb-1 tracking-wide">ARCHITECTURE BLUEPRINT</h3>
                  <p className="text-sm text-zinc-300 leading-relaxed">
                    Mastering this design pattern prepares you for the engineering bar at{' '}
                    {doc.projectMeta.targetCompanies.map((company: string, i: number, arr: any[]) => (
                      <span key={company}>
                        <strong className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{company}</strong>
                        {i < arr.length - 2 ? ', ' : i === arr.length - 2 ? ' and ' : ''}
                      </span>
                    ))}.
                  </p>
                </div>
              </div>
            )}

            {/* Tags */}
            {doc.tags && doc.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-10">
                {doc.tags.map((tag: string) => (
                  <span key={tag} className="px-2 py-1 rounded text-[10px] bg-white/5 text-zinc-400 border border-white/5">#{tag}</span>
                ))}
              </div>
            )}

            {/* EXTRACTED PDF BLOCKS */}
            {extractedPdfs.map((pdf, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-xl border mb-8 flex-wrap gap-4 ${doc.category === 'Project Blueprints' ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.05)]' : 'bg-orange-500/5 border-orange-500/10'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-12 rounded-lg border flex items-center justify-center flex-shrink-0 ${doc.category === 'Project Blueprints' ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-orange-500/10 border-orange-500/20'}`}>
                    <FileText className={`w-5 h-5 ${doc.category === 'Project Blueprints' ? 'text-emerald-400' : 'text-orange-400'}`} />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{pdf.filename}</div>
                    <div className="text-xs text-zinc-500">
                      {doc.category === 'Project Blueprints' ? 'Project Blueprint (PDF)' : 'PDF Document'}
                    </div>
                  </div>
                </div>
                <a 
                  href={pdf.src}
                  download={pdf.filename}
                  target="_blank"
                  onClick={() => {
                    try {
                      fetch('/api/analytics/track', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                          type: 'pdf_download', 
                          resourceId: doc._id,
                          platform: doc.category,
                          title: doc.title || ''
                        })

                      }).catch(() => {});
                    } catch (e) {}
                  }}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-xs font-medium transition-all ${doc.category === 'Project Blueprints' ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20'}`}
                >
                  <Download className="w-3.5 h-3.5" /> 
                  {doc.category === 'Project Blueprints' ? 'Download Blueprint' : 'Download'}
                </a>

              </div>
            ))}

            {/* ARTICLE BODY */}
            <div className={`article-body tiptap ${getFontSizeClass()} mt-8`}>
              <TiptapEditor content={cleanContent || doc.content} readOnly />
            </div>
            {/* Author Card */}
            <div className="mt-14 p-6 rounded-2xl glass flex items-start gap-4 flex-wrap">
              <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-2xl overflow-hidden shrink-0">
                {doc.authorImg && doc.authorImg.startsWith('http') ? (
                  <img 
                    src={doc.authorImg} 
                    alt="Author" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(doc.authorName || 'Author')}`;
                    }}
                  />
                ) : (
                  (doc.authorName || 'Anonymous').charAt(0).toUpperCase()
                )}

              </div>
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{doc.authorName || 'Anonymous'}</span>
                  {doc.isVerified && <img src="/VerifiedBadge.svg" alt="Verified" className="w-4 h-4 inline-block" />}
                  {doc.isPro && !doc.isVerified && (
                    <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">PRO</span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mb-3">{doc.authorEmail} • Contributor</p>
                <div className="flex items-center gap-3">
                  <button className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
                    <Twitter className="w-3 h-3" /> Follow
                  </button>
                  <span className="text-zinc-700">•</span>
                  <span className="text-xs text-zinc-500">47 resources published</span>
                </div>
              </div>
            </div>

            {/* Engagement Bar */}
            <div className="mt-10 flex items-center justify-between py-6 border-t border-b border-white/5 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <button 
                  onClick={handleUpvote} 
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-all ${isUpvoted ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/5 text-zinc-400 hover:bg-white/10'}`}
                >
                  <ArrowUp className="w-4 h-4" />
                  <span>{upvoteCount}</span>
                  <span className="hidden sm:inline">Upvotes</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm text-zinc-400 hover:bg-white/10 transition-all">
                  <MessageSquare className="w-4 h-4" />
                  {doc.commentsCount || 0} Comments
                </button>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => showToast('Saved to bookmarks! 📌', 'success')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm text-zinc-400 hover:bg-white/10 transition-all">
                  <Bookmark className="w-4 h-4" /> Save
                </button>
                <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-sm text-zinc-400 hover:bg-white/10 transition-all">
                  <Share2 className="w-4 h-4" /> Share
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-10">
              <h3 className="text-lg font-medium mb-6">Discussion ({doc.commentsCount || 0})</h3>
              <div className="flex items-start gap-3 mb-8">
                <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {user ? (
                    user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="You" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-sm font-bold text-emerald-400">{(user.user_metadata?.full_name || 'U').charAt(0)}</span>
                    )
                  ) : (
                    <User className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
                <div className="flex-1">
                  <textarea 
                    rows={3} 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder={user ? "Share your thoughts..." : "Login to share your thoughts..."} 
                    disabled={!user || isSubmittingComment}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-zinc-300 placeholder:text-zinc-600 outline-none focus:border-emerald-500/30 transition-colors resize-none leading-relaxed disabled:opacity-50"
                  />
                  <div className="flex justify-end mt-2">
                    <button 
                      onClick={handleSubmitComment} 
                      disabled={!user || isSubmittingComment || !newComment.trim()}
                      className="px-4 py-1.5 rounded-lg bg-white text-zinc-900 text-xs font-medium hover:bg-zinc-200 transition-all disabled:opacity-50"
                    >
                      {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <p className="text-zinc-500 text-sm italic text-center py-4">No comments yet. Be the first to start the discussion!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {comment.authorImg ? (
                          <img 
                            src={comment.authorImg} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                            alt={comment.authorName} 
                            onError={(e) => {
                              e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(comment.authorName || 'User')}`;
                            }}
                          />
                        ) : (
                          <span className="text-sm font-bold text-emerald-400">{comment.authorName.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium">{comment.authorName}</span>
                          <span className="text-[10px] text-zinc-600">
                            {new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <button className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1">
                            <ArrowUp className="w-3 h-3" />{comment.upvotes || 0}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </article>
        </main>

        {/* RIGHT: Recommendations */}
        <aside className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-14 lg:h-[calc(100vh-56px)] lg:overflow-y-auto py-8 px-6 lg:pl-0 lg:pr-6">
          <div className="glass rounded-xl p-4 mb-5">
            <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3">Resource Info</div>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Type</span>
                <span className="text-xs text-orange-400 font-medium">{doc.category}</span>
              </div>
              {doc.category === 'Study Materials' && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Read Time</span>
                  <span className="text-xs text-zinc-300">{readTimeStr}</span>
                </div>
              )}
              {doc.category !== 'Study Materials' && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Read Time</span>
                  <span className="text-xs text-zinc-300">{readTimeStr}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Published</span>
                <span className="text-xs text-zinc-300">{new Date(doc.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500">Views</span>
                <span className="text-xs text-zinc-300">{doc.views || 0}</span>
              </div>


            </div>
          </div>

          <RelatedResources currentDocId={doc._id} currentTags={doc.tags || []} />

          {/* Tags */}
          {doc.tags && doc.tags.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3 px-1">Tags</div>
              <div className="flex flex-wrap gap-1.5">
                {doc.tags.map((tag: string) => (
                  <a href="#" key={tag} className="px-2 py-1 rounded text-[10px] bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">#{tag}</a>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center">
              <Zap className="w-3 h-3 text-emerald-400" />
            </div>
            <span className="text-[10px] text-zinc-600">© 2025 DSA Quest. Built for students, backed by pros.</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors"><Github className="w-4 h-4" /></a>
            <a href="#" className="text-zinc-600 hover:text-zinc-400 transition-colors"><Linkedin className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
