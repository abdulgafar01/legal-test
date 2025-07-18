'use client'
import React from 'react'
import { ArrowLeft, Shield, FileText, Settings, HelpCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
  
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
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Profile</h1>
        </div>

        <div className="flex flex-col gap-8">
          {/* Profile Info */}
          <div>
            <div>
                <div className="flex  items-center gap-3">
                  <div className="w-16 h-16 border border-black rounded-xl  flex items-center justify-center  text-2xl font-bold mb-4">
                    TA
                  </div>

                  <div className=''>
                  <h2 className="text-[16px] font-semibold text-foreground">Toluwanimi Adeyemo</h2>
                  <p className="text-xs text-muted-foreground">Toluwanimi@gmail.com</p>
                  <Link href="/dashboard/edit-profile" passHref>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="px-2 py-0.5 text-xs font-medium"
                    >
                      {/* <Edit2 className="w-4 h-4 mr-2" /> */}
                      Edit Profile
                    </Button>
                  </Link>
                  </div>
                </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="lg:col-span-2">
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="space-y-1">
                  {menuItems.map((item, index) => (
                    <Link 
                      key={index}
                      href={item.href}
                      passHref
                    >
                      <div className="flex items-center justify-between p-4 rounded-lg hover:bg-accent cursor-pointer transition-colors">
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;