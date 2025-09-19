import React from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

interface AgentOnboardingSuccessProps {
  applicationId: string;
  email: string;
  onContactSupport?: () => void;
}

export const AgentOnboardingSuccess: React.FC<AgentOnboardingSuccessProps> = ({
  applicationId,
  email,
  onContactSupport
}) => {
  return (
    <div className="max-w-2xl mx-auto text-center py-12">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircleIcon className="w-8 h-8 text-green-600" />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Application Submitted Successfully!
      </h1>

      <p className="text-lg text-gray-600 mb-6">
        Thank you for your application. We have received your agent onboarding request.
      </p>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div>
            <strong className="text-gray-700">Application ID:</strong>
            <p className="text-gray-900 font-mono">{applicationId}</p>
          </div>
          <div>
            <strong className="text-gray-700">Email:</strong>
            <p className="text-gray-900">{email}</p>
          </div>
        </div>
      </div>

      <p className="text-gray-600 mb-8">
        We will review your application within 2-3 business days and send you an email with the next steps.
      </p>

      <div className="space-y-4">
        <button
          onClick={onContactSupport}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};
