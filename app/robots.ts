import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard',
        '/dashboard/',
        '/auth',
        '/auth/',
        '/api',
        '/api/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}