// ===== FIREBASE CONFIG =====
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set, get, update, push, remove, onValue } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBgNiehD0PECNhj3BcT8aRzgN6Q1PyAiWI",
  authDomain: "partexcloud.firebaseapp.com",
  databaseURL: "https://partexcloud-default-rtdb.firebaseio.com",
  projectId: "partexcloud",
  storageBucket: "partexcloud.firebasestorage.app",
  messagingSenderId: "708155275046",
  appId: "1:708155275046:web:fa7d7d82a06878a8cc33e7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { auth, db, ref, set, get, update, push, remove, onValue, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail };

// ===== PLAN CONFIG =====
export const PLANS = {
  free:     { name: 'Free',     storage: 5 * 1024,    price: 0,   priceId: null },
  starter:  { name: 'Starter',  storage: 50 * 1024,   price: 3.99, priceId: 'starter' },
  pro:      { name: 'Pro',      storage: 200 * 1024,  price: 8.99, priceId: 'pro' },
  business: { name: 'Business', storage: 1024 * 1024, price: 24.99, priceId: 'business' },
};

// ===== HELPERS =====
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(i > 1 ? 1 : 0) + ' ' + units[i];
}

export function formatDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function getFileIcon(name) {
  const ext = name.split('.').pop().toLowerCase();
  const icons = {
    pdf: '📄', doc: '📝', docx: '📝', txt: '📃',
    jpg: '🖼️', jpeg: '🖼️', png: '🖼️', gif: '🖼️', webp: '🖼️', svg: '🖼️',
    mp4: '🎬', mov: '🎬', avi: '🎬', mkv: '🎬',
    mp3: '🎵', wav: '🎵', flac: '🎵',
    zip: '📦', rar: '📦', tar: '📦', gz: '📦',
    xls: '📊', xlsx: '📊', csv: '📊',
    ppt: '📋', pptx: '📋',
    js: '💻', ts: '💻', py: '💻', html: '💻', css: '💻', json: '💻',
  };
  return icons[ext] || '📎';
}

// ===== THEME =====
export function initTheme() {
  const saved = localStorage.getItem('fluxora-theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  return saved;
}

export function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('fluxora-theme', next);
  return next;
}

// ===== TOAST =====
export function toast(msg, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const icons = { success: '✓', error: '✕', info: 'ℹ' };
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => el.remove(), duration);
}

// ===== USER DATA =====
export async function getUserData(uid) {
  const snap = await get(ref(db, `users/${uid}`));
  return snap.exists() ? snap.val() : null;
}

export async function createUserData(uid, email, name) {
  const data = {
    uid,
    email,
    name,
    plan: 'free',
    storageUsed: 0,
    storageLimit: PLANS.free.storage,
    createdAt: Date.now(),
    files: {}
  };
  await set(ref(db, `users/${uid}`), data);
  return data;
}
