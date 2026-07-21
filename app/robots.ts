import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
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
    sitemap: 'https://dsaquest.in/sitemap.xml',
  };
}