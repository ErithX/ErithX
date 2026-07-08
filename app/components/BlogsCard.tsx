import React from 'react';
import { PenLine, Clock, ArrowUp, MessageSquare } from 'lucide-react';

export interface BlogItem {
  id: number;
  type: 'blog';
  title: string;
  excerpt: string;
  fullContent?: string;
  author: string;
  authorImg: string;
  isPro: boolean;
  tags: string[];
  upvotes: number;
  comments: number;
  time: string;
  readTime: string;
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
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="type-blog px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <PenLine className="w-3 h-3" />
            Blog
          </span>
          <span className="text-[10px] text-zinc-600">{item.time}</span>
        </div>
        <h3 className="text-sm font-medium leading-snug mb-2 line-clamp-2">{item.title}</h3>
        <p className="text-xs text-zinc-500 leading-relaxed mb-3 line-clamp-2">{item.excerpt}</p>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {item.tags.map(t => (
            <span key={t} className="px-1.5 py-0.5 rounded text-[9px] bg-white/5 text-zinc-500">#{t}</span>
          ))}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-bold overflow-hidden shrink-0">
              {item.authorImg && item.authorImg.startsWith('http') && !item.authorImg.includes('picsum') ? (
                <img src={item.authorImg} className="w-full h-full object-cover" alt={item.author} />
              ) : (
                <span className="text-[10px]">{item.author ? item.author.charAt(0).toUpperCase() : 'A'}</span>
              )}
            </div>
            <span className="text-[10px] text-zinc-400">{item.author}</span>
            {item.isPro && (
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
              <MessageSquare className="w-3 h-3" />
              {item.comments}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
