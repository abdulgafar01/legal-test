import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from './ui/badge';
import {
  getMyConsultations,
  isConsultationTimeReady,
  getTimeUntilConsultation,
  type Consultation
} from '@/lib/api/consultations';
import JoinVideoButton from './JoinVideoButton';
import { format, parseISO } from 'date-fns';
import { useAccountTypeStore } from '@/stores/useAccountTypeStore';
import { getCurrentUserId } from '@/lib/auth';
import { useTranslations } from 'next-intl';

interface ConsultationDashboardProps {
  onSelectChat: (chatId: string) => void;
}

const ConsultationDashboard = ({ onSelectChat }: ConsultationDashboardProps) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { accountType } = useAccountTypeStore();
  const currentUserId = getCurrentUserId();
  const [recentlyCompleted, setRecentlyCompleted] = useState<Set<number>>(new Set());
  const t = useTranslations('consultation');

  useEffect(() => {
    loadConsultations();
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail: any = (e as CustomEvent).detail;
      if (!detail || !detail.consultation_id) return;
      setConsultations(prev =>
        prev.map(c => {
          if (c.id === detail.consultation_id) {
            const updated = {
              ...c,
              status_info: { ...c.status_info, name: detail.status },
              completed_at: detail.completed_at || c.completed_at
            };
            if (detail.status === 'completed') {
              setRecentlyCompleted(rc => {
                const next = new Set(rc);
                next.add(c.id);
                setTimeout(() => {
                  setRecentlyCompleted(inner => {
                    const clone = new Set(inner);
                    clone.delete(c.id);
                    return clone;
                  });
                }, 1200);
                return next;
              });
            }
            return updated;
          }
          return c;
        })
      );
    };
    window.addEventListener('consultation-status-changed', handler as EventListener);
    return () => window.removeEventListener('consultation-status-changed', handler as EventListener);
  }, []);

  const loadConsultations = async () => {
    try {
      setLoading(true);
      const response = await getMyConsultations();
      const items = (response as any).success
        ? (response as any).data
        : (response as any).results;
      if (Array.isArray(items)) {
        setConsultations(items);
      }
    } catch (error) {
      console.error('Error loading consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConsultations = consultations.filter(consultation => {
    const seeker = consultation.service_seeker_info;
    const practitioner = consultation.practitioner_info;
    const isUserPractitioner = currentUserId === practitioner.user_id;
    const counterpart = isUserPractitioner ? seeker : practitioner;
    const fullName = `${counterpart.first_name} ${counterpart.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const now = new Date();
  const toDateTime = (c: Consultation) =>
    new Date(`${c.time_slot_info.date}T${c.time_slot_info.start_time}`);
  const todayDateStr = now.toDateString();

  const previousConsultations = filteredConsultations.filter(
    c => c.status_info.name === 'completed'
  );
  const activeOrUpcoming = filteredConsultations.filter(
    c => c.status_info.name !== 'completed'
  );

  const todayConsultations = activeOrUpcoming.filter(c => {
    const d = new Date(c.time_slot_info.date);
    return d.toDateString() === todayDateStr;
  });
  const upcomingConsultations = activeOrUpcoming.filter(c => {
    const start = toDateTime(c);
    return (
      start > now && new Date(c.time_slot_info.date).toDateString() !== todayDateStr
    );
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatConsultationTime = (consultation: Consultation) => {
    const date = parseISO(consultation.time_slot_info.date);
    const startTime = consultation.time_slot_info.start_time;
    return {
      date: format(date, 'MMM d'),
      time: startTime,
      fullDate: format(date, 'EEEE, MMMM d, yyyy')
    };
  };

  const getConsultationMessage = (consultation: Consultation) => {
    const timeInfo = getTimeUntilConsultation(consultation);

    if (consultation.status_info.name === 'completed')
      return t('consultationCompleted');
    if (consultation.status_info.name === 'cancelled')
      return t('consultationCancelled');
    if (timeInfo.isReady) return t('readyToStart');
    if (timeInfo.days > 0) return t('inDays', { count: timeInfo.days });
    if (timeInfo.hours > 0) return t('inHours', { count: timeInfo.hours });
    return t('inMinutes', { count: timeInfo.minutes });
  };

  const ConsultationItem = ({ consultation }: { consultation: Consultation }) => {
    const timeInfo = formatConsultationTime(consultation);
    const seeker = consultation.service_seeker_info;
    const practitioner = consultation.practitioner_info;
    const isUserPractitioner = currentUserId === practitioner.user_id;
    const counterpart = isUserPractitioner ? seeker : practitioner;
    const canAccess = isConsultationTimeReady(consultation);
    const animate = recentlyCompleted.has(consultation.id);

    return (
      <div
        className={`flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer ${
          animate ? 'animate-slide-fade' : ''
        }`}
        onClick={() => onSelectChat(consultation.id.toString())}
      >
        <Avatar className="w-12 h-12">
          <AvatarImage
            src={counterpart.profile_image || ''}
            alt={`${counterpart.first_name} ${counterpart.last_name}`}
          />
          <AvatarFallback>
            {counterpart.first_name[0]}
            {counterpart.last_name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 truncate">
              {counterpart.first_name} {counterpart.last_name}
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">{timeInfo.time}</span>
              {canAccess && (
                <Badge
                  variant="secondary"
                  className="w-2 h-2 p-0 bg-green-500 rounded-full"
                ></Badge>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 truncate">
              {getConsultationMessage(consultation)}
            </p>
            <div className="flex items-center gap-2">
              {canAccess && <JoinVideoButton consultationId={consultation.id} />}
              <Badge
                className={`text-xs ${getStatusColor(
                  consultation.status_info.name
                )}`}
              >
                {t(`status.${consultation.status_info.name}`)}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white flex flex-col" style={{ height: 'calc(100vh - 60px)' }}>
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4">
            {t('consultations')}
          </h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('loadingConsultations')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white flex flex-col" style={{ height: 'calc(100vh - 60px)' }}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="mb-4">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
            {t('consultations')}
          </h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder={t('searchPlaceholder')}
            className="pl-10"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Consultations List */}
      <div className="flex-1 overflow-y-auto">
        {/* Today Section */}
        {todayConsultations.length > 0 && (
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              {t('today')}
            </h2>
            <div className="space-y-1">
              {todayConsultations.map(consultation => (
                <ConsultationItem key={consultation.id} consultation={consultation} />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Consultations */}
        {upcomingConsultations.length > 0 && (
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              {t('upcoming')}
            </h2>
            <div className="space-y-1">
              {upcomingConsultations.map(consultation => (
                <ConsultationItem key={consultation.id} consultation={consultation} />
              ))}
            </div>
          </div>
        )}

        {/* Previous Consultations */}
        {previousConsultations.length > 0 && (
          <div className="p-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              {t('previous')}
            </h2>
            <div className="space-y-1">
              {previousConsultations.map(consultation => (
                <ConsultationItem key={consultation.id} consultation={consultation} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredConsultations.length === 0 && !loading && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('noConsultationsFound')}
              </h3>
              <p className="text-gray-600">
                {searchTerm
                  ? t('tryAdjustingSearch')
                  : t('bookConsultationToStart')}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConsultationDashboard;
