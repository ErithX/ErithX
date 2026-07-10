import Navbar from '@/components/Navbar';
import Hero from '@/components/landing/Hero';
import PlatformMarquee from '@/components/landing/PlatformMarquee';
import Manifesto from '@/components/landing/Manifesto';
import Ecosystem from '@/components/landing/Ecosystem';
import Journey from '@/components/landing/Journey';
import Stats from '@/components/landing/Stats';
import Testimonials from '@/components/landing/Testimonials';
import CTA from '@/components/landing/CTA';
import Footer from '@/components/landing/Footer';
import ScrollRevealProvider from '@/components/landing/ScrollRevealProvider';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white selection:bg-emerald-500/30 selection:text-white">
      <Navbar />
      <ScrollRevealProvider>
        <main>
          <Hero />
          <PlatformMarquee />
          <Manifesto />
          <Ecosystem />
          <Journey />
          <Stats />
          <Testimonials />
          <CTA />
        </main>
        <Footer />
      </ScrollRevealProvider>
    </div>
  );
}
