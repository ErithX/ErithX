import type { Metadata } from 'next';
import connectToDatabase from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';
import mongoose from 'mongoose';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  
  try {
    await connectToDatabase();
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id, status: 'published' }
      : { slug: id, status: 'published' };

    const doc: any = await Resource.findOne(query).lean();

    if (!doc) {
      return {
        title: 'Resource Not Found | DSA Quest',
        description: 'The requested computer science resource could not be found.',
      };
    }

    const title = `${doc.title} | DSA Quest`;
    const cleanDescription = (doc.summary || doc.content?.replace(/<[^>]*>?/gm, '') || '')
      .substring(0, 160)
      .replace(/\s+/g, ' ')
      .trim();

    const canonicalUrl = `https://contest-tracker-zms3.vercel.app/resources/${doc._id}`;
    const tagsKeywords = doc.tags && doc.tags.length > 0 ? doc.tags.join(', ') : 'DSA, Computer Science';

    return {
      title,
      description: cleanDescription || `Read ${doc.title} on DSA Quest - CS study materials and notes.`,
      keywords: `${tagsKeywords}, ${doc.category || 'Study Materials'}, DSA Quest, Computer Science Notes, Placement Prep`,
      authors: [{ name: doc.authorName || 'DSA Quest Team' }],
      creator: doc.authorName || 'DSA Quest',
      openGraph: {
        title,
        description: cleanDescription,
        url: canonicalUrl,
        siteName: 'DSA Quest',
        type: 'article',
        publishedTime: doc.createdAt ? new Date(doc.createdAt).toISOString() : undefined,
        modifiedTime: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
        authors: [doc.authorName || 'DSA Quest Team'],
        tags: doc.tags || [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description: cleanDescription,
      },
      alternates: {
        canonical: canonicalUrl,
      },
    };
  } catch (error) {
    return {
      title: 'Tech Study Resource | DSA Quest',
      description: 'Explore high-quality Data Structures, Algorithms, and CS study materials on DSA Quest.',
    };
  }
}

export default async function ResourceDetailLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let jsonLd = null;

  try {
    await connectToDatabase();
    const query = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id, status: 'published' }
      : { slug: id, status: 'published' };

    const doc: any = await Resource.findOne(query).lean();

    if (doc) {
      const cleanDescription = (doc.summary || doc.content?.replace(/<[^>]*>?/gm, '') || '')
        .substring(0, 160)
        .replace(/\s+/g, ' ')
        .trim();

      jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        'headline': doc.title,
        'description': cleanDescription,
        'articleBody': doc.content?.replace(/<[^>]*>?/gm, '').substring(0, 1000),
        'author': {
          '@type': 'Person',
          'name': doc.authorName || 'DSA Quest Team',
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'DSA Quest',
          'url': 'https://contest-tracker-zms3.vercel.app',
        },
        'datePublished': doc.createdAt ? new Date(doc.createdAt).toISOString() : undefined,
        'dateModified': doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
        'mainEntityOfPage': `https://contest-tracker-zms3.vercel.app/resources/${doc._id}`,
        'keywords': doc.tags ? doc.tags.join(', ') : undefined,
      };
    }
  } catch (error) {
    console.error('Failed to generate JSON-LD for resource layout:', error);
  }

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
