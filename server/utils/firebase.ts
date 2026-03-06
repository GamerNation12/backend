import admin from 'firebase-admin';

if (!admin.apps.length) {
  try {
    const rawData = process.env.FIREBASE_SERVICE_ACCOUNT as string;
    let serviceAccount;

    // Check if the data is Base64 (Netlify) or raw JSON (Local)
    if (rawData.startsWith('ew')) {
      // Decode Base64 to string, then parse to JSON
      const decoded = Buffer.from(rawData, 'base64').toString('utf8');
      serviceAccount = JSON.parse(decoded);
    } else {
      // It's already JSON (likely local testing)
      serviceAccount = JSON.parse(rawData);
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    
    console.log('🔥 Firebase Admin successfully initialized!');
  } catch (error) {
    console.error('❌ Firebase Init Error:', error);
  }
}

export const db = admin.firestore();