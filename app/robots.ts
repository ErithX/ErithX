import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/llms.txt',
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
    sitemap: 'https://erithx.dev/sitemap.xml',
  };
}