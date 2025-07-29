'use client'
import { useState } from "react";
import { ArrowLeft} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
// import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
// import Image from "next/image";

const EditProfile = () => {
  const router = useRouter();
//   const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "Toluwanimi Adeyemo",
    email: "toluwanimi@gmail.com",
    phone: "+1 (555) 000-0000",
    address: "",
    state: "",
    city: "",
    country: "US"
  });

  //  const [hasProfilePhoto, setHasProfilePhoto] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // toast({
    //   title: "Profile updated",
    //   description: "Your profile has been successfully updated.",
    // });
    router.push("/profile"); // Using Next.js router
  };

  // const handlePhotoUpload = () => {
  //   setHasProfilePhoto(true);
  //   // toast({
  //   //   title: "Photo uploaded",
  //   //   description: "Your profile photo has been updated.",
  //   // });
  //   alert("Photo upload functionality is not implemented yet.");
  // };

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto mb-3">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header with Link for back navigation */}
        <div className="flex items-center gap-4 mb-3">
          <Link href="/dashboard/profile" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
        </div>

            <div className="flex flex-col gap-4 p-3 max-w-lg">
              {/* Profile Photo Section */}
               <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-lg flex items-center border border-gray-900 justify-center overflow-hidden">
                    TA
                  </div>

                  <div className=''>
                  <h2 className="text-sm font-semibold text-foreground">Toluwanimi Adeyemo</h2>
                  <p className="text-xs text-muted-foreground">Toluwanimi@gmail.com</p>
                  <Link href="/dashboard/edit-profile" passHref>
                     <button
                              className="text-sm text-[#8E8E93] bg-[#FFF9E7] cursor-pointer px-2.5 py-0.5 rounded-4xl hover:underline"
                              // onClick={handlePhotoUpload}
                             
                            >
                             Edit photo
                     </button>
                  </Link>
                  </div>
                </div>

              {/* Form Section (remaining code stays the same) */}
              <div className="space-y-4 max-w-lg">
                {/* ... all your existing form fields remain unchanged ... */}
                <div>
                  <Label htmlFor="fullName" className="text-sm font-medium text-foreground mb-2 block">
                    Full Name
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground mb-2 block">
                    Phone number
                  </Label>
                  <div className="flex gap-2">
                    <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">US</SelectItem>
                        <SelectItem value="UK">UK</SelectItem>
                        <SelectItem value="CA">CA</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="flex-1"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address" className="text-sm font-medium text-foreground mb-2 block">
                    Address (Current/Residential)
                  </Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state" className="text-sm font-medium text-foreground mb-2 block">
                      State
                    </Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium text-foreground mb-2 block">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="w-full"
                    />
                  </div>
                </div>

                
                <div className="pt-6">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="w-full rounded-3xl"
                    onClick={handleSubmit}
                  >
                    Update
                  </Button>
                </div>
              </div>
            </div>
        
        
      </div>
    </div>
  );
}

export default EditProfile;