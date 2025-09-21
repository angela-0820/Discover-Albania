(function () {
  'use strict';

  // ---- Konstanta e celesave te storage ----
  const STORAGE_KEYS = {
    reservations: 'da_reservations',
    auth: 'da_auth',
  };

  // ---- Kontroll i disponueshmerise se storage (p.sh. private mode) ----
  function storageAvailable(type) {
    try {
      const s = window[type];
      const testKey = '__da_test__';
      s.setItem(testKey, '1');
      s.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  const HAS_LOCAL = storageAvailable('localStorage');
  const HAS_SESSION = storageAvailable('sessionStorage');

  // Fallback ne memorie nese storage nuk eshte i disponueshem
  const memLocal = new Map();
  const memSession = new Map();

  function safeGetLocal(key) {
    if (HAS_LOCAL) return localStorage.getItem(key);
    return memLocal.get(key) ?? null;
  }
  function safeSetLocal(key, val) {
    if (HAS_LOCAL) localStorage.setItem(key, val);
    else memLocal.set(key, val);
  }
  function safeRemoveSession(key) {
    if (HAS_SESSION) sessionStorage.removeItem(key);
    else memSession.delete(key);
  }
  function safeGetSession(key) {
    if (HAS_SESSION) return sessionStorage.getItem(key);
    return memSession.get(key) ?? null;
  }
  function safeSetSession(key, val) {
    if (HAS_SESSION) sessionStorage.setItem(key, val);
    else memSession.set(key, val);
  }

  // ---- Helpers te brendshem ----
  function parseJson(raw, fallback) {
    try { return raw ? JSON.parse(raw) : fallback; }
    catch { return fallback; }
  }

  // ---- API: Reservations ----
  function getReservations() {
    const raw = safeGetLocal(STORAGE_KEYS.reservations);
    return parseJson(raw, []);
  }

  function setReservations(list) {
    try {
      safeSetLocal(STORAGE_KEYS.reservations, JSON.stringify(Array.isArray(list) ? list : []));
    } catch {
      // hesht sepse eshte demo; ne prodhim log error
    }
  }

  function addReservation(entry) {
    const list = getReservations();
    list.push(entry);
    setReservations(list);
  }

  // ---- API: Auth demo (session) ----
  function setAuth(user) {
    try {
      safeSetSession(STORAGE_KEYS.auth, JSON.stringify({ user, ts: Date.now() }));
    } catch { /* demo */ }
  }

  function getAuth() {
    const raw = safeGetSession(STORAGE_KEYS.auth);
    return parseJson(raw, null);
  }

  function logoutAuth() {
    try { safeRemoveSession(STORAGE_KEYS.auth); }
    catch { /* demo */ }
  }

  // ---- API: Formatim date ----
  // Shenim: emri ruhet si "formatDateISO" per kompatibilitet, por kthen date te formatuar sipas locales.
  function formatDateISO(d) {
    const dt = new Date(d);
    if (isNaN(dt)) return '';
    return dt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
  }

  // ---- Export ne namespace global ----
  Object.defineProperty(window, 'DA', {
    value: Object.freeze({
      getReservations,
      setReservations,
      addReservation,
      setAuth,
      getAuth,
      logoutAuth,
      formatDateISO
    }),
    writable: false,
    configurable: false,
    enumerable: true
  });
})();
