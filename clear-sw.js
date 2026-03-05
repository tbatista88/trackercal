// Script para limpar service workers e cache
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log('Service Worker desregistado');
    }
  });
}

if ('caches' in window) {
  caches.keys().then(function(cacheNames) {
    cacheNames.forEach(function(cacheName) {
      caches.delete(cacheName);
      console.log('Cache apagado:', cacheName);
    });
  });
}

console.log('🧹 Limpeza completa! Recarrega a página.');
alert('Cache limpo! Recarrega a página (Ctrl+F5)');