'use client';

import { useEffect, useState } from 'react';
import DashboardTemplate from '@/components/templates/DashboardTemplate';
import auth from '@/utils/firebase-client';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

type CurrentUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  organization?: { name: string };
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'funds' | 'account'>('account');
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '' });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout', {});
    } catch {}
    await signOut(auth);
    router.push('/auth/login');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) { setUser(null); return; }
        const token = await firebaseUser.getIdToken();
        const res = await fetch(`${apiBase}/auth/login`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) { console.error('Failed to fetch user in settings', res.status); return; }
        const data = await res.json();
        setUser(data.user);
        setFormData({ firstName: data.user.firstName ?? '', lastName: data.user.lastName ?? '', email: data.user.email ?? '', phoneNumber: '' });
      } catch (err) {
        console.error('Error loading user in settings', err);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSaveError(null);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);
    try {
      const res = await api.patch(`/users/${user.id}`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });
      setUser({ ...user, ...res.data });
      setEditing(false);
      setSaveSuccess(true);
    } catch (err: any) {
      setSaveError(err?.response?.data?.error ?? 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) setFormData({ firstName: user.firstName, lastName: user.lastName, email: user.email, phoneNumber: '' });
    setSaveError(null);
    setSaveSuccess(false);
    setEditing(false);
  };

  return (
    <DashboardTemplate>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* Tabs */}
        <div className="flex space-x-8 border-b">
          <button
            onClick={() => setActiveTab('funds')}
            className={`pb-2 ${activeTab === 'funds' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
          >
            Fund Settings
          </button>
          <button
            onClick={() => setActiveTab('account')}
            className={`pb-2 ${activeTab === 'account' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
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
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Your profile</h2>
                  {!editing ? (
                    <button
                      onClick={() => setEditing(true)}
                      className="text-sm border border-black rounded-full px-4 py-1 font-medium"
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="text-sm border border-gray-400 rounded-full px-4 py-1 text-gray-600"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="text-sm border border-black rounded-full px-4 py-1 font-medium disabled:opacity-50"
                      >
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>

                {saveError && <p className="text-red-600 text-sm mb-3">{saveError}</p>}
                {saveSuccess && <p className="text-green-600 text-sm mb-3">Profile updated successfully.</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">First Name</label>
                    {editing ? (
                      <input name="firstName" value={formData.firstName} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 text-sm w-full" />
                    ) : (
                      <p className="text-sm font-medium">{user?.firstName ?? '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Last Name</label>
                    {editing ? (
                      <input name="lastName" value={formData.lastName} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 text-sm w-full" />
                    ) : (
                      <p className="text-sm font-medium">{user?.lastName ?? '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Your Role</label>
                    <p className="text-sm font-medium">{user?.role ?? '—'}</p>
                    <p className="text-xs text-gray-400 mt-0.5">This was assigned by your administrator</p>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Email</label>
                    {editing ? (
                      <input name="email" type="email" value={formData.email} onChange={handleChange} className="border border-gray-300 rounded px-3 py-2 text-sm w-full" />
                    ) : (
                      <p className="text-sm font-medium">{user?.email ?? '—'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Phone Number</label>
                    {editing ? (
                      <input name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} placeholder="+1 888-888-7777" className="border border-gray-300 rounded px-3 py-2 text-sm w-full" />
                    ) : (
                      <p className="text-sm font-medium">{formData.phoneNumber || '—'}</p>
                    )}
                  </div>
                </div>
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

              {/* Logout */}
              <section>
                <h2 className="text-lg font-semibold mb-2">Account</h2>
                <button onClick={handleLogout} className="border px-4 py-2 rounded">
                  Log out
                </button>
              </section>

            </div>
          )}
        </div>
      </main>
    </DashboardTemplate>
  );
}
