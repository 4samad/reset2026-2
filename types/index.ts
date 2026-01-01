export type CheckInStatus = 'relapsed' | 'struggled' | 'strong';

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  currentDay: number;
  whatsappOptIn: boolean;
  whatsappNumber?: string;
  mentorCheckInOptIn: boolean;
  age?: number;
  gender?: string;
  goal?: string;
  preferredLanguage?: 'English' | 'Malayalam';
  onboardingCompleted: boolean;
}

export interface DailyCheckIn {
  id: string;
  userId: string;
  date: string;
  status: CheckInStatus;
  dayNumber: number;
}

export interface ReadingResource {
  id: string;
  title: string;
  url: string;
  image: string;
}

export interface Testimonial {
  id: string;
  text: string;
  username: string;
  day: number;
}

export interface DailyFocus {
  day: number;
  text: {
    English: string;
    Malayalam: string;
  };
  task?: {
    English: string;
    Malayalam: string;
  };
}
