'use client';

import { useState, useEffect } from 'react';
import { Bell, BellOff, Volume2 } from 'lucide-react';

interface PushNotificationsProps {
  className?: string;
}

export default function PushNotifications({ className = '' }: PushNotificationsProps) {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Verificar soporte para notificaciones push
    const checkSupport = () => {
      const supported = 'serviceWorker' in navigator && 
                       'PushManager' in window && 
                       'Notification' in window;
      setIsSupported(supported);
      
      if (supported) {
        setPermission(Notification.permission);
        checkExistingSubscription();
      }
    };

    checkSupport();
  }, []);

  const checkExistingSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const existingSubscription = await registration.pushManager.getSubscription();
      setSubscription(existingSubscription);
    } catch (error) {
      console.error('Error checking subscription:', error);
    }
  };

  const requestPermission = async () => {
    if (!isSupported) return;

    setIsLoading(true);
    
    try {
      const permission = await Notification.requestPermission();
      setPermission(permission);
      
      if (permission === 'granted') {
        await subscribeToPush();
        
        // Mostrar notificación de bienvenida
        showWelcomeNotification();
      }
    } catch (error) {
      console.error('Error requesting permission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const subscribeToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      
      // Clave pública VAPID (en producción, esto debería venir del servidor)
      const vapidPublicKey = 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9f4LiKiOOUkv4xaQAGSQ4RD7hJKs6c4hpgd-QFXBCVMn6G9Ry7nE';
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });
      
      setSubscription(subscription);
      
      // Enviar suscripción al servidor
      await sendSubscriptionToServer(subscription);
      
    } catch (error) {
      console.error('Error subscribing to push:', error);
    }
  };

  const unsubscribeFromPush = async () => {
    if (!subscription) return;

    setIsLoading(true);
    
    try {
      await subscription.unsubscribe();
      setSubscription(null);
      
      // Notificar al servidor
      await removeSubscriptionFromServer(subscription);
      
    } catch (error) {
      console.error('Error unsubscribing:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendSubscriptionToServer = async (subscription: PushSubscription) => {
    try {
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscription,
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        }),
      });
    } catch (error) {
      console.error('Error sending subscription to server:', error);
    }
  };

  const removeSubscriptionFromServer = async (subscription: PushSubscription) => {
    try {
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription }),
      });
    } catch (error) {
      console.error('Error removing subscription from server:', error);
    }
  };

  const showWelcomeNotification = () => {
    if (permission === 'granted') {
      new Notification('¡Bienvenido a YOUNGMUFF!', {
        body: 'Ahora recibirás notificaciones sobre nueva música y contenido.',
        icon: '/images/logo.png',
        badge: '/images/logo.png',
        tag: 'welcome',
        requireInteraction: false,
        silent: false
      });
    }
  };

  const testNotification = async () => {
    if (!subscription) return;

    try {
      await fetch('/api/push/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscription }),
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
    }
  };

  // Convertir clave VAPID
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className={`push-notifications ${className}`}>
      {permission === 'default' && (
        <button
          onClick={requestPermission}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-500 text-white rounded-lg hover:from-red-700 hover:to-orange-600 transition-all duration-300 disabled:opacity-50"
        >
          <Bell size={18} />
          {isLoading ? 'Activando...' : 'Activar Notificaciones'}
        </button>
      )}

      {permission === 'granted' && !subscription && (
        <button
          onClick={subscribeToPush}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-blue-500 text-white rounded-lg hover:from-green-700 hover:to-blue-600 transition-all duration-300 disabled:opacity-50"
        >
          <Bell size={18} />
          {isLoading ? 'Suscribiendo...' : 'Suscribirse'}
        </button>
      )}

      {permission === 'granted' && subscription && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/20 text-green-400 rounded-lg border border-green-500/30">
            <Bell size={16} />
            <span className="text-sm">Notificaciones activas</span>
          </div>
          
          <button
            onClick={testNotification}
            className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
            title="Probar notificación"
          >
            <Volume2 size={16} />
          </button>
          
          <button
            onClick={unsubscribeFromPush}
            disabled={isLoading}
            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50"
            title="Desactivar notificaciones"
          >
            <BellOff size={16} />
          </button>
        </div>
      )}

      {permission === 'denied' && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30">
          <BellOff size={16} />
          <span className="text-sm">Notificaciones bloqueadas</span>
        </div>
      )}
    </div>
  );
}