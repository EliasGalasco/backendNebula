// NebulaPage/src/app/api/auth/login/route.ts

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    // Simulate fetching a user from the database
    // In a real application, replace this with database interaction
    const fakeUser = {
      id: 'fake-user-id',
      email: 'test@example.com', // Use a fixed email for simulation
      hashedPassword: await bcrypt.hash('password123', 10), // Hash a fake password for comparison
      name: 'Fake User',
    };

    // In a real application:
    // Replace fakeUser with actual user fetched from database
    const user = fakeUser; // For simulation

    if (email !== user.email) { // Simple email check for simulation
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // 2. Compare the provided password with the hashed password from the database.
    const isPasswordValid = await bcrypt.compare(password, user.hashedPassword);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    // 3. Generate a session token (e.g., JWT).
    // In a real app, use a strong secret key from environment variables
    const secret = 'your-secret-key'; // Replace with process.env.JWT_SECRET
    const token = jwt.sign({ userId: user.id, email: user.email }, secret, { expiresIn: '1h' });

    return NextResponse.json({ message: 'Login successful', token, user });

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
  }
}

// Note: Other HTTP methods (GET, PUT, DELETE) are not typically used for login.