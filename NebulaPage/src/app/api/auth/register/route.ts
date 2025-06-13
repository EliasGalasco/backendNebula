// src/app/api/auth/register/route.ts

import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // In a real application, check if the user already exists
    // const existingUser = await prisma.user.findUnique({ where: { email } });
    // if (existingUser) {
    //   return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    // }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Prepare user data for saving
    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    // In a real application, save the user to the database
    // const newUser = await prisma.user.create({ data: userData });

    // Simulate a successful registration
    console.log('Simulating user registration:', userData);

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}