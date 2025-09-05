import { NextRequest, NextResponse } from 'next/server';

// En producción, esto debería estar en variables de entorno
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const VAPID_PRIVATE_KEY = 'your-vapid-private-key';
const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9f4LiKiOOUkv4xaQAGSQ4RD7hJKs6c4hpgd-QFXBCVMn6G9Ry7nE';

// Simulamos una base de datos en memoria (en producción usar una DB real)
const subscriptions = new Set<string>();

export async function POST(request: NextRequest) {
  try {
    const { subscription, userAgent, timestamp } = await request.json();

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: 'Subscription data is required' },
        { status: 400 }
      );
    }

    // Guardar suscripción (en producción, guardar en base de datos)
    subscriptions.add(JSON.stringify({
      subscription,
      userAgent,
      timestamp,
      createdAt: new Date().toISOString()
    }));

    console.log('New push subscription:', {
      endpoint: subscription.endpoint,
      userAgent,
      timestamp: new Date(timestamp).toISOString()
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription saved successfully',
      subscriptionCount: subscriptions.size
    });

  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json(
      { error: 'Failed to save subscription' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    subscriptionCount: subscriptions.size,
    vapidPublicKey: VAPID_PUBLIC_KEY
  });
}