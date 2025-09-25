"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Calendar, Clock, DollarSign, User, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format, parseISO, isSameDay } from 'date-fns';
import { createConsultationBooking, type TimeSlot, type ConsultationBookingData } from '@/lib/api/consultations';
import { toast } from 'sonner';

interface PractitionerDetail {
  id: number;
  user_info: {
    first_name: string;
    last_name: string;
    profile_image?: string | null;
  };
  specializations: Array<{
    id: number;
    name: string;
  }>;
  hourly_rate: number;
  available_slots: TimeSlot[];
}

interface TimeSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  practitioner: PractitionerDetail;
  onBookingSuccess: (consultationId: number) => void;
}

const TimeSlotModal: React.FC<TimeSlotModalProps> = ({
  isOpen,
  onClose,
  practitioner,
  onBookingSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bookedConsultationId, setBookedConsultationId] = useState<number | null>(null);

  const getSpecializationNames = (specializations: any): string[] => {
    try {
      if (!specializations) return [];
      if (Array.isArray(specializations) && specializations.length && typeof specializations[0] === 'object') {
        const names = specializations.map((s: any) => s?.name).filter(Boolean);
        return names.flatMap((n: any) => {
          if (typeof n === 'string') {
            const t = n.trim();
            if (t.startsWith('[')) {
              try {
                const parsed = JSON.parse(t);
                return Array.isArray(parsed)
                  ? parsed.map((v) => (typeof v === 'string' ? v : v?.name)).filter(Boolean)
                  : [n];
              } catch {
                return t.replace(/^\[|\]$/g, '').replace(/\"/g, '').split(',').map(s => s.trim()).filter(Boolean);
              }
            }
          }
          return [n];
        }).filter(Boolean);
      }
      if (Array.isArray(specializations)) return specializations.filter(Boolean);
      if (typeof specializations === 'string') {
        const trimmed = specializations.trim();
        if (trimmed.startsWith('[')) {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) return parsed.map((v) => (typeof v === 'string' ? v : v?.name)).filter(Boolean);
        }
        return trimmed.replace(/^\[|\]$/g, '').replace(/"/g, '').split(',').map(s => s.trim()).filter(Boolean);
      }
      return [];
    } catch {
      return [];
    }
  };

  // Group available slots by date
  const slotsByDate = (practitioner.available_slots || []).reduce((acc, slot) => {
    const date = slot.date; // Use flattened date field
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, TimeSlot[]>);

  const availableDates = Object.keys(slotsByDate).sort();

  // Show error if no slots available
  if (!practitioner.available_slots || practitioner.available_slots.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>No Available Slots</DialogTitle>
            <DialogDescription>
              {practitioner.user_info.first_name} {practitioner.user_info.last_name} doesn't have any available time slots at the moment.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-6">
              Please check back later or contact the practitioner directly.
            </p>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Reset selections when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedDate(null);
      setSelectedTimeSlot(null);
      setConsultationNotes('');
      setShowSuccess(false);
      setBookedConsultationId(null);
    }
  }, [isOpen]);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null);
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot);
  };

  const handleBooking = async () => {
    if (!selectedTimeSlot) return;

    setIsBooking(true);
    try {
      const bookingData: ConsultationBookingData = {
        practitioner_id: practitioner.id,
        time_slot_id: selectedTimeSlot.id,
        consultation_notes: consultationNotes.trim() || undefined,
      };

      const response = await createConsultationBooking(bookingData);
      
      if (response.success) {
        setBookedConsultationId(response.data.id);
        setShowSuccess(true);
        toast.success('Consultation booked successfully! 🎉');
      } else {
        toast.error('Failed to book consultation. Please try again.');
      }
    } catch (error: any) {
      console.error('Booking error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to book consultation. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsBooking(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
    if (bookedConsultationId) {
      onBookingSuccess(bookedConsultationId);
    }
  };

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleSuccessClose}>
        <DialogContent className="max-w-md">
          <div className="text-center py-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed! 🎉</h2>
            <p className="text-gray-600 mb-6">
              Your consultation with {practitioner.user_info.first_name} {practitioner.user_info.last_name} has been booked successfully.
            </p>
            
            {selectedTimeSlot && selectedDate && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>{selectedTimeSlot.start_time} - {selectedTimeSlot.end_time}</span>
                </div>
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span>${practitioner.hourly_rate}</span>
                </div>
              </div>
            )}
            
            <Button onClick={handleSuccessClose} className="w-full">
              View My Consultations
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <User className="w-5 h-5" />
            <span>Book Consultation with {practitioner.user_info.first_name} {practitioner.user_info.last_name}</span>
          </DialogTitle>
          <DialogDescription>
            Select your preferred date and time slot for the consultation
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Practitioner Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-20 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {practitioner.user_info.first_name[0]}{practitioner.user_info.last_name[0]}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {practitioner.user_info.first_name} {practitioner.user_info.last_name}
                </h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {getSpecializationNames(practitioner.specializations).map((name, idx) => (
                    <Badge
                      key={`${name}-${idx}`}
                      variant="secondary"
                      className="bg-blue-50 text-blue-700 border border-blue-200"
                    >
                      {name}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm font-medium text-green-600">
                  ${practitioner.hourly_rate}/hour
                </p>
              </div>
            </div>
          </div>

          {/* Date Selection */}
          <div>
            <Label className="text-base font-medium">Select Date</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {availableDates.map((date) => (
                <Button
                  key={date}
                  variant={selectedDate === date ? "default" : "outline"}
                  onClick={() => handleDateSelect(date)}
                  className="h-auto p-3 text-left cursor-pointer hover:bg-gray-300"
                >
                  <div>
                    <div className="font-medium">
                      {format(parseISO(date), 'MMM d')}
                    </div>
                    <div className="text-xs opacity-75">
                      {format(parseISO(date), 'EEEE')}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Time Slot Selection */}
          {selectedDate && (
            <div>
              <Label className="text-base font-medium">Select Time</Label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2 mt-2">
                {slotsByDate[selectedDate]?.map((slot) => (
                  <Button
                    key={slot.id}
                    variant={selectedTimeSlot?.id === slot.id ? "default" : "outline"}
                    onClick={() => handleTimeSlotSelect(slot)}
                    disabled={slot.is_booked}
                    className="h-auto p-2 cursor-pointer hover:bg-gray-300"
                  >
                    <div className="text-center">
                      <div className="text-sm font-medium">
                        {slot.start_time}
                      </div>
                      <div className="text-xs opacity-75">
                        {slot.end_time}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Consultation Notes */}
          <div>
            <Label htmlFor="notes" className="text-base font-medium">
              Consultation Notes (Optional)
            </Label>
            <Textarea
              id="notes"
              placeholder="Describe your legal issue or what you'd like to discuss..."
              value={consultationNotes}
              onChange={(e) => setConsultationNotes(e.target.value)}
              className="mt-2"
              rows={3}
            />
          </div>

          {/* Booking Summary */}
          {selectedTimeSlot && selectedDate && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Booking Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Date:</span>
                  <span>{format(parseISO(selectedDate), 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time:</span>
                  <span>{selectedTimeSlot.start_time} - {selectedTimeSlot.end_time}</span>
                </div>
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span>1 hour</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>Total:</span>
                  <span>${practitioner.hourly_rate}</span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleBooking}
              disabled={!selectedTimeSlot || isBooking}
              className="flex-1 cursor-pointer"
            >
              {isBooking ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TimeSlotModal;
