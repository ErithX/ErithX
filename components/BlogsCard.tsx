import React from 'react';
import { PenLine, Clock, ArrowUp, MessageSquare, Eye } from 'lucide-react';

export interface BlogItem {
  id: number;
  type: 'blog';
  title: string;
  subtitle?: string;
  excerpt: string;
  category?: string;
  fullContent?: string;
  author: string;
  authorImg: string;
  isPro: boolean;
  isVerified?: boolean;
  tags: string[];
  upvotes: number;
  comments: number;
  views: number;
  time: string;
  readTime: string;
  coverImg?: string;
}

interface BlogsCardProps {
  item: BlogItem;
  index: number;
  onClick: (item: BlogItem) => void;
}

export default function BlogsCard({ item, index, onClick }: BlogsCardProps) {
  return (
    <div 
      className="feed-card glass rounded-xl overflow-hidden animate-in"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => onClick(item)}
    >
      {item.coverImg && (
        <div className="w-full h-36 relative overflow-hidden border-b border-white/5 bg-zinc-900/60">
          <img 
            src={item.coverImg} 
            alt={item.title} 
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => { e.currentTarget.parentElement?.remove(); }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent pointer-events-none"></div>
          <div className="absolute bottom-3 left-4 pointer-events-none">
            <div className="text-[10px] text-zinc-300 font-medium px-2 py-0.5 rounded bg-black/50 backdrop-blur-sm border border-white/10 inline-block">{item.readTime}</div>
          </div>
        </div>
      )}
      <div className="p-4">

        <div className="flex items-center justify-between mb-2">
          {item.category === 'Project Blueprints' || item.category === 'Project Ideas' ? (
            <span className="type-project px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <PenLine className="w-3 h-3" />
              Project Idea
            </span>
          ) : item.category === 'Career' ? (
            <span className="type-career px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <PenLine className="w-3 h-3" />
              Career
            </span>
          ) : (
            <span className="type-blog px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <PenLine className="w-3 h-3" />
              Blog
            </span>
          )}
          <span className="text-[10px] text-zinc-600">{item.time}</span>
        </div>

        <h3 className="text-sm font-medium leading-snug mb-1">{item.title}</h3>
        {item.subtitle ? (
          <p className="text-xs font-medium text-zinc-400 leading-relaxed mb-3 line-clamp-2">{item.subtitle}</p>
        ) : (
          <p className="text-xs text-zinc-500 leading-relaxed mb-3 line-clamp-2">{item.excerpt}</p>
        )}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.tags.map(t => (
            <span key={t} className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-zinc-500">#{t}</span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <img 
              src={item.authorImg && item.authorImg.startsWith('http') ? item.authorImg : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.author || 'author')}`} 
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded-full object-cover bg-zinc-800" 
              alt={item.author} 
              onError={(e) => {
                e.currentTarget.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(item.author || 'author')}`;
              }}
            />

            <span className="text-[10px] text-zinc-400 font-medium flex items-center gap-1">
              {item.author}
              {item.isVerified && (
                <img src="/VerifiedBadge.svg" alt="Verified" className="w-3.5 h-3.5 inline-block" />
              )}
            </span>
            {item.isPro && !item.isVerified && (
              <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded font-bold">PRO</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-zinc-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.readTime}
            </span>
            <span className="text-[10px] text-zinc-500 flex items-center gap-1">
              <ArrowUp className="w-3 h-3" />
              {item.upvotes}
            </span>
            <span className="text-[10px] text-zinc-500 flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {item.views || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
