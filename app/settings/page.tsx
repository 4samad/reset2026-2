'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { User } from '@/types';
import Link from 'next/link';
import { FiArrowLeft, FiUser, FiMail, FiCalendar, FiLogOut, FiCheck } from 'react-icons/fi';
import { FaUser, FaWhatsapp } from 'react-icons/fa';
import WhatsAppOptInSection from '@/components/WhatsAppOptInSection';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [mentorCheckInOptIn, setMentorCheckInOptIn] = useState(false);
  const [preferredLanguage, setPreferredLanguage] = useState<'English' | 'Malayalam'>('English');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchUserData() {
      if (status === 'unauthenticated') {
        router.push('/auth/signin');
        return;
      }

      if (status === 'authenticated') {
        try {
          // Fetch user from API
          const response = await fetch('/api/users/me');
          const data = await response.json();

          if (data.user) {
            setUser(data.user);
            setWhatsappOptIn(data.user.whatsappOptIn);
            setWhatsappNumber(data.user.whatsappNumber || '');
            setMentorCheckInOptIn(data.user.mentorCheckInOptIn);
            setPreferredLanguage(data.user.preferredLanguage || 'English');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    }

    fetchUserData();
  }, [status, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      // Update user via API
      const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          whatsappOptIn,
          whatsappNumber: (whatsappOptIn || mentorCheckInOptIn) ? whatsappNumber : undefined,
          mentorCheckInOptIn,
          preferredLanguage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to save changes');
        return;
      }

      // Update local state with API response
      setUser(data.user);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

  if (status === 'loading' || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6 animate-fade-in">
          <Link href="/dashboard" className="btn btn-ghost btn-sm gap-2 rounded-full hover:scale-105 transition-transform">
            <FiArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 animate-slide-up mx-2">Settings</h1>

        <div className="card bg-base-100 shadow-xl border-4 border-base-300 rounded-3xl mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-body p-6">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3 bg-primary/5 p-4 rounded-2xl">
                <div className="avatar placeholder">
                  <div className="bg-primary text-primary-content rounded-full w-14 ring-4 ring-primary ring-offset-2 ring-offset-base-100 flex">
                    <FaUser className="w-7 h-7 m-auto" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold opacity-70">Username</p>
                  <p className="font-bold text-lg">{user.username}</p>
                </div>
              </div>

              <div className="divider"></div>

              <div className="flex items-start gap-3 bg-info/5 p-4 rounded-2xl">
                <FiMail className="w-5 h-5 mt-1 text-info" />
                <div>
                  <p className="text-xs font-semibold opacity-70">Email</p>
                  <p className="font-semibold">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-success/5 p-4 rounded-2xl">
                <FiCalendar className="w-5 h-5 mt-1 text-success" />
                <div className="flex-1">
                  <p className="text-xs font-semibold opacity-70">Progress</p>
                  <p className="font-bold text-lg mb-2">Day {user.currentDay} of 30 🔥</p>
                  <progress
                    className="progress progress-primary w-full h-3"
                    value={user.currentDay}
                    max="30"
                  ></progress>
                </div>
              </div>

              {(user.age || user.gender || user.goal) && (
                <>
                  <div className="divider"></div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {user.age && (
                      <div className="bg-base-200 p-3 rounded-2xl">
                        <p className="text-xs font-semibold opacity-70">Age</p>
                        <p className="font-semibold">{user.age}</p>
                      </div>
                    )}

                    {user.gender && (
                      <div className="bg-base-200 p-3 rounded-2xl">
                        <p className="text-xs font-semibold opacity-70">Gender</p>
                        <p className="font-semibold">{user.gender}</p>
                      </div>
                    )}
                  </div>

                  {user.goal && (
                    <div className="bg-base-200 p-4 rounded-2xl">
                      <p className="text-xs font-semibold opacity-70 mb-1">Main Goal</p>
                      <p className="font-semibold">{user.goal}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="card bg-base-100 shadow-xl border-4 border-base-300 rounded-3xl mb-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="card-body p-6">
              <h2 className="text-2xl font-bold mb-4 gap-2 flex items-center">
                Support Preferences
              </h2>

              <WhatsAppOptInSection
                whatsappOptIn={whatsappOptIn}
                onWhatsappOptInChange={setWhatsappOptIn}
                mentorCheckInOptIn={mentorCheckInOptIn}
                onMentorCheckInOptInChange={setMentorCheckInOptIn}
                whatsappNumber={whatsappNumber}
                onWhatsappNumberChange={setWhatsappNumber}
              />

              <div className="divider my-6"></div>

              <h3 className="font-bold text-lg sm:text-xl mb-4">Language Preference 🌐</h3>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">Daily Message Language</span>
                </label>
                <div className="flex gap-3">
                  {(['English', 'Malayalam'] as const).map((lang) => (
                    <label
                      key={lang}
                      className={`btn flex-1 rounded-2xl font-bold transition-all ${
                        preferredLanguage === lang ? 'btn-primary' : 'btn-outline'
                      }`}
                    >
                      <input
                        type="radio"
                        name="language"
                        value={lang}
                        checked={preferredLanguage === lang}
                        onChange={(e) => setPreferredLanguage(e.target.value as 'English' | 'Malayalam')}
                        className="hidden"
                      />
                      {lang}
                    </label>
                  ))}
                </div>
              </div>

              <div className="card-actions mt-6">
                <button type="submit" className="btn btn-primary w-full gap-2 rounded-2xl font-bold text-base shadow-xl hover:scale-105 transition-transform">
                  {saved ? (
                    <>
                      <FiCheck className="w-5 h-5" />
                      Saved! ✓
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>

        <div className="card bg-base-100 shadow-xl border-4 border-error/30 rounded-3xl animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <div className="card-body p-6">
            <h2 className="text-2xl font-bold mb-4">Account</h2>
            <button
              onClick={handleSignOut}
              className="btn btn-outline btn-error w-full gap-2 rounded-2xl font-bold border-2 hover:scale-105 transition-transform"
            >
              <FiLogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
