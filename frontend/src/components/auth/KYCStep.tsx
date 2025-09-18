import React from 'react';
import { FileUpload, UploadedFile } from '../ui/FileUpload';
import { Select } from '../ui/Select';

export interface KYCData {
  idType: string;
  idNumber: string;
  idFrontDoc: UploadedFile[];
  idBackDoc: UploadedFile[];
  businessLicense: UploadedFile[];
  proofOfOwnership: UploadedFile[];
  additionalDocs: UploadedFile[];
}

interface KYCStepProps {
  data: KYCData;
  onChange: (data: Partial<KYCData>) => void;
}

const idTypes = [
  { value: 'national_id', label: 'National ID Card' },
  { value: 'passport', label: 'Passport' },
  { value: 'drivers_license', label: 'Driver\'s License' }
];

export const KYCStep: React.FC<KYCStepProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Identity Verification
        </h3>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="ID Document Type"
              value={data.idType}
              onChange={(e) => onChange({ idType: e.target.value })}
              placeholder="Select ID type"
              options={idTypes}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                ID Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={data.idNumber}
                onChange={(e) => onChange({ idNumber: e.target.value })}
                placeholder="Enter ID number"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          </div>

          {/* ID Document Front */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              ID Document - Front Side <span className="text-red-500">*</span>
            </h4>
            <FileUpload
              label="Upload front side of your ID"
              description="Clear photo of the front side of your ID document"
              accept=".jpg,.jpeg,.png,.pdf"
              maxSize={5 * 1024 * 1024} // 5MB
              multiple={false}
              files={data.idFrontDoc}
              onFilesChange={(files) => onChange({ idFrontDoc: files })}
            />
          </div>

          {/* ID Document Back */}
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              ID Document - Back Side <span className="text-red-500">*</span>
            </h4>
            <FileUpload
              label="Upload back side of your ID"
              description="Clear photo of the back side of your ID document"
              accept=".jpg,.jpeg,.png,.pdf"
              maxSize={5 * 1024 * 1024} // 5MB
              multiple={false}
              files={data.idBackDoc}
              onFilesChange={(files) => onChange({ idBackDoc: files })}
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
          <div className="flex items-start space-x-3">
            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h5 className="font-medium text-amber-800 dark:text-amber-200 mb-1">
                Photo Guidelines
              </h5>
              <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1">
                <li>• Take photos in good lighting</li>
                <li>• Ensure all text is clearly readable</li>
                <li>• Avoid glare and shadows</li>
                <li>• Include all four corners of the document</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Business Documents */}
      <div className="border-t pt-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Business License & Permits
        </h3>

        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Real Estate License <span className="text-red-500">*</span>
            </h4>
            <FileUpload
              label="Upload your real estate license"
              description="Valid real estate agent or broker license"
              accept=".jpg,.jpeg,.png,.pdf"
              maxSize={5 * 1024 * 1024} // 5MB
              multiple={false}
              files={data.businessLicense}
              onFilesChange={(files) => onChange({ businessLicense: files })}
            />
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Proof of Property Ownership (Optional)
            </h4>
            <FileUpload
              label="Upload property ownership documents"
              description="Title deeds, property certificates, or ownership proof"
              accept=".jpg,.jpeg,.png,.pdf"
              maxSize={5 * 1024 * 1024} // 5MB
              multiple={true}
              files={data.proofOfOwnership}
              onFilesChange={(files) => onChange({ proofOfOwnership: files })}
            />
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-3">
              Additional Certifications (Optional)
            </h4>
            <FileUpload
              label="Upload additional certifications"
              description="Professional certifications, awards, or qualifications"
              accept=".jpg,.jpeg,.png,.pdf"
              maxSize={5 * 1024 * 1024} // 5MB
              multiple={true}
              files={data.additionalDocs}
              onFilesChange={(files) => onChange({ additionalDocs: files })}
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Required Documents Checklist:
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${data.idFrontDoc.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-blue-800 dark:text-blue-200">ID Front</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${data.idBackDoc.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-blue-800 dark:text-blue-200">ID Back</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${data.businessLicense.length > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-blue-800 dark:text-blue-200">Business License</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${data.idType && data.idNumber ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm text-blue-800 dark:text-blue-200">ID Details</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};