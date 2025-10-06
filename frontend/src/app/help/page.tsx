'use client'

import React, { useState } from 'react'
import Navbar from '../../components/navigation/Navbar'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline'

interface FAQItem {
  question: string
  answer: string
  category: string
}

export default function HelpPage() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)
  const [selectedCategory, setSelectedCategory] = useState('all')

  const faqs: FAQItem[] = [
    {
      category: 'general',
      question: 'What is Property237?',
      answer:
        'Property237 is Cameroon\'s leading property rental platform connecting tenants with property owners and agents. We make finding and listing rental properties simple, secure, and efficient.',
    },
    {
      category: 'general',
      question: 'Is Property237 free to use?',
      answer:
        'Browsing properties and creating an account is free. Tenants can search and view properties at no cost. Agents use credits for certain premium features like featured listings.',
    },
    {
      category: 'tenant',
      question: 'How do I search for properties?',
      answer:
        'Use our search feature on the Properties page to filter by location, price, property type, bedrooms, and more. You can save favorites and apply directly through the platform.',
    },
    {
      category: 'tenant',
      question: 'How do I apply for a property?',
      answer:
        'Once you find a property you like, click "Apply Now" on the property detail page. Fill in your desired move-in date and any additional notes. The agent will review your application and respond.',
    },
    {
      category: 'tenant',
      question: 'Can I view properties before applying?',
      answer:
        'Yes! Contact the agent directly through the platform to schedule a viewing. Their contact information is available on each property listing.',
    },
    {
      category: 'tenant',
      question: 'How do I know if an agent is verified?',
      answer:
        'Verified agents have a blue checkmark badge next to their name. This indicates they\'ve completed our verification process including identity and document verification.',
    },
    {
      category: 'agent',
      question: 'How do I list a property?',
      answer:
        'Sign up as an agent, navigate to "Add Property" from your dashboard, and fill in the property details including photos, description, amenities, and pricing. Your listing will be live after submission.',
    },
    {
      category: 'agent',
      question: 'What are credits and how do they work?',
      answer:
        'Credits are used for premium features like featuring your listings, boosting visibility, and accessing advanced analytics. Purchase credits through your account to unlock these features.',
    },
    {
      category: 'agent',
      question: 'How do I manage applications?',
      answer:
        'View all applications in your dashboard. You can approve, reject, or request more information from applicants. Communicate directly with potential tenants through the platform.',
    },
    {
      category: 'agent',
      question: 'Can I edit my listings?',
      answer:
        'Yes! Go to "My Properties" in your dashboard, find the property you want to edit, and click "Edit". You can update details, photos, pricing, and availability anytime.',
    },
    {
      category: 'payment',
      question: 'What payment methods do you accept?',
      answer:
        'We accept Mobile Money (MTN Mobile Money, Orange Money), bank cards, and bank transfers for credit purchases and premium features.',
    },
    {
      category: 'payment',
      question: 'Are payments secure?',
      answer:
        'Yes! All payments are processed through secure, encrypted payment gateways. We never store your payment information on our servers.',
    },
    {
      category: 'payment',
      question: 'Can I get a refund?',
      answer:
        'Credits are generally non-refundable. However, if you experience technical issues or unauthorized charges, contact our support team within 7 days for assistance.',
    },
    {
      category: 'account',
      question: 'How do I verify my account?',
      answer:
        'Complete the verification process in your profile settings. Upload a valid ID card, proof of address, and any required business documents for agents. Verification typically takes 24-48 hours.',
    },
    {
      category: 'account',
      question: 'I forgot my password. What should I do?',
      answer:
        'Click "Forgot Password" on the sign-in page. Enter your email address, and we\'ll send you instructions to reset your password.',
    },
    {
      category: 'account',
      question: 'How do I delete my account?',
      answer:
        'Go to Settings > Account Settings > Delete Account. Note that this action is permanent and cannot be undone. All your data will be removed from our system.',
    },
    {
      category: 'safety',
      question: 'How do I report a suspicious listing?',
      answer:
        'If you encounter a suspicious listing, click the "Report" button on the property page or contact our support team directly. We take fraud seriously and investigate all reports promptly.',
    },
    {
      category: 'safety',
      question: 'What safety precautions should I take?',
      answer:
        'Always verify property ownership, visit properties in person before committing, never send money before signing a contract, and use our platform for all communications to maintain records.',
    },
    {
      category: 'technical',
      question: 'The website is not loading properly. What should I do?',
      answer:
        'Try clearing your browser cache, using a different browser, or checking your internet connection. If the problem persists, contact our technical support team.',
    },
    {
      category: 'technical',
      question: 'Do you have a mobile app?',
      answer:
        'Currently, we offer a mobile-optimized website. Native iOS and Android apps are in development and will be available soon. Stay tuned for updates!',
    },
  ]

  const categories = [
    { value: 'all', label: 'All Topics' },
    { value: 'general', label: 'General' },
    { value: 'tenant', label: 'For Tenants' },
    { value: 'agent', label: 'For Agents' },
    { value: 'payment', label: 'Payments' },
    { value: 'account', label: 'Account' },
    { value: 'safety', label: 'Safety' },
    { value: 'technical', label: 'Technical' },
  ]

  const filteredFAQs =
    selectedCategory === 'all'
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory)

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <QuestionMarkCircleIcon className="w-16 h-16 mx-auto text-property237-primary mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            How Can We Help You?
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Find answers to frequently asked questions
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-property237-primary text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="space-y-4">
            {filteredFAQs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className="font-semibold text-gray-900 dark:text-white pr-4">
                    {faq.question}
                  </span>
                  {expandedIndex === index ? (
                    <ChevronUpIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDownIcon className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {expandedIndex === index && (
                  <div className="px-6 pb-4 text-gray-700 dark:text-gray-300">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-property237-primary to-property237-dark rounded-xl shadow-lg p-8 text-white">
            <div className="text-center mb-8">
              <ChatBubbleLeftRightIcon className="w-12 h-12 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Still Need Help?</h2>
              <p className="text-white/90">
                Our support team is here to assist you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <EnvelopeIcon className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Email Us</h3>
                  <a
                    href="mailto:support@property237.cm"
                    className="text-sm text-white/90 hover:text-white"
                  >
                    support@property237.cm
                  </a>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <PhoneIcon className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Call Us</h3>
                  <a
                    href="tel:+2376XXXXXXX"
                    className="text-sm text-white/90 hover:text-white"
                  >
                    +237 6XX XXX XXX
                  </a>
                </div>
              </div>

              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <ChatBubbleLeftRightIcon className="w-8 h-8 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Live Chat</h3>
                  <p className="text-sm text-white/90">
                    Mon-Fri, 9AM-6PM
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <a
                href="/contact"
                className="inline-block px-8 py-3 bg-white text-property237-primary font-semibold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="max-w-4xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a
              href="/terms"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-center"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Terms of Service
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Read our terms and conditions
              </p>
            </a>

            <a
              href="/privacy"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-center"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                Privacy Policy
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Learn how we protect your data
              </p>
            </a>

            <a
              href="/about"
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow text-center"
            >
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                About Us
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Learn more about Property237
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
