import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use environment variable in real app

export async function GET(request: Request) {
  try {
    // Apply authentication and administrator guards
    const authResult = await authGuard(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Not authenticated
    }

    const adminResult = await adminGuard(authResult.user); // Assuming authResult.user contains user info
    if (adminResult instanceof NextResponse) {
      return adminResult; // Not an administrator
    }

    // Simulate fetching all users from the database
    const users = await getAllUsersFromDatabase();

    // Filter out sensitive information like hashed passwords
    const usersWithoutPasswords = users.map(user => {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return NextResponse.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// Simulated database interaction function
async function getAllUsersFromDatabase() {
  // Replace with your actual database query
  console.log('Fetching all users from the database...');

  // Simulate a placeholder user with hashed password for 'persyxd@gmail.com'
  const hashedPasswordForPersyxd = await bcrypt.hash('nebula07', 10); // Hash the password

  return [
    { id: 'user1', name: 'Alice', email: 'alice@example.com', password: await bcrypt.hash('password123', 10), role: 'user' },
    { id: 'user2', name: 'Bob', email: 'bob@example.com', password: await bcrypt.hash('adminpass', 10), role: 'admin' },
    { id: 'user3', name: 'Persy XD', email: 'persyxd@gmail.com', password: hashedPasswordForPersyxd, role: 'admin' }, // Added the requested user
  ];
}

// Simulated authentication and authorization checks (replace with your actual implementations)
async function authGuard(request: Request) {
  // Example: Check for a valid token in headers or cookies
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    // In a real app, you would likely fetch full user details from the DB here
    return { user: { id: decoded.userId, email: decoded.email, role: decoded.role } }; // Assuming token contains userId, email, and role
  } catch (error) {
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 });
  }
}

async function adminGuard(user: any) {
  // Example: Check if the user object (from authGuard) indicates admin role
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
  }
  return null; // User is an administrator
}