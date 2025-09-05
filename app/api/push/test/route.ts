import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { subscription } = await request.json();

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription is required' },
        { status: 400 }
      );
    }

    // En un entorno real, aquí usarías web-push para enviar la notificación
    // Por ahora, simulamos el envío
    console.log('Sending test notification to:', subscription.endpoint);

    // Simular envío de notificación push
    const notificationPayload = {
      title: 'YOUNGMUFF - Notificación de Prueba',
      body: '¡Las notificaciones están funcionando correctamente! 🎵',
      icon: '/images/logo.png',
      badge: '/images/logo.png',
      data: {
        url: '/',
        timestamp: Date.now(),
        type: 'test'
      },
      actions: [
        {
          action: 'open',
          title: 'Abrir App'
        },
        {
          action: 'close',
          title: 'Cerrar'
        }
      ]
    };

    // En producción, aquí enviarías la notificación real usando web-push:
    /*
    const webpush = require('web-push');
    
    webpush.setVapidDetails(
      'mailto:your-email@example.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );

    await webpush.sendNotification(
      subscription,
      JSON.stringify(notificationPayload)
    );
    */

    return NextResponse.json({ 
      success: true, 
      message: 'Test notification sent successfully',
      payload: notificationPayload
    });

  } catch (error) {
    console.error('Error sending test notification:', error);
    return NextResponse.json(
      { error: 'Failed to send test notification' },
      { status: 500 }
    );
  }
}