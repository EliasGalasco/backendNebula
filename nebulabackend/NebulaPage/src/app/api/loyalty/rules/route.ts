import { NextResponse } from 'next/server';
// Import necessary modules and types
// In a real application, you would import your database interaction logic and authentication helpers.

// --- Simulation of data layer and authentication ---
// This is a placeholder. Replace with your actual database access code.
const simulatedLoyaltyRules = [
  { id: 'rule1', description: 'Earn 1 point per dollar spent on services', type: 'per_dollar_spent', value: 1 },
  { id: 'rule2', description: 'Earn 50 points for booking online', type: 'booking_online', value: 50 },
];
const simulateAuthAndAdmin = async (request: Request) => {
  // Simulate checking for a valid admin session/token
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { authenticated: false, isAdmin: false, error: 'Authentication required', status: 401 };
  }
  // Simulate token verification and check for admin status
  // In a real app, use jsonwebtoken.verify and check user roles from DB
  const token = authHeader.substring(7);
  if (token === 'fake-admin-token') { // Use a real token validation and admin check
    return { authenticated: true, isAdmin: true, user: { id: 'admin_user' }, status: 200 };
  } else if (token === 'fake-user-token') {
     return { authenticated: true, isAdmin: false, user: { id: 'regular_user' }, status: 200 };
  }
  return { authenticated: false, isAdmin: false, error: 'Invalid token', status: 401 };
};
// --- End Simulation ---

// Helper function for consistent error responses
const handleError = (error: any, status: number = 500) => {
  console.error(error);
  return NextResponse.json({ message: error instanceof Error ? error.message : 'An error occurred' }, { status });
};

// GET handler to fetch all loyalty rules (Admin only)
export async function GET(request: Request) {
  try {
    // Simulate authentication and admin check
    const authCheck = await simulateAuthAndAdmin(request);
    if (!authCheck.authenticated || !authCheck.isAdmin) {
      return NextResponse.json({ message: authCheck.error || 'Forbidden' }, { status: authCheck.status === 200 ? 403 : authCheck.status });
    }

    // Fetch all rules from the database
    // In a real application, replace this with your database query
    const rules = simulatedLoyaltyRules;

    return NextResponse.json(rules, { status: 200 }); // Return 200 OK
  } catch (error) {
    return handleError(error);
  }
}

// POST handler to create a new loyalty rule (Admin only)
export async function POST(request: Request) {
  try {
    // Simulate authentication and admin check
    const authCheck = await simulateAuthAndAdmin(request);
    if (!authCheck.authenticated || !authCheck.isAdmin) {
      return NextResponse.json({ message: authCheck.error || 'Forbidden' }, { status: authCheck.status === 200 ? 403 : authCheck.status });
    }

    const newRuleData: { description?: string; type?: string; value?: number } = await request.json();

    // Basic validation (expand as needed)
    if (!newRuleData || typeof newRuleData !== 'object' || !newRuleData.description || !newRuleData.type || newRuleData.value === undefined) {
      return handleError(new Error('Invalid rule data provided'), 400);
    }

    // Simulate generating a unique ID for the new rule
    const newRuleId = `rule${simulatedLoyaltyRules.length + 1}`;
    const createdRule = {
      id: newRuleId,
      ...newRuleData,
    };
    // In a real application, save this to your database
    simulatedLoyaltyRules.push(createdRule); // Simulate adding to our in-memory array

    return NextResponse.json(createdRule, { status: 201 });
  } catch (error) {
    return handleError(error);
  }
}