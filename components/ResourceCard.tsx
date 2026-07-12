import React from 'react';
import { FileText, Link as LinkIcon, Image as ImageIcon, ArrowUp, MessageSquare, Globe, Eye } from 'lucide-react';

export interface ResourceItem {
  id: number;
  type: 'pdf' | 'link' | 'image';
  title: string;
  excerpt: string;
  author: string;
  authorImg: string;
  isPro: boolean;
  tags: string[];
  upvotes: number;
  comments: number;
  views: number;
  time: string;
  
  // PDF specific
  pages?: number;
  size?: string;
  coverImg?: string;
  
  // Image specific
  imageSrc?: string;
  
  // Link specific
  url?: string;
  favicon?: string;
}

interface ResourceCardProps {
  item: ResourceItem;
  index: number;
  onClick: (item: ResourceItem) => void;
}

export default function ResourceCard({ item, index, onClick }: ResourceCardProps) {
  const getTypeConfig = () => {
    switch (item.type) {
      case 'pdf': return { class: 'bg-orange-500/10 text-orange-400 border border-orange-500/20', icon: <FileText className="w-3 h-3" />, label: 'PDF' };
      case 'link': return { class: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20', icon: <LinkIcon className="w-3 h-3" />, label: 'Link' };
      case 'image': return { class: 'bg-purple-500/10 text-purple-400 border border-purple-500/20', icon: <ImageIcon className="w-3 h-3" />, label: 'Image' };
      default: return { class: '', icon: null, label: '' };
    }
  };

  const tc = getTypeConfig();

  const renderContentPreview = () => {
    if (item.type === 'image') {
      return (
        <div className="relative overflow-hidden">
          <img src={`https://picsum.photos/seed/${item.imageSrc}/600/400.jpg`} className="w-full h-48 object-cover" alt={item.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 to-transparent"></div>
        </div>
      );
    } else if (item.type === 'pdf') {
      return (
        <div className="relative overflow-hidden">
          <img src={`https://picsum.photos/seed/${item.coverImg}/600/300.jpg`} className="w-full h-36 object-cover opacity-60" alt={item.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
          <div className="absolute bottom-3 left-4 flex items-center gap-2">
            <div className="w-10 h-12 rounded bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <div className="text-[10px] text-orange-400 font-medium">{item.pages} pages</div>
              <div className="text-[10px] text-zinc-500">{item.size}</div>
            </div>
          </div>
        </div>
      );
    } else if (item.type === 'link') {
      return (
        <div className="p-4 bg-white/[0.02] border-b border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-5 h-5 rounded bg-cyan-500/20 flex items-center justify-center">
              <Globe className="w-3 h-3 text-cyan-400" />
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">{item.url}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="feed-card glass rounded-xl overflow-hidden animate-in"
      style={{ animationDelay: `${index * 0.05}s` }}
      onClick={() => onClick(item)}
    >
      {renderContentPreview()}
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span className={`${tc.class} px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1`}>
            {tc.icon}
            {tc.label}
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
            <img 
              src={item.authorImg && item.authorImg.startsWith('http') ? item.authorImg : `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.authorImg || item.author}`} 
              className="w-5 h-5 rounded-full object-cover bg-zinc-800" 
              alt={item.author} 
            />
            <span className="text-[10px] text-zinc-400">{item.author}</span>
            {item.isPro && (
              <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1 py-0.5 rounded font-bold">PRO</span>
            )}
          </div>
          <div className="flex items-center gap-3">
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
