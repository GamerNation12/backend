import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    // We use the environment variable instead of a physical file!
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT as string);
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('🔥 Firebase Admin successfully initialized');
  } catch (error) {
    console.error('❌ Firebase Init Error: Make sure FIREBASE_SERVICE_ACCOUNT is a valid JSON string in your Netlify env vars', error);
  }
}

export const db = admin.firestore();