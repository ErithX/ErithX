"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Zap, Search, Plus, User, ArrowDown, Upload, 
  LayoutGrid, List, TrendingUp, Award, Trophy,
  PenLine, FileText, Link as LinkIcon, Image as ImageIcon,
  Flame, Code, Twitter, Github, Linkedin
} from 'lucide-react';
import BlogsCard, { BlogItem } from '@/components/BlogsCard';
import ResourceCard, { ResourceItem } from '@/components/ResourceCard';

type FeedItem = BlogItem | ResourceItem;

const FEED_DATA: FeedItem[] = [
  {
    id: 1, type: 'blog', title: 'The Evolution of DSA Quest: The Ultimate All-in-One Tech Starter Pack',
    excerpt: 'Every computer science student shares the same daily headache. On any given weekend, there is a major coding contest on one site...',
    fullContent: `<p>Every computer science student and aspiring developer shares the same daily headache...</p>`,
    author: 'DSA Quest Team', authorImg: 'team1', isPro: true,
    tags: ['community', 'vision'], upvotes: 342, comments: 47, time: '2h ago',
    readTime: '5 min read'
  },
  {
    id: 2, type: 'pdf', title: 'Mastering Dynamic Programming: A Visual Guide',
    excerpt: 'Complete DP cheat sheet covering all major patterns — from Fibonacci to Matrix Chain Multiplication with state transition diagrams.',
    author: 'Priya Sharma', authorImg: 'pro1', isPro: true,
    tags: ['dp', 'cheatsheet', 'interview-prep'], upvotes: 521, comments: 89, time: '5h ago',
    pages: 42, size: '3.8 MB', coverImg: 'dp-cheatsheet'
  },
  {
    id: 3, type: 'image', title: 'Binary Search Tree — Complete Traversal Flowchart',
    excerpt: 'A comprehensive flowchart showing Inorder, Preorder, Postorder, and Level-order traversals with decision points.',
    author: 'Rahul Verma', authorImg: 'pro2', isPro: true,
    tags: ['bst', 'trees', 'flowchart'], upvotes: 287, comments: 23, time: '8h ago',
    imageSrc: 'bst-flowchart'
  },
  {
    id: 4, type: 'link', title: 'NeetCode 150 — The Ultimate Blind 75 Expansion',
    excerpt: 'NeetCode\'s expanded list of 150 LeetCode problems organized by pattern. The gold standard for interview preparation.',
    author: 'Ankit Gupta', authorImg: 'pro3', isPro: false,
    tags: ['leetcode', 'neetcode', 'interview-prep'], upvotes: 198, comments: 31, time: '12h ago',
    url: 'neetcode.io', favicon: 'neetcode'
  },
  {
    id: 5, type: 'blog', title: 'How I Cracked Google SDE Interview: A Real Experience',
    excerpt: 'From online assessment to onsite rounds — here\'s everything that was asked, how I prepared, and what I wish I knew earlier. Includes my exact 3-month study plan.',
    author: 'Sarah Chen', authorImg: 'pro4', isPro: true,
    tags: ['google', 'interview', 'sde'], upvotes: 891, comments: 156, time: '1d ago',
    readTime: '12 min read'
  },
  {
    id: 6, type: 'pdf', title: 'System Design Primer: Distributed Systems Notes',
    excerpt: 'Comprehensive notes covering load balancing, caching, database sharding, message queues, and microservices architecture.',
    author: 'Rahul Verma', authorImg: 'pro2', isPro: true,
    tags: ['system-design', 'distributed'], upvotes: 445, comments: 67, time: '1d ago',
    pages: 78, size: '7.2 MB', coverImg: 'sys-design'
  },
  {
    id: 7, type: 'image', title: 'Sorting Algorithms Comparison Chart',
    excerpt: 'Visual comparison of all major sorting algorithms — time complexity, space complexity, stability, and when to use which.',
    author: 'Meera Patel', authorImg: 'user1', isPro: false,
    tags: ['sorting', 'algorithms', 'comparison'], upvotes: 334, comments: 18, time: '2d ago',
    imageSrc: 'sorting-compare'
  },
  {
    id: 8, type: 'link', title: 'Visualgo — Algorithm Visualization Tool',
    excerpt: 'Interactive visualization of data structures and algorithms. Perfect for understanding how BFS, DFS, Dijkstra and others actually work step by step.',
    author: 'Priya Sharma', authorImg: 'pro1', isPro: true,
    tags: ['visualization', 'tools', 'learning'], upvotes: 267, comments: 12, time: '2d ago',
    url: 'visualgo.net', favicon: 'visualgo'
  },
  {
    id: 9, type: 'blog', title: 'Why Graph Problems Terrify Beginners (And Shouldn\'t)',
    excerpt: 'Most students panic at the word "graph." Here\'s a mental model that makes BFS, DFS, and Dijkstra feel natural — not scary.',
    author: 'Ankit Gupta', authorImg: 'pro3', isPro: false,
    tags: ['graphs', 'bfs', 'dfs'], upvotes: 178, comments: 34, time: '3d ago',
    readTime: '8 min read'
  },
  {
    id: 10, type: 'pdf', title: 'OS Concepts Cheatsheet for GATE',
    excerpt: 'All important Operating System concepts in one place — process scheduling, deadlocks, memory management, and paging with formulas.',
    author: 'Vikram Singh', authorImg: 'user2', isPro: false,
    tags: ['os', 'gate', 'cheatsheet'], upvotes: 156, comments: 21, time: '3d ago',
    pages: 24, size: '1.5 MB', coverImg: 'os-cheatsheet'
  },
  {
    id: 11, type: 'image', title: 'React Component Lifecycle Diagram',
    excerpt: 'Complete lifecycle of React class components — mounting, updating, and unmounting phases with method call order.',
    author: 'Sarah Chen', authorImg: 'pro4', isPro: true,
    tags: ['react', 'frontend', 'diagram'], upvotes: 223, comments: 9, time: '4d ago',
    imageSrc: 'react-lifecycle'
  },
  {
    id: 12, type: 'link', title: 'Big-O Cheat Sheet by Eric Rowell',
    excerpt: 'The definitive Big-O complexity chart for all common data structure operations and sorting algorithms. Bookmark this.',
    author: 'Meera Patel', authorImg: 'user1', isPro: false,
    tags: ['big-o', 'complexity', 'reference'], upvotes: 412, comments: 5, time: '5d ago',
    url: 'bigocheatsheet.com', favicon: 'bigo'
  }
];

export default function ResourcesPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [items, setItems] = useState<FeedItem[]>(FEED_DATA);

  const filterCards = (type: string) => {
    setActiveFilter(type);
    if (type === 'all') {
      setItems(FEED_DATA);
    } else {
      setItems(FEED_DATA.filter(d => d.type === type));
    }
  };

  const handleItemClick = (item: FeedItem) => {
    router.push(`/resources/${item.id}`);
  };

  return (
    <div className="min-h-screen">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#09090b]/85 backdrop-blur-[12px]">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center">
                <Zap className="w-4 h-4 text-emerald-500" />
              </div>
              <span className="font-semibold text-sm tracking-tight">DSA Quest</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 ml-1 hidden sm:inline">Community</span>
            </a>
            <div className="hidden md:flex items-center gap-1">
              <a href="/resources" className="px-3 py-1.5 text-xs font-medium text-white bg-white/5 rounded">Resources</a>
              <a href="/" className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded">Contests</a>
              <a href="/dashboard" className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white transition-colors rounded">Dashboard</a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02]">
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <input type="text" placeholder="Search resources..." className="bg-transparent text-xs text-zinc-300 placeholder:text-zinc-600 outline-none w-40" />
            </div>
            <button onClick={() => router.push('/dashboard/write')} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-zinc-900 text-xs font-medium hover:bg-zinc-200 transition-all">
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Upload</span>
            </button>
            <div className="w-7 h-7 rounded-full bg-zinc-800 flex items-center justify-center cursor-pointer hover:bg-zinc-700 transition-colors">
              <User className="w-3.5 h-3.5 text-zinc-400" />
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-28 pb-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0" style={{background: 'radial-gradient(ellipse at top, rgba(6,78,59,0.2), #09090b, #09090b)'}}></div>
        <div className="absolute top-20 right-1/4 w-96 h-96 rounded-full opacity-10" style={{background: 'radial-gradient(circle, #10b981, transparent 70%)', filter: 'blur(60px)'}}></div>
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
              <div className="text-2xl font-semibold">1,247</div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Resources Shared</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-2xl font-semibold text-emerald-400">89</div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Pro Contributors</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-2xl font-semibold">4,831</div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 mt-1">Community Members</div>
            </div>
            <div className="glass rounded-lg p-4">
              <div className="text-2xl font-semibold text-cyan-400">23</div>
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
                  {['dynamic-programming', 'system-design', 'interview-prep', 'graphs', 'career-playbook', 'leetcode', 'open-source', 'sql'].map(tag => (
                    <span key={tag} className="px-2 py-1 rounded text-[10px] font-medium bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Top Contributors */}
              <div className="glass rounded-xl p-5">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                  <Award className="w-3.5 h-3.5" /> Top Contributors
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img src="https://picsum.photos/seed/pro1/40/40.jpg" className="w-8 h-8 rounded-full object-cover" alt="pro" />
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate flex items-center gap-1">Priya Sharma <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">PRO</span></div>
                      <div className="text-[10px] text-zinc-500">SDE @ Google • 47 posts</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <img src="https://picsum.photos/seed/pro2/40/40.jpg" className="w-8 h-8 rounded-full object-cover" alt="pro" />
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate flex items-center gap-1">Rahul Verma <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">PRO</span></div>
                      <div className="text-[10px] text-zinc-500">Tech Lead @ MS • 32 posts</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestone Preview */}
              <div className="glass rounded-xl p-5">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4 flex items-center gap-2">
                  <Trophy className="w-3.5 h-3.5" /> Latest Milestones
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center flex-shrink-0">
                      <Flame className="w-4 h-4 text-yellow-500" />
                    </div>
                    <div>
                      <div className="text-[11px] font-medium">30-Day Streak 🔥</div>
                      <div className="text-[10px] text-zinc-500">Ankit • 2h ago</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] border border-white/5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Code className="w-4 h-4 text-emerald-500" />
                    </div>
                    <div>
                      <div className="text-[11px] font-medium">100 Problems Solved</div>
                      <div className="text-[10px] text-zinc-500">Meera • 5h ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-[10px] text-zinc-600">© 2025 DSA Quest. Built for students, backed by pros.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
            <a href="#" className="text-zinc-500 hover:text-white transition-colors"><Linkedin className="w-4 h-4" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
