import React from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import { FileUpload, UploadedFile } from '../ui/FileUpload';
import { BuildingOffice2Icon } from '@heroicons/react/24/outline';

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
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
          <BuildingOffice2Icon className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Business Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tell us about your real estate business and company registration details
        </p>
      </div>

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
            placeholder="Enter RC registration number"
            required
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
            required
          />

          <Select
            label="Business Category"
            options={businessCategories.map(cat => ({ value: cat, label: cat }))}
            value={data.businessCategory}
            onChange={(e) => onChange({ businessCategory: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Company Size"
            options={companySizes.map(size => ({ value: size, label: size }))}
            value={data.companySize}
            onChange={(e) => onChange({ companySize: e.target.value })}
            required
          />

          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="hasVAT"
                checked={data.hasVAT}
                onChange={(e) => onChange({ hasVAT: e.target.checked })}
              />
              <label htmlFor="hasVAT" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Company is VAT registered
              </label>
            </div>
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-property237-primary focus:ring-offset-2 dark:bg-gray-700 dark:text-white resize-none"
            required
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Describe your real estate business activities and areas of expertise
          </p>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Business Documents
        </h3>

        <FileUpload
          onFilesChange={handleFileUpload}
          files={data.businessDocs}
          accept=".pdf,.jpg,.jpeg,.png"
          maxSize={5242880}
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
          </ul>
        </div>
      </div>
    </div>
  );
};
