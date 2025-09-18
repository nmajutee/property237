import React from 'react';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';

export interface AddressData {
  street: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
  residenceProof: File | null;
  residenceProofFileName: string;
  isBusinessAddressSame: boolean;
  businessStreet: string;
  businessCity: string;
  businessRegion: string;
  businessPostalCode: string;
  businessCountry: string;
}

interface AddressStepProps {
  data: AddressData;
  onChange: (data: Partial<AddressData>) => void;
}

const cameroonRegions = [
  'Adamawa',
  'Centre',
  'East',
  'Far North',
  'Littoral',
  'North',
  'Northwest',
  'South',
  'Southwest',
  'West'
];

export const AddressStep: React.FC<AddressStepProps> = ({ data, onChange }) => {
  const handleFileUpload = (file: File | null) => {
    onChange({
      residenceProof: file,
      residenceProofFileName: file ? file.name : ''
    });
  };

  const handleBusinessAddressToggle = (checked: boolean) => {
    onChange({
      isBusinessAddressSame: checked,
      // Clear business address if same as residence
      ...(checked && {
        businessStreet: data.street,
        businessCity: data.city,
        businessRegion: data.region,
        businessPostalCode: data.postalCode,
        businessCountry: data.country
      })
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Residential Address
        </h3>

        <div className="space-y-4">
          <Input
            label="Street Address"
            type="text"
            value={data.street}
            onChange={(e) => onChange({ street: e.target.value })}
            placeholder="Enter your street address"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City/Town"
              type="text"
              value={data.city}
              onChange={(e) => onChange({ city: e.target.value })}
              placeholder="Enter city or town"
              required
            />

            <Select
              label="Region"
              value={data.region}
              onChange={(e) => onChange({ region: e.target.value })}
              placeholder="Select region"
              options={cameroonRegions.map(region => ({
                value: region,
                label: region
              }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Postal Code"
              type="text"
              value={data.postalCode}
              onChange={(e) => onChange({ postalCode: e.target.value })}
              placeholder="Enter postal code"
            />

            <Select
              label="Country"
              value={data.country}
              onChange={(e) => onChange({ country: e.target.value })}
              placeholder="Select country"
              options={[
                { value: 'CM', label: 'Cameroon' },
                { value: 'NG', label: 'Nigeria' },
                { value: 'GA', label: 'Gabon' },
                { value: 'GQ', label: 'Equatorial Guinea' },
                { value: 'TD', label: 'Chad' },
                { value: 'CF', label: 'Central African Republic' }
              ]}
              required
            />
          </div>
        </div>

        {/* Proof of Residence Upload */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Proof of Residence <span className="text-red-500">*</span>
          </label>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-green-500 dark:hover:border-green-400 transition-colors">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => handleFileUpload(e.target.files?.[0] || null)}
              className="hidden"
              id="residence-proof"
            />
            <label htmlFor="residence-proof" className="cursor-pointer">
              <div className="text-gray-500 dark:text-gray-400">
                <svg className="mx-auto h-12 w-12 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-sm">
                  {data.residenceProofFileName || 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PDF, JPG, JPEG, PNG up to 5MB
                </p>
              </div>
            </label>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Upload utility bill, rental agreement, or official residence document
          </p>
        </div>
      </div>

      {/* Business Address */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Business Address
        </h3>

        <Checkbox
          label="Business address is same as residential address"
          checked={data.isBusinessAddressSame}
          onChange={(e) => handleBusinessAddressToggle(e.target.checked)}
        />

        {!data.isBusinessAddressSame && (
          <div className="mt-4 space-y-4">
            <Input
              label="Business Street Address"
              type="text"
              value={data.businessStreet}
              onChange={(e) => onChange({ businessStreet: e.target.value })}
              placeholder="Enter business street address"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="City/Town"
                type="text"
                value={data.businessCity}
                onChange={(e) => onChange({ businessCity: e.target.value })}
                placeholder="Enter city or town"
                required
              />

              <Select
                label="Region"
                value={data.businessRegion}
                onChange={(e) => onChange({ businessRegion: e.target.value })}
                placeholder="Select region"
                options={cameroonRegions.map(region => ({
                  value: region,
                  label: region
                }))}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Postal Code"
                type="text"
                value={data.businessPostalCode}
                onChange={(e) => onChange({ businessPostalCode: e.target.value })}
                placeholder="Enter postal code"
              />

              <Select
                label="Country"
                value={data.businessCountry}
                onChange={(e) => onChange({ businessCountry: e.target.value })}
                placeholder="Select country"
                options={[
                  { value: 'CM', label: 'Cameroon' },
                  { value: 'NG', label: 'Nigeria' },
                  { value: 'GA', label: 'Gabon' },
                  { value: 'GQ', label: 'Equatorial Guinea' },
                  { value: 'TD', label: 'Chad' },
                  { value: 'CF', label: 'Central African Republic' }
                ]}
                required
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};