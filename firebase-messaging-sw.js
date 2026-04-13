importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBxw-MbQw3DUIEy4F77pW6sycQ6Ib4E0H4",
  authDomain: "sporting-zorzal-jr.firebaseapp.com",
  databaseURL: "https://sporting-zorzal-jr-default-rtdb.firebaseio.com",
  projectId: "sporting-zorzal-jr",
  storageBucket: "sporting-zorzal-jr.firebasestorage.app",
  messagingSenderId: "607899014695",
  appId: "1:607899014695:web:d288d72578f00f9d2f6002"
});

const messaging = firebase.messaging();

// Notificaciones cuando la página está en segundo plano o cerrada
messaging.onBackgroundMessage(function(payload) {
  const { title, body, icon } = payload.notification || {};
  self.registration.showNotification(title || '⚽ Sporting Zorzal Jr', {
    body: body || '',
    icon: icon || 'https://static.wixstatic.com/media/bda49d_f9966472445e4704b82a2a839b9b74fc~mv2.png',
    badge: 'https://static.wixstatic.com/media/bda49d_f9966472445e4704b82a2a839b9b74fc~mv2.png',
    vibrate: [200, 100, 200],
    data: payload.data || {},
    actions: [
      { action: 'open', title: 'Ver página' },
      { action: 'close', title: 'Cerrar' }
    ]
  });
});

// Click en la notificación — abre la página
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  if (event.action === 'close') return;
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url.includes('sporting') && 'focus' in client) return client.focus();
      }
      return clients.openWindow('/');
    })
  );
});

// PWA: cache básico para funcionar offline
const CACHE = 'zorzal-v1';
self.addEventListener('install', function(e) {
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(clients.claim());
});
