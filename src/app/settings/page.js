'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'

export default function SettingsPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('notifications')
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      push: true,
      bidding: true,
      outbid: true,
      won: true,
      messages: true,
      newsletter: false
    },
    privacy: {
      showEmail: false,
      showPhone: false,
      showLocation: true,
      showActivity: true,
      allowMessages: true,
      indexProfile: true
    },
    preferences: {
      language: 'en',
      timezone: 'America/New_York',
      currency: 'USD',
      theme: 'dark',
      autoLogout: 30
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
      activityLog: true
    }
  })

  const handleToggle = (section, key) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: !prev[section][key]
      }
    }))
  }

  const handleSelectChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert('Settings saved successfully!')
    } catch (error) {
      alert('Failed to save settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      {/* Use Navbar Component */}
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Settings</h1>
          <p className="text-gray-400 text-sm sm:text-base">Manage your account preferences and privacy settings</p>
        </div>

        {/* Mobile Tabs Dropdown */}
        <div className="sm:hidden mb-6">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
            className="w-full bg-[#18181B] border border-[#232326] rounded-lg px-4 py-3 text-white focus:border-orange-500 focus:outline-none"
          >
            <option value="notifications">🔔 Notifications</option>
            <option value="privacy">🔒 Privacy</option>
            <option value="preferences">⚙️ Preferences</option>
            <option value="security">🛡️ Security</option>
          </select>
        </div>

        {/* Desktop Tabs */}
        <div className="bg-[#18181B] rounded-xl border border-[#232326] mb-6 sm:mb-8">
          <div className="hidden sm:flex border-b border-[#232326] overflow-x-auto">
            {[
              { key: 'notifications', label: 'Notifications', icon: '🔔' },
              { key: 'privacy', label: 'Privacy', icon: '🔒' },
              { key: 'preferences', label: 'Preferences', icon: '⚙️' },
              { key: 'security', label: 'Security', icon: '🛡️' }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 lg:px-6 py-4 font-medium transition whitespace-nowrap text-sm lg:text-base ${
                  activeTab === tab.key
                    ? 'text-orange-400 border-b-2 border-orange-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-4 sm:p-6">
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg font-semibold">Notification Preferences</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  <div>
                    <h4 className="font-medium text-gray-300 mb-4">Delivery Methods</h4>
                    <div className="space-y-3">
                      {Object.entries({
                        email: 'Email notifications',
                        sms: 'SMS notifications',
                        push: 'Push notifications'
                      }).map(([key, label]) => (
                        <label key={key} className="flex items-center justify-between cursor-pointer p-2 sm:p-0">
                          <span className="text-gray-300 text-sm sm:text-base">{label}</span>
                          <input
                            type="checkbox"
                            checked={settings.notifications[key]}
                            onChange={() => handleToggle('notifications', key)}
                            className="w-4 h-4 text-orange-500 bg-[#232326] border-[#333] rounded focus:ring-orange-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-300 mb-4">Event Types</h4>
                    <div className="space-y-3">
                      {Object.entries({
                        bidding: 'New bids on my items',
                        outbid: 'When I get outbid',
                        won: 'Auction wins',
                        messages: 'New messages',
                        newsletter: 'Newsletter updates'
                      }).map(([key, label]) => (
                        <label key={key} className="flex items-center justify-between cursor-pointer p-2 sm:p-0">
                          <span className="text-gray-300 text-sm sm:text-base">{label}</span>
                          <input
                            type="checkbox"
                            checked={settings.notifications[key]}
                            onChange={() => handleToggle('notifications', key)}
                            className="w-4 h-4 text-orange-500 bg-[#232326] border-[#333] rounded focus:ring-orange-500"
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg font-semibold">Privacy Settings</h3>
                <div className="space-y-3 sm:space-y-4">
                  {Object.entries({
                    showEmail: 'Show email address on profile',
                    showPhone: 'Show phone number on profile',
                    showLocation: 'Show location on profile',
                    showActivity: 'Show recent activity on profile',
                    allowMessages: 'Allow messages from other users',
                    indexProfile: 'Allow search engines to index my profile'
                  }).map(([key, label]) => (
                    <label key={key} className="flex items-center justify-between cursor-pointer p-3 sm:p-4 bg-[#232326] rounded-lg">
                      <span className="text-gray-300 text-sm sm:text-base pr-2">{label}</span>
                      <input
                        type="checkbox"
                        checked={settings.privacy[key]}
                        onChange={() => handleToggle('privacy', key)}
                        className="w-4 h-4 text-orange-500 bg-[#2a2a2e] border-[#333] rounded focus:ring-orange-500 flex-shrink-0"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg font-semibold">General Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Language</label>
                    <select
                      value={settings.preferences.language}
                      onChange={(e) => handleSelectChange('preferences', 'language', e.target.value)}
                      className="w-full bg-[#232326] border border-[#333] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm sm:text-base focus:border-orange-500 focus:outline-none"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Timezone</label>
                    <select
                      value={settings.preferences.timezone}
                      onChange={(e) => handleSelectChange('preferences', 'timezone', e.target.value)}
                      className="w-full bg-[#232326] border border-[#333] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm sm:text-base focus:border-orange-500 focus:outline-none"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Currency</label>
                    <select
                      value={settings.preferences.currency}
                      onChange={(e) => handleSelectChange('preferences', 'currency', e.target.value)}
                      className="w-full bg-[#232326] border border-[#333] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm sm:text-base focus:border-orange-500 focus:outline-none"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CAD">CAD ($)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Auto Logout</label>
                    <select
                      value={settings.preferences.autoLogout}
                      onChange={(e) => handleSelectChange('preferences', 'autoLogout', parseInt(e.target.value))}
                      className="w-full bg-[#232326] border border-[#333] rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white text-sm sm:text-base focus:border-orange-500 focus:outline-none"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={0}>Never</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-4">Theme</label>
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        checked={settings.preferences.theme === 'light'}
                        onChange={() => handleSelectChange('preferences', 'theme', 'light')}
                        className="text-orange-500"
                      />
                      <span className="text-sm sm:text-base">Light Mode</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="theme"
                        checked={settings.preferences.theme === 'dark'}
                        onChange={() => handleSelectChange('preferences', 'theme', 'dark')}
                        className="text-orange-500"
                      />
                      <span className="text-sm sm:text-base">Dark Mode</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-4 sm:space-y-6">
                <h3 className="text-lg font-semibold">Security Settings</h3>
                <div className="space-y-3 sm:space-y-4">
                  {Object.entries({
                    twoFactor: 'Enable two-factor authentication',
                    loginAlerts: 'Email alerts for new logins',
                    activityLog: 'Keep activity log'
                  }).map(([key, label]) => (
                    <label key={key} className="flex items-start justify-between cursor-pointer p-3 sm:p-4 bg-[#232326] rounded-lg">
                      <div className="pr-2">
                        <span className="text-gray-300 text-sm sm:text-base">{label}</span>
                        {key === 'twoFactor' && (
                          <p className="text-xs sm:text-sm text-gray-400 mt-1">Add an extra layer of security to your account</p>
                        )}
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.security[key]}
                        onChange={() => handleToggle('security', key)}
                        className="w-4 h-4 text-orange-500 bg-[#2a2a2e] border-[#333] rounded focus:ring-orange-500 flex-shrink-0 mt-1"
                      />
                    </label>
                  ))}
                </div>

                <div className="pt-4 sm:pt-6 border-t border-[#232326]">
                  <h4 className="font-medium text-gray-300 mb-4">Password & Access</h4>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 sm:p-4 bg-[#232326] hover:bg-[#2a2a2e] rounded-lg transition">
                      <div className="font-medium text-white text-sm sm:text-base">Change Password</div>
                      <div className="text-xs sm:text-sm text-gray-400">Update your account password</div>
                    </button>
                    <button className="w-full text-left p-3 sm:p-4 bg-[#232326] hover:bg-[#2a2a2e] rounded-lg transition">
                      <div className="font-medium text-white text-sm sm:text-base">Download Account Data</div>
                      <div className="text-xs sm:text-sm text-gray-400">Get a copy of your account information</div>
                    </button>
                    <button className="w-full text-left p-3 sm:p-4 bg-red-600/10 border border-red-600/20 hover:bg-red-600/20 rounded-lg transition">
                      <div className="font-medium text-red-400 text-sm sm:text-base">Delete Account</div>
                      <div className="text-xs sm:text-sm text-red-300">Permanently delete your account and all data</div>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-center sm:justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-3 rounded-lg font-semibold transition text-sm sm:text-base"
          >
            {isSaving ? 'Saving Settings...' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}
