'use client';

import { useState } from 'react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'funds' | 'account'>('account');

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      {/* Tabs */}
      <div className="flex space-x-8 border-b">
        <button
          onClick={() => setActiveTab('funds')}
          className={`pb-2 ${
            activeTab === 'funds' ? 'border-b-2 border-black font-medium' : 'text-gray-500'
          }`}
        >
          Fund Settings
        </button>
        <button
          onClick={() => setActiveTab('account')}
          className={`pb-2 ${
            activeTab === 'account' ? 'border-b-2 border-black font-medium' : 'text-gray-500'
          }`}
        >
          Account Settings
        </button>
      </div>

      {/* Content */}
      <div className="mt-8">
        {activeTab === 'funds' ? (
          <p className="text-gray-500">Fund Settings will go here.</p>
        ) : (
          <div className="space-y-10">
            {/* Your Profile */}
            <section>
              <h2 className="text-lg font-semibold mb-4">Your profile</h2>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6">
                {/* Upload box */}
                <div className="w-24 h-24 bg-gray-100 border border-gray-300 rounded flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 7h4l2-3h6l2 3h4v13H3V7z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 11a3 3 0 100 6 3 3 0 000-6z"
                    />
                  </svg>
                </div>

                {/* Text */}
                <div className="mt-3 sm:mt-0">
                  <p className="text-sm font-medium text-gray-700">Add a profile photo</p>
                  <p className="text-sm text-gray-500">Recommended dimensions are 1600 × 1600</p>
                </div>
              </div>

              {/* Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input
                    type="text"
                    value="Janice"
                    readOnly
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value="Smith"
                    readOnly
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Role</label>
                  <input
                    type="text"
                    value="Analyst"
                    readOnly
                    className="border rounded px-3 py-2 w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">This was assigned by your administrator</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value="jsmith@gmail.com"
                    readOnly
                    className="border rounded px-3 py-2 w-full"
                  />
                </div>
              </div>
            </section>

            {/* Contact Info */}
            <section>
              <h2 className="text-lg font-semibold mb-2">Additional contact information</h2>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
              <input
                type="tel"
                value="+1 888-888-7777"
                readOnly
                className="border rounded px-3 py-2 w-full sm:w-1/2"
              />
            </section>

            {/* Password */}
            <section>
              <h2 className="text-lg font-semibold mb-2">Password</h2>
              <div className="space-x-4">
                <button className="border px-4 py-2 rounded">Change your password</button>
                <button className="border px-4 py-2 rounded">Reset your password</button>
              </div>
            </section>

            {/* 2FA Security */}
            <section>
              <h2 className="text-lg font-semibold mb-2">Account Security</h2>
              <p className="text-sm text-gray-500 mb-2">
                Make your account more secure through double verification
              </p>
              <button className="border px-4 py-2 rounded">
                Set Up Two-Factor Authentication
              </button>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
