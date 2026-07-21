// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DSA Quest — Coding Contests and Study Resources",
    template: "%s | DSA Quest"
  },
  description: "Track upcoming coding contests and find high-quality DSA study materials. Prepare for tech interviews and placements.",
  keywords: "All in one software engineering platform, Computer science student ecosystem, Full stack engineering preparation platform, Complete tech career readiness hub, Next gen engineering education portal, Comprehensive coding companion website, BTech CSE complete student portal, Self taught software engineer launchpad, AI era developer training platform, College engineering to tech career gateway, DSA Quest, DSA Quest platform, DSA Quest official website, DSA Quest portal, DSA Quest roadmap",
  authors: [{ name: "DSA Quest Team" }],
  creator: "DSA Quest",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://contest-tracker-zms3.vercel.app",
    siteName: "DSA Quest",
    title: "DSA Quest - Track All Coding Contests in One Place",
    description: "Never miss a coding contest! Track LeetCode, Codeforces, CodeChef, AtCoder & more. Get email alerts and prepare for FAANG interviews.",
  },
  alternates: {
    canonical: "https://contest-tracker-zms3.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "DSA Quest - Competitive Programming Contest Tracker",
    description: "Track coding contests from 10+ platforms. Get daily alerts & prepare for FAANG interviews.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
       <meta name="google-site-verification" content="4KfpDK0yjbk36wT5FagXAX1r2DHchla3Haf3g0q_F1c" />
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WS99FGKXWT"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WS99FGKXWT');
          `}
        </Script>

        {/* Microsoft Clarity (Removed dummy ID to prevent 400 Bad Request) */}
        {/*
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {\`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "YOUR_CLARITY_ID");
          \`}
        </Script>
        */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            {children}
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}