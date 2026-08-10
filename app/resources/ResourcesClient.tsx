"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Zap, Search, Plus, User, ArrowDown, Upload, 
  LayoutGrid, List, TrendingUp, Award, Trophy,
  Flame, Code, Twitter, Linkedin
} from 'lucide-react';
import BlogsCard, { BlogItem } from '@/components/BlogsCard';
import ResourceCard, { ResourceItem } from '@/components/ResourceCard';
import CreatorPopup from '@/components/CreatorPopup';
import Navbar from '@/components/Navbar';
import ProBadge from '@/components/profile/ProBadge';

export type FeedItem = BlogItem | ResourceItem;

// We will fetch real data from the database now instead of using this mock array.
const FEED_DATA: FeedItem[] = [];

export default function ResourcesClient({ initialItems }: { initialItems: FeedItem[] }) {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [items, setItems] = useState<FeedItem[]>(initialItems);
  const [allItems, setAllItems] = useState<FeedItem[]>(initialItems);

  // The initial items are already passed in from the server, 
  // so we don't need a loading state or a client-side fetch on mount.

  const filterCards = (type: string) => {
    setActiveFilter(type);
    if (type === 'all') {
      setItems(allItems);
    } else if (type === 'pdf') {
      setItems(allItems.filter(d => d.type === 'pdf' || d.type === 'doc' || d.category === 'Study Materials'));
    } else if (type === 'project') {
      setItems(allItems.filter(d => (d as any).type === 'project' || d.category === 'Project Blueprints' || d.category === 'Project Ideas'));
    } else if (type === 'blog') {
      setItems(allItems.filter(d => (d.type === 'blog' || d.category === 'Blogs' || d.category === 'Career') && d.category !== 'Project Blueprints' && d.category !== 'Project Ideas' && d.category !== 'Study Materials'));
    } else {
      setItems(allItems.filter(d => d.type === type || d.category === type));
    }
  };

  const handleItemClick = (item: FeedItem) => {
    router.push(`/resources/${item.id}`);
  };

  return (
    <div className="min-h-screen">
      <CreatorPopup />
      <Navbar />

      {/* HERO SECTION */}
      <section className="pt-28 pb-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse at top, rgba(6,78,59,0.2), #09090b, #09090b)'}}></div>
        <div className="absolute top-20 right-1/4 w-64 h-64 md:w-96 md:h-96 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #10b981, transparent 70%)', filter: 'blur(60px)'}}></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot"></span>
              <span className="text-xs font-medium text-emerald-400">2,000+ learners active now</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4 gradient-text">The Complete Software Engineering & Student Resource Hub</h1>
            <p className="text-sm text-zinc-400 leading-relaxed mb-8 max-w-lg">
              Access our all-in-one tech education platform featuring curated BTech CSE semester notes, engineering PDF downloads, technical blogs, and tech career roadmaps. Curated by verified pros, built for students.
            </p>
            <div className="flex items-center gap-4">
              <a href="#feed" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-zinc-900 text-xs font-medium hover:bg-zinc-200 transition-all">
                Browse All Resources
                <ArrowDown className="w-3.5 h-3.5" />
              </a>
              <button onClick={() => router.push('/dashboard/write')} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-white/10 text-zinc-300 text-xs font-medium hover:bg-white/5 transition-all">
                <Upload className="w-3.5 h-3.5" />
                Contribute
              </button>
            </div>
          </div>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            <div className="glass rounded-lg p-4">
              <div className="text-2xl font-semibold">{allItems.length}</div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Resources Shared</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-2xl font-semibold text-emerald-400">
                {new Set(allItems.map(i => i.author)).size}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Contributors</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-2xl font-semibold">
                {allItems.reduce((sum, item) => sum + (item.views || 0), 0)}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Total Views</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-2xl font-semibold text-cyan-400">
                {allItems.filter(i => i.time.includes('h ago') || (i.time.includes('d ago') && parseInt(i.time) <= 7)).length}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">New This Week</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEED SECTION */}
      <section id="feed" className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          {/* Filters */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <button 
                className={`filter-btn px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 border border-transparent hover:text-white transition-all ${activeFilter === 'all' ? 'active bg-white/10 text-white' : ''}`}
                onClick={() => filterCards('all')}
              >
                All
              </button>
              <button 
                className={`filter-btn px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 border border-transparent hover:text-white transition-all flex items-center gap-1.5 ${activeFilter === 'blog' ? 'active bg-white/10 text-white' : ''}`}
                onClick={() => filterCards('blog')}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Blogs
              </button>
              <button 
                className={`filter-btn px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 border border-transparent hover:text-white transition-all flex items-center gap-1.5 ${activeFilter === 'pdf' ? 'active bg-white/10 text-white' : ''}`}
                onClick={() => filterCards('pdf')}
              >
                <span className="w-2 h-2 rounded-full bg-orange-500"></span> Notes & PDFs
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded hover:bg-white/5 transition-colors text-zinc-500 hover:text-white" title="Grid view">
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded hover:bg-white/5 transition-colors text-zinc-500 hover:text-white" title="List view">
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex gap-6">
            {/* Masonry Feed */}
            <div className="flex-1 min-w-0">
              {items.length === 0 ? (
                <div className="py-16 px-6 text-center rounded-2xl glass border border-white/5 border-dashed">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto mb-3">
                    <Code className="w-6 h-6" />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">
                    {activeFilter === 'project' ? 'No Project Ideas yet' : 'No resources found'}
                  </h3>
                  <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-4">
                    {activeFilter === 'project' 
                      ? 'High-signal system design blueprints & real-world engineering project ideas are being curated.'
                      : 'Try selecting a different filter above.'}
                  </p>
                  <button onClick={() => router.push('/dashboard/write')} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-300 hover:text-white transition-all">
                    Contribute an Idea
                  </button>
                </div>
              ) : (
                <div className="masonry" id="feedGrid">
                  {items.map((item, i) => {
                    if (item.type === 'blog' || (item as any).type === 'project') {
                      return <BlogsCard key={item.id} item={item as BlogItem} index={i} onClick={handleItemClick} />;
                    } else {
                      return <ResourceCard key={item.id} item={item as ResourceItem} index={i} onClick={handleItemClick} />;
                    }
                  })}
                </div>
              )}
            </div>


            {/* Sidebar */}
            <div className="hidden lg:block w-72 flex-shrink-0 space-y-6">
              {/* Trending Tags */}
              <div className="glass rounded-xl p-5">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5" /> Trending Tech Categories
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const tagCounts: Record<string, number> = {};
                    allItems.forEach(item => {
                      (item.tags || []).forEach(tag => {
                        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
                      });
                    });
                    const topTags = Object.entries(tagCounts)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 8)
                      .map(entry => entry[0]);
                    
                    if (topTags.length === 0) return <div className="text-xs text-zinc-500">No tags yet</div>;
                    
                    return topTags.map(tag => (
                      <span key={tag} className="px-2 py-1 rounded text-[10px] font-medium bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer" onClick={() => {}}>
                        #{tag}
                      </span>
                    ));
                  })()}
                </div>
              </div>

              {/* Top Contributors */}
              <div className="glass rounded-xl p-5">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                  <Award className="w-3.5 h-3.5" /> Top Contributors
                </h3>
                <div className="space-y-4">
                  {(() => {
                    // Note for Developer: In backend, fetch actual User documents so we have bio, twitterUrl, linkedinUrl, isPro, isVerified.
                    const authorCounts: Record<string, { count: number, isPro: boolean, name: string, bio: string, twitter: string, linkedin: string, isVerified: boolean, authorImg: string }> = {};
                    allItems.forEach(item => {
                      if (!authorCounts[item.author]) {
                        authorCounts[item.author] = { 
                          count: 0, 
                          isPro: item.isPro || false, 
                          name: item.author,
                          bio: "Passionate developer sharing resources.", // Fallback dummy bio
                          twitter: "#",
                          linkedin: "#",
                          isVerified: item.isVerified || false,
                          authorImg: item.authorImg || ''
                        };
                      }
                      authorCounts[item.author].count += 1;
                    });
                    
                    const topAuthors = Object.values(authorCounts)
                      .sort((a, b) => b.count - a.count)
                      .slice(0, 3);
                      
                    if (topAuthors.length === 0) return <div className="text-xs text-zinc-500">No contributors yet</div>;
                    
                    return topAuthors.map((author, idx) => (
                      <div key={idx} className="flex gap-3 pb-4 border-b border-white/5 last:border-0 last:pb-0">
                        <div className={`w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center font-bold text-xs shrink-0 mt-1 overflow-hidden`}>
                          {author.authorImg ? (
                            <img src={author.authorImg} alt={author.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className={idx === 0 ? 'text-emerald-400' : 'text-cyan-400'}>{author.name.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold truncate flex items-center gap-1.5">
                            {author.name} 
                            {author.isVerified && <img src="/VerifiedBadge.svg" alt="Verified" className="w-3.5 h-3.5 inline-block" />}
                            {author.isPro && !author.isVerified && <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded font-bold">PRO</span>}
                          </div>
                          <div className="text-[10px] text-zinc-400 mb-1">{author.count} resources shared</div>
                          <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-2">
                            {/* Will be author.bio from DB */}
                            {author.bio}
                          </p>
                          <div className="flex items-center gap-2">
                            <a href={author.twitter} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                              <Twitter className="w-3.5 h-3.5" />
                            </a>
                            <a href={author.linkedin} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors">
                              <Linkedin className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
