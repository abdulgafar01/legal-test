'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Save, Loader2 } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { API_CONFIG } from '@/config/api'
import { toast } from 'sonner'

const profileUpdateSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  phone_number: z.string().min(10, 'Phone number must be at least 10 characters'),
  country: z.string().min(2, 'Country is required'),
  state: z.string().min(2, 'State is required'),
  city: z.string().min(2, 'City is required'),
  bio: z.string().optional(),
  education: z.string().optional(),
  hourly_rate: z.number().min(0, 'Hourly rate must be positive').optional(),
  specializations: z.array(z.string()).optional(),
})

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>

interface ProfileSettingsFormProps {
  user: any
}

const ProfileSettingsForm = ({ user }: ProfileSettingsFormProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newSpecialization, setNewSpecialization] = useState('')
  const queryClient = useQueryClient()

  const practitionerProfile = user.practitioner_profile

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty }
  } = useForm<ProfileUpdateForm>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      phone_number: user.phone_number || '',
      country: user.country || '',
      state: user.state || '',
      city: user.city || '',
      bio: practitionerProfile?.bio || '',
      education: practitionerProfile?.education || '',
      hourly_rate: practitionerProfile?.hourly_rate ? parseFloat(practitionerProfile.hourly_rate) : undefined,
      specializations: practitionerProfile?.specializations?.map((s: any) => s.name) || [],
    }
  })

  const specializations = watch('specializations') || []

  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileUpdateForm) => {
      const token = localStorage.getItem('access_token')
      const response = await axios.put(
        `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.profile.updateProfile}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    },
    onSuccess: () => {
      toast.success('Profile updated successfully!')
      setIsEditing(false)
      queryClient.invalidateQueries({ queryKey: ['current-user'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile')
    },
  })

  const onSubmit = (data: ProfileUpdateForm) => {
    updateProfileMutation.mutate(data)
  }

  const addSpecialization = () => {
    if (newSpecialization.trim() && !specializations.includes(newSpecialization.trim())) {
      setValue('specializations', [...specializations, newSpecialization.trim()], { shouldDirty: true })
      setNewSpecialization('')
    }
  }

  const removeSpecialization = (spec: string) => {
    setValue('specializations', specializations.filter(s => s !== spec), { shouldDirty: true })
  }

  if (!isEditing) {
    return (
      <div className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">First Name</Label>
              <p className="font-medium">{user.first_name || 'Not provided'}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Last Name</Label>
              <p className="font-medium">{user.last_name || 'Not provided'}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Phone Number</Label>
              <p className="font-medium">{user.phone_number || 'Not provided'}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Hourly Rate</Label>
              <p className="font-medium">
                {practitionerProfile?.hourly_rate ? `$${practitionerProfile.hourly_rate}` : 'Not set'}
              </p>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Country</Label>
              <p className="font-medium">{user.country || 'Not provided'}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">State</Label>
              <p className="font-medium">{user.state || 'Not provided'}</p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">City</Label>
              <p className="font-medium">{user.city || 'Not provided'}</p>
            </div>
          </div>
        </div>

        {/* Specializations */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Areas of Specialization</h3>
          <div className="flex flex-wrap gap-2">
            {practitionerProfile?.specializations?.map((spec: any) => (
              <Badge key={spec.id} variant="secondary">
                {spec.name}
              </Badge>
            )) || <p className="text-muted-foreground">No specializations added</p>}
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Bio</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {practitionerProfile?.bio || 'No bio provided'}
          </p>
        </div>

        {/* Education */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Education</h3>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {practitionerProfile?.education || 'No education information provided'}
          </p>
        </div>

        <Button onClick={() => setIsEditing(true)} className="mt-6">
          Edit Profile
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                aria-invalid={!!errors.first_name}
                {...register('first_name')}
              />
              {errors.first_name && <p className="mt-1 text-xs text-red-500">{errors.first_name.message}</p>}
            </div>
            <div>
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                aria-invalid={!!errors.last_name}
                {...register('last_name')}
              />
              {errors.last_name && <p className="mt-1 text-xs text-red-500">{errors.last_name.message}</p>}
            </div>
            <div>
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                aria-invalid={!!errors.phone_number}
                {...register('phone_number')}
                placeholder="+1234567890"
              />
              {errors.phone_number && <p className="mt-1 text-xs text-red-500">{errors.phone_number.message}</p>}
            </div>
            <div>
              <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
              <Input
                id="hourly_rate"
                type="number"
                step="0.01"
                aria-invalid={!!errors.hourly_rate}
                {...register('hourly_rate', { valueAsNumber: true })}
                placeholder="0.00"
              />
              {errors.hourly_rate && <p className="mt-1 text-xs text-red-500">{errors.hourly_rate.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                aria-invalid={!!errors.country}
                {...register('country')}
              />
              {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country.message}</p>}
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                aria-invalid={!!errors.state}
                {...register('state')}
              />
              {errors.state && <p className="mt-1 text-xs text-red-500">{errors.state.message}</p>}
            </div>
            <div>
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                aria-invalid={!!errors.city}
                {...register('city')}
              />
              {errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Specializations */}
      <Card>
        <CardHeader>
          <CardTitle>Areas of Specialization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2 mb-4">
            {specializations.map((spec, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {spec}
                <X
                  className="w-3 h-3 cursor-pointer hover:text-destructive"
                  onClick={() => removeSpecialization(spec)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newSpecialization}
              onChange={(e) => setNewSpecialization(e.target.value)}
              placeholder="Add specialization"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSpecialization())}
            />
            <Button type="button" onClick={addSpecialization} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bio */}
      <Card>
        <CardHeader>
          <CardTitle>Bio</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            {...register('bio')}
            placeholder="Tell clients about yourself, your experience, and your approach to legal practice..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            {...register('education')}
            placeholder="List your educational background, degrees, and relevant certifications..."
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          type="submit"
          disabled={!isDirty || updateProfileMutation.isPending}
          className="flex items-center gap-2"
        >
          {updateProfileMutation.isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Changes
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsEditing(false)}
          disabled={updateProfileMutation.isPending}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
}

export default ProfileSettingsForm
