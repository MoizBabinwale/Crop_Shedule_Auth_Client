import React from "react";

export default function TermsConditions() {
  return (
    <div className="min-h-screen bg-green-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-green-700 mb-6">Terms & Conditions</h1>

        <p className="mb-4 text-gray-700">Last Updated: September 2025</p>

        <div className="space-y-6 text-gray-700 leading-7">
          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">1. Acceptance of Terms</h2>

            <p>By accessing and using our website, you agree to comply with these Terms and Conditions.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">2. Services</h2>

            <p>We provide crop schedule management, quotation generation, and calendar synchronization services for agricultural use.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">3. User Responsibilities</h2>

            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Provide accurate information</li>
              <li>Use the platform legally</li>
              <li>Protect account credentials</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">4. Google Services</h2>

            <p>Our platform integrates with Google services such as Google Calendar upon your authorization.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">5. Limitation of Liability</h2>

            <p>We are not responsible for crop losses, technical interruptions, or third-party service failures.</p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-green-700 mb-2">6. Contact Information</h2>

            <p>For any questions regarding these Terms, contact:</p>

            <p className="mt-2 font-semibold">info@parnanetra.org</p>
          </div>
        </div>
      </div>
    </div>
  );
}
