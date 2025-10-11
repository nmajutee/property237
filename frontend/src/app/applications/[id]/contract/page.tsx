'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { getApiBaseUrl } from '@/services/api';

interface ContractData {
  application_id: number;
  property_title: string;
  property_address: string;
  property_type: string;
  tenant_name: string;
  tenant_email: string;
  agent_name: string;
  agent_email: string;
  monthly_rent: string;
  security_deposit: string;
  lease_start_date: string;
  lease_end_date: string;
  lease_duration_months: number;
  status: string;
  contract_generated_at: string;
  property_amenities: string[];
}

export default function ContractViewPage() {
  const router = useRouter();
  const params = useParams();
  const applicationId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contract, setContract] = useState<ContractData | null>(null);
  const [signing, setSigning] = useState(false);

  useEffect(() => {
    fetchContractData();
  }, [applicationId]);

  const fetchContractData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('property237_access_token');

      if (!token) {
        router.push('/sign-in');
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/applications/${applicationId}/contract/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Contract not found or application not approved');
        }
        throw new Error('Failed to fetch contract data');
      }

      const data = await response.json();
      setContract(data);
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching contract:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSignContract = async () => {
    try {
      setSigning(true);
      const token = localStorage.getItem('property237_access_token');

      if (!token) {
        router.push('/sign-in');
        return;
      }

      const response = await fetch(
        `${getApiBaseUrl()}/applications/${applicationId}/sign-contract/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to sign contract');
      }

      // Refresh contract data
      await fetchContractData();

      alert('Contract signed successfully!');

    } catch (err: any) {
      console.error('Error signing contract:', err);
      alert(err.message || 'Failed to sign contract');
    } finally {
      setSigning(false);
    }
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate and download a PDF
    alert('PDF download functionality would be implemented here');
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contract...</p>
        </div>
      </div>
    );
  }

  if (error || !contract) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-3xl">⚠</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Contract Not Available</h1>
          <p className="text-gray-600 mb-6">
            {error || 'This contract could not be found. The application may not be approved yet.'}
          </p>
          <button
            onClick={() => router.push('/my-applications')}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Back to Applications
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Not printed */}
        <div className="mb-6 print:hidden">
          <button
            onClick={() => router.push('/my-applications')}
            className="text-green-600 hover:text-green-700 flex items-center gap-2 mb-4"
          >
            ← Back to Applications
          </button>
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Rental Agreement Contract</h1>
              <p className="text-gray-600 mt-1">Application #{contract.application_id}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                🖨️ Print
              </button>
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                📄 Download PDF
              </button>
            </div>
          </div>
        </div>

        {/* Contract Document */}
        <div className="bg-white rounded-lg shadow-md p-8 print:shadow-none print:p-0">
          {/* Contract Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">RESIDENTIAL LEASE AGREEMENT</h2>
            <p className="text-sm text-gray-600">Property237 - Real Estate Platform</p>
            <p className="text-sm text-gray-600">Contract Generated: {new Date(contract.contract_generated_at).toLocaleDateString()}</p>
          </div>

          {/* Property Details */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">PROPERTY INFORMATION</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-700">Property Title:</p>
                <p className="text-gray-900">{contract.property_title}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Property Type:</p>
                <p className="text-gray-900">{contract.property_type}</p>
              </div>
              <div className="col-span-2">
                <p className="font-semibold text-gray-700">Property Address:</p>
                <p className="text-gray-900">{contract.property_address}</p>
              </div>
            </div>
          </div>

          {/* Parties Involved */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">PARTIES TO THIS AGREEMENT</h3>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="font-semibold text-gray-700 mb-2">LANDLORD (Agent):</p>
                <p className="text-gray-900">{contract.agent_name}</p>
                <p className="text-gray-600">{contract.agent_email}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700 mb-2">TENANT:</p>
                <p className="text-gray-900">{contract.tenant_name}</p>
                <p className="text-gray-600">{contract.tenant_email}</p>
              </div>
            </div>
          </div>

          {/* Financial Terms */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">FINANCIAL TERMS</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-700">Monthly Rent:</p>
                <p className="text-2xl font-bold text-green-600">${contract.monthly_rent}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold text-gray-700">Security Deposit:</p>
                <p className="text-2xl font-bold text-blue-600">${contract.security_deposit}</p>
              </div>
            </div>
          </div>

          {/* Lease Duration */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">LEASE DURATION</h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-700">Lease Start Date:</p>
                <p className="text-gray-900">{new Date(contract.lease_start_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Lease End Date:</p>
                <p className="text-gray-900">{new Date(contract.lease_end_date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="font-semibold text-gray-700">Duration:</p>
                <p className="text-gray-900">{contract.lease_duration_months} months</p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          {contract.property_amenities && contract.property_amenities.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">INCLUDED AMENITIES</h3>
              <div className="grid grid-cols-3 gap-3">
                {contract.property_amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="text-sm text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">TERMS AND CONDITIONS</h3>
            <div className="space-y-4 text-sm text-gray-700">
              <div>
                <p className="font-semibold mb-1">1. RENT PAYMENT</p>
                <p>Tenant agrees to pay rent on or before the 1st day of each month. Late payment fees may apply after a 5-day grace period.</p>
              </div>
              <div>
                <p className="font-semibold mb-1">2. SECURITY DEPOSIT</p>
                <p>The security deposit will be held for the duration of the lease and returned within 30 days of lease termination, minus any deductions for damages.</p>
              </div>
              <div>
                <p className="font-semibold mb-1">3. MAINTENANCE</p>
                <p>Tenant is responsible for minor repairs and maintenance. Landlord will handle major repairs and structural issues.</p>
              </div>
              <div>
                <p className="font-semibold mb-1">4. UTILITIES</p>
                <p>Unless specified otherwise, tenant is responsible for electricity, gas, water, internet, and other utilities.</p>
              </div>
              <div>
                <p className="font-semibold mb-1">5. PETS</p>
                <p>Pets are not allowed unless explicitly approved by landlord in writing. Additional pet deposit may be required.</p>
              </div>
              <div>
                <p className="font-semibold mb-1">6. TERMINATION</p>
                <p>Either party may terminate this lease with 30 days written notice. Early termination by tenant may result in forfeiture of security deposit.</p>
              </div>
              <div>
                <p className="font-semibold mb-1">7. GOVERNING LAW</p>
                <p>This agreement shall be governed by the laws of the jurisdiction where the property is located.</p>
              </div>
            </div>
          </div>

          {/* Signatures */}
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">SIGNATURES</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-4">LANDLORD SIGNATURE:</p>
                <div className="border-t-2 border-gray-900 pt-2">
                  <p className="text-sm text-gray-900">{contract.agent_name}</p>
                  <p className="text-xs text-gray-600">Date: {new Date(contract.contract_generated_at).toLocaleDateString()}</p>
                  <p className="text-xs text-green-600 font-semibold mt-1">✓ Digitally Signed</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-4">TENANT SIGNATURE:</p>
                <div className="border-t-2 border-gray-900 pt-2">
                  <p className="text-sm text-gray-900">{contract.tenant_name}</p>
                  <p className="text-xs text-gray-600">Date: {new Date().toLocaleDateString()}</p>
                  {contract.status === 'signed' ? (
                    <p className="text-xs text-green-600 font-semibold mt-1">✓ Digitally Signed</p>
                  ) : (
                    <p className="text-xs text-orange-600 font-semibold mt-1">⏳ Awaiting Signature</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sign Button - Not printed */}
          {contract.status !== 'signed' && (
            <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6 print:hidden">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 text-3xl">📝</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">Ready to Sign?</h4>
                  <p className="text-sm text-gray-700 mb-4">
                    By clicking "Sign Contract" below, you agree to all the terms and conditions outlined in this rental agreement.
                  </p>
                  <button
                    onClick={handleSignContract}
                    disabled={signing}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {signing ? 'Signing...' : '✍️ Sign Contract'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Signed Status - Not printed */}
          {contract.status === 'signed' && (
            <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-lg p-6 print:hidden">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 text-3xl">✅</div>
                <div>
                  <h4 className="font-semibold text-green-900 mb-1">Contract Signed</h4>
                  <p className="text-sm text-green-700">
                    This contract has been digitally signed by all parties. You can download or print a copy for your records.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-6 border-t text-center text-xs text-gray-500">
            <p>This is a legally binding agreement. Please read carefully before signing.</p>
            <p className="mt-1">Property237 Real Estate Platform • www.property237.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
