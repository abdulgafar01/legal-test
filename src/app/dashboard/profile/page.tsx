'use client'
import React, { useEffect } from 'react'
import { Shield, FileText, Settings, HelpCircle, ChevronRight, Star, Flag} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';
import Image from 'next/image';
import { Icon } from "@iconify/react";
import { useCountries } from '@/hooks/useCountries';

const Page = () => {
    const router = useRouter();
  const {data: user} = useCurrentUser();
    const { data: countries = [] } = useCountries();
    const country = countries.find(
        (c) => c.name === user?.data?.country // match by name
      );

    useEffect(() => {
    if (!user) {
      router.push("/login"); // redirect to login page
    }
  }, [user, router]);

  if (!user) return null; // prevent flash

  // Helpers and normalized values for practitioner data
  const practitioner = user?.data?.practitioner_profile || {};

  const formatExperienceLevel = (level?: string) =>
    level ? level.replace(/_/g, ' ').replace(/^\w|\s\w/g, (m) => m.toUpperCase()) : '—';

  const getSpecializationNames = (specializations: any): string[] => {
    try {
      if (!specializations) return [];
      if (Array.isArray(specializations) && specializations.length && typeof specializations[0] === 'object') {
        const names = specializations.map((s: any) => s?.name).filter(Boolean);
        return names
          .flatMap((n: any) => {
            if (typeof n === 'string') {
              const t = n.trim();
              if (t.startsWith('[')) {
                try {
                  const parsed = JSON.parse(t);
                  return Array.isArray(parsed)
                    ? parsed.map((v) => (typeof v === 'string' ? v : v?.name)).filter(Boolean)
                    : [n];
                } catch {
                  return [
                    t
                      .replace(/^\[|\]$/g, '')
                      .replace(/"/g, '')
                      .split(',')
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
      if (Array.isArray(specializations)) return specializations.filter(Boolean);
      if (typeof specializations === 'string') {
        const trimmed = specializations.trim();
        if (trimmed.startsWith('[')) {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) return parsed.map((v) => (typeof v === 'string' ? v : v?.name)).filter(Boolean);
        }
        return trimmed
          .replace(/^\[|\]$/g, '')
          .replace(/"/g, '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
      }
      return [];
    } catch {
      return [];
    }
  };

  const specializationNames = getSpecializationNames(practitioner?.specializations);
  const qualification = user?.data?.qualification || practitioner?.education || '—';
  const yearsOfExperience = practitioner?.years_of_experience ?? practitioner?.experience_years ?? null;
  const totalConsultations = practitioner?.total_consultations ?? practitioner?.consultations_count ?? null;
  const hourlyRate = practitioner?.hourly_rate ?? null;
  const levelDisplay = formatExperienceLevel(practitioner?.experience_level);
  const rating = practitioner?.average_rating;
  const totalReviews = practitioner?.total_reviews;
  
  const menuItems = [
    {
      icon: Shield,
      title: "Subscription",
      description: "Free",
      href: "/dashboard/subscription",
      showArrow: false
    },
    {
      icon: Shield,
      title: "Privacy Policy",
      href: "/dashboard/privacy-policy",
      showArrow: true
    },
    {
      icon: FileText,
      title: "Terms & Conditions",
      href: "/terms",
      showArrow: true
    },
    {
      icon: Settings,
      title: "Settings",
  href: "/dashboard/settings",
      showArrow: true
    },
    {
      icon: HelpCircle,
      title: "Help",
  href: "/dashboard/help",
      showArrow: true
    }
  ];

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto mb-3">
      {
        user.data.user_type === 'legal_practitioner'  ?
        (
           <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-3">
          <h1 className="text-2xl font-bold text-foreground">Profile Account</h1>
        </div>

        <div className="flex flex-col gap-4 p-3">
          {/* Profile Info */}
            
          <div className="max-w-md rounded-2xl border border-gray-200 bg-[#F6F6F6]">
                  <div className="p-6">
                    {/* Header Section */}
                    <div className="flex items-start gap-4">
                      {/* <Image
                        src="/lawyer.jpg"
                        alt="Profile"
                        width={64}
                        height={64}
                        className="rounded-lg object-cover"
                      /> */}
                      <div className="w-16 h-16 rounded-lg flex items-center border border-gray-900 justify-center overflow-hidden">
                    {user?.data?.first_name?.charAt(0) || "?"}
                     </div>
                      
              
                      <div>
                        <h2 className="text-lg font-semibold">{user?.data?.first_name}</h2>
                        <p className="text-sm text-gray-500">{user?.data?.last_name}</p>
                       

                        <div className="flex items-center gap-2 mt-1">
                          {country?.code ? (
                            <Icon
                              icon={`flag:${country.code.toLowerCase()}-4x3`}
                              className="h-5 w-5 rounded-sm"
                            />
                          ) : (
                            <span><Flag/></span>
                          )}
                          <span>{country?.name || "Unknown"}</span>
                        </div>

                        {/* Rating */}
                        {(typeof rating !== 'undefined' && rating !== null) && (
                          <div className="flex items-center gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.round(Number(rating) || 0) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                            <span className="text-sm text-gray-600 ml-1">{(Number(rating) || 0).toFixed(1)}{typeof totalReviews !== 'undefined' ? ` • ${totalReviews} reviews` : ''}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="mt-6 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Level:</span>
                        <span className="font-medium">{levelDisplay}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <span className="text-gray-500">Expertise:</span>
                        <div className="font-medium w-3/5">
                          {specializationNames.length ? (
                            <div className="flex flex-wrap gap-2 justify-end">
                              {specializationNames.map((name, i) => (
                                <Badge
                                  key={`${name}-${i}`}
                                  variant="secondary"
                                  className="bg-blue-50 text-blue-700 border border-blue-200"
                                >
                                  {name}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            '—'
                          )}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Qualification:</span>
                        <span className="font-medium">{qualification}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Consultations:</span>
                        <span className="font-medium">{typeof totalConsultations === 'number' ? totalConsultations : '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Years of experience:</span>
                        <span className="font-medium">{typeof yearsOfExperience === 'number' ? `${yearsOfExperience} years` : '—'}</span>
                      </div>
                    </div>

                    {/* Button */}
                    <button className="mt-6 w-full flex items-center justify-between border border-yellow-400 text-gray-700 px-4 py-2 rounded-lg hover:bg-yellow-50 transition">
                      <span>Consultation</span>
                      <span className="font-semibold">{hourlyRate ? `$${hourlyRate}` : '$—'}</span>
                    </button>
                  </div>
          </div>
            

            
          

          {/* Menu Items */}
          <div className="">
              <div className="">
                <div className="space-y-1">
                  {menuItems.map((item, index) => (
                    <Link 
                      key={index}
                      href={item.href}
                      passHref
                    >
                      <div className="flex items-center justify-between border-b border-[#E8E7E7] max-w-xl p-3 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium text-foreground">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.description && (
                            <Badge variant="outline" className="text-muted-foreground">
                              {item.description}
                            </Badge>
                          )}
                          {item.showArrow && (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
          </div>

        </div>
      </div>) 
           :

      (<div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-3">
          {/* <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button> */}
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        </div>

        <div className="flex flex-col gap-4 p-3">
          {/* Profile Info */}
            
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg flex items-center border border-gray-900 justify-center overflow-hidden">
                    {user?.data?.first_name?.charAt(0) || "?"}
                  </div>

                  <div className=''>
                  <h2 className="text-sm font-semibold text-foreground">{user?.data?.first_name} {user?.data?.last_name}</h2>
                  <p className="text-xs text-muted-foreground"></p>
                  <Link href="/dashboard/edit-profile" passHref>
                     <button
                              className="text-sm text-[#8E8E93] bg-[#FFF9E7] cursor-pointer px-2.5 py-0.5 rounded-4xl hover:underline"
                             
                            >
                             Edit Profile
                     </button>
                  </Link>
                  </div>
                </div>

            

            
          

          {/* Menu Items */}
          <div className="">
              <div className="">
                <div className="space-y-1">
                  {menuItems.map((item, index) => (
                    <Link 
                      key={index}
                      href={item.href}
                      passHref
                    >
                      <div className="flex items-center justify-between border-b border-[#E8E7E7] max-w-xl p-3 cursor-pointer transition-colors">
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium text-foreground">{item.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.description && (
                            <Badge variant="outline" className="text-muted-foreground">
                              {item.description}
                            </Badge>
                          )}
                          {item.showArrow && (
                            <ChevronRight className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
          </div>

        </div>
      </div>)
      }
    </div>
  );
}

export default Page;