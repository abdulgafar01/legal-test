import Header from "@/components/landing/Header";
import VideoBanner from "@/components/landing/VideoBanner";
import Services from "@/components/landing/Services";
import Pricing from "@/components/landing/Pricing";
import CTAForLawyers from "@/components/landing/CTAForLawyers";
import Testimonials from "@/components/landing/Testimonials";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import { FeaturesAccordion } from "@/components/landing/FeaturesAccordion";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ResponsibleAISection } from "@/components/landing/ResponsibleAISection";
import { BlogCarouselSection } from "@/components/landing/BlogCarouselSection";

export default function LandingPage() {
  return (
    <main className="bg-white min-h-screen text-gray-900 font-nunito">
      <Header />
      <VideoBanner />
      <Hero />
      <Services />
      <FeaturesAccordion/>
      <Pricing />
      <CTAForLawyers />
      <ResponsibleAISection/>
      <BlogCarouselSection/>
      <Testimonials />
      <Footer />
      <ScrollToTop/>
    </main>
  );
}
