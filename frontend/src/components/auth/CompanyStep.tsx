import React from 'react';
import { Input } from '../ui/Input';
import { Checkbox } from '../ui/Checkbox';
import { FileUpload, UploadedFile } from '../ui/FileUpload';

export interface CompanyData {
  companyName: string;
  rcNumber: string;
  taxId: string;
  hasVAT: boolean;
  vatNumber: string;
  yearEstablished: string;
  businessCategory: string;
  companySize: string;
  businessDescription: string;
  businessDocs: UploadedFile[];
}

interface CompanyStepProps {
  data: CompanyData;
  onChange: (data: Partial<CompanyData>) => void;
}

const businessCategories = [
  'Real Estate Agency',
  'Property Development',
  'Property Management',
  'Real Estate Consulting',
  'Property Investment',
  'Commercial Real Estate',
  'Residential Real Estate',
  'Industrial Real Estate',
  'Other'
];

const companySizes = [
  '1-5 employees',
  '6-20 employees',
  '21-50 employees',
  '51-100 employees',
  '100+ employees'
];

export const CompanyStep: React.FC<CompanyStepProps> = ({ data, onChange }) => {
  const handleFileUpload = (files: UploadedFile[]) => {
    onChange({ businessDocs: files });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Business Information
        </h3>

        <div className="space-y-4">
          <Input
            label="Company Name"
            type="text"
            value={data.companyName}
            onChange={(e) => onChange({ companyName: e.target.value })}
            placeholder="Enter your registered company name"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="RC Number"
              type="text"
              value={data.rcNumber}
              onChange={(e) => onChange({ rcNumber: e.target.value })}
              placeholder="RC-XXXXXXX"
              required
              helperText="Company registration number from RCCM"
            />

            <Input
              label="Tax ID (TIN)"
              type="text"
              value={data.taxId}
              onChange={(e) => onChange({ taxId: e.target.value })}
              placeholder="Enter Tax Identification Number"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Year Established"
              type="number"
              value={data.yearEstablished}
              onChange={(e) => onChange({ yearEstablished: e.target.value })}
              placeholder="2020"
              min="1990"
              max={new Date().getFullYear()}
              required
            />

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Business Category <span className="text-red-500">*</span>
              </label>
              <select
                value={data.businessCategory}
                onChange={(e) => onChange({ businessCategory: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select business category</option>
                {businessCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Company Size <span className="text-red-500">*</span>
              </label>
              <select
                value={data.companySize}
                onChange={(e) => onChange({ companySize: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                required
              >
                <option value="">Select company size</option>
                {companySizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Checkbox
                label="Company is VAT registered"
                checked={data.hasVAT}
                onChange={(e) => onChange({ hasVAT: e.target.checked })}
              />
            </div>
          </div>

          {data.hasVAT && (
            <Input
              label="VAT Number"
              type="text"
              value={data.vatNumber}
              onChange={(e) => onChange({ vatNumber: e.target.value })}
              placeholder="Enter VAT registration number"
              required
            />
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Business Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={data.businessDescription}
              onChange={(e) => onChange({ businessDescription: e.target.value })}
              placeholder="Describe your business activities, services, and expertise..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white resize-none"
              required
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Describe your real estate business activities and areas of expertise
            </p>
          </div>
        </div>
      </div>

      {/* Business Documents Upload */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Business Documents
        </h3>

        <FileUpload
          onFilesChange={handleFileUpload}
          files={data.businessDocs}
          accept=".pdf,.jpg,.jpeg,.png"
          maxSize={5 * 1024 * 1024} // 5MB
          multiple={true}
          description="Upload business registration, licenses, and certifications"
        />

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Required Documents:
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• Company Registration Certificate (RC)</li>
            <li>• Tax Registration Certificate (TIN)</li>
            <li>• Business License or Operating Permit</li>
            <li>• Real Estate Agent License (if applicable)</li>
            <li>• VAT Registration Certificate (if VAT registered)</li>
            <li>• Professional Certifications (optional)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};