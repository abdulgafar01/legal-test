'use client';

import React from 'react';
import { AlertCircle, FileText, Mail, RefreshCw, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const ApplicationRejectedPage: React.FC = () => {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Alert Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle size={32} className="text-red-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Application Not Approved
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Unfortunately, your practitioner application did not meet our current requirements. 
          This decision was made after careful review of your submitted information.
        </p>

        {/* Status Timeline */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">Application Submitted</span>
            </div>
            <div className="w-4 h-4 bg-green-600 rounded-full"></div>
          </div>

          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center gap-3">
              <User size={16} className="text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Reviewed by Admin</span>
            </div>
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
          </div>

          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle size={16} className="text-red-600" />
              <span className="text-sm font-medium text-red-800">Application Not Approved</span>
            </div>
            <div className="w-4 h-4 bg-red-600 rounded-full"></div>
          </div>
        </div>

        {/* Reason Section */}
        <div className="bg-orange-50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Mail size={16} className="text-orange-600 mt-0.5" />
            <div className="text-left">
              <h3 className="text-sm font-medium text-orange-900 mb-1">Feedback Available</h3>
              <p className="text-sm text-orange-700">
                Check your email for detailed feedback on why your application was not approved and steps to improve.
              </p>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <RefreshCw size={16} className="text-blue-600 mt-0.5" />
              <div className="text-left">
                <h3 className="text-sm font-medium text-blue-900 mb-1">Reapply Later</h3>
                <p className="text-sm text-blue-700">
                  You can submit a new application after addressing the feedback provided.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/onboarding/professionals"
            className="block w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-center"
          >
            Submit New Application
          </Link>
          
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Questions about your application? Contact us at{' '}
            <a href="mailto:admin@theyas.co" className="text-blue-600 hover:underline">
              admin@theyas.co
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationRejectedPage;
