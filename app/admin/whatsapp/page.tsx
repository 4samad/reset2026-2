'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { dailyFocuses } from '@/data/content';
import Link from 'next/link';

interface WhatsAppUser {
  id: string;
  username: string;
  currentDay: number;
  whatsappNumber: string;
  preferredLanguage?: 'English' | 'Malayalam';
  createdAt: Date;
}

export default function WhatsAppMessagesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<WhatsAppUser[]>([]);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function fetchAdminData() {
      if (status === 'unauthenticated') {
        router.push('/auth/signin');
        return;
      }

      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/admin/users');

          if (response.status === 403) {
            router.push('/dashboard');
            return;
          }

          const data = await response.json();

          if (response.ok && data.users) {
            setAuthorized(true);
            // Filter only users who opted in for WhatsApp
            const whatsappUsers = data.users.filter(
              (u: any) => u.whatsappOptIn && u.whatsappNumber
            );
            setUsers(whatsappUsers);
          }
        } catch (error) {
          console.error('Error fetching admin data:', error);
          router.push('/dashboard');
        }
      }
    }

    fetchAdminData();
  }, [status, router]);

  const getWhatsAppMessageLink = (user: WhatsAppUser): string => {
    const currentDay = user.currentDay;
    const language = user.preferredLanguage || 'English';

    const dailyFocus = dailyFocuses.find(df => df.day === currentDay);

    if (!dailyFocus) {
      return '';
    }

    let message = dailyFocus.text[language as 'English' | 'Malayalam'];

    if (dailyFocus.task) {
      message += '\n\n' + dailyFocus.task[language as 'English' | 'Malayalam'];
    }

    message += '\n\nVisit app: https://reset.detoxmind.org';

    const phoneNumber = user.whatsappNumber.replace(/[^\d+]/g, '');
    const encodedMessage = encodeURIComponent(message);

    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  };

  if (status === 'loading' || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 animate-slide-up">
          <Link href="/admin" className="btn btn-ghost btn-sm gap-2 mb-4">
            <FiArrowLeft className="w-4 h-4" />
            Back to Admin Dashboard
          </Link>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <FaWhatsapp className="w-8 h-8 text-success" />
            WhatsApp Daily Messages
          </h1>
          <p className="opacity-70">
            Send daily messages to users who opted in for WhatsApp notifications
          </p>
        </div>

        <div className="card bg-base-100 shadow-lg border border-base-300 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="card-body">
            <h2 className="card-title mb-4">
              Users Opted In ({users.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Progress</th>
                    <th>WhatsApp Number</th>
                    <th>Language</th>
                    <th>Joined</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <FaWhatsapp className="w-12 h-12 opacity-30" />
                          <p className="opacity-60">No users opted in for WhatsApp messages</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td className="font-semibold">{user.username}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">Day {user.currentDay}/30</span>
                            <progress
                              className="progress progress-primary w-20"
                              value={user.currentDay}
                              max="30"
                            ></progress>
                          </div>
                        </td>
                        <td>
                          <a
                            href={`https://wa.me/${user.whatsappNumber.replace(/[^\d+]/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-mono link link-primary flex items-center gap-1 hover:underline"
                          >
                            <FaWhatsapp className="w-3 h-3" />
                            {user.whatsappNumber}
                          </a>
                        </td>
                        <td>
                          <div className="badge badge-outline">
                            {user.preferredLanguage || 'English'}
                          </div>
                        </td>
                        <td className="opacity-70 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          <a
                            href={getWhatsAppMessageLink(user)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm h-fit btn-primary gap-2 text-white"
                          >
                            <FiSend className="w-4 h-4 text-white" />
                            <span className='text-white'>
                              Send Message
                            </span>
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
