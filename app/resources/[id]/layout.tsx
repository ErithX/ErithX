import { Metadata } from 'next';
import connectToDatabase from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';
import mongoose from 'mongoose';

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const unwrappedParams = await params;
  const id = unwrappedParams.id;

  try {
    await connectToDatabase();
    
    // Find the resource by slug or id
    const query = mongoose.Types.ObjectId.isValid(id) 
      ? { _id: id, status: 'published' } 
      : { slug: id, status: 'published' };
      
    const doc = await Resource.findOne(query);

    if (!doc) {
      return {
        title: 'Resource Not Found | DSA Quest',
        description: 'The requested resource could not be found.',
      };
    }

    const title = `${doc.title} | DSA Quest`;
    const description = doc.content 
      ? doc.content.replace(/<[^>]*>?/gm, '').substring(0, 160) // Strip HTML and limit to 160 chars
      : 'Read this amazing resource on DSA Quest, your ultimate coding contest platform.';

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        authors: [doc.authorName || 'Anonymous'],
        images: doc.coverImage ? [doc.coverImage] : ['https://dsaquest.dev/og-image.jpg'],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: doc.coverImage ? [doc.coverImage] : ['https://dsaquest.dev/og-image.jpg'],
      },
    };
  } catch (error) {
    return {
      title: 'Resource | DSA Quest',
    };
  }
}

export default function ResourceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>;
}
