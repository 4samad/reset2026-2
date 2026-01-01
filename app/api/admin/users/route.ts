import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth-helpers';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
  try {
    // Check admin authorization
    const adminStatus = await isAdmin();

    if (!adminStatus) {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Connect to database
    await connectDB();

    // Fetch all users, excluding email addresses for privacy
    const users = await User.find({}).sort({ createdAt: -1 });

    // Return anonymized user data (without emails)
    return NextResponse.json(
      {
        users: users.map((user) => ({
          id: user._id,
          username: user.username,
          currentDay: user.currentDay,
          whatsappOptIn: user.whatsappOptIn,
          mentorCheckInOptIn: user.mentorCheckInOptIn,
          age: user.age,
          gender: user.gender,
          goal: user.goal,
          onboardingCompleted: user.onboardingCompleted,
          createdAt: user.createdAt,
        })),
        total: users.length,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching users for admin:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
