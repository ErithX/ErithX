import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/api/contests',
        '/api/resources',
      ],
      disallow: [
        '/dashboard',
        '/dashboard/',
        '/auth',
        '/auth/',
        '/api/',
      ],
    },
    sitemap: 'https://contest-tracker-zms3.vercel.app/sitemap.xml',
  };
}