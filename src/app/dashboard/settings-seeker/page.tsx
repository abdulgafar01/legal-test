'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useUpdateUserProfile } from '@/hooks/useUpdateUserProfile'
import { useCountries } from '@/hooks/useCountries'
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type FormValues = {
  full_name: string
  email: string
  country: string
  rawPhone: string
  phone_number: string
  state: string
  city: string
  date_of_birth: string
}

const SettingsSeekerPage = () => {
  const { data: user } = useCurrentUser()
  const { mutate: updateProfile, isPending } = useUpdateUserProfile()
  const { data: countries = [] } = useCountries()

  const { register, setValue, watch, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      full_name: '',
      email: '',
      country: 'NG',
      rawPhone: '',
      phone_number: '',
      state: '',
      city: '',
      date_of_birth: '',
    },
  })

  const rawPhone = watch('rawPhone')
  const selectedCountry = watch('country')

  useEffect(() => {
    if (user?.data && countries.length > 0) {
      const u = user.data
      const fullPhone = u.phone_number || ''
      const matchedDialCode = countries.find((c) => fullPhone.startsWith(c.dial_code))
      const dialCode = matchedDialCode?.dial_code || ''
      const raw = fullPhone.replace(dialCode, '')

      reset({
        full_name: [u.first_name, u.last_name].filter(Boolean).join(' ').trim(),
        email: u.email || '',
        country: matchedDialCode?.code || u.country || 'NG',
        rawPhone: raw,
        phone_number: fullPhone,
        state: u.state || '',
        city: u.city || '',
        date_of_birth: u.date_of_birth || '',
      })
    }
  }, [user, countries, reset])

  useEffect(() => {
    const dialCode = countries.find((c) => c.code === selectedCountry)?.dial_code || ''
    setValue('phone_number', `${dialCode}${rawPhone}`)
  }, [rawPhone, selectedCountry, countries, setValue])

  const onSubmit = (values: FormValues) => {
    const name = values.full_name?.trim() || ''
    const parts = name.split(/\s+/)
    const first_name = parts.shift() || ''
    const last_name = parts.join(' ')

    const payload: Record<string, unknown> = {
      first_name,
      last_name,
      phone_number: values.phone_number,
      country: values.country,
      state: values.state,
      city: values.city,
      date_of_birth: values.date_of_birth || undefined,
    }

    updateProfile(payload, {
      onSuccess: () => {
        toast.success('Profile updated successfully')
      },
    })
  }

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto mb-3">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center gap-4 mb-3">
          <Link href="/dashboard/profile" passHref className="cursor-pointer">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-2xl">
              {/* Photo */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg flex items-center border border-gray-900 justify-center overflow-hidden">
                  {(watch('full_name')?.charAt(0) || '?').toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold">{watch('full_name') || 'Your name'}</p>
                  <p className="text-xs text-muted-foreground">{watch('email') || 'you@example.com'}</p>
                  <button
                    type="button"
                    className="text-sm text-[#8E8E93] bg-[#FFF9E7] cursor-pointer px-2.5 py-0.5 rounded-4xl"
                    onClick={() => toast.message('Photo upload coming soon')}
                  >
                    Upload photo
                  </button>
                </div>
              </div>

              {/* Full name */}
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input id="full_name" {...register('full_name')} />
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" {...register('email')} disabled />
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="phone">Phone number</Label>
                <div className="flex gap-2">
                  <Select value={selectedCountry} onValueChange={(v) => setValue('country', v)}>
                    <SelectTrigger className="w-[110px]">
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
                                className="h-4 w-4 rounded-sm"
                              />
                              ({country.dial_code})
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Input placeholder="7012345678" {...register('rawPhone')} className="flex-1" />
                </div>
              </div>

              {/* Address (UI only for now) */}
              <div>
                <Label>Address (Current/Residential)</Label>
                <Input placeholder="Not editable" disabled />
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" {...register('state')} />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input id="city" {...register('city')} />
                </div>
              </div>

              {/* DOB */}
              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input id="date_of_birth" placeholder="YYYY-MM-DD" {...register('date_of_birth')} />
              </div>

              <div className="pt-2">
                <Button type="submit" variant="outline" size="lg" className="w-full rounded-3xl cursor-pointer" disabled={isPending}>
                  {isPending ? 'Updating…' : 'Update'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default SettingsSeekerPage
