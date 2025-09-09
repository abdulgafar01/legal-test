import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Edit2, Save, Loader2 } from 'lucide-react';
import { ApiService } from '@/config/apiService';

interface ProfileSettingsFormProps {
  profile: any;
  onProfileUpdate: (updatedProfile: any) => void;
}

const CustomInput = ({ label, value, onChange, placeholder, type = 'text', error, disabled = false }: any) => (
  <div className="space-y-1">
    <Label className="text-sm font-medium">{label}</Label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
        error ? 'border-red-500' : 'border-gray-300'
      } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
    />
    {error && <p className="text-red-500 text-xs">{error}</p>}
  </div>
);

export const ProfileSettingsForm = ({ profile, onProfileUpdate }: ProfileSettingsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    bio: '',
    consultation_rate: '',
    hire_rate: '',
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (profile) {
      console.log('🔍 Profile data received:', profile);
      
      // Handle nested practitioner profile structure
      const practitionerProfile = profile.practitioner_profile || {};
      
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone_number: profile.phone_number || '',
        bio: practitionerProfile.bio || '',
        consultation_rate: practitionerProfile.hourly_rate || '',
        hire_rate: practitionerProfile.hourly_rate || '', // Using same rate for both
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await ApiService.updatePractitionerProfile(formData);
      onProfileUpdate(response.data);
      setIsEditing(false);
    } catch (error: any) {
      if (error.response?.data) {
        setErrors(error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      const practitionerProfile = profile.practitioner_profile || {};
      
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: profile.email || '',
        phone_number: profile.phone_number || '',
        bio: practitionerProfile.bio || '',
        consultation_rate: practitionerProfile.hourly_rate || '',
        hire_rate: practitionerProfile.hourly_rate || '',
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  return (
    <div className="h-full overflow-y-auto pr-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Update your personal information and rates
            </CardDescription>
          </div>
          {!isEditing && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              Edit
            </Button>
          )}
        </CardHeader>
        <CardContent className="pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                label="First Name"
                value={formData.first_name}
                onChange={(e: any) => setFormData({ ...formData, first_name: e.target.value })}
                placeholder="Enter first name"
                error={errors.first_name}
                disabled={!isEditing}
              />
              <CustomInput
                label="Last Name"
                value={formData.last_name}
                onChange={(e: any) => setFormData({ ...formData, last_name: e.target.value })}
                placeholder="Enter last name"
                error={errors.last_name}
                disabled={!isEditing}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter email address"
                error={errors.email}
                disabled={!isEditing}
              />
              <CustomInput
                label="Phone Number"
                value={formData.phone_number}
                onChange={(e: any) => setFormData({ ...formData, phone_number: e.target.value })}
                placeholder="Enter phone number"
                error={errors.phone_number}
                disabled={!isEditing}
              />
            </div>

            {/* Bio */}
            <div className="space-y-1">
              <Label className="text-sm font-medium">Bio</Label>
              <Textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself and your expertise..."
                rows={4}
                disabled={!isEditing}
                className={errors.bio ? 'border-red-500' : ''}
              />
              {errors.bio && <p className="text-red-500 text-xs">{errors.bio}</p>}
            </div>

            {/* Rates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomInput
                label="Consultation Rate ($/hour)"
                type="number"
                value={formData.consultation_rate}
                onChange={(e: any) => setFormData({ ...formData, consultation_rate: e.target.value })}
                placeholder="Enter consultation rate"
                error={errors.consultation_rate}
                disabled={!isEditing}
              />
              <CustomInput
                label="Hire Rate ($/hour)"
                type="number"
                value={formData.hire_rate}
                onChange={(e: any) => setFormData({ ...formData, hire_rate: e.target.value })}
                placeholder="Enter hire rate"
                error={errors.hire_rate}
                disabled={!isEditing}
              />
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Save Changes
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
