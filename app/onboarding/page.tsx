'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { generateUsernameSuggestions } from '@/lib/utils';
import { FiRefreshCw, FiArrowRight, FiArrowLeft } from 'react-icons/fi';
import Logo from '@/components/Logo';
import WhatsAppOptInSection from '@/components/WhatsAppOptInSection';

type OnboardingStep = 'username' | 'details';

export default function OnboardingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState<OnboardingStep>('username');
  const [username, setUsername] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // All details in one step
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [mentorCheckInOptIn, setMentorCheckInOptIn] = useState(false);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [goal, setGoal] = useState('');

  useEffect(() => {
    async function checkExistingUser() {
      if (status === 'unauthenticated') {
        router.push('/auth/signin');
        return;
      }

      if (status === 'authenticated') {
        // Check if user already exists and has completed onboarding
        try {
          const response = await fetch('/api/users/me');
          const data = await response.json();

          if (data.user && data.user.onboardingCompleted) {
            // User already exists and completed onboarding, redirect to dashboard
            router.push('/dashboard');
            return;
          }
        } catch (error) {
          console.error('Error checking existing user:', error);
        }
      }

      if (step === 'username') {
        setSuggestions(generateUsernameSuggestions(4));
      }
    }

    checkExistingUser();
  }, [status, router, step]);

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setStep('details');
    }
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) return;

    try {
      // Create user via API
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          whatsappOptIn,
          whatsappNumber: (whatsappOptIn || mentorCheckInOptIn) ? whatsappNumber : undefined,
          mentorCheckInOptIn,
          age: age ? parseInt(age) : undefined,
          gender: gender || undefined,
          goal: goal || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error (e.g., username already taken)
        alert(data.error || 'Failed to create user');
        return;
      }

      // Successfully created user, redirect to dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating user:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const refreshSuggestions = () => {
    setSuggestions(generateUsernameSuggestions(4));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex justify-center mb-4">
            <Logo size="xl" />
          </div>
        </div>

        {step === 'username' && (
          <div className="card bg-base-100 shadow-2xl border-4 border-base-300 rounded-3xl animate-slide-up">
            <div className="card-body p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
                Choose an anonymous username 🎭
              </h2>
              <p className="text-base-content/70 mb-6 font-medium">
                No real names. This keeps your privacy.
              </p>

              <form onSubmit={handleUsernameSubmit} className="space-y-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-bold">Username</span>
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="input input-bordered input-primary w-full rounded-2xl border-2 focus:border-primary focus:ring-4 focus:ring-primary/20 font-semibold"
                    placeholder="your-anonymous-name"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="label-text font-bold">Suggestions:</span>
                    <button
                      type="button"
                      onClick={refreshSuggestions}
                      className="btn btn-ghost btn-sm gap-2 rounded-full hover:scale-105 transition-transform"
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      Refresh
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => setUsername(suggestion)}
                        className="btn btn-outline border-2 btn-sm justify-start rounded-2xl font-bold hover:btn-primary hover:scale-105 transition-all"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    type="submit"
                    className="btn btn-primary w-full gap-2 rounded-2xl font-bold text-base shadow-xl hover:scale-105 transition-transform"
                  >
                    Continue
                    <FiArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {step === 'details' && (
          <div className="card bg-base-100 shadow-2xl border-4 border-base-300 rounded-3xl animate-slide-up">
            <div className="card-body p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">
                Complete your profile
              </h2>
              <p className="text-base-content/70 mb-6 font-medium">
                All fields are optional. Share what you're comfortable with.
              </p>

              <form onSubmit={handleDetailsSubmit} className="space-y-6">
                {/* Profile Information */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg sm:text-xl">About You 👤</h3>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold">Age</span>
                    </label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="input input-bordered w-full rounded-2xl border-2 focus:border-primary focus:ring-4 focus:ring-primary/20 font-semibold"
                      placeholder="Your age"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold">Gender</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {['Male', 'Female', 'Prefer not to say'].map((option) => (
                        <label
                          key={option}
                          className={`btn flex-1 min-w-30 rounded-2xl font-bold transition-all ${
                            gender === option ? 'btn-primary' : 'btn-outline'
                          }`}
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={option}
                            checked={gender === option}
                            onChange={(e) => setGender(e.target.value)}
                            className="hidden"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-bold">Main Goal</span>
                    </label>
                    <div className="space-y-2">
                      {[
                        'Break addiction to pornography',
                        'Reduce screen time',
                        'Improve focus and productivity',
                        'Build healthier habits'
                      ].map((option) => (
                        <label
                          key={option}
                          className={`btn w-full justify-start text-left h-auto py-3 rounded-2xl font-bold transition-all ${
                            goal === option ? 'btn-primary' : 'btn-outline'
                          }`}
                        >
                          <input
                            type="radio"
                            name="goal"
                            value={option}
                            checked={goal === option}
                            onChange={(e) => setGoal(e.target.value)}
                            className="hidden"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="divider"></div>

                {/* Support Options */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg sm:text-xl">Support Options 💬</h3>

                  <WhatsAppOptInSection
                    whatsappOptIn={whatsappOptIn}
                    onWhatsappOptInChange={setWhatsappOptIn}
                    mentorCheckInOptIn={mentorCheckInOptIn}
                    onMentorCheckInOptInChange={setMentorCheckInOptIn}
                    whatsappNumber={whatsappNumber}
                    onWhatsappNumberChange={setWhatsappNumber}
                  />
                </div>

                <div className="card-actions flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep('username')}
                    className="btn btn-outline border-2 flex-1 gap-2 rounded-2xl font-bold hover:scale-105 transition-transform"
                  >
                    <FiArrowLeft className="w-5 h-5" />
                    Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1 gap-2 rounded-2xl font-bold text-base shadow-xl hover:scale-105 transition-transform"
                  >
                    Start
                    <FiArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
