import { Metadata } from 'next';
import connectToDatabase from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';
import Comment from '@/models/Comment';
import ResourceClient from './ResourceClient';

// Helper to fetch resource and comments
async function getResourceData(id: string) {
  try {
    await connectToDatabase();
    const mongoose = require('mongoose');
    const query = mongoose.Types.ObjectId.isValid(id) 
      ? { _id: id, status: 'published' } 
      : { slug: id, status: 'published' };
      
    const doc = await Resource.findOne(query).lean();
    if (!doc) return { doc: null, comments: [] };

    // Need to stringify _id to avoid Next.js warning about plain objects
    const serializedDoc = JSON.parse(JSON.stringify(doc));

    // Fetch comments
    const comments = await Comment.find({ resourceId: doc._id }).sort({ createdAt: -1 }).lean();
    const serializedComments = JSON.parse(JSON.stringify(comments));

    return { doc: serializedDoc, comments: serializedComments };
  } catch (error) {
    console.error("Error fetching resource data:", error);
    return { doc: null, comments: [] };
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const { doc } = await getResourceData(resolvedParams.id);
  
  if (!doc) {
    return {
      title: 'Resource Not Found | ErithX',
      description: 'The requested resource could not be found.',
    };
  }

  // Generate a brief description from content if none provided
  let description = doc.title;
  if (doc.content) {
    // Strip HTML tags for description and get first 120 chars
    const plainText = doc.content.replace(/<[^>]+>/g, '').trim();
    description = plainText.length > 120 ? plainText.substring(0, 120) + '...' : plainText;
  }
  
  // Clean up trailing period if exists, then add the standard suffix
  description = `${description.replace(/\.$/, '')}. Part of ErithX Resources, a curated set of articles for DSA students.`;

  return {
    title: `${doc.title} – ErithX Resources`,
    description: description,
    keywords: doc.tags || [],
    openGraph: {
      title: `${doc.title} – ErithX Resources`,
      description: description,
      type: 'article',
      publishedTime: doc.createdAt,
      authors: [doc.authorName || 'Anonymous'],
      tags: doc.tags,
      images: doc.coverImage ? [
        {
          url: doc.coverImage,
          width: 1200,
          height: 630,
          alt: doc.title,
        }
      ] : [],
    },
  };
}

export default async function ResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { doc, comments } = await getResourceData(resolvedParams.id);
  
  return (
    <ResourceClient 
      initialDoc={doc} 
      initialComments={comments} 
      resourceId={resolvedParams.id} 
    />
  );
}
