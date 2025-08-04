'use client';

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUpdateUserProfile } from "@/hooks/useUpdateUserProfile";
import { useCountries } from "@/hooks/useCountries";


const EditProfile = () => {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { mutate: updateProfile, isPending } = useUpdateUserProfile();
  const { data: countries = [] } = useCountries()
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    rawPhone: "",
    address: '',
    state: '',
    city: '',
    country: '',
  });

  // Populate form with user data
  useEffect(() => {
  if (user?.data) {
    const fullPhone = user.data.phone_number || "";
    const matchedDialCode = countries.find((c) =>
      fullPhone.startsWith(c.dial_code)
    );

    const dialCode = matchedDialCode?.dial_code || "";
    const rawPhone = fullPhone.replace(dialCode, "");

    setFormData({
      first_name: user.data.first_name || "",
      last_name: user.data.last_name || "",
      email: user.data.email || "",
      phone_number: fullPhone,
      rawPhone: rawPhone,
      address: user.data.address || "",
      state: user.data.state || "",
      city: user.data.city || "",
      country: matchedDialCode?.code || user.data.country || "",
    });
  }
}, [user]);


  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    updateProfile(formData, {
      onSuccess: () => {
        router.push("/dashboard/profile");
      },
    });
  };

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto mb-3">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-3">
          <Link href="/dashboard/profile" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
        </div>

        <div className="flex flex-col gap-4 p-3 max-w-lg">
          {/* Profile Photo Placeholder */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-lg flex items-center border border-gray-900 justify-center overflow-hidden">
              {formData.first_name?.charAt(0) || "?"}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                {formData.first_name} {formData.last_name}
              </h2>
              <p className="text-xs text-muted-foreground">{formData.email}</p>
              <button
                className="text-sm text-[#8E8E93] bg-[#FFF9E7] cursor-pointer px-2.5 py-0.5 rounded-4xl hover:underline"
                onClick={() => alert("Photo upload not implemented")}
              >
                Edit photo
              </button>
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-4 max-w-lg">
            <div>
              <Label className="mb-2" htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                value={formData.first_name}
                onChange={(e) => handleInputChange("first_name", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                value={formData.last_name}
                onChange={(e) => handleInputChange("last_name", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
            </div>

            <div>
  <Label htmlFor="phone_number">Phone number</Label>
  <div className="flex gap-2">
    {/* Country Select with Flags */}
    <Select
      value={formData.country}
      onValueChange={(countryCode) => {
        const selected = countries.find((c) => c.code === countryCode);
        if (!selected) return;

        handleInputChange("country", selected.code);

        // Strip existing dial code from phone if already applied
        const rawPhone = formData.phone_number.replace(/^\+\d+/, "").trim();
        const updatedPhone = `${selected.dial_code}${rawPhone}`;

        handleInputChange("phone_number", updatedPhone);
      }}
    >
      <SelectTrigger className="w-fit">
        <SelectValue placeholder="Country" />
      </SelectTrigger>
      <SelectContent>
        {countries
          .filter((c) => c.is_active)
          .map((country) => (
            <SelectItem key={country.code} value={country.code}>
              <div className="flex items-center gap-2">
                <Icon
                  icon={`flag:${country.code.toLowerCase()}-4x3`}
                  className="h-5 w-5 rounded-sm"
                />
                ({country.dial_code})
              </div>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>

        {/* Raw Phone Input */}
        <Input
          id="phone_number"
          placeholder="7012345678"
          value={formData.phone_number} // show raw phone
          onChange={(e) => {
            const raw = e.target.value;
            const dialCode =
              countries.find((c) => c.code === formData.country)?.dial_code || "";
            handleInputChange("rawPhone", raw);
            // handleInputChange("phone_number", `${dialCode}${raw}`);
          }}
          className="flex-1"
        />
  </div>
            </div>

            <div>
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
              </div>
            </div>

            <div className="pt-6">
              <Button
                variant="outline"
                size="lg"
                className="w-full rounded-3xl"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? "Updating..." : "Update"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
