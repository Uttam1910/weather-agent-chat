/**
 * analyticsStore.js
 * Persistent IndexedDB & LocalStorage Analytics Database for Weather Agent Admin.
 * Stores real-time public usage events without capturing personal user information.
 */

const DB_NAME = 'WeatherAnalyticsDB';
const DB_VERSION = 1;

let dbPromise = null;

function openDB() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (e) => {
      const db = e.target.result;

      if (!db.objectStoreNames.contains('visitors')) {
        const store = db.createObjectStore('visitors', { keyPath: 'id' });
        store.createIndex('lastSeenAt', 'lastSeenAt', { unique: false });
      }

      if (!db.objectStoreNames.contains('sessions')) {
        const store = db.createObjectStore('sessions', { keyPath: 'id' });
        store.createIndex('startedAt', 'startedAt', { unique: false });
      }

      if (!db.objectStoreNames.contains('page_views')) {
        const store = db.createObjectStore('page_views', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('path', 'path', { unique: false });
      }

      if (!db.objectStoreNames.contains('searches')) {
        const store = db.createObjectStore('searches', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('city', 'city', { unique: false });
      }

      if (!db.objectStoreNames.contains('feature_usage')) {
        const store = db.createObjectStore('feature_usage', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('featureId', 'featureId', { unique: false });
      }

      if (!db.objectStoreNames.contains('api_requests')) {
        const store = db.createObjectStore('api_requests', { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
        store.createIndex('provider', 'provider', { unique: false });
      }
    };

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });

  return dbPromise;
}

export async function addRecord(storeName, data) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      const req = store.put(data);
      req.onsuccess = () => resolve(req.result);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    console.warn('Analytics DB Error (non-blocking):', err);
  }
}

export async function getAllRecords(storeName) {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = (e) => reject(e.target.error);
    });
  } catch (err) {
    return [];
  }
}

export async function clearAllAnalyticsData() {
  try {
    const db = await openDB();
    const storeNames = ['visitors', 'sessions', 'page_views', 'searches', 'feature_usage', 'api_requests'];
    const tx = db.transaction(storeNames, 'readwrite');
    storeNames.forEach((s) => tx.objectStore(s).clear());
  } catch (err) {
    console.warn('Failed to clear analytics store:', err);
  }
}
