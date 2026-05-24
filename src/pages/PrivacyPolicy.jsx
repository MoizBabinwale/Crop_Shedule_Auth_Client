import React from "react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-green-700 mb-6">Privacy Policy</h1>

        <p className="mb-4 text-gray-700">Last Updated: September 2025</p>

        <div className="space-y-6 text-gray-700 leading-7">
          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">1. Information We Collect</h2>

            <p>We may collect personal information including your name, email address, phone number, crop details, schedules, and Google Calendar information when you use our services.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">2. How We Use Your Information</h2>

            <p>Your information is used to:</p>

            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Generate crop schedules and quotations</li>
              <li>Sync reminders to Google Calendar</li>
              <li>Improve our services</li>
              <li>Provide customer support</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">3. Google Calendar Access</h2>

            <p>Our application requests access to your Google Calendar only to create, manage, and remove quotation reminder events that you approve.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">4. Data Security</h2>

            <p>We use secure technologies and industry-standard practices to protect your information.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">5. Third-Party Services</h2>

            <p>We may use Google APIs and other third-party services to provide features within our platform.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">6. Contact Us</h2>

            <p>If you have any questions regarding this Privacy Policy, please contact us at:</p>

            <p className="mt-2 font-semibold">info@parnanetra.org</p>
          </div>
        </div>
      </div>
    </div>
  );
}
