import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // TODO: Implement logic to fetch available loyalty rewards from the database.
    // This would involve interacting with your data layer, potentially filtering for active rewards.
    // Simulate fetching rewards from a database
    const rewards = [
      { id: 1, name: 'Descuento del 10%', pointsRequired: 100 },
      { id: 2, name: 'Servicio gratuito (corte de pelo)', pointsRequired: 500 },
      { id: 3, name: 'Producto de belleza de regalo', pointsRequired: 250 },
    ];

    return NextResponse.json(rewards, { status: 200 });

  } catch (error) {
    console.error('Error fetching loyalty rewards:', error);
    // TODO: Implement more specific error handling based on the error type
    return NextResponse.json({ message: 'Error fetching loyalty rewards' }, { status: 500 });
  }
}