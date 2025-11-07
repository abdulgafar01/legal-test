"use client";
import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  MessageSquare,
  FileEdit,
  FileSearch,
  Upload,
} from "lucide-react";
import { ImageWithFallback } from "./ImageWithFallback";
import { useTranslations } from "next-intl";

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: typeof MessageSquare;
  image: string;
}

export function FeaturesAccordion() {
  const t = useTranslations("featuresAccordion");
  const features: Feature[] = [
    {
      id: "conversational",
      title: t("title"),
      description:
        t("description"),
      icon: MessageSquare,
      image:
        "https://images.unsplash.com/photo-1743865318581-2e0e59e7292e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjB3b21hbiUyMHdvcmtpbmclMjBsYXB0b3B8ZW58MXx8fHwxNzYxMjE3NTYxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "draft",
      title: t("title2"),
      description:
        t("description2"),
      icon: FileEdit,
      image:
        "https://images.unsplash.com/photo-1758518727077-ffb66ffccced?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHBlb3BsZSUyMG1lZXRpbmclMjBkaXNjdXNzaW9ufGVufDF8fHx8MTc2MTIxNzU2MXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "summarization",
      title: t("title3"),
      description:
        t("description3"),
      icon: FileSearch,
      image:
        "https://images.unsplash.com/photo-1713947503486-0e3916611517?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYW4lMjByZWFkaW5nJTIwZG9jdW1lbnRzJTIwb2ZmaWNlfGVufDF8fHx8MTc2MTIxNzU2Mnww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
      id: "upload",
      title: t("title4"),
      description:
        t("description4"),
      icon: Upload,
      image:
        "https://images.unsplash.com/photo-1728302732935-421062dcd60f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2N1bWVudCUyMHVwbG9hZCUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzYxMjE3NTYyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
  ];

  const [selectedFeature, setSelectedFeature] = useState<string>(
    features[0].id
  );

  const currentFeature =
    features.find((f) => f.id === selectedFeature) || features[0];

  return (
    <section className="py-20 lg:py-32 bg-muted/20" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">
            {t("heading")}
          </h2>
        </div>

        {/* Interactive Content */}
        <div className="grid lg:grid-cols-2 gap-12 items-start" dir="ltr">
          {/* Features List */}
          <div className="space-y-3">
            {features.map((feature) => {
              const isSelected = selectedFeature === feature.id;
              const Icon = feature.icon;

              return (
                <div key={feature.id}>
                  <button
                    onClick={() => setSelectedFeature(feature.id)}
                    className={`w-full text-left px-6 py-4 rounded-lg transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? "bg-primary/5 border-l-4 border-primary"
                        : "bg-background hover:bg-muted/50 border-l-4 border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`h-5 w-5 ${
                            isSelected
                              ? "text-primary"
                              : "text-muted-foreground"
                          }`}
                        />
                        <h3
                          className={`text-lg ${
                            isSelected ? "text-foreground" : "text-foreground"
                          }`}
                        >
                          {feature.title}
                        </h3>
                      </div>
                      {isSelected ? (
                        <ChevronUp className="h-5 w-5 text-primary" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Description */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      isSelected ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 py-4 ml-8">
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Feature Image */}
          <div className="relative lg:sticky lg:top-24">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/5 to-primary/10">
              <ImageWithFallback
                key={currentFeature.id}
                src={currentFeature.image}
                alt={currentFeature.title}
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            </div>

            {/* Floating Badge */}
            <div className="absolute top-6 right-6 bg-background/95 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg border border-border">
              <p className="text-sm">
                <span className="text-primary">AI-Powered</span>
              </p>
            </div>

            {/* Bottom Info Card */}
            <div className="absolute bottom-6 left-6 right-6 bg-background/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border border-border">
              <div className="flex items-center gap-2 mb-1">
                <currentFeature.icon className="h-4 w-4 text-primary" />
                <p className="text-sm">{currentFeature.title}</p>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">
                {currentFeature.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
