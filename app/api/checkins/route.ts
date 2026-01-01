import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import DailyCheckIn from '@/lib/models/DailyCheckIn';

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

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch all check-ins for this user, sorted by date descending
    const checkIns = await DailyCheckIn.find({ userId: user._id }).sort({
      date: -1,
    });

    // Return check-ins
    return NextResponse.json(
      {
        checkIns: checkIns.map((checkIn) => ({
          id: checkIn._id,
          date: checkIn.date,
          status: checkIn.status,
          dayNumber: checkIn.dayNumber,
          createdAt: checkIn.createdAt,
        })),
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching check-ins:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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
    const { status, date } = body;

    // Validate required fields
    if (!status || !date) {
      return NextResponse.json(
        { error: 'Status and date are required' },
        { status: 400 }
      );
    }

    // Validate status
    if (!['strong', 'struggled', 'relapsed'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // If this is the user's first ever check-in, set dateJoined
    if (!user.dateJoined) {
      user.dateJoined = new Date(date); // Use the check-in date
      await user.save();
    }

    // Calculate current day number based on days since dateJoined
    const dateJoinedTime = new Date(user.dateJoined).getTime();
    const currentDateTime = new Date(date).getTime();
    const daysSinceJoined = Math.floor(
      (currentDateTime - dateJoinedTime) / (1000 * 60 * 60 * 24)
    );
    const currentDay = Math.min(daysSinceJoined + 1, 30); // Day 1 = dateJoined, max 30

    // Upsert check-in (update if exists for this date, create if not)
    const checkIn = await DailyCheckIn.findOneAndUpdate(
      { userId: user._id, date },
      {
        status,
        dayNumber: currentDay,
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
      }
    );

    // Update user's currentDay
    user.currentDay = currentDay;
    await user.save();

    // Return check-in
    return NextResponse.json(
      {
        checkIn: {
          id: checkIn._id,
          date: checkIn.date,
          status: checkIn.status,
          dayNumber: checkIn.dayNumber,
          createdAt: checkIn.createdAt,
        },
        user: {
          currentDay: user.currentDay,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error creating/updating check-in:', error);

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
