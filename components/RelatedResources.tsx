"use client";

import React, { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import Link from 'next/link';

interface RelatedResourcesProps {
  currentDocId: string;
  currentTags: string[];
}

export default function RelatedResources({ currentDocId, currentTags }: RelatedResourcesProps) {
  const [related, setRelated] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch('/api/resources');
        const allDocs = await res.json();

        // Engine Logic:
        // 1. Exclude current document
        // 2. Calculate overlap score (how many tags match)
        // 3. Sort by score (desc), then by upvotes (desc)
        const scoredDocs = allDocs
          .filter((doc: any) => doc._id !== currentDocId)
          .map((doc: any) => {
            const docTags = doc.tags || [];
            const overlap = docTags.filter((tag: string) => currentTags.includes(tag)).length;
            return { ...doc, overlapScore: overlap };
          })
          .filter((doc: any) => doc.overlapScore > 0) // Only show if at least 1 tag matches
          .sort((a: any, b: any) => {
            if (b.overlapScore !== a.overlapScore) {
              return b.overlapScore - a.overlapScore;
            }
            return (b.upvotes || 0) - (a.upvotes || 0);
          });

        // If no matching tags, just show top upvoted
        const finalDocs = scoredDocs.length > 0 
          ? scoredDocs 
          : allDocs
              .filter((doc: any) => doc._id !== currentDocId)
              .sort((a: any, b: any) => (b.upvotes || 0) - (a.upvotes || 0));

        setRelated(finalDocs.slice(0, 4));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentTags) {
      fetchRelated();
    }
  }, [currentDocId, currentTags]);

  if (loading) {
    return <div className="animate-pulse text-xs text-zinc-500 mb-5">Finding related content...</div>;
  }

  if (related.length === 0) {
    return null;
  }

  return (
    <div className="mb-5">
      <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-3 px-1">Related Resources</div>
      <div className="space-y-3">
        {related.map((doc) => {
          let typeLabel = "Blog";
          let typeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
          
          if (doc.category === 'Study Materials') {
            typeLabel = "PDF";
            typeColor = "bg-orange-500/10 text-orange-400 border-orange-500/20";
          }
          
          return (
            <Link href={`/resources/${doc.slug || doc._id}`} key={doc._id} className="rec-card block p-3 rounded-xl glass hover:bg-white/[0.04] transition-colors border border-transparent hover:border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border ${typeColor}`}>
                  {typeLabel}
                </span>
                <span className="text-[9px] text-zinc-600">
                  {doc.overlapScore > 0 ? `${doc.overlapScore} matching tags` : 'Popular'}
                </span>
              </div>
              <h4 className="text-xs font-medium leading-snug mb-1.5 line-clamp-2 text-zinc-200">{doc.title}</h4>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                <ArrowUp className="w-3 h-3" />{doc.upvotes || 0}
                <span className="text-zinc-700">•</span>
                <span className="flex items-center gap-1">
                  {doc.authorName || 'Anonymous'}
                  {doc.isVerified && <img src="/VerifiedBadge.svg" alt="Verified" className="w-3 h-3 inline-block" />}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
