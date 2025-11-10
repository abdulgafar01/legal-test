import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Info,
  Award,
  Briefcase,
  CheckCircle,
  Clock,
} from "lucide-react";
import { ApiService } from "@/config/apiService";
import { useTranslations } from "next-intl";

interface SpecializationSettingsProps {
  profile: any;
}

export const SpecializationSettings = ({
  profile,
}: SpecializationSettingsProps) => {
  const [specializations, setSpecializations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  console.log("🔍 SpecializationSettings - Profile received:", profile);
  console.log(
    "🔍 SpecializationSettings - Practitioner profile:",
    profile?.practitioner_profile
  );
  console.log(
    "🔍 SpecializationSettings - Specializations:",
    profile?.practitioner_profile?.specializations
  );
  const t = useTranslations("settingsSeeker");

  useEffect(() => {
    fetchSpecializations();
  }, []);

  const fetchSpecializations = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getSpecializations();
      console.log("🔍 Specializations API Response:", response.data);
      setSpecializations(response.data.results || response.data);
    } catch (error) {
      console.error("Error fetching specializations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper copied from practitioner details page to normalize names
  const getSpecializationNames = (specs: any): string[] => {
    try {
      if (!specs) return [];
      if (
        Array.isArray(specs) &&
        specs.length &&
        typeof specs[0] === "object"
      ) {
        const names = specs.map((s: any) => s?.name).filter(Boolean);
        return names
          .flatMap((n: any) => {
            if (typeof n === "string") {
              const t = n.trim();
              if (t.startsWith("[")) {
                try {
                  const parsed = JSON.parse(t);
                  return Array.isArray(parsed)
                    ? parsed
                        .map((v) => (typeof v === "string" ? v : v?.name))
                        .filter(Boolean)
                    : [n];
                } catch {
                  return [
                    t
                      .replace(/^\[|\]$/g, "")
                      .replace(/\"/g, '"')
                      .replace(/"/g, "")
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  ].flat();
                }
              }
            }
            return [n];
          })
          .filter(Boolean) as string[];
      }
      if (Array.isArray(specs)) {
        return specs.filter(Boolean);
      }
      if (typeof specs === "string") {
        const trimmed = specs.trim();
        if (trimmed.startsWith("[")) {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed))
            return parsed
              .map((v) => (typeof v === "string" ? v : v?.name))
              .filter(Boolean);
        }
        return trimmed
          .replace(/^\[|\]$/g, "")
          .replace(/"/g, "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return [];
    } catch {
      return [];
    }
  };

  const specializationNames = getSpecializationNames(
    profile?.practitioner_profile?.specializations
  );

  console.log("🔍 Specialization Names (normalized):", specializationNames);
  console.log("🔍 All Specializations:", specializations);
  console.log("🔍 Specializations is array:", Array.isArray(specializations));

  // Ensure specializations is always an array before filtering
  const safeSpecializations = Array.isArray(specializations)
    ? specializations
    : [];
  const used = new Set(specializationNames);
  const availableSpecializations = safeSpecializations.filter(
    (spec) => !used.has(spec.name)
  );

  return (
    <div className="h-full overflow-y-auto space-y-6 pr-2 pt-4 pb-20">
      {/* Current Specializations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            {t("settings.Your Specializations")}
          </CardTitle>
          <CardDescription>
            {t(
              "settings.Areas of law where you practice and provide consultations"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {specializationNames.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {specializationNames.map((name, index) => (
                <Badge
                  key={`${name}-${index}`}
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 border border-blue-200"
                >
                  {name}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t("settings.No specializations assigned")}
              </h3>
              <p className="text-gray-500">
                {t(
                  "settings.Contact your administrator to get started with your practice areas"
                )}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Available Specializations */}
      {safeSpecializations.length > 0 &&
        availableSpecializations.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                {t("settings.Available Specializations")}
              </CardTitle>
              <CardDescription>
                {t(
                  "settings.Additional areas of law you can potentially practice in"
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableSpecializations.map((spec: any) => (
                  <div
                    key={spec.id}
                    className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-600" />
                      <h3 className="font-semibold text-gray-900">
                        {spec.name}
                      </h3>
                    </div>
                    {spec.description && (
                      <p className="text-sm text-gray-600 mt-2">
                        {spec.description}
                      </p>
                    )}
                    <Badge variant="outline" className="mt-2">
                      {t("settings.Available")}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}{" "}
      {/* Professional Credentials */}
      {(profile?.practitioner_profile?.experiences?.length > 0 ||
        profile?.practitioner_profile?.certifications?.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              {t("settings.Professional Credentials")}
            </CardTitle>
            <CardDescription>
              {t("settings.Your verified experience and certifications")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Experience */}
            {profile?.practitioner_profile?.experiences &&
              profile.practitioner_profile.experiences.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-blue-600" />
                    {t("settings.Professional Experience")}
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {profile.practitioner_profile.experiences.map(
                      (exp: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-semibold text-purple-900">
                                {exp.position}
                              </h5>
                              <p className="text-purple-700 font-medium">
                                {exp.company}
                              </p>
                              <p className="text-sm text-purple-600 mt-1">
                                {exp.start_date} - {exp.end_date || t("settings.Present")}
                              </p>
                              {exp.description && (
                                <p className="text-sm text-purple-700 mt-2">
                                  {exp.description}
                                </p>
                              )}
                            </div>
                            <Briefcase className="h-5 w-5 text-purple-600 flex-shrink-0" />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

            {/* Certificates */}
            {profile?.practitioner_profile?.certifications &&
              profile.practitioner_profile.certifications.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg flex items-center gap-2">
                    <Award className="h-4 w-4 text-green-600" />
                    {t("settings.Certifications")}
                  </h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {profile.practitioner_profile.certifications.map(
                      (cert: any, index: number) => (
                        <div
                          key={index}
                          className="p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h5 className="font-semibold text-green-900">
                                {cert.name}
                              </h5>
                              <p className="text-green-700 font-medium">
                                {cert.issuing_organization}
                              </p>
                              <p className="text-sm text-green-600 mt-1">
                                {t("settings.Issued")}: {cert.issue_date}
                                {cert.expiry_date &&
                                  ` | Expires: ${cert.expiry_date}`}
                              </p>
                            </div>
                            <Award className="h-5 w-5 text-green-600 flex-shrink-0" />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
          </CardContent>
        </Card>
      )}
      {/* Information Notices */}
      <div className="space-y-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-1">
                  {t("settings.specializationQuestion")}
                </h4>
                <p className="text-sm text-blue-800">
                  {t("settings.contactAdmin")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Award className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-900 mb-1">
                  {t("settings.Professional Credentials")}
                </h4>
                <p className="text-sm text-amber-800">
                  {t("settings.notice")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
