"use client";
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './ImageWithFallback';
import { Button } from '../ui/button';
import { useRouter } from 'next/navigation';

export function ResponsibleAISection() {
    const router = useRouter();
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="order-2 lg:order-1">
            <div className="aspect-[4/3] md:aspect-[3/3] overflow-hidden rounded-lg">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1736939678218-bd648b5ef3bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMGxhd3llcnxlbnwxfHx8fDE3NjIwNzUzNzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Professional legal consultation"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">
              Responsibly developed AI, shaped by legal professionals to uphold fairness and accountability
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              At TheYas Law, we adhere to globally recognized Responsible AI Principles — ensuring every AI solution is developed with human and legal oversight, transparency, and accountability, while actively mitigating bias and safeguarding integrity.
            </p>
            <Button className="bg-[var(--primary)] hover:opacity-80 text-white px-6 py-6 group" onClick={() => router.push("/signup/seeker")}>
              Explore our AI assistant
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
