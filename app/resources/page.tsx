import { Metadata } from 'next';
import connectToDatabase from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';
import ResourcesClient from './ResourcesClient';

export const metadata: Metadata = {
  title: 'DSA Quest | Resources Feed',
  description: 'Discover verified tech resources, guides, and study materials for your competitive programming journey.',
};

export default async function ResourcesPage() {
  await connectToDatabase();
  
  // Fetch all published resources
  const docs = await Resource.find({ status: 'published' }).sort({ createdAt: -1 }).lean();
  
  // Format for the FeedItem structure
  const formattedData = docs.map((doc: any) => {
    const diffMs = Date.now() - new Date(doc.createdAt).getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const timeStr = diffHrs < 24 ? `${diffHrs}h ago` : `${Math.floor(diffHrs/24)}d ago`;
    
    // Clean HTML tags for excerpt
    const cleanText = doc.content ? doc.content.replace(/<[^>]+>/g, '').trim() : '';
    const excerpt = cleanText.substring(0, 150) + (cleanText.length > 150 ? '...' : '');

    const readTimeStr = `${Math.max(1, Math.ceil((doc.wordCount || 0) / 200))} min read`;

    let type: 'blog' | 'pdf' = 'blog';
    if (doc.category === 'Study Materials') type = 'pdf';
    if (doc.category === 'Career') type = 'blog';
    
    const baseItem = {
      id: doc.slug || doc._id.toString(),
      title: doc.title || 'Untitled',
      excerpt,
      author: doc.authorName || 'Anonymous',
      authorImg: doc.authorImg || 'pro1',
      isPro: doc.isPro || false,
      isVerified: doc.isVerified || false,
      tags: doc.tags || [],
      upvotes: doc.upvotes || 0,
      comments: doc.commentsCount || 0,
      views: doc.views || 0,
      time: timeStr
    };

    if (type === 'blog') {
      return { ...baseItem, type: 'blog', readTime: readTimeStr, coverImg: doc.coverImage } as any;
    } else {
      return { 
        ...baseItem, 
        type: 'pdf', 
        coverImg: doc.coverImage, 
        size: readTimeStr 
      } as any;
    }
  });

  return (
    <ResourcesClient initialItems={formattedData} />
  );
}
