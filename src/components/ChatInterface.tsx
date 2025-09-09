import React, { useState, useEffect } from 'react';
import { ArrowLeft, MoreVertical, Smile, Paperclip, Mic, Send, Play, FileText, Clock, Calendar, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { getConsultationDetails, isConsultationTimeReady, getTimeUntilConsultation, type Consultation } from '@/lib/api/consultations';
import { format, parseISO } from 'date-fns';

interface ChatInterfaceProps {
  selectedChat: string | null;
  onBack: () => void;
}

const ChatInterface = ({ selectedChat, onBack }: ChatInterfaceProps) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeUntil, setTimeUntil] = useState({ days: 0, hours: 0, minutes: 0, isReady: false });

  useEffect(() => {
    if (selectedChat) {
      loadConsultationDetails();
    }
  }, [selectedChat]);

  useEffect(() => {
    if (consultation) {
      const updateTimer = () => {
        const newTimeInfo = getTimeUntilConsultation(consultation);
        setTimeUntil(newTimeInfo);
      };

      updateTimer();
      const interval = setInterval(updateTimer, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [consultation]);

  const loadConsultationDetails = async () => {
    if (!selectedChat) return;
    
    try {
      setLoading(true);
      const response = await getConsultationDetails(parseInt(selectedChat));
      if (response.success) {
        setConsultation(response.data);
      }
    } catch (error) {
      console.error('Error loading consultation details:', error);
    } finally {
      setLoading(false);
    }
  };

  const chatData = {
    'wade-1': {
      name: 'Wade Warren',
      status: 'Active now',
      avatar: '/placeholder.svg',
      messages: [
        {
          id: 1,
          text: 'Hi Wade, i have a case',
          time: '15:18',
          sent: true,
          type: 'text'
        },
        {
          id: 2,
          text: 'Hello Lilian!',
          time: '15:22',
          sent: false,
          type: 'text'
        },
        {
          id: 3,
          text: 'Hope you are doing very well today. Tell me about the case.',
          time: '15:22',
          sent: false,
          type: 'text'
        },
        {
          id: 4,
          text: 'Please, can I send a VN?',
          time: '15:18',
          sent: true,
          type: 'text'
        },
        {
          id: 5,
          text: 'Sure, you can please',
          time: '15:22',
          sent: false,
          type: 'text'
        },
        {
          id: 6,
          duration: '0:37',
          time: '15:03',
          sent: true,
          type: 'voice'
        },
        {
          id: 7,
          fileName: 'Case file.pdf',
          fileSize: '246 KB',
          pages: '6 pages',
          time: '15:03',
          sent: true,
          type: 'file'
        }
      ]
    },
    'floyd-1': {
      name: 'Floyd Miles',
      status: 'Active now',
      avatar: '/placeholder.svg',
      messages: [
        {
          id: 1,
          text: 'Hello! How can I help you today?',
          time: '14:30',
          sent: false,
          type: 'text'
        }
      ]
    }
  };

  const currentChat = selectedChat ? chatData[selectedChat as keyof typeof chatData] : null;

  if (!consultation && !currentChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50" style={{ height: 'calc(100vh - 60px)' }}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Select a conversation</h2>
          <p className="text-gray-600">Choose a chat from the sidebar to start messaging</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50" style={{ height: 'calc(100vh - 60px)' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading consultation...</p>
        </div>
      </div>
    );
  }

  // Check if consultation time has arrived
  const canAccessChat = consultation ? isConsultationTimeReady(consultation) : true;

  // If consultation exists but time hasn't arrived, show waiting screen
  if (consultation && !canAccessChat) {
    const practitioner = consultation.practitioner_info;
    const consultationDate = parseISO(consultation.time_slot_info.date);
    const formattedDate = format(consultationDate, 'EEEE, MMMM d, yyyy');
    const formattedTime = `${consultation.time_slot_info.start_time} - ${consultation.time_slot_info.end_time}`;

    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50" style={{ height: 'calc(100vh - 60px)' }}>
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="lg:hidden"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Avatar className="w-10 h-10">
              <AvatarImage 
                src={practitioner.user_info.profile_image || ''} 
                alt={`${practitioner.user_info.first_name} ${practitioner.user_info.last_name}`} 
              />
              <AvatarFallback>
                {practitioner.user_info.first_name[0]}{practitioner.user_info.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-gray-900">
                {practitioner.user_info.first_name} {practitioner.user_info.last_name}
              </h3>
              <p className="text-sm text-gray-600">Consultation scheduled</p>
            </div>
          </div>
        </div>

        {/* Waiting Content */}
        <div className="text-center p-8 max-w-md">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-blue-600" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Consultation Not Ready</h2>
          <p className="text-gray-600 mb-6">
            Your consultation with {practitioner.user_info.first_name} {practitioner.user_info.last_name} is scheduled for:
          </p>

          <div className="bg-white rounded-lg p-6 border mb-6">
            <div className="flex items-center justify-center space-x-2 text-gray-600 mb-2">
              <Calendar className="w-4 h-4" />
              <span className="font-medium">{formattedDate}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-medium">{formattedTime}</span>
            </div>
          </div>

          {timeUntil.isReady ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-800 font-medium">Your consultation is ready to start!</p>
              <p className="text-green-600 text-sm">Please refresh the page to access the chat.</p>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800 font-medium">
                Time remaining: {timeUntil.days > 0 && `${timeUntil.days}d `}
                {timeUntil.hours > 0 && `${timeUntil.hours}h `}
                {timeUntil.minutes}m
              </p>
              <p className="text-yellow-600 text-sm">Chat will be available 15 minutes before your consultation.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Display name for header
  const displayName = consultation ? 
    `${consultation.practitioner_info.user_info.first_name} ${consultation.practitioner_info.user_info.last_name}` :
    currentChat?.name || 'Unknown';

  const displayAvatar = consultation?.practitioner_info.user_info.profile_image || currentChat?.avatar;

  const displayStatus = consultation ? 
    (consultation.status_info.name === 'in_progress' ? 'In consultation' : 'Available') :
    currentChat?.status || 'Active now';

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  return (
    <div className="flex-1 flex flex-col bg-white" style={{ height: 'calc(100vh - 60px)' }}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="lg:hidden"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Avatar className="w-10 h-10">
            <AvatarImage src={displayAvatar || ''} alt={displayName} />
            <AvatarFallback>{displayName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">{displayName}</h3>
            <p className="text-sm text-green-600">{displayStatus}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: 'calc(100vh - 60px - 64px - 64px)' }}>
        {/* Date separator */}
        <div className="flex justify-center">
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {consultation ? 
              format(parseISO(consultation.time_slot_info.date), 'dd-MM-yyyy') : 
              '24-01-2025'
            }
          </span>
        </div>

        {/* Show consultation-specific content or fallback to mock messages */}
        {consultation ? (
          <div className="text-center p-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Live Chat Ready</h3>
            <p className="text-gray-600 mb-4">
              Your consultation with {consultation.practitioner_info.user_info.first_name} {consultation.practitioner_info.user_info.last_name} is ready.
            </p>
            <p className="text-sm text-gray-500">
              Real-time chat will be implemented in the next phase.
            </p>
          </div>
        ) : (
          currentChat?.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sent
                  ? 'bg-yellow-100 text-gray-900'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              {msg.type === 'text' && (
                <p className="text-sm">{msg.text}</p>
              )}
              
              {msg.type === 'voice' && (
                <div className="flex items-center space-x-2 bg-yellow-200 rounded-lg p-2">
                  <Button size="sm" className="w-8 h-8 rounded-full bg-yellow-600 hover:bg-yellow-700">
                    <Play className="w-3 h-3 fill-white" />
                  </Button>
                  <div className="flex-1">
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-0.5 bg-yellow-600 rounded-full"
                          style={{ height: `${Math.random() * 20 + 4}px` }}
                        />
                      ))}
                    </div>
                  </div>
                  {/* <span className="text-xs text-gray-600">{msg.duration}</span> */}
                </div>
              )}
              
              {msg.type === 'file' && (
                <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border">
                  <div className="w-12 h-12 bg-red-500 rounded flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    {/* <p className="text-sm font-medium">{msg.fileName}</p> */}
                    <p className="text-xs text-gray-500">
                      {/* {msg.pages} • {msg.fileSize} • pdf */}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-end mt-1 space-x-1">
                <span className="text-xs text-gray-500">{msg.time}</span>
                {msg.sent && (
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
        )}

        {/* Subscription notification - only show for mock chats */}
        {!consultation && (
        <Card className="mx-4 bg-yellow-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <p className="text-sm font-medium text-gray-900 mb-2">
              Your subscription will expire in 7 days.
            </p>
            <p className="text-xs text-gray-600 mb-3">
              Kindly renew before the end of 7 days to continue consulting with Wade Warren.
            </p>
            <Button className="bg-gray-900 hover:bg-gray-800 text-white">
              Renew Subscription
            </Button>
          </CardContent>
        </Card>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your message"
              className="pr-12"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <Paperclip className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleRecording}
            className={isRecording ? 'bg-red-100' : ''}
          >
            <Mic className={`w-4 h-4 ${isRecording ? 'text-red-500' : ''}`} />
          </Button>
          {message.trim() && (
            <Button onClick={handleSendMessage} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
