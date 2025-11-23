"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, User, Calendar, BookOpen, Loader2 } from "lucide-react";
import { ProfileSettingsForm } from "./components/ProfileSettingsForm";
import AvailabilityCalendar from "./components/AvailabilityCalendar";
import { SpecializationSettings } from "./components/SpecializationSettings";
import { ApiService } from "@/config/apiService";
import { useTranslations } from "next-intl";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("settingsSeeker");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      // Debug: Log token information
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      console.log("🔍 Debug - Tokens:", {
        accessToken: accessToken ? "Present" : "Missing",
        refreshToken: refreshToken ? "Present" : "Missing",
        accessTokenLength: accessToken?.length,
      });

      const response = await ApiService.getPractitionerProfile();
      console.log("✅ Full API Response:", response.data);
      console.log("🔍 Profile structure:", {
        data: response.data.data || response.data,
        hasData: !!response.data.data,
        keys: Object.keys(response.data),
      });
      setProfile(response.data.data || response.data);
    } catch (error: any) {
      console.error("❌ Profile fetch error:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = (updatedProfile: any) => {
    setProfile(updatedProfile);
  };

  const handleAvailabilityUpdate = () => {
    // Optional: You can refresh any related data here
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "availability", label: "Availability", icon: Calendar },
    { id: "specializations", label: "Specializations", icon: BookOpen },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>{t("settings.loading")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={fetchProfile} variant="outline">
                {t("settings.Try Again")}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="container mx-auto px-6 py-8 max-w-6xl flex-1 flex flex-col overflow-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Settings className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("settings.heading")}
            </h1>
            <p className="text-gray-600">{t("settings.p1")}</p>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 flex-shrink-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center cursor-pointer gap-2 ${
                  activeTab === tab.id
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="h-full overflow-y-auto">
              <ProfileSettingsForm
                profile={profile}
                onProfileUpdate={handleProfileUpdate}
              />
            </div>
          )}

          {/* Availability Tab */}
          {activeTab === "availability" && (
            <div className="h-full">
              <AvailabilityCalendar />
            </div>
          )}

          {/* Specializations Tab */}
          {activeTab === "specializations" && (
            <div className="h-full">
              <SpecializationSettings profile={profile} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
