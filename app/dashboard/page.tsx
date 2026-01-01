'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import ProgressTracker from '@/components/ProgressTracker';
import ReadingResourcesSection from '@/components/ReadingResourcesSection';
import YouTubeVideoSection from '@/components/YouTubeVideoSection';
import PsychologistCTA from '@/components/PsychologistCTA';
import ImageSection from '@/components/ImageSection';
import Footer from '@/components/Footer';
import { User, DailyCheckIn, CheckInStatus } from '@/types';
import { dailyFocuses } from '@/data/content';
import { formatDate, getSupportiveMessage } from '@/lib/utils';
import { CHECK_IN_OPTIONS } from '@/lib/constants';
import { FaFire } from 'react-icons/fa';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [todayCheckIn, setTodayCheckIn] = useState<CheckInStatus | undefined>();

  useEffect(() => {
    async function fetchUserData() {
      if (status === 'unauthenticated') {
        router.push('/auth/signin');
        return;
      }

      if (status === 'authenticated' && session?.user) {
        try {
          // Fetch user from API
          const userResponse = await fetch('/api/users/me');
          const userData = await userResponse.json();

          if (!userData.user || !userData.user.onboardingCompleted) {
            router.push('/onboarding');
            return;
          }

          setUser(userData.user);

          // Fetch check-ins from API
          const checkInsResponse = await fetch('/api/checkins');
          const checkInsData = await checkInsResponse.json();

          if (checkInsData.checkIns) {
            setCheckIns(checkInsData.checkIns);

            const today = formatDate(new Date());
            const todayCheckInData = checkInsData.checkIns.find((c: DailyCheckIn) => c.date === today);
            if (todayCheckInData) {
              setTodayCheckIn(todayCheckInData.status);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    }

    fetchUserData();
  }, [status, session, router]);

  const handleCheckIn = async (status: CheckInStatus) => {
    if (!user) return;

    const today = formatDate(new Date());

    try {
      // Create/update check-in via API
      const response = await fetch('/api/checkins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status,
          date: today,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Error creating check-in:', data.error);
        alert('Failed to save check-in. Please try again.');
        return;
      }

      // Update local state with new check-in
      const existingIndex = checkIns.findIndex(c => c.date === today);
      let updatedCheckIns;
      if (existingIndex >= 0) {
        updatedCheckIns = [...checkIns];
        updatedCheckIns[existingIndex] = data.checkIn;
      } else {
        updatedCheckIns = [data.checkIn, ...checkIns];
      }

      setCheckIns(updatedCheckIns);
      setTodayCheckIn(status);

      // Update user's current day from API response
      if (data.user) {
        setUser({ ...user, currentDay: data.user.currentDay });
      }
    } catch (error) {
      console.error('Error creating check-in:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (status === 'loading' || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const userLanguage = user.preferredLanguage || 'English';
  const dailyFocus = dailyFocuses.find(f => f.day === user.currentDay);
  const currentFocus = dailyFocus?.text[userLanguage] || dailyFocus?.text.English || 'Keep going. One day at a time.';
  const currentTask = dailyFocus?.task?.[userLanguage] || dailyFocus?.task?.English;

  return (
    <div className="min-h-screen bg-base-200">
      <Header />

      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="mb-8 animate-fade-in">
          <div className="badge badge-warning badge-lg gap-2 py-4 px-4">
            <FaFire className="w-4 h-4" />
            <span className="font-bold">{user.currentDay} Day Streak!</span>
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-12 animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-2 text-neutral text-center">
            Hi, {user.username}! 👋
          </h1>
        </div>

        {/* How are you feeling today? - Daily Check-in */}
        <div className="card bg-base-100 shadow-xl border-4 border-base-300 rounded-3xl mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-body p-8 sm:p-10">
            <h2 className="card-title text-xl sm:text-2xl mb-8">How are you feeling today?</h2>

            <div className="grid grid-cols-3 gap-4 sm:gap-6">
              {CHECK_IN_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = todayCheckIn === option.status;
                const isOtherSelected = todayCheckIn && !isSelected;
                return (
                  <button
                    key={option.status}
                    onClick={() => handleCheckIn(option.status)}
                    className={`btn aspect-square w-full h-auto p-0 flex-col gap-2 sm:gap-3 rounded-full border-0 transition-all transform hover:scale-105 ${
                      isSelected
                        ? option.selectedBg + ' text-white shadow-xl scale-105'
                        : option.bgColor + ' hover:scale-105' + (isOtherSelected ? ' opacity-40' : '')
                    }`}
                  >
                    <Icon className="w-8 h-8 sm:w-12 sm:h-12" />
                    <span className="font-bold text-xs sm:text-sm">{option.label}</span>
                  </button>
                );
              })}
            </div>

            {todayCheckIn && (
              <div className="chat chat-start mt-8 animate-bounce-in">
                <div className={`chat-bubble text-sm sm:text-base font-semibold ${
                  todayCheckIn === 'strong' ? 'chat-bubble-success text-white' :
                  todayCheckIn === 'struggled' ? 'chat-bubble-warning' :
                  'chat-bubble-error text-white'
                }`}>
                  {getSupportiveMessage(todayCheckIn)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Calendar (Progress Tracker) */}
        <div className="animate-slide-up mb-10" style={{ animationDelay: '0.15s' }}>
          <ProgressTracker
            checkIns={checkIns}
            currentDay={user.currentDay}
          />
        </div>

        {/* Daily Message */}
        <div className="card bg-neutral text-neutral-content shadow-xl rounded-3xl mb-10 animate-slide-up border-4 border-neutral-focus" style={{ animationDelay: '0.2s' }}>
          <div className="card-body p-8 sm:p-10">
            <h2 className="card-title text-base sm:text-lg mb-2">
              Today's Message
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold mb-6">
              Day {user.currentDay}
            </h3>
            <p className="text-lg sm:text-xl leading-relaxed whitespace-pre-line">{currentFocus}</p>

            {currentTask && (
              <div className="mt-6 p-4 bg-neutral-focus/30 rounded-2xl border-2 border-neutral-content/20">
                <p className="text-sm sm:text-base font-bold mb-2 opacity-80">
                  {userLanguage === 'Malayalam' ? 'ഇന്നത്തെ ടാസ്ക്:' : 'Today\'s Task:'}
                </p>
                <p className="text-base sm:text-lg leading-relaxed whitespace-pre-line">{currentTask}</p>
              </div>
            )}

            {/* Mobile Share Button */}
            <button
              onClick={async () => {
                const shareData = {
                  title: 'Reset 2026 - Today\'s Message',
                  text: currentFocus,
                  url: window.location.href,
                };

                if (navigator.share) {
                  try {
                    await navigator.share(shareData);
                  } catch (error: any) {
                    if (error.name !== 'AbortError') {
                      console.error('Error sharing:', error);
                      alert('Could not share. Please try again.');
                    }
                  }
                } else {
                  // Fallback: Copy to clipboard
                  const textToShare = `${shareData.text}\n\n${shareData.url}`;
                  try {
                    await navigator.clipboard.writeText(textToShare);
                    alert('Message copied to clipboard!');
                  } catch (error) {
                    console.error('Could not copy:', error);
                    alert('Sharing is not supported on this device.');
                  }
                }
              }}
              className="btn btn-sm mt-6 md:hidden w-fit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              SHARE
            </button>
          </div>
        </div>

        {/* Psychologist Support CTA */}
        <div className="animate-slide-up mb-10" style={{ animationDelay: '0.225s' }}>
          <PsychologistCTA />
        </div>

        {/* Resources */}
        <div className="animate-slide-up mb-10" style={{ animationDelay: '0.24s' }}>
          <ReadingResourcesSection />
        </div>

        {/* YouTube Video */}
        <div className="animate-slide-up mb-10" style={{ animationDelay: '0.25s' }}>
          <YouTubeVideoSection />
        </div>

        {/* Full Width Image */}
        <div className="animate-slide-up mb-10" style={{ animationDelay: '0.3s' }}>
          <ImageSection />
        </div>
      </div>

      <Footer />
    </div>
  );
}
