'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FiUsers, FiCheckCircle, FiXCircle, FiAlertTriangle } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import Link from 'next/link';

interface AdminUser {
  id: string;
  username: string;
  currentDay: number;
  whatsappOptIn: boolean;
  whatsappNumber?: string;
  preferredLanguage?: 'English' | 'Malayalam';
  mentorCheckInOptIn: boolean;
  createdAt: Date;
}

export default function AdminPage() {
  const { status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function fetchAdminData() {
      if (status === 'unauthenticated') {
        router.push('/auth/signin');
        return;
      }

      if (status === 'authenticated') {
        try {
          // Fetch users from admin API
          const response = await fetch('/api/admin/users');

          if (response.status === 403) {
            // User is not an admin, redirect to dashboard
            router.push('/dashboard');
            return;
          }

          const data = await response.json();

          if (response.ok && data.users) {
            setAuthorized(true);
            setUsers(data.users);
          }
        } catch (error) {
          console.error('Error fetching admin data:', error);
          router.push('/dashboard');
        }
      }
    }

    fetchAdminData();
  }, [status, router]);

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
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <FiUsers className="w-8 h-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="opacity-70">
            All data is anonymous. No Google identity information is stored.
          </p>
        </div>

        <div className="stats stats-vertical lg:stats-horizontal shadow-lg bg-base-100 border border-base-300 mb-6 w-full animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="stat">
            <div className="stat-figure text-primary">
              <FiUsers className="w-8 h-8" />
            </div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-primary">{users.length}</div>
            <div className="stat-desc">Active participants</div>
          </div>

          <Link href="/admin/whatsapp" className="stat hover:bg-base-200 transition-colors cursor-pointer">
            <div className="stat-figure text-success">
              <FaWhatsapp className="w-8 h-8" />
            </div>
            <div className="stat-title">WhatsApp Opted In</div>
            <div className="stat-value text-success">
              {users.filter(u => u.whatsappOptIn).length}
            </div>
            <div className="stat-desc">Click to send daily messages →</div>
          </Link>

          <Link href="/admin/mentor-checkins" className="stat hover:bg-base-200 transition-colors cursor-pointer">
            <div className="stat-figure text-info">
              <FiCheckCircle className="w-8 h-8" />
            </div>
            <div className="stat-title">Mentor Check-ins</div>
            <div className="stat-value text-info">
              {users.filter(u => u.mentorCheckInOptIn).length}
            </div>
            <div className="stat-desc">Click to contact users →</div>
          </Link>
        </div>

        <div className="card bg-base-100 shadow-lg border border-base-300 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="card-body">
            <h2 className="card-title mb-4">User Details</h2>

            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Username</th>
                    <th>Progress</th>
                    <th>Language</th>
                    <th>Joined</th>
                    <th>WhatsApp Number</th>
                    <th>WhatsApp Opt-in</th>
                    <th>Mentor Check-in</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <FiUsers className="w-12 h-12 opacity-30" />
                          <p className="opacity-60">No users yet</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.username}>
                        <td className="font-semibold">{user.username}</td>
                        <td>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm">{user.currentDay}/30</span>
                            <progress
                              className="progress progress-primary w-20"
                              value={user.currentDay}
                              max="30"
                            ></progress>
                          </div>
                        </td>
                        <td>
                          {user.preferredLanguage ? (
                            <div className="badge badge-outline badge-sm">
                              {user.preferredLanguage}
                            </div>
                          ) : (
                            <span className="text-xs opacity-40">Not set</span>
                          )}
                        </td>
                        <td className="opacity-70 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td>
                          {user.whatsappNumber ? (
                            <a
                              href={`https://wa.me/${user.whatsappNumber.replace(/[^\d+]/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-mono link link-primary flex items-center gap-1 hover:underline"
                            >
                              <FaWhatsapp className="w-3 h-3" />
                              {user.whatsappNumber}
                            </a>
                          ) : (
                            <span className="text-xs opacity-40">Not provided</span>
                          )}
                        </td>
                        <td>
                          {user.whatsappOptIn ? (
                            <div className="badge badge-success badge-sm gap-1">
                              <FiCheckCircle className="w-3 h-3" />
                              Opted in
                            </div>
                          ) : (
                            <div className="badge badge-ghost badge-sm gap-1">
                              <FiXCircle className="w-3 h-3" />
                              Not opted in
                            </div>
                          )}
                        </td>
                        <td>
                          {user.mentorCheckInOptIn ? (
                            <div className="badge badge-info badge-sm gap-1">
                              <FiCheckCircle className="w-3 h-3" />
                              Enabled
                            </div>
                          ) : (
                            <div className="badge badge-ghost badge-sm gap-1">
                              <FiXCircle className="w-3 h-3" />
                              Disabled
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="alert alert-info shadow-lg mt-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <FiAlertTriangle className="w-6 h-6" />
          <div>
            <h3 className="font-bold">Privacy Notice</h3>
            <div className="text-sm">
              Email addresses are never displayed in the admin dashboard. Admin access is controlled
              via the ADMIN_EMAILS environment variable.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
