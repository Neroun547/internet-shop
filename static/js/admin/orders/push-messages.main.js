import { urlBase64ToUint8Array } from "../../common/urlBase64ToUint8Array.js";

function requestPermission() {
  return new Promise(function(resolve, reject) {
    const permissionResult = Notification.requestPermission(function(result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  })
    .then(function(permissionResult) {
      if (permissionResult !== 'granted') {
        throw new Error('Permission not granted.');
      }
    });
}

requestPermission()
  .then(() => {
    // Register a Service Worker.
    navigator.serviceWorker.register('/js/admin/orders/service-worker.js')
      .then((registration) => {
        console.log(registration)
            console.log("Ready")
            // Use the PushManager to get the user's subscription to the push service.
            return registration.pushManager.getSubscription()
              .then(async function(subscription) {
                // If a subscription was found, return it.
                if (subscription) {
                  return { alreadyAuth: true, subscription };
                }

                // Get the server's public key
                const response = await fetch('/admin/settings/public-key-push-messages');
                const vapidPublicKey = (await response.json()).value;
                console.log(vapidPublicKey)
                // Chrome doesn't accept the base64-encoded (string) vapidPublicKey yet
                // urlBase64ToUint8Array() is defined in /tools.js
                const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

                // Otherwise, subscribe the user (userVisibleOnly allows to specify that we don't plan to
                // send notifications that don't have a visible effect for the user).
                return registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: convertedVapidKey
                });
              });
          }).then(function(subscription) {

          if(subscription.alreadyAuth) {
            return;
          }
          // Send the subscription details to the server using the Fetch API.
          fetch('/admin/settings/register-push-messages', {
            method: 'post',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify({
              subscription: subscription
            }),
          });
        })
      .catch(e => {
        console.log(e)
      });
  })
