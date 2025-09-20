import Header from '@/components/landing/Header';
import Hero from '@/components/landing/Hero';
import Services from '@/components/landing/Services';
import Pricing from '@/components/landing/Pricing';
import CTAForLawyers from '@/components/landing/CTAForLawyers';
import Testimonials from '@/components/landing/Testimonials';
import Footer from '@/components/landing/Footer';

export default function LandingPage(){
  return (
    <main className="bg-white min-h-screen text-gray-900 font-nunito">
      <Header />
      <Hero />
      <Services />
      <Pricing />
      <CTAForLawyers />
      <Testimonials />
      <Footer />
    </main>
  );
}