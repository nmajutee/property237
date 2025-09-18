import React, { useState, useEffect, useCallback } from 'react';
import { Input } from '../ui/Input';
import { PhoneInput } from '../ui/PhoneInput';
import { Button } from '../ui/Button';

export interface MobileMoneyData {
  provider: 'mtn' | 'orange' | 'other';
  phoneNumber: string;
  accountName: string;
  nameMatchStatus: 'match' | 'close' | 'mismatch' | 'pending';
  verificationCode?: string;
  isVerified: boolean;
}

interface MobileMoneyStepProps {
  data: MobileMoneyData;
  personalName: string;
  onChange: (data: Partial<MobileMoneyData>) => void;
}

const mobileMoneyProviders = [
  { value: 'mtn', label: 'MTN Mobile Money', color: 'bg-yellow-500' },
  { value: 'orange', label: 'Orange Money', color: 'bg-orange-500' },
  { value: 'other', label: 'Other Provider', color: 'bg-gray-500' }
];

export const MobileMoneyStep: React.FC<MobileMoneyStepProps> = ({ data, personalName, onChange }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [showVerificationInput, setShowVerificationInput] = useState(false);

  const levenshteinDistance = useCallback((str1: string, str2: string): number => {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + indicator
        );
      }
    }

    return matrix[str2.length][str1.length];
  }, []);

  const calculateNameSimilarity = useCallback((str1: string, str2: string): number => {
    // Simple similarity calculation (Levenshtein distance normalized)
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;

    if (longer.length === 0) return 1.0;

    const editDistance = levenshteinDistance(longer, shorter);
    return (longer.length - editDistance) / longer.length;
  }, [levenshteinDistance]);

  // Simulate name matching when account name changes
  useEffect(() => {
    if (data.accountName && personalName) {
      const similarity = calculateNameSimilarity(data.accountName.toLowerCase(), personalName.toLowerCase());
      let status: 'match' | 'close' | 'mismatch';

      if (similarity > 0.8) {
        status = 'match';
      } else if (similarity > 0.6) {
        status = 'close';
      } else {
        status = 'mismatch';
      }

      onChange({ nameMatchStatus: status });
    }
  }, [data.accountName, personalName, onChange, calculateNameSimilarity]);

  const handleSendVerification = async () => {
    setIsVerifying(true);

    // Simulate sending verification SMS
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsVerifying(false);
    setShowVerificationInput(true);

    // In a real app, this would trigger SMS sending
    console.log(`Sending verification code to ${data.phoneNumber} via ${data.provider}`);
  };

  const handleVerifyCode = async () => {
    if (data.verificationCode === '123456') { // Demo code
      onChange({ isVerified: true });
      setShowVerificationInput(false);
    } else {
      alert('Invalid verification code. Try 123456 for demo.');
    }
  };

  const renderNameMatchStatus = () => {
    if (!data.accountName || !personalName) return null;

    const statusConfig = {
      match: {
        color: 'text-green-700 bg-green-50 border-green-200 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800',
        icon: '✓',
        message: 'Names match perfectly'
      },
      close: {
        color: 'text-yellow-700 bg-yellow-50 border-yellow-200 dark:text-yellow-400 dark:bg-yellow-900/20 dark:border-yellow-800',
        icon: '⚠',
        message: 'Names are similar but not exact'
      },
      mismatch: {
        color: 'text-red-700 bg-red-50 border-red-200 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800',
        icon: '✗',
        message: 'Names do not match'
      }
    };

    const status = statusConfig[data.nameMatchStatus as keyof typeof statusConfig];

    return (
      <div className={`mt-3 p-3 border rounded-lg ${status.color}`}>
        <div className="flex items-center space-x-2">
          <span className="font-medium">{status.icon}</span>
          <span className="text-sm">{status.message}</span>
        </div>
        <div className="text-xs mt-1 opacity-75">
          Profile: {personalName} | Account: {data.accountName}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Mobile Money Verification
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          We need to verify your mobile money account to ensure secure transactions for property commissions and payments.
        </p>

        <div className="space-y-6">
          {/* Provider Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Mobile Money Provider <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {mobileMoneyProviders.map((provider) => (
                <button
                  key={provider.value}
                  type="button"
                  onClick={() => onChange({ provider: provider.value as any })}
                  className={`p-4 border-2 rounded-lg text-center transition-all ${
                    data.provider === provider.value
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${provider.color} mx-auto mb-2`}></div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {provider.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Phone Number Input */}
          <div>
            <PhoneInput
              label="Mobile Money Phone Number"
              value={data.phoneNumber}
              onChange={(e) => onChange({ phoneNumber: e.target.value })}
              placeholder="Enter mobile money number"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This should be your registered mobile money number
            </p>
          </div>

          {/* Account Name */}
          <div>
            <Input
              label="Account Holder Name"
              type="text"
              value={data.accountName}
              onChange={(e) => onChange({ accountName: e.target.value })}
              placeholder="Enter name as registered with mobile money"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Enter your name exactly as registered with your mobile money provider
            </p>
            {renderNameMatchStatus()}
          </div>

          {/* Verification Section */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 dark:text-white mb-4">
              Account Verification
            </h4>

            {!data.isVerified && !showVerificationInput && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Click the button below to receive a verification code via SMS to confirm your mobile money account.
                </p>
                <Button
                  onClick={handleSendVerification}
                  disabled={!data.phoneNumber || !data.accountName || isVerifying}
                  loading={isVerifying}
                  className="w-full md:w-auto"
                >
                  {isVerifying ? 'Sending Code...' : 'Send Verification Code'}
                </Button>
              </div>
            )}

            {!data.isVerified && showVerificationInput && (
              <div className="space-y-4">
                <Input
                  label="Verification Code"
                  type="text"
                  value={data.verificationCode || ''}
                  onChange={(e) => onChange({ verificationCode: e.target.value })}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
                <div className="flex space-x-3">
                  <Button
                    onClick={handleVerifyCode}
                    disabled={!data.verificationCode || data.verificationCode.length !== 6}
                    className="w-full md:w-auto"
                  >
                    Verify Code
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSendVerification}
                    loading={isVerifying}
                    className="w-full md:w-auto"
                  >
                    Resend Code
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Demo: Use code <strong>123456</strong> to verify
                </p>
              </div>
            )}

            {data.isVerified && (
              <div className="flex items-center space-x-3 text-green-700 dark:text-green-400">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">Account Verified Successfully</p>
                  <p className="text-sm opacity-75">Your mobile money account has been confirmed</p>
                </div>
              </div>
            )}
          </div>

          {/* Important Notice */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
              Why do we need this?
            </h4>
            <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
              <li>• Receive commission payments directly to your mobile money account</li>
              <li>• Enable secure property transaction processing</li>
              <li>• Comply with Cameroon financial regulations</li>
              <li>• Provide automated payment reconciliation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};