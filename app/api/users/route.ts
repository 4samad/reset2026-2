import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request: NextRequest) {
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
    const { username, age, gender, goal, whatsappOptIn, whatsappNumber, mentorCheckInOptIn } = body;

    // Validate required fields
    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const existingUserByEmail = await User.findOne({ email: session.user.email });
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Check if username is already taken
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return NextResponse.json(
        { error: 'Username is already taken' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = await User.create({
      email: session.user.email,
      username,
      age: age || undefined,
      gender: gender || undefined,
      goal: goal || undefined,
      whatsappOptIn: whatsappOptIn || false,
      whatsappNumber: whatsappNumber || undefined,
      mentorCheckInOptIn: mentorCheckInOptIn || false,
      currentDay: 1,
      onboardingCompleted: true,
    });

    // Return user data (excluding sensitive fields)
    return NextResponse.json(
      {
        id: newUser._id,
        email: newUser.email,
        username: newUser.username,
        currentDay: newUser.currentDay,
        whatsappOptIn: newUser.whatsappOptIn,
        whatsappNumber: newUser.whatsappNumber,
        mentorCheckInOptIn: newUser.mentorCheckInOptIn,
        age: newUser.age,
        gender: newUser.gender,
        goal: newUser.goal,
        onboardingCompleted: newUser.onboardingCompleted,
        createdAt: newUser.createdAt,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating user:', error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
