// ===== Firebase Analytics (GA4) via CDN, modular =====
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
import {
  getAnalytics, logEvent, isSupported, setAnalyticsCollectionEnabled,
  setUserId, setUserProperties
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js';

// TODO: PREENCHER com o config do app Web do MESMO projeto Firebase (inclui measurementId)
const firebaseConfig = {
  apiKey: "API_KEY",
  authDomain: "PROJECT.firebaseapp.com",
  projectId: "PROJECT",
  storageBucket: "PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID",
  measurementId: "G-XXXXXXX"
};

const app = initializeApp(firebaseConfig);

// "debug_mode" se a URL tiver ?firebase_analytics_debug_mode=true
const params = new URLSearchParams(location.search);
const debugMode = params.has('firebase_analytics_debug_mode');

let analytics = null;
try {
  if (await isSupported()) {
    analytics = getAnalytics(app);
    setAnalyticsCollectionEnabled(analytics, true);
    console.log('[GA4] Analytics inicializado', { debugMode });

    // page_view inicial manual (ajuda SPA e debug)
    trackPageView(location.pathname);
  } else {
    console.warn('[GA4] Analytics não suportado neste ambiente');
  }
} catch (e) {
  console.warn('[GA4] Falha ao inicializar Analytics:', e);
}

// ----- wrappers que incluem debug_mode quando solicitado -----
function _log(name, data = {}) {
  if (!analytics) return;
  const payload = debugMode ? { ...data, debug_mode: true } : data;
  logEvent(analytics, name, payload);
}

export function trackPageView(pathname = location.pathname) {
  _log('page_view', {
    page_location: location.href,
    page_path: pathname,
    page_title: document.title
  });
}

export function trackClick(name, extra = {}) {
  _log('click', { element_name: name, ...extra });
}

export function trackMessageSent(extra = {}) {
  _log('generate_lead', { method: 'contact_form', ...extra });
}

export function identifyUser(userId) {
  if (!analytics || !userId) return;
  setUserId(analytics, userId);
}
export function setUserAttrs(attrs = {}) {
  if (!analytics) return;
  setUserProperties(analytics, attrs);
}

// Auto: elementos com data-analytics-click
document.addEventListener('click', (ev) => {
  const el = ev.target?.closest?.('[data-analytics-click]');
  if (!el) return;
  const name = el.getAttribute('data-analytics-click') || 'click';
  const label = el.getAttribute('data-analytics-label') || el.textContent?.trim() || '';
  const href = el.getAttribute('href') || '';
  trackClick(name, { label, href });
});

// Expor helpers p/ console
window.__ga = { trackPageView, trackClick, trackMessageSent, identifyUser, setUserAttrs, app };
