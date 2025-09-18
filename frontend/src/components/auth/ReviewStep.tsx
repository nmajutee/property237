import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { FileUpload, UploadedFile } from '../ui/FileUpload';

export interface ReviewData {
  selfieDoc: UploadedFile[];
  termsAccepted: boolean;
  dataConsentAccepted: boolean;
  marketingConsent: boolean;
}

interface ReviewStepProps {
  data: ReviewData;
  formData: any; // Full agent onboarding data
  onChange: (data: Partial<ReviewData>) => void;
  onEdit: (step: number) => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ data, formData, onChange, onEdit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!data.termsAccepted || !data.dataConsentAccepted) {
      alert('Please accept the terms and data processing consent to continue.');
      return;
    }

    setIsSubmitting(true);

    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 3000));

    // In a real app, this would submit to the backend
    console.log('Submitting agent onboarding data:', { ...formData, verification: data });

    setIsSubmitting(false);

    // Redirect to success page or dashboard
    alert('Application submitted successfully! You will receive a confirmation email shortly.');
  };

  const renderSectionSummary = (title: string, data: any, stepIndex: number) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(stepIndex)}
        >
          Edit
        </Button>
      </div>
      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
        {Object.entries(data).map(([key, value]) => {
          if (key === 'currentStep' || !value) return null;

          if (Array.isArray(value)) {
            return value.length > 0 ? (
              <div key={key}>
                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                {value.length} file(s) uploaded
              </div>
            ) : null;
          }

          return (
            <div key={key}>
              <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
              <span>{typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Review & Submit Application
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Please review all your information carefully before submitting your agent application.
        </p>
      </div>

      {/* Application Summary */}
      <div className="space-y-6">
        <h4 className="font-medium text-gray-900 dark:text-white">Application Summary</h4>

        {renderSectionSummary('Personal Information', formData.personalInfo, 0)}
        {renderSectionSummary('Address Information', formData.address, 1)}
        {renderSectionSummary('Company Information', formData.company, 2)}
        {renderSectionSummary('KYC Documents', formData.kyc, 3)}
        {renderSectionSummary('Mobile Money Account', formData.mobileMoney, 4)}
      </div>

      {/* Identity Verification Selfie */}
      <div className="border-t pt-8">
        <h4 className="font-medium text-gray-900 dark:text-white mb-4">
          Identity Verification Selfie
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Take a clear selfie holding your ID document to complete the verification process.
        </p>

        <FileUpload
          label="Upload verification selfie"
          description="Clear photo of yourself holding your ID document"
          accept=".jpg,.jpeg,.png"
          maxSize={5 * 1024 * 1024} // 5MB
          multiple={false}
          files={data.selfieDoc}
          onFilesChange={(files) => onChange({ selfieDoc: files })}
        />

        <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                Selfie Guidelines
              </h5>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <li>• Hold your ID document clearly visible next to your face</li>
                <li>• Ensure good lighting and clear image quality</li>
                <li>• Make sure both your face and ID are fully visible</li>
                <li>• Take the photo in a well-lit environment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Agreements */}
      <div className="border-t pt-8">
        <h4 className="font-medium text-gray-900 dark:text-white mb-6">
          Legal Agreements & Consents
        </h4>

        <div className="space-y-4">
          <Checkbox
            label="I accept the Terms of Service and Agent Agreement"
            checked={data.termsAccepted}
            onChange={(e) => onChange({ termsAccepted: e.target.checked })}
            required
          />

          <Checkbox
            label="I consent to the processing of my personal data for agent verification and platform operations"
            checked={data.dataConsentAccepted}
            onChange={(e) => onChange({ dataConsentAccepted: e.target.checked })}
            required
          />

          <Checkbox
            label="I consent to receive marketing communications and updates (optional)"
            checked={data.marketingConsent}
            onChange={(e) => onChange({ marketingConsent: e.target.checked })}
          />
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            What happens next?
          </h5>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Your application will be reviewed within 2-3 business days</li>
            <li>• You'll receive email updates on your application status</li>
            <li>• Once approved, you'll get access to the agent dashboard</li>
            <li>• Our team may contact you for additional verification if needed</li>
          </ul>
        </div>
      </div>

      {/* Submit Button */}
      <div className="border-t pt-8">
        <div className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!data.termsAccepted || !data.dataConsentAccepted || data.selfieDoc.length === 0}
            loading={isSubmitting}
            size="lg"
            className="px-12"
          >
            {isSubmitting ? 'Submitting Application...' : 'Submit Agent Application'}
          </Button>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
          By submitting, you confirm that all information provided is accurate and complete.
        </p>
      </div>
    </div>
  );
};