'use client';

import React from 'react';
import { CheckCircle, Clock, FileText, Mail, User } from 'lucide-react';
import Link from 'next/link';

const PendingReviewPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} className="text-green-600" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Application Submitted Successfully! 🎉
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          Thank you for submitting your practitioner application. Your profile is now under review by our admin team.
        </p>

        {/* Status Timeline */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileText size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">Application Submitted</span>
            </div>
            <CheckCircle size={16} className="text-green-600" />
          </div>

          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
            <div className="flex items-center gap-3">
              <Clock size={16} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Under Review</span>
            </div>
            <div className="w-4 h-4 border-2 border-yellow-600 rounded-full animate-pulse"></div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <User size={16} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-500">Profile Approved</span>
            </div>
            <div className="w-4 h-4 border-2 border-gray-300 rounded-full"></div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Mail size={16} className="text-blue-600 mt-0.5" />
            <div className="text-left">
              <h3 className="text-sm font-medium text-blue-900 mb-1">What happens next?</h3>
              <p className="text-sm text-blue-700">
                We'll review your application within 2-3 business days and send you an email with the status update.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="block w-full py-3 px-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Go to Dashboard
          </Link>
          
          <Link
            href="/profile"
            className="block w-full py-3 px-4 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            View Profile
          </Link>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Questions? Contact our support team at{' '}
            <a href="mailto:support@legalai.com" className="text-blue-600 hover:underline">
              support@legalai.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PendingReviewPage;
