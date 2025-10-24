'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { Settings, Bell, Globe, User, Lock } from 'lucide-react';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    breaking: true,
    daily: true,
    weekly: false,
  });

  const [selectedSources, setSelectedSources] = useState([
    'CNN',
    'TechCrunch',
    'Reuters',
  ]);

  const [selectedTopics, setSelectedTopics] = useState([
    'Technology',
    'Politics',
    'Science',
  ]);

  const allSources = ['CNN', 'TechCrunch', 'Reuters', 'The Guardian', 'BBC', 'Bloomberg', 'NYTimes'];
  const allTopics = ['Technology', 'Politics', 'Sports', 'Business', 'Entertainment', 'Science', 'Health', 'World News', 'Culture'];

  const toggleSource = (source: string) => {
    setSelectedSources((prev) =>
      prev.includes(source)
        ? prev.filter((s) => s !== source)
        : [...prev, source]
    );
  };

  const toggleTopic = (topic: string) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      <Header />

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings & Preferences</h1>
          <p className="text-[hsl(var(--text-secondary))]">
            Customize your news experience and manage your account
          </p>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* News Sources */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Globe className="text-[hsl(var(--primary-blue))]" size={24} />
              <h2 className="text-xl font-semibold">News Sources</h2>
            </div>
            <p className="text-sm text-[hsl(var(--text-secondary))] mb-4">
              Select the news platforms you want to follow
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {allSources.map((source) => (
                <label
                  key={source}
                  className="flex items-center gap-3 p-3 border border-[hsl(var(--border))] rounded-lg cursor-pointer hover:bg-[hsl(var(--light-bg))] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedSources.includes(source)}
                    onChange={() => toggleSource(source)}
                    className="w-4 h-4 rounded border-gray-300 text-[hsl(var(--primary-blue))] focus:ring-[hsl(var(--primary-blue))]"
                  />
                  <span className="text-sm font-medium">{source}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Topic Interests */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="text-[hsl(var(--primary-blue))]" size={24} />
              <h2 className="text-xl font-semibold">Topic Interests</h2>
            </div>
            <p className="text-sm text-[hsl(var(--text-secondary))] mb-4">
              Choose topics you want to see in your feed
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {allTopics.map((topic) => (
                <label
                  key={topic}
                  className="flex items-center gap-3 p-3 border border-[hsl(var(--border))] rounded-lg cursor-pointer hover:bg-[hsl(var(--light-bg))] transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedTopics.includes(topic)}
                    onChange={() => toggleTopic(topic)}
                    className="w-4 h-4 rounded border-gray-300 text-[hsl(var(--primary-blue))] focus:ring-[hsl(var(--primary-blue))]"
                  />
                  <span className="text-sm font-medium">{topic}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="text-[hsl(var(--primary-blue))]" size={24} />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            <p className="text-sm text-[hsl(var(--text-secondary))] mb-4">
              Manage how you receive news updates
            </p>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 border border-[hsl(var(--border))] rounded-lg cursor-pointer hover:bg-[hsl(var(--light-bg))] transition-colors">
                <div>
                  <div className="font-medium">Breaking News Alerts</div>
                  <div className="text-sm text-[hsl(var(--text-secondary))]">
                    Get notified about breaking news immediately
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.breaking}
                  onChange={(e) =>
                    setNotifications({ ...notifications, breaking: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-gray-300 text-[hsl(var(--primary-blue))] focus:ring-[hsl(var(--primary-blue))]"
                />
              </label>

              <label className="flex items-center justify-between p-4 border border-[hsl(var(--border))] rounded-lg cursor-pointer hover:bg-[hsl(var(--light-bg))] transition-colors">
                <div>
                  <div className="font-medium">Daily Digest</div>
                  <div className="text-sm text-[hsl(var(--text-secondary))]">
                    Receive a daily summary of top stories
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.daily}
                  onChange={(e) =>
                    setNotifications({ ...notifications, daily: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-gray-300 text-[hsl(var(--primary-blue))] focus:ring-[hsl(var(--primary-blue))]"
                />
              </label>

              <label className="flex items-center justify-between p-4 border border-[hsl(var(--border))] rounded-lg cursor-pointer hover:bg-[hsl(var(--light-bg))] transition-colors">
                <div>
                  <div className="font-medium">Weekly Roundup</div>
                  <div className="text-sm text-[hsl(var(--text-secondary))]">
                    Get a weekly summary of the most important news
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={notifications.weekly}
                  onChange={(e) =>
                    setNotifications({ ...notifications, weekly: e.target.checked })
                  }
                  className="w-5 h-5 rounded border-gray-300 text-[hsl(var(--primary-blue))] focus:ring-[hsl(var(--primary-blue))]"
                />
              </label>
            </div>
          </div>

          {/* Account Settings */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <User className="text-[hsl(var(--primary-blue))]" size={24} />
              <h2 className="text-xl font-semibold">Account Settings</h2>
            </div>
            <div className="space-y-3">
              <button className="w-full text-left p-4 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--light-bg))] transition-colors">
                <div className="font-medium">Edit Profile</div>
                <div className="text-sm text-[hsl(var(--text-secondary))]">
                  Update your name, email, and photo
                </div>
              </button>
              <button className="w-full text-left p-4 border border-[hsl(var(--border))] rounded-lg hover:bg-[hsl(var(--light-bg))] transition-colors">
                <div className="flex items-center gap-2">
                  <Lock size={16} />
                  <span className="font-medium">Privacy & Security</span>
                </div>
                <div className="text-sm text-[hsl(var(--text-secondary))]">
                  Manage your privacy settings and password
                </div>
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end gap-3">
            <button className="px-6 py-3 border border-[hsl(var(--border))] rounded-lg text-sm font-medium hover:bg-[hsl(var(--light-bg))] transition-colors">
              Cancel
            </button>
            <button className="px-6 py-3 bg-[hsl(var(--primary-blue))] text-white rounded-lg text-sm font-medium hover:bg-[hsl(207,77%,50%)] transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
