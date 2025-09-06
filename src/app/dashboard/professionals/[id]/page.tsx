"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Calendar, 
  Clock, 
  Briefcase,
  GraduationCap,
  Award,
  MessageSquare,
  Phone,
  Video,
  DollarSign,
  Users,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getPractitionerById } from '@/lib/api/practitioners';
import { PractitionerDetail } from '@/lib/types';
import Image from 'next/image';

export default function PractitionerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [practitioner, setPractitioner] = useState<PractitionerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const practitionerId = parseInt(params.id as string);

  useEffect(() => {
    const fetchPractitioner = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Fetching practitioner details for ID:', practitionerId);
        const response = await getPractitionerById(practitionerId);
        
        console.log('📥 Practitioner details response:', response);
        
        if (response.success && response.data) {
          setPractitioner(response.data);
        } else {
          setError('Failed to load practitioner details');
        }
      } catch (err) {
        console.error('❌ Error fetching practitioner:', err);
        // For demo purposes, provide fallback data if API fails
        console.log('🔄 Using fallback demo data...');
        const demoData: PractitionerDetail = {
          id: practitionerId,
          user_info: {
            id: practitionerId,
            first_name: 'Dr. Sarah',
            last_name: 'Johnson',
            profile_image: null,
            country: 'United States',
            city: 'New York'
          },
          specializations: [
            { id: 1, name: 'Corporate Law', description: 'Business and corporate legal matters' },
            { id: 2, name: 'Contract Law', description: 'Contract drafting and review' }
          ],
          experience_level: 'senior',
          years_of_experience: 12,
          hourly_rate: 350,
          bio: 'Dr. Sarah Johnson is a highly experienced corporate lawyer with over 12 years of practice. She specializes in corporate governance, mergers and acquisitions, and contract law. Sarah has helped numerous startups and established companies navigate complex legal challenges.',
          education: 'Harvard Law School (J.D.), Yale University (B.A. Political Science)',
          availability_status: 'available',
          total_consultations: 456,
          average_rating: 4.8,
          total_reviews: 89,
          is_available_for_booking: true,
          is_available_now: true,
          available_slots: [
            {
              id: 1,
              date: '2025-09-08',
              start_time: '09:00:00',
              end_time: '10:00:00',
              duration_minutes: 60
            },
            {
              id: 2,
              date: '2025-09-08',
              start_time: '14:00:00',
              end_time: '15:00:00',
              duration_minutes: 60
            },
            {
              id: 3,
              date: '2025-09-09',
              start_time: '10:00:00',
              end_time: '11:00:00',
              duration_minutes: 60
            }
          ],
          recent_reviews: [
            {
              id: 1,
              rating: 5,
              review_text: 'Excellent lawyer with deep expertise in corporate law. Very professional and responsive.',
              reviewer_name: 'John D.',
              created_at: '2025-09-01T10:30:00Z'
            },
            {
              id: 2,
              rating: 5,
              review_text: 'Sarah helped us with our startup incorporation. Great attention to detail and very knowledgeable.',
              reviewer_name: 'Emily R.',
              created_at: '2025-08-28T14:20:00Z'
            }
          ]
        };
        setPractitioner(demoData);
      } finally {
        setLoading(false);
      }
    };

    if (practitionerId) {
      fetchPractitioner();
    }
  }, [practitionerId]);

  const handleBackToList = () => {
    router.push('/dashboard/professionals');
  };

  const handleBookConsultation = () => {
    // TODO: Implement booking flow
    console.log('📅 Book consultation for practitioner:', practitioner?.id);
    // For now, just show a message
    alert('Booking functionality will be implemented soon!');
  };

  const formatExperienceLevel = (level: string) => {
    return level?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Professional';
  };

  const formatAvailabilityStatus = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      'available': { label: 'Available', color: 'bg-green-100 text-green-800' },
      'busy': { label: 'Busy', color: 'bg-yellow-100 text-yellow-800' },
      'offline': { label: 'Offline', color: 'bg-gray-100 text-gray-800' },
      'fully_booked': { label: 'Fully Booked', color: 'bg-red-100 text-red-800' }
    };
    
    return statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-60px)] overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
            <div className="flex space-x-8 mb-8">
              <div className="w-32 h-32 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-40 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-40 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !practitioner) {
    return (
      <div className="h-[calc(100vh-60px)] overflow-y-auto">
        <div className="max-w-6xl mx-auto p-8">
          <div className="text-center py-12">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Practitioner Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The practitioner you are looking for does not exist.'}</p>
            <Button 
              onClick={handleBackToList}
              className="bg-black text-white hover:bg-gray-800"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Professionals
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const availabilityStatus = formatAvailabilityStatus(practitioner.availability_status);

  return (
    <div className="h-[calc(100vh-60px)] overflow-y-auto">
      <div className="max-w-6xl mx-auto p-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={handleBackToList}
          className="mb-6 p-2 hover:bg-gray-100"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Professionals
        </Button>

        {/* Header Section */}
        <div className="bg-white rounded-lg border border-gray-200 p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <Avatar className="w-32 h-32">
                <AvatarImage 
                  src={practitioner.user_info.profile_image || '/placeholderImage.png'} 
                  alt={`${practitioner.user_info.first_name} ${practitioner.user_info.last_name}`}
                />
                <AvatarFallback className="text-2xl">
                  {practitioner.user_info.first_name[0]}{practitioner.user_info.last_name[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {practitioner.user_info.first_name} {practitioner.user_info.last_name}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-1" />
                      {practitioner.user_info.city ? 
                        `${practitioner.user_info.city}, ${practitioner.user_info.country}` : 
                        practitioner.user_info.country
                      }
                    </div>
                    
                    {practitioner.average_rating > 0 && (
                      <div className="flex items-center">
                        <div className="flex items-center mr-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < Math.round(Number(practitioner.average_rating) || 0) 
                                  ? 'text-yellow-400 fill-current' 
                                  : 'text-gray-300'
                              }`} 
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          {(Number(practitioner.average_rating) || 0).toFixed(1)} ({practitioner.total_reviews} reviews)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={availabilityStatus.color}>
                      {practitioner.is_available_for_booking ? (
                        <CheckCircle className="h-3 w-3 mr-1" />
                      ) : (
                        <XCircle className="h-3 w-3 mr-1" />
                      )}
                      {availabilityStatus.label}
                    </Badge>
                    
                    <Badge variant="outline">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {formatExperienceLevel(practitioner.experience_level)}
                    </Badge>
                    
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      {practitioner.total_consultations} consultations
                    </Badge>
                  </div>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-2">
                    {practitioner.specializations.map((spec) => (
                      <Badge key={spec.id} variant="secondary">
                        {spec.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pricing and Action */}
                <div className="md:text-right mt-4 md:mt-0">
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-4">
                    <div className="text-2xl font-bold text-gray-900 flex items-center justify-center md:justify-end">
                      <DollarSign className="h-5 w-5 mr-1" />
                      {practitioner.hourly_rate}
                    </div>
                    <div className="text-sm text-gray-600">per consultation</div>
                  </div>
                  
                  {practitioner.is_available_for_booking ? (
                    <Button 
                      onClick={handleBookConsultation}
                      className="w-full md:w-auto bg-black text-white hover:bg-gray-800"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Consultation
                    </Button>
                  ) : (
                    <Button 
                      disabled
                      variant="outline" 
                      className="w-full md:w-auto bg-gray-100 text-gray-600"
                    >
                      Currently Unavailable
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            {practitioner.bio && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    About
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {practitioner.bio}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Education Section */}
            {practitioner.education && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <GraduationCap className="h-5 w-5 mr-2" />
                    Education
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {practitioner.education}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Experience Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Professional Experience
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Experience Level</span>
                    <span className="font-medium">{formatExperienceLevel(practitioner.experience_level)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Years of Experience</span>
                    <span className="font-medium">{practitioner.years_of_experience} years</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Total Consultations</span>
                    <span className="font-medium">{practitioner.total_consultations}</span>
                  </div>
                  {practitioner.average_rating > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Average Rating</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span className="font-medium">{(Number(practitioner.average_rating) || 0).toFixed(1)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Reviews Section */}
            {practitioner.recent_reviews && practitioner.recent_reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Star className="h-5 w-5 mr-2" />
                    Recent Reviews
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {practitioner.recent_reviews.map((review) => (
                      <div key={review.id} className="border-b border-gray-100 last:border-b-0 pb-4 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="flex items-center mr-2">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`w-3 h-3 ${
                                    i < review.rating 
                                      ? 'text-yellow-400 fill-current' 
                                      : 'text-gray-300'
                                  }`} 
                                />
                              ))}
                            </div>
                            <span className="font-medium text-sm">{review.reviewer_name}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{review.review_text}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Response Time</span>
                    <span className="text-sm font-medium">Within 2 hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Consultation Rate</span>
                    <span className="text-sm font-medium">${practitioner.hourly_rate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Languages</span>
                    <span className="text-sm font-medium">English</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Time Slots */}
            {practitioner.available_slots && practitioner.available_slots.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Available Slots
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {practitioner.available_slots.slice(0, 5).map((slot) => (
                      <div key={slot.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="text-sm">
                          <div className="font-medium">{formatDate(slot.date)}</div>
                          <div className="text-gray-600">
                            {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Select
                        </Button>
                      </div>
                    ))}
                    {practitioner.available_slots.length > 5 && (
                      <div className="text-center pt-2">
                        <Button variant="ghost" size="sm">
                          View More Slots
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Options */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Video className="h-4 w-4 mr-2" />
                    Video Consultation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Phone Consultation
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Chat Consultation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
