// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker registered:', registration);
      updateStatus('Service Worker registered ✓');
    })
    .catch(error => {
      console.error('Service Worker registration failed:', error);
      updateStatus('Service Worker failed to register');
    });
}

// Update timestamp
function updateTimestamp() {
  const now = new Date();
  document.getElementById('timestamp').textContent = 'Last updated: ' + now.toLocaleString();
}

updateTimestamp();
setInterval(updateTimestamp, 1000);

// Update status message
function updateStatus(message) {
  const statusEl = document.getElementById('status');
  statusEl.textContent = message;
}

// Install prompt handling
let deferredPrompt;
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredPrompt = event;

  const installBtn = document.getElementById('installBtn');
  installBtn.style.display = 'block';
  updateStatus('Ready to install!');

  installBtn.addEventListener('click', () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(choiceResult => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
          updateStatus('App installed! 🎉');
          installBtn.style.display = 'none';
        } else {
          console.log('User dismissed the install prompt');
          updateStatus('Ready to install!');
        }
        deferredPrompt = null;
      });
    }
  });
});

// Check if app is running as standalone (installed)
window.addEventListener('load', () => {
  if (window.navigator.standalone === true) {
    updateStatus('Running as installed app ✓');
  } else if (navigator.serviceWorker.controller) {
    updateStatus('Service Worker active ✓');
  }
});

// Listen for app install success
window.addEventListener('appinstalled', () => {
  console.log('App was installed');
  updateStatus('App installed successfully! 🎉');
});
