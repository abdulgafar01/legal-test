'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ApiService } from '@/config/apiService';
import { ChevronLeft, ChevronRight, Clock, Plus, Trash2 } from 'lucide-react';

interface TimeSlot {
  id?: number;
  start_time?: string;
  end_time?: string;
}

interface SpecificAvailability {
  id?: number;
  date: string;
  is_available: boolean;
  time_slots: TimeSlot[];
}

interface RecurringAvailability {
  id?: number;
  day_of_week: number;
  start_time?: string;
  end_time?: string;
  default_start_time?: string;
  default_end_time?: string;
  is_active: boolean;
}

interface AvailabilityData {
  specific_dates: SpecificAvailability[];
  recurring: RecurringAvailability[];
}

const AvailabilityCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState<AvailabilityData>({
    specific_dates: [],
    recurring: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [showAddRecurring, setShowAddRecurring] = useState(false);
  const [newSlotTime, setNewSlotTime] = useState({ start: '', end: '' });

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const [availabilityRes, recurringRes] = await Promise.all([
        ApiService.getAvailability(),
        ApiService.getRecurringAvailability()
      ]);
      
      console.log('🔍 Availability API Response:', availabilityRes.data);
      console.log('🔍 Recurring API Response:', recurringRes.data);
      
      setAvailability({
        specific_dates: availabilityRes.data.results || [],
        recurring: recurringRes.data.results || []
      });
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

    // Convert JavaScript day of week (0=Sunday) to Django day of week (0=Monday)
  const jsToDjangoDayOfWeek = (jsDay: number): number => {
    return jsDay === 0 ? 6 : jsDay - 1;
  };

  // Convert Django day of week (0=Monday) to JavaScript day of week (0=Sunday)  
  const djangoToJsDayOfWeek = (djangoDay: number): number => {
    return djangoDay === 6 ? 0 : djangoDay + 1;
  };

  const getAvailabilityForDate = (date: Date) => {
    // Use timezone-safe date string generation
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    
    const jsDay = date.getDay();
    const djangoDay = jsToDjangoDayOfWeek(jsDay);
    // Check specific date availability first
    const specificAvailability = availability.specific_dates.find(
      (slot: SpecificAvailability) => slot.date === dateStr
    );
    
    if (specificAvailability) {
      return {
        hasAvailability: specificAvailability.is_available,
        isSpecific: true,
        specificData: specificAvailability
      };
    }
    
    // Check recurring availability using Django day numbering
    const recurringAvailability = availability.recurring.filter(
      (slot: RecurringAvailability) => 
      slot.day_of_week === djangoDay && slot.is_active
    );
    
    if (recurringAvailability.length > 0) {
      // For recurring availability, assume available if time slots exist
      return {
        hasAvailability: true,
        isSpecific: false,
        recurringData: recurringAvailability
      };
    }
    
    return {
      hasAvailability: false,
      isSpecific: false
    };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(formatDate(date));
    setShowAddSlot(true);
  };

  const addTimeSlot = async () => {
    if (!selectedDate || !newSlotTime.start || !newSlotTime.end) return;

    try {
      const slotData = {
        date: selectedDate,
        is_available: true,
        is_all_day: false,
        notes: '',
        time_slots: [
          {
            start_time: newSlotTime.start + ':00', // Add seconds
            end_time: newSlotTime.end + ':00',     // Add seconds
            booking_notes: ''
          }
        ]
      };

      console.log('🔍 Sending availability data:', slotData);
      await ApiService.updateAvailability(slotData);
      await fetchAvailability();
      
      setShowAddSlot(false);
      setNewSlotTime({ start: '', end: '' });
      setSelectedDate(null);
    } catch (error) {
      console.error('Error adding time slot:', error);
    }
  };

  const deleteTimeSlot = async (slotId: number) => {
    try {
      await ApiService.deleteAvailability(slotId);
      await fetchAvailability();
    } catch (error) {
      console.error('Error deleting time slot:', error);
    }
  };

  const toggleRecurringAvailability = async (day: number) => {
    try {
      const existing = availability.recurring.find(slot => slot.day_of_week === day);
      
      if (existing) {
        await ApiService.deleteRecurringAvailability(existing.id!);
        await fetchAvailability();
      } else {
        // Open modal for time selection
        setSelectedDay(day);
        setNewSlotTime({ start: '09:00', end: '17:00' });
        setShowAddRecurring(true);
      }
    } catch (error) {
      console.error('Error toggling recurring availability:', error);
    }
  };

  const addRecurringAvailability = async () => {
    if (selectedDay === null || !newSlotTime.start || !newSlotTime.end) return;

    try {
      setLoading(true);
      const recurringData = {
        day_of_week: selectedDay!,
        is_available: true,
        is_all_day: false,
        default_start_time: newSlotTime.start + ':00',
        default_end_time: newSlotTime.end + ':00',
        is_active: true
      };
      
      await ApiService.updateRecurringAvailability(recurringData);
      await fetchAvailability();
      
      setShowAddRecurring(false);
      setSelectedDay(null);
      setNewSlotTime({ start: '', end: '' });
    } catch (error) {
      console.error('Error adding recurring availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timeStr: string | undefined | null) => {
    if (!timeStr) {
      return 'N/A';
    }
    
    const timeParts = timeStr.split(':');
    if (timeParts.length < 2) {
      return timeStr; // Return as-is if not in expected format
    }
    
    const [hours, minutes] = timeParts;
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 h-full overflow-y-auto pb-32">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Availability Calendar
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('prev')}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-[200px] text-center">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigateMonth('next')}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {/* Day headers */}
            {daysOfWeek.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day.slice(0, 3)}
              </div>
            ))}
            
            {/* Calendar days */}
            {getCalendarDays().map((date, index) => {
              if (!date) {
                return <div key={index} className="p-2"></div>;
              }

              const availability = getAvailabilityForDate(date);
              const isToday = formatDate(date) === formatDate(new Date());
              const isPast = date < new Date();

              return (
                <button
                  key={formatDate(date)}
                  onClick={() => !isPast && handleDateClick(date)}
                  disabled={isPast}
                  className={`
                    p-2 text-center text-sm border rounded-md transition-colors relative
                    ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                    ${availability.hasAvailability ? 'bg-green-50 border-green-200' : ''}
                    ${isPast ? 'text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}
                  `}
                >
                  <span>{date.getDate()}</span>
                  {availability.hasAvailability && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-50 border border-blue-500 rounded"></div>
              <span>Today</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Recurring Availability */}
      <Card>
        <CardHeader>
          <CardTitle>Weekly Recurring Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {daysOfWeek.map((day, index) => {
              // Convert JS day index to Django day index
              const djangoDayIndex = jsToDjangoDayOfWeek(index);
              const recurringSlot = availability.recurring.find(slot => slot.day_of_week === djangoDayIndex);
              
              return (
                <div key={day} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium min-w-[100px]">{day}</span>
                    {recurringSlot && (
                      <Badge variant="secondary">
                        {formatTime((recurringSlot.default_start_time || recurringSlot.start_time || '09:00'))} - {formatTime((recurringSlot.default_end_time || recurringSlot.end_time || '17:00'))}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant={recurringSlot ? "destructive" : "default"}
                    size="sm"
                    onClick={() => toggleRecurringAvailability(djangoDayIndex)}
                  >
                    {recurringSlot ? 'Remove' : 'Add Availability'}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add Time Slot Modal */}
      {showAddSlot && selectedDate && (
        <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CardContent className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Add Time Slot for {new Date(selectedDate).toLocaleDateString()}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input
                  type="time"
                  value={newSlotTime.start}
                  onChange={(e) => setNewSlotTime(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <input
                  type="time"
                  value={newSlotTime.end}
                  onChange={(e) => setNewSlotTime(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddSlot(false);
                    setSelectedDate(null);
                    setNewSlotTime({ start: '', end: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={addTimeSlot}>
                  Add Slot
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Recurring Availability Modal */}
      {showAddRecurring && selectedDay !== null && (
        <Card className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <CardContent className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Add Weekly Availability for {daysOfWeek[djangoToJsDayOfWeek(selectedDay)]}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Start Time</label>
                <input
                  type="time"
                  value={newSlotTime.start}
                  onChange={(e) => setNewSlotTime(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">End Time</label>
                <input
                  type="time"
                  value={newSlotTime.end}
                  onChange={(e) => setNewSlotTime(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddRecurring(false);
                    setSelectedDay(null);
                    setNewSlotTime({ start: '', end: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={addRecurringAvailability} disabled={loading}>
                  {loading ? 'Adding...' : 'Add Weekly Availability'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Date Specific Availability */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle>Specific Availability for {new Date(selectedDate).toLocaleDateString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {availability.specific_dates
                .filter(avail => avail.date === selectedDate && avail.is_available)
                .flatMap((avail, availIndex) => 
                  (avail.time_slots || []).map((slot, slotIndex) => (
                    <div key={`${availIndex}-${slotIndex}`} className="flex items-center justify-between p-2 border rounded">
                      <Badge variant="secondary">
                        {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
                      </Badge>
                      {slot.id && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteTimeSlot(slot.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))
                )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AvailabilityCalendar;
