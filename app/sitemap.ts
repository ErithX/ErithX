import { MetadataRoute } from 'next';
import connectToDatabase from '@/app/lib/mongodb';
import { Resource } from '@/models/Resource';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Hardcoding the exact production URL to prevent any Vercel environment variable mishaps
  // that cause relative paths (e.g. "/contests") in the sitemap output.
  const baseUrl = 'https://contest-tracker-zms3.vercel.app';

  // Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/contests`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  // Dynamic Routes
  let dynamicRoutes: MetadataRoute.Sitemap = [];
  try {
    await connectToDatabase();
    const resources = await Resource.find({ status: 'published' }).select('_id updatedAt').lean();
    
    dynamicRoutes = resources.map((resource: any) => ({
      url: `${baseUrl}/resources/${resource._id}`,
      lastModified: resource.updatedAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Failed to generate dynamic sitemap routes:', error);
  }

  return [...staticRoutes, ...dynamicRoutes];
}