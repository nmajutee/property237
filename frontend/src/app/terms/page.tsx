'use client'

import React from 'react'
import Navbar from '../../components/navigation/Navbar'
import Link from 'next/link'

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Terms of Service
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Last Updated: October 6, 2025
          </p>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              By accessing and using Property237 ("the Platform," "our services"), you accept and
              agree to be bound by these Terms of Service. If you do not agree to these terms,
              please do not use our services.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              2. Description of Services
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Property237 provides an online platform connecting property owners, agents, and
              tenants for property rental purposes in Cameroon. Our services include:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Property listing and search functionality</li>
              <li>Communication tools between users</li>
              <li>Rental application processing</li>
              <li>Payment processing and credit system</li>
              <li>User verification services</li>
              <li>Property management tools for agents</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              3. User Accounts
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              3.1 Registration
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              To use certain features, you must create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and update your information</li>
              <li>Keep your password secure and confidential</li>
              <li>Be responsible for all activities under your account</li>
              <li>Notify us immediately of any unauthorized use</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              3.2 Account Types
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We offer three account types:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li><strong>Tenant:</strong> Search for and apply to rental properties</li>
              <li><strong>Agent/Landlord:</strong> List and manage properties</li>
              <li><strong>Admin:</strong> Platform management and oversight</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              3.3 Eligibility
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You must be at least 18 years old to use our services. By using the Platform, you
              represent that you meet this requirement.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              4. User Conduct
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You agree NOT to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Provide false or misleading information</li>
              <li>Impersonate any person or entity</li>
              <li>Post fraudulent, illegal, or harmful content</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Violate any laws or regulations</li>
              <li>Interfere with or disrupt the Platform</li>
              <li>Use automated systems to access the Platform without permission</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Collect user information without consent</li>
              <li>Advertise or promote third-party services without permission</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              5. Property Listings
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              5.1 Agent Responsibilities
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you list properties, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Provide accurate property information and photos</li>
              <li>Have the right to list the property</li>
              <li>Comply with all applicable housing laws</li>
              <li>Respond promptly to inquiries</li>
              <li>Honor your commitments to tenants</li>
              <li>Maintain proper licensing and permits</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              5.2 Property Standards
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              All listed properties must:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Meet local safety and habitability standards</li>
              <li>Be accurately described and photographed</li>
              <li>Have clear and lawful rental terms</li>
              <li>Comply with anti-discrimination laws</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              6. Credit System and Payments
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              6.1 Credits
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Our platform uses a credit system for certain services:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Credits are purchased in advance</li>
              <li>Credits are non-refundable except as required by law</li>
              <li>Credits have no cash value</li>
              <li>Credit usage is tracked and visible in your account</li>
              <li>Unused credits do not expire</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              6.2 Payment Processing
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              All payments are processed securely through third-party payment providers. You agree
              to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Provide accurate payment information</li>
              <li>Pay all charges incurred</li>
              <li>Comply with the payment provider's terms</li>
              <li>Not dispute legitimate charges</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              6.3 Fees and Pricing
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We reserve the right to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Change our fees and pricing at any time</li>
              <li>Offer promotions and discounts</li>
              <li>Charge fees for premium services</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              7. Intellectual Property
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              7.1 Platform Content
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              All content on the Platform, including text, graphics, logos, and software, is owned
              by Property237 or its licensors and protected by intellectual property laws.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              7.2 User Content
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You retain ownership of content you submit but grant us a worldwide, non-exclusive
              license to use, display, and distribute your content for platform operations.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              8. Verification and Background Checks
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may verify user information and conduct background checks. However:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>We do not guarantee the accuracy of user information</li>
              <li>Verification does not constitute an endorsement</li>
              <li>Users remain responsible for their own due diligence</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              9. Disclaimers and Limitations of Liability
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              9.1 Service Availability
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              The Platform is provided "as is" without warranties of any kind. We do not guarantee:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Uninterrupted or error-free service</li>
              <li>Accuracy of listings or user information</li>
              <li>Quality or condition of properties</li>
              <li>Successful rental transactions</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              9.2 Limitation of Liability
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              To the maximum extent permitted by law, Property237 shall not be liable for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Indirect, incidental, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>User disputes or property issues</li>
              <li>Third-party actions or content</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              10. Indemnification
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You agree to indemnify and hold Property237 harmless from any claims, damages, or
              expenses arising from:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Your use of the Platform</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any laws or third-party rights</li>
              <li>Your content or listings</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              11. Termination
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may suspend or terminate your account at any time for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Violation of these Terms</li>
              <li>Fraudulent or illegal activity</li>
              <li>Extended inactivity</li>
              <li>Any reason at our discretion</li>
            </ul>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You may delete your account at any time through your account settings.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              12. Dispute Resolution
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Any disputes arising from these Terms or use of the Platform shall be resolved through:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Good faith negotiation between parties</li>
              <li>Mediation if negotiation fails</li>
              <li>Arbitration in accordance with Cameroonian law</li>
              <li>Courts of Cameroon as a last resort</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              13. Changes to Terms
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may modify these Terms at any time. We will notify users of material changes.
              Continued use of the Platform after changes constitutes acceptance of the new Terms.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              14. Governing Law
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              These Terms are governed by the laws of Cameroon, without regard to conflict of law
              principles.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              15. Contact Information
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              For questions about these Terms, contact us:
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mb-8">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Email:</strong> legal@property237.cm
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Phone:</strong> +237 6XX XXX XXX
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong>Address:</strong> Douala, Cameroon
              </p>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Related Documents:
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/privacy"
                className="text-property237-primary hover:text-property237-dark font-medium"
              >
                Privacy Policy
              </Link>
              <Link
                href="/cookie-policy"
                className="text-property237-primary hover:text-property237-dark font-medium"
              >
                Cookie Policy
              </Link>
              <Link
                href="/contact"
                className="text-property237-primary hover:text-property237-dark font-medium"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
