'use client'
import React from 'react'
import { ArrowLeft, Shield, FileText, Settings, HelpCircle, ChevronRight} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const Page = () => {
    const router = useRouter();
    const {data: user} = useCurrentUser();
  
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
      href: "#",
      showArrow: true
    },
    {
      icon: HelpCircle,
      title: "Help",
      href: "#",
      showArrow: true
    }
  ];

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto mb-3">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5{user.data.email}" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        </div>

        <div className="flex flex-col gap-4 p-3">
          {/* Profile Info */}
            
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg flex items-center border border-gray-900 justify-center overflow-hidden">
                    TA
                  </div>

                  <div className=''>
                  <h2 className="text-sm font-semibold text-foreground">{user.data.first_name} {user.data.last_name}</h2>
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
      </div>
    </div>
  );
}

export default Page;