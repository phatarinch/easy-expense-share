/* Easy Expense service worker — caches the whole app so it opens offline */
const CACHE = 'easy-expense-c22669d067';
const ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./xlsx.full.min.js", "./fonts/anuphan-thai-400-normal.woff2", "./fonts/anuphan-latin-400-normal.woff2", "./fonts/anuphan-thai-500-normal.woff2", "./fonts/anuphan-latin-500-normal.woff2", "./fonts/anuphan-thai-600-normal.woff2", "./fonts/anuphan-latin-600-normal.woff2", "./fonts/anuphan-thai-700-normal.woff2", "./fonts/anuphan-latin-700-normal.woff2", "./icons/apple-touch-icon.png", "./icons/favicon-32.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-192.png", "./icons/maskable-512.png", "./easy-expense-template.xlsx", "./guide.html", "./guide-img/01-welcome.jpg", "./guide-img/02-empty.jpg", "./guide-img/03-list.jpg", "./guide-img/04-add.jpg", "./guide-img/05-summary.jpg", "./guide-img/06-recurring.jpg", "./guide-img/07-credit.jpg", "./guide-img/08-categories.jpg", "./guide-img/09-backup.jpg"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS))); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('easy-expense-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data === 'skip') self.skipWaiting(); });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate'){
    e.respondWith(caches.match(req, {ignoreSearch:true}).then(r => r || caches.match('./index.html')).then(r => r || fetch(req)));
    return;
  }
  e.respondWith(caches.match(req, {ignoreSearch:true}).then(r => r || fetch(req).then(res => {
    if (res.ok){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
