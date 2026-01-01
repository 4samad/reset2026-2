import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function GET() {
  try {
    // Validate session
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Find user by email from session
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Return user data (excluding sensitive fields)
    return NextResponse.json(
      {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          currentDay: user.currentDay,
          whatsappOptIn: user.whatsappOptIn,
          whatsappNumber: user.whatsappNumber,
          mentorCheckInOptIn: user.mentorCheckInOptIn,
          age: user.age,
          gender: user.gender,
          goal: user.goal,
          preferredLanguage: user.preferredLanguage,
          onboardingCompleted: user.onboardingCompleted,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Validate session
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Parse request body
    const body = await request.json();
    const {
      username,
      age,
      gender,
      goal,
      whatsappOptIn,
      whatsappNumber,
      mentorCheckInOptIn,
      preferredLanguage,
    } = body;

    // Find user
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If username is being updated, check if it's already taken
    if (username && username !== user.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return NextResponse.json(
          { error: 'Username is already taken' },
          { status: 409 }
        );
      }
      user.username = username;
    }

    // Update fields
    if (age !== undefined) user.age = age;
    if (gender !== undefined) user.gender = gender;
    if (goal !== undefined) user.goal = goal;
    if (whatsappOptIn !== undefined) user.whatsappOptIn = whatsappOptIn;
    if (whatsappNumber !== undefined) user.whatsappNumber = whatsappNumber;
    if (mentorCheckInOptIn !== undefined)
      user.mentorCheckInOptIn = mentorCheckInOptIn;
    if (preferredLanguage !== undefined) user.preferredLanguage = preferredLanguage;

    // Save updated user
    await user.save();

    // Return updated user data
    return NextResponse.json(
      {
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          currentDay: user.currentDay,
          whatsappOptIn: user.whatsappOptIn,
          whatsappNumber: user.whatsappNumber,
          mentorCheckInOptIn: user.mentorCheckInOptIn,
          age: user.age,
          gender: user.gender,
          goal: user.goal,
          preferredLanguage: user.preferredLanguage,
          onboardingCompleted: user.onboardingCompleted,
          createdAt: user.createdAt,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating user:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
