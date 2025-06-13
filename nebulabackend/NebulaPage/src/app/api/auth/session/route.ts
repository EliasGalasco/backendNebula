import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    // In a real application, you would extract the token
    // from headers (e.g., Authorization: Bearer <token>) or cookies.
    const token = request.headers.get('Authorization')?.split(' ')[1]; // Example from header

    if (!token) {
      return NextResponse.json({ message: 'No token provided' }, { status: 401 });
    }

    const jwtSecret = 'your_jwt_secret'; // Use the same secret as for signing tokens

    try {
      // Validate the token
      const decoded = jwt.verify(token, jwtSecret) as { userId: string, email: string, role?: string }; // Cast to expected payload type

      // In a real application, you might want to fetch more detailed user
      // information from the database based on the decoded ID to ensure
      // the user still exists and is active.

      // For now, we'll return the payload from the token
      const { id, email, role } = decoded;
      const userData = { // Corrected simulation
        id: id, // Assuming 'id' from payload is the user ID
        email: email,
        name: 'Nombre de Usuario',
        role: 'user', // or 'admin'
      };

      return NextResponse.json({ message: 'Session is valid', user: userData }, { status: 200 });
    } else {
      // jwt.verify will throw an error if the token is invalid or expired
      return NextResponse.json({ message: 'Invalid or expired token' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error checking session:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 }); // Handle other errors
  }
}
}