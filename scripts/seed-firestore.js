'use strict';

const admin = require('firebase-admin');

// Decode the base64-encoded private key
const privateKeyBase64 =
  'LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRQ1NQdWJkM3RTMXRWaWYKTEhLQUdFUmZNbGhuMHlLdy96aUVUcUVqcWlEYTZ3QW1xdm9ySmllbitjOFVIZUt3c0JNckN1YVk1WGhxdzZKZwpzYnR4TnYzWkd0NzU2bHQ0ZTJNdXA2dnBlRkNnVVM4RTcwQnlmV2syaG1XMVB0L0t0UGozbEhYck9tTkxDS2xsClVqNUJGaStqWm95anFhZGcxV1RveUxTNlFTSm9jYk1kTWZqNWtZOXVpYXpwUUEvOHgrNE81VDNQVEUxVG1uQ1cKTzYrNWpOU210MU11cC81bXZCbngwSEZHNWdQNVR4QTRJRjVhLzNMN3grTU1DZ0RDZkVMbXlwdkJsMGN1R1kyZwpGdkVIdDNITCtOZXJ6Q0kvNGdkNTRFQkRuMUtGVVN0ZWs2cjdTY2pxczJER2pFRk4yK05wcUZEZElGendVdUx1Cnp4U3dqL1REQWdNQkFBRUNnZ0VBUFFmR0JhSkh4MXJhRkhjU2czVmRGeE1tQkpIK1lMbnBob0ZmeXNmbE5TYXIKNWZjbE5sdVNZZzJraHVNZjVwZGNNSEs0bitiblZUcTJLVDhTbDZFWTE0RFl1NWU3TzNEV2g3Sk9VankwL09wVQpRbTFyeWp1ZTdET3kveXV4YmVFUEl4YlFETzNOWVJOSXlmRkQ3SnFMSDlnY2FmSlRXTnhFNDhaYWNYM2NFNVI1CjZUdUZKTjR5RitsaEJ6cG0xTHB3Zzk2aGpCVU4xa0YzZU03MzUxcEtLT0ZpUE9tQnZnVkdQUlJnaW1MaCt1UVMKQks1ems5bDArZnMrMmJWejdBbFZxZjRxRHpTZllJbTcxNS9CWmxpWVJTNGNUeDZWUEdKN01jays3R1NUSWllYgpod3RDcEZjd3IvZ01VMmJRbXlBdVBIYitqb2ZFSVRybkpuWkZKTUwrclFLQmdRRENTM1JJRldmdzlPQXJSWUhtCjYrVzJqeXFsWVBLcGVMRDJONFBuaEFqUXQyMDdHQ3NMY2pGNGJ4ZFo3OEcxbUtXejFkcmhkeE5ZWWc4RHZUVjkKdUg3SVl6YmZ3dWQ3Y0xxUlQ1VzQyOUhZRk0vN0pzM0tvRlpwQ0p2VWswWGlOYlBwQThpOG90N0J3YUgvK1IyYgpUYnk3VFRlUDdTSkFsbkVrNVNlenR0V1JmUUtCZ1FEQXNQZHF6cE1TbnlvYzhMa0VNSlJ3akJRVjVRNkhhVERRCnh2V3FjeGhzVDE0MVU2TUJzOEVCMm1MUHN1RGFMM2FZbGtxcnlaRm5jSjAvTkc1aWlSRnUwZU1abVdrNlIyV3gKZ2hYZ0JRMDJWR2pOUlBjYzM1MWV1V21YMitFcHZ2L3o0cjAveXhIS2h3aXQvUFU1OE50bURUZnB0ZlhXNDJKeQpwRUVXbVI1elB3S0JnQkFWVU9YYXA4VUJjRUVFdXZFVG0rdFZ4SkQyQ29CTzFrODdYemJkN2lEZzNqRGpHa1VUClNkY1BVeDZGdzBJMkJabHlYWEVHZTFwNG00ZVN0UWZZS3Q2Sm4vUTczUStSMEUvUkI3TEt0Mzhza2Q3WFluZWcKZUNhdnFMNmJCbERvWXlFcHlBY2RjRlVYbzBKZUs3NDhYQ0FoRHpWaHl0RVA0d1BMMkZKL0V3UzlBb0dBUGJ3MAorTlpJVG80S0N3Mmc2Vk83S3pmbDg0SFlucyszNFJ2dGQzZTZtbkR2U1B5TDNDN0FKcHpXVFo4TTVUcVJyNTl2Ck93eXdka2loU0srK3Nma2lTYlFiSTRlQUxEalZ2d0pqaWN0MGlUU1FBendXUS96c3lYMXo5RUJ4S2xQVVkwb0EKd2lDSWlhK3J1enF4UXFnRlV2UG5Od3lpUC8vSCtkemdNYUpMSERjQ2dZRUFreGFFTUQ5SEZnbHFVcW9HUnFUeAptTkI1MGF1dXhMblpwRzk4bVg1eWxlNndPNU9lek54ZXBRVUpYZnI2U1hRckNXNFJXelJoUXdyU0lmVU9CYkZ2Cm9ZTGxxUW94WXhSQXFtcHlQSE12TkFNWjFSMy94Tmh2VVhPMUNUTTVoNTF1alVXV2dKZktIS3pGT0lsd2UrNXYKdjA5TlJXWUFFc0FEUmMrNENHbWxIVHM9Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K';

const privateKey = Buffer.from(privateKeyBase64, 'base64').toString('utf8');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: 'hiram-494501',
    clientEmail: 'hiram-686@hiram-494501.iam.gserviceaccount.com',
    privateKey,
  }),
});

const db = admin.firestore();

const monitors = [
  {
    id: 'homepage',
    data: {
      name: 'Homepage',
      url: 'https://example.com',
      status: 'up',
      uptime: '99.98%',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
  },
  {
    id: 'api',
    data: {
      name: 'API',
      url: 'https://api.example.com',
      status: 'up',
      uptime: '99.85%',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
  },
  {
    id: 'dashboard',
    data: {
      name: 'Dashboard',
      url: 'https://app.example.com',
      status: 'degraded',
      uptime: '97.20%',
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
  },
];

async function seed() {
  console.log('🌱 Seeding Firestore monitors collection…');

  for (const monitor of monitors) {
    await db.collection('monitors').doc(monitor.id).set(monitor.data, { merge: true });
    console.log(`  ✓ Upserted monitor: ${monitor.id}`);
  }

  console.log('✅ Firestore seeded successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
