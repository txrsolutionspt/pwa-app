// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js', { scope: './' })
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

// Counter functionality with localStorage persistence
const COUNTER_KEY = 'pwa-counter';

function loadCounter() {
  const saved = localStorage.getItem(COUNTER_KEY);
  return saved ? parseInt(saved, 10) : 0;
}

function saveCounter(value) {
  localStorage.setItem(COUNTER_KEY, value);
}

function updateCounterDisplay(value) {
  document.getElementById('counterDisplay').textContent = value;
}

let counter = loadCounter();
updateCounterDisplay(counter);

document.getElementById('incrementBtn').addEventListener('click', () => {
  counter++;
  saveCounter(counter);
  updateCounterDisplay(counter);
});

document.getElementById('decrementBtn').addEventListener('click', () => {
  counter--;
  saveCounter(counter);
  updateCounterDisplay(counter);
});

document.getElementById('resetBtn').addEventListener('click', () => {
  counter = 0;
  saveCounter(counter);
  updateCounterDisplay(counter);
});
