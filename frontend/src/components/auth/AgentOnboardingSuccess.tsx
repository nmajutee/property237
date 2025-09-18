import React from 'react';
import { Button } from '../ui/Button';

interface AgentOnboardingSuccessProps {
  applicationId?: string;
  email?: string;
  onBackToDashboard?: () => void;
}

export const AgentOnboardingSuccess: React.FC<AgentOnboardingSuccessProps> = ({
  applicationId,
  email,
  onBackToDashboard
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-8">
      <div className="max-w-2xl w-full mx-auto px-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">

          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 px-8 py-12 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Application Submitted Successfully!
            </h1>
            <p className="text-green-100">
              Your agent registration has been received and is under review
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="space-y-6">

              {/* Application Details */}
              {applicationId && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                    Application Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Application ID:</span>
                      <span className="font-mono text-sm font-medium text-gray-900 dark:text-white">
                        {applicationId}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                        Under Review
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Submitted:</span>
                      <span className="text-sm text-gray-900 dark:text-white">
                        {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Next Steps */}
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  What happens next?
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">1</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Document Review</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Our team will review your submitted documents and verify your information.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">2</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Background Check</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        We'll conduct necessary background and reference checks.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">3</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">Account Activation</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Once approved, you'll receive access to the agent dashboard and tools.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">
                  Stay Updated
                </h3>
                <div className="space-y-3">
                  {email && (
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      📧 We'll send status updates to <strong>{email}</strong>
                    </p>
                  )}
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    ⏱️ Review typically takes <strong>2-3 business days</strong>
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    📞 Questions? Contact support at <strong>support@property237.cm</strong>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={onBackToDashboard}
                  className="flex-1"
                >
                  Continue to Property237
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="flex-1"
                >
                  Print Confirmation
                </Button>
              </div>

              {/* Important Notes */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  Important Notes:
                </h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex items-start space-x-2">
                    <span className="font-medium">•</span>
                    <span>Keep your application ID safe for future reference</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-medium">•</span>
                    <span>We may contact you for additional documentation if needed</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-medium">•</span>
                    <span>Your mobile money account will be activated upon approval</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="font-medium">•</span>
                    <span>You can check application status in your account dashboard</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};