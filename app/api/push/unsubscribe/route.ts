import { NextRequest, NextResponse } from 'next/server';

// Simulamos una base de datos en memoria (en producción usar una DB real)
const subscriptions = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { subscription } = await request.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Subscription data is required' },
        { status: 400 }
      );
    }

    // Buscar y eliminar suscripción
    const subscriptionKey = subscription.endpoint;
    let removed = false;

    for (const sub of subscriptions) {
      const parsedSub = JSON.parse(sub);
      if (parsedSub.subscription.endpoint === subscriptionKey) {
        subscriptions.delete(sub);
        removed = true;
        break;
      }
    }

    console.log('Push subscription removed:', {
      endpoint: subscription.endpoint,
      found: removed
    });

    return NextResponse.json({ 
      success: true, 
      message: removed ? 'Subscription removed successfully' : 'Subscription not found',
      subscriptionCount: subscriptions.size
    });

  } catch (error) {
    console.error('Error removing subscription:', error);
    return NextResponse.json(
      { error: 'Failed to remove subscription' },
      { status: 500 }
    );
  }
}