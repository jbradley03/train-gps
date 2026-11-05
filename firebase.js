import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";
import {
  initializeFirestore, persistentLocalCache, persistentMultipleTabManager
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBtLzdxm-ameml4dGvUh5peZ_VW3cxj620",
  authDomain: "urban-computing-fa797.firebaseapp.com",
  projectId: "urban-computing-fa797",
  storageBucket: "urban-computing-fa797.firebasestorage.app",
  messagingSenderId: "351408129155",
  appId: "1:351408129155:web:b68de259056d5ea4b0c7b6",
};

const app = initializeApp(firebaseConfig);

// Offline cache: points recorded with no signal are queued and sent when it returns
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});

const auth = getAuth(app);
export async function ensureSignedIn() {
  await auth.authStateReady();          // reuse the previous anonymous user if there is one
  if (!auth.currentUser) await signInAnonymously(auth);
}
