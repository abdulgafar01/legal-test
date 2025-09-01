'use client';

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useUpdateUserProfile } from "@/hooks/useUpdateUserProfile";
import { useCountries } from "@/hooks/useCountries";

interface EditProfileForm {
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  rawPhone: string;
  phone_number: string;
  // address: string;
  state: string;
  city: string;
}

const EditProfile = () => {
  const router = useRouter();
  const { data: user } = useCurrentUser();
  const { mutate: updateProfile, isPending } = useUpdateUserProfile();
  const { data: countries = [] } = useCountries();

  const { register, setValue, watch, handleSubmit, reset } = useForm<EditProfileForm>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      rawPhone: "",
      // address: "",
      state: "",
      city: "",
      country: "NG",
    },
  });

  const rawPhone = watch("rawPhone");
  const selectedCountry = watch("country");

  useEffect(() => {
    if (user?.data && countries.length > 0) {
      const fullPhone = user.data.phone_number || "";
      const matchedDialCode = countries.find((c) =>
        fullPhone.startsWith(c.dial_code)
      );
      const dialCode = matchedDialCode?.dial_code || "";
      const raw = fullPhone.replace(dialCode, "");

      reset({
        first_name: user.data.first_name || "",
        last_name: user.data.last_name || "",
        email: user.data.email || "",
        phone_number: fullPhone,
        rawPhone: raw,
        // address: user.data.address || "",
        state: user.data.state || "",
        city: user.data.city || "",
        country: matchedDialCode?.code || user.data.country || "NG",
      });
    }
  }, [user, countries, reset]);

  // Rebuild phone_number on rawPhone/country change
  useEffect(() => {
    const dialCode = countries.find((c) => c.code === selectedCountry)?.dial_code || "";
    setValue("phone_number", `${dialCode}${rawPhone}`);
  }, [rawPhone, selectedCountry, countries, setValue]);

  const onSubmit = (data: EditProfileForm) => {
    updateProfile(data, {
      onSuccess: () => router.push("/dashboard/profile"),
    });
  };

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto mb-3">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-3">
          <Link href="/dashboard/profile" passHref>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-3 max-w-lg">
          {/* Profile photo placeholder */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-lg flex items-center border border-gray-900 justify-center overflow-hidden">
              {watch("first_name")?.charAt(0) || "?"}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                {watch("first_name")} {watch("last_name")}
              </h2>
              <p className="text-xs text-muted-foreground">{watch("email")}</p>
              <button
                type="button"
                className="text-sm text-[#8E8E93] bg-[#FFF9E7] cursor-pointer px-2.5 py-0.5 rounded-4xl hover:underline"
                onClick={() => alert("Photo upload not implemented")}
              >
                Edit photo
              </button>
            </div>
          </div>

          {/* Name inputs */}
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input id="first_name" {...register("first_name")} />
          </div>

          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" {...register("last_name")} />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" {...register("email")} />
          </div>

          {/* Phone + Dial code */}
          <div>
            <Label htmlFor="phone_number">Phone number</Label>
            <div className="flex gap-2">
              <Select
                value={selectedCountry}
                onValueChange={(value) => setValue("country", value)}
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

              <Input
                id="phone_number"
                placeholder="7012345678"
                {...register("rawPhone")}
                className="flex-1"
              />
            </div>
          </div>

          {/* Address */}
          {/* <div>
            <Label htmlFor="address">Address</Label>
            <Input id="address" {...register("address")} />
          </div> */}

          {/* State and City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="state">State</Label>
              <Input id="state" {...register("state")} />
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input id="city" {...register("city")} />
            </div>
          </div>

          {/* Submit */}
          <div className="pt-6">
            <Button
              type="submit"
              variant="outline"
              size="lg"
              className="w-full rounded-3xl"
              disabled={isPending}
            >
              {isPending ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
