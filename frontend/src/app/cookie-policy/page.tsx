'use client'

import React from 'react'
import Navbar from '../../components/navigation/Navbar'
import Link from 'next/link'

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Cookie Policy
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Last Updated: October 6, 2025
          </p>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              1. What Are Cookies?
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Cookies are small text files that are placed on your device when you visit our
              website. They help us provide you with a better experience by remembering your
              preferences and understanding how you use our platform.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              2. How We Use Cookies
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Property237 uses cookies and similar tracking technologies for the following purposes:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              2.1 Essential Cookies
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              These cookies are necessary for the platform to function properly:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li><strong>Authentication:</strong> Keep you logged in to your account</li>
              <li><strong>Security:</strong> Protect against fraudulent activity and enhance security</li>
              <li><strong>Session Management:</strong> Remember your choices during your visit</li>
              <li><strong>Load Balancing:</strong> Distribute traffic across our servers</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              2.2 Functional Cookies
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              These cookies enable enhanced functionality and personalization:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li><strong>Preferences:</strong> Remember your language, region, and display settings</li>
              <li><strong>User Interface:</strong> Store your layout and view preferences</li>
              <li><strong>Search History:</strong> Remember recent searches for convenience</li>
              <li><strong>Saved Items:</strong> Track your favorites and saved properties</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              2.3 Analytics Cookies
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              These cookies help us understand how visitors interact with our platform:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li><strong>Usage Statistics:</strong> Track page views, visits, and session duration</li>
              <li><strong>Performance Monitoring:</strong> Identify and fix technical issues</li>
              <li><strong>User Behavior:</strong> Understand navigation patterns and popular features</li>
              <li><strong>A/B Testing:</strong> Test different versions of our platform</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              2.4 Marketing Cookies
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              These cookies are used to deliver relevant advertisements:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li><strong>Targeted Advertising:</strong> Show ads relevant to your interests</li>
              <li><strong>Retargeting:</strong> Display ads for properties you've viewed</li>
              <li><strong>Campaign Tracking:</strong> Measure the effectiveness of marketing campaigns</li>
              <li><strong>Social Media Integration:</strong> Enable sharing and social features</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              3. Types of Cookies We Use
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              3.1 First-Party Cookies
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Set directly by Property237 when you visit our platform:
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mb-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 text-gray-900 dark:text-white">Cookie Name</th>
                    <th className="text-left py-2 text-gray-900 dark:text-white">Purpose</th>
                    <th className="text-left py-2 text-gray-900 dark:text-white">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 dark:text-gray-300">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2">property237_access_token</td>
                    <td className="py-2">Authentication</td>
                    <td className="py-2">Session</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2">property237_user</td>
                    <td className="py-2">User data</td>
                    <td className="py-2">Session</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2">theme_preference</td>
                    <td className="py-2">Dark/Light mode</td>
                    <td className="py-2">1 year</td>
                  </tr>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <td className="py-2">language</td>
                    <td className="py-2">Language preference</td>
                    <td className="py-2">1 year</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              3.2 Third-Party Cookies
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Set by our service providers and partners:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li><strong>Google Analytics:</strong> Website analytics and reporting</li>
              <li><strong>Payment Processors:</strong> Secure payment processing</li>
              <li><strong>Social Media Platforms:</strong> Social sharing and login features</li>
              <li><strong>Advertising Networks:</strong> Targeted advertising</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              4. Cookie Duration
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Cookies may be either:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>
                <strong>Session Cookies:</strong> Temporary cookies that expire when you close your
                browser
              </li>
              <li>
                <strong>Persistent Cookies:</strong> Remain on your device for a set period or until
                you delete them
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              5. Managing Your Cookie Preferences
            </h2>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              5.1 Cookie Settings
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              You can manage your cookie preferences in several ways:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Use our cookie consent banner when you first visit our site</li>
              <li>Access cookie settings in your account preferences</li>
              <li>Configure your browser settings to block or delete cookies</li>
              <li>Use browser privacy modes or extensions</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              5.2 Browser Controls
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Most browsers allow you to:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>View and delete existing cookies</li>
              <li>Block third-party cookies</li>
              <li>Block all cookies from specific websites</li>
              <li>Block all cookies entirely</li>
              <li>Delete all cookies when closing the browser</li>
            </ul>

            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-6">
              <p className="text-blue-800 dark:text-blue-200 font-medium mb-2">
                ⚠️ Important Note:
              </p>
              <p className="text-blue-700 dark:text-blue-300">
                Blocking or deleting cookies may impact your experience on our platform. Some
                features may not work properly, and you may need to log in each time you visit.
              </p>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              5.3 Browser-Specific Instructions
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Instructions for popular browsers:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>
                <strong>Google Chrome:</strong> Settings → Privacy and security → Cookies and other
                site data
              </li>
              <li>
                <strong>Mozilla Firefox:</strong> Options → Privacy & Security → Cookies and Site
                Data
              </li>
              <li>
                <strong>Safari:</strong> Preferences → Privacy → Manage Website Data
              </li>
              <li>
                <strong>Microsoft Edge:</strong> Settings → Cookies and site permissions
              </li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              6. Third-Party Cookies and Services
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We work with third-party services that may set their own cookies:
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              6.1 Google Analytics
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We use Google Analytics to analyze platform usage. You can opt-out by installing the
              Google Analytics Opt-out Browser Add-on.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
              6.2 Social Media
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Social media cookies enable sharing and social features. These are controlled by the
              respective social media platforms and subject to their privacy policies.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              7. Do Not Track Signals
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Some browsers have "Do Not Track" features. Currently, there is no industry standard
              for responding to these signals. We do not currently respond to Do Not Track signals.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              8. Mobile Devices
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              On mobile devices, you can control tracking through:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 mb-4">
              <li>Device privacy settings</li>
              <li>Advertising identifier preferences</li>
              <li>App permissions</li>
              <li>Limit Ad Tracking (iOS) or Opt out of Ads Personalization (Android)</li>
            </ul>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              9. Updates to This Cookie Policy
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We may update this Cookie Policy from time to time to reflect changes in technology,
              legislation, or our practices. The "Last Updated" date at the top indicates when this
              policy was last revised.
            </p>

            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mt-8 mb-4">
              10. Contact Us
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              If you have questions about our use of cookies, please contact us:
            </p>
            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg mb-8">
              <p className="text-gray-700 dark:text-gray-300 mb-2">
                <strong>Email:</strong> privacy@property237.cm
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
                href="/terms"
                className="text-property237-primary hover:text-property237-dark font-medium"
              >
                Terms of Service
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
