const activateNotification = document.getElementById("activate-notification");

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

function subscribeUserToPush() {
  return navigator.serviceWorker.register('settings/service-worker.js')
    .then(function(registration) {
      const subscribeOptions = {
        userVisibleOnly: true,
        applicationServerKey: 'BO-ELz9fhIWm5ZY1Bf007L_pvQ8b_MEH4pQOHdzIY3vp3aZFuK9NYCCmMuMWeX1AFe5hM-oHp_EJSC-2rVrlo0I'
      };

      return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(function(pushSubscription) {
      return pushSubscription;
    });
}

activateNotification.addEventListener("change", async function (e) {
  try {
    await requestPermission();
    const pushSubscriptionObj = await subscribeUserToPush();

    await fetch("/admin/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        data: JSON.stringify(pushSubscriptionObj),
        active: activateNotification.checked
      })
    });
  } catch(e) {
    console.log(e);
  }
});
