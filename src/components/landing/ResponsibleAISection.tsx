"use client";
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function ResponsibleAISection() {
  const  t  = useTranslations();
    const router = useRouter();
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white"
    dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="aspect-[4/3] md:aspect-[4/3] overflow-hidden rounded-lg">
              <ImageWithFallback
                src="images/confident-lady.png"
                alt="Professional legal consultation"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">
             {t("responsibleAI.heading")}
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {t("responsibleAI.description")}
            </p>
            <Button className="bg-[var(--primary)] hover:opacity-80 text-white px-6 py-6 group" onClick={() => router.push("/signup/seeker")}>
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              {t("responsibleAI.button")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
