import React from 'react';
import {
  FaUserFriends,
  FaWhatsapp,
  FaEnvelope,
  FaUpload,
  FaEdit,
  FaQrcode,
  FaFileImage,
  FaList,
  FaQuestionCircle,
  FaBook,
  FaChartLine,
} from 'react-icons/fa';

const FeatureSection = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  </div>
);

const FeatureCard = ({ icon: Icon, title, description }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <div className="p-3 bg-blue-50 rounded-lg">
          <Icon className="w-6 h-6 text-gray-600" />
        </div>
      </div>
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  </div>
);

const Overview = () => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome to E-Marketing Platform
        </h1>
        <p className="mt-2 text-gray-600">
          Your all-in-one solution for contact management and message
          broadcasting.
        </p>
      </div>

      <FeatureSection title="Contact Management">
        <FeatureCard
          icon={FaUserFriends}
          title="Add Individual Contacts"
          description="Easily add new contacts one by one with detailed information including name, phone number, and email."
        />
        <FeatureCard
          icon={FaUpload}
          title="Bulk Upload Contacts"
          description="Save time by uploading multiple contacts at once using an Excel file. Perfect for large contact lists."
        />
        <FeatureCard
          icon={FaEdit}
          title="Manage Contacts"
          description="View, edit, or remove contacts anytime. Keep your contact list up-to-date and organized."
        />
      </FeatureSection>

      <FeatureSection title="WhatsApp Broadcasting">
        <FeatureCard
          icon={FaWhatsapp}
          title="Send WhatsApp Messages"
          description="Broadcast text messages to your contacts directly through WhatsApp integration."
        />
        <FeatureCard
          icon={FaQrcode}
          title="Quick Authentication"
          description="Secure and easy setup - simply scan a QR code to link your WhatsApp account."
        />
        <FeatureCard
          icon={FaFileImage}
          title="Rich Media Sharing"
          description="Share images and files with your contacts. Support for multiple file formats."
        />
      </FeatureSection>

      <FeatureSection title="Email Broadcasting">
        <FeatureCard
          icon={FaEnvelope}
          title="Email Campaign Management"
          description="Create and manage email campaigns. Send professional emails to your contact lists."
        />
        <FeatureCard
          icon={FaList}
          title="Email List Organization"
          description="Organize your email contacts into lists for targeted campaigns and better management."
        />
        <FeatureCard
          icon={FaUpload}
          title="Import Email Lists"
          description="Easily import existing email lists from Excel files or other supported formats."
        />
      </FeatureSection>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <FaQuestionCircle className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-blue-900">Need Help?</h3>
          </div>
          <p className="text-blue-700">
            For detailed instructions or support, please contact our team or
            refer to the documentation.
          </p>
        </div>

        <div className="bg-green-50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <FaChartLine className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-green-900">
              Quick Stats
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Total Contacts</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
            <div className="bg-white rounded-lg p-4 text-center">
              <p className="text-sm text-gray-600">Messages Sent</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-purple-50 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-3">
            <FaBook className="w-5 h-5 text-purple-500" />
            <h3 className="text-lg font-semibold text-purple-900">
              Quick Start Guide
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4">
              <p className="font-medium text-gray-900 mb-2">1. Add Contacts</p>
              <p className="text-sm text-gray-600">
                Start by adding your contacts individually or upload them in
                bulk.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="font-medium text-gray-900 mb-2">
                2. Create Campaign
              </p>
              <p className="text-sm text-gray-600">
                Set up your WhatsApp or email campaign with your message
                content.
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <p className="font-medium text-gray-900 mb-2">
                3. Start Broadcasting
              </p>
              <p className="text-sm text-gray-600">
                Select your audience and start sending your messages.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
