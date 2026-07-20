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

export default function ResourcesPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [items, setItems] = useState<FeedItem[]>([]);
  const [allItems, setAllItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch('/api/resources');
        const data = await res.json();
        
        const formattedData: FeedItem[] = data.map((doc: any) => {
          // Calculate human readable time (e.g. 2h ago)
          const diffMs = Date.now() - new Date(doc.createdAt).getTime();
          const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
          const timeStr = diffHrs < 24 ? `${diffHrs}h ago` : `${Math.floor(diffHrs/24)}d ago`;
          
          // Clean HTML tags for excerpt
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = doc.content || '';
          const cleanText = tempDiv.textContent || tempDiv.innerText || "";
          const excerpt = cleanText.substring(0, 150) + (cleanText.length > 150 ? '...' : '');

          const readTimeStr = `${Math.max(1, Math.ceil((doc.wordCount || 0) / 200))} min read`;

          // Determine card type based on category
          let type: any = 'blog';
          if (doc.category === 'Study Materials') type = 'pdf';
          if (doc.category === 'Career') type = 'blog';
          
          // Base structure
          const baseItem = {
            id: doc.slug || doc._id,
            title: doc.title || 'Untitled',
            excerpt,
            author: doc.authorName || 'Anonymous',
            authorImg: doc.authorImg || 'pro1', // Uses our schema default
            isPro: doc.isPro || false, // User requested to keep this field
            isVerified: doc.isVerified || false,
            tags: doc.tags || [],
            upvotes: doc.upvotes || 0,
            comments: doc.commentsCount || 0,
            views: doc.views || 0,
            time: timeStr
          };

          if (type === 'blog') {
            return { ...baseItem, type: 'blog', readTime: readTimeStr, coverImg: doc.coverImage } as BlogItem;
          } else {
            return { 
              ...baseItem, 
              type: 'pdf', 
              coverImg: doc.coverImage, 
              size: readTimeStr // Displaying read time in place of PDF size
            } as ResourceItem;
          }
        });

        setAllItems(formattedData);
        setItems(formattedData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const filterCards = (type: string) => {
    setActiveFilter(type);
    if (type === 'all') {
      setItems(allItems);
    } else {
      setItems(allItems.filter(d => d.type === type));
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
            <h1 className="text-4xl md:text-5xl font-medium tracking-tighter mb-4 gradient-text">The Complete Student Ecosystem</h1>
            <p className="text-sm text-zinc-400 leading-relaxed mb-8 max-w-lg">
              Curated resources by verified industry professionals. Share study materials, blogs, diagrams, and links — all in one place. Built for students, backed by pros.
            </p>
            <div className="flex items-center gap-4">
              <a href="#feed" className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-zinc-900 text-xs font-medium hover:bg-zinc-200 transition-all">
                Explore Feed
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
                <span className="w-2 h-2 rounded-full bg-orange-500"></span> PDFs
              </button>
              <button 
                className={`filter-btn px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 border border-transparent hover:text-white transition-all flex items-center gap-1.5 ${activeFilter === 'link' ? 'active bg-white/10 text-white' : ''}`}
                onClick={() => filterCards('link')}
              >
                <span className="w-2 h-2 rounded-full bg-cyan-500"></span> Links
              </button>
              <button 
                className={`filter-btn px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 border border-transparent hover:text-white transition-all flex items-center gap-1.5 ${activeFilter === 'image' ? 'active bg-white/10 text-white' : ''}`}
                onClick={() => filterCards('image')}
              >
                <span className="w-2 h-2 rounded-full bg-purple-500"></span> Images
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
              <div className="masonry" id="feedGrid">
                {items.map((item, i) => {
                  if (item.type === 'blog') {
                    return <BlogsCard key={item.id} item={item as BlogItem} index={i} onClick={handleItemClick} />;
                  } else {
                    return <ResourceCard key={item.id} item={item as ResourceItem} index={i} onClick={handleItemClick} />;
                  }
                })}
              </div>
            </div>

            {/* Sidebar */}
            <div className="hidden lg:block w-72 flex-shrink-0 space-y-6">
              {/* Trending Tags */}
              <div className="glass rounded-xl p-5">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5" /> Trending Tags
                </h3>
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
