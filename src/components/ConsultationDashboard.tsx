
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from './ui/badge';
// import { Badge } from '@/components/ui/badge';

interface ConsultationDashboardProps {
  onSelectChat: (chatId: string) => void;
}

const ConsultationDashboard = ({ onSelectChat }: ConsultationDashboardProps) => {
  const todayConsultations = [
    {
      id: 'floyd-1',
      name: 'Floyd Miles',
      message: 'Waiting...',
      time: '45min ago',
      avatar: '/placeholder.svg'
    }
  ];

  const previousConsultations = [
    {
      id: 'wade-1',
      name: 'Wade Warren',
      message: 'Hello Warren',
      time: '45min ago',
      avatar: '/placeholder.svg',
      unread: true
    },
    {
      id: 'wade-2',
      name: 'Wade Warren',
      message: 'Hello Warren', 
      time: '45min ago',
      avatar: '/placeholder.svg',
      unread: true
    },
    {
      id: 'wade-3',
      name: 'Wade Warren',
      message: 'Hello Warren',
      time: '45min ago', 
      avatar: '/placeholder.svg',
      unread: true
    },
    {
      id: 'wade-4',
      name: 'Wade Warren',
      message: 'Hello Warren',
      time: '45min ago',
      avatar: '/placeholder.svg',
      unread: true
    },
    {
      id: 'wade-5',
      name: 'Wade Warren',
      message: 'Hello Warren',
      time: '45min ago',
      avatar: '/placeholder.svg',
      unread: true
    },
    {
      id: 'wade-6',
      name: 'Wade Warren',
      message: 'Hello Warren',
      time: '45min ago',
      avatar: '/placeholder.svg',
      unread: true
    }
  ];

  return (
    <div className=" bg-white flex flex-col" style={{ height: 'calc(100vh - 60px)' }}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="mb-4">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Consultations</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input 
            placeholder="Search consultations..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Consultations List */}
      <div className="flex-1 overflow-y-auto">
        {/* Today Section */}
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Today</h2>
          <div className="space-y-1">
            {todayConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onSelectChat(consultation.id)}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={consultation.avatar} alt={consultation.name} />
                  <AvatarFallback>{consultation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{consultation.name}</h3>
                    <span className="text-xs text-gray-500">{consultation.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{consultation.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Previous Consultations */}
        <div className="p-4">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Previous Consultations</h2>
          <div className="space-y-1">
            {previousConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onSelectChat(consultation.id)}
              >
                <Avatar className="w-12 h-12">
                  <AvatarImage src={consultation.avatar} alt={consultation.name} />
                  <AvatarFallback>{consultation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-gray-900 truncate">{consultation.name}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{consultation.time}</span>
                      {consultation.unread && (
                        <Badge variant="secondary" className="w-2 h-2 p-0 bg-gray-800"></Badge>
                    
                        // <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{consultation.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDashboard