import { auth } from '@/auth';

/**
 * Check if the current authenticated user is an admin
 * Admin status is determined by checking if the user's email
 * is in the ADMIN_EMAILS environment variable (comma-separated list)
 */
export async function isAdmin(): Promise<boolean> {
  const session = await auth();

  if (!session || !session.user?.email) {
    return false;
  }

  const adminEmails = process.env.ADMIN_EMAILS?.split(',').map((email) =>
    email.trim().toLowerCase()
  ) || [];

  return adminEmails.includes(session.user.email.toLowerCase());
}

/**
 * Get the current session or throw an error if not authenticated
 */
export async function requireAuth() {
  const session = await auth();

  if (!session || !session.user?.email) {
    throw new Error('Unauthorized - Please sign in');
  }

  return session;
}

/**
 * Require admin access or throw an error
 */
export async function requireAdmin() {
  const session = await requireAuth();
  const adminStatus = await isAdmin();

  if (!adminStatus) {
    throw new Error('Forbidden - Admin access required');
  }

  return session;
}
