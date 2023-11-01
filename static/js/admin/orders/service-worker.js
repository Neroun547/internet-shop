// Register event listener for the 'push' event.
console.log("reg")
self.addEventListener('push', function(event) {
  console.log(event)
  // Keep the service worker alive until the notification is created.
  event.waitUntil(
    // Show a notification with title 'ServiceWorker Cookbook' and body 'Alea iacta est'.
    self.registration.showNotification('ServiceWorker Cookbook', {
      body: 'Alea iacta est',
    })
  );
});
