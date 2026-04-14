const { initializeApp, cert } = require('firebase-admin/app');
const { getDatabase } = require('firebase-admin/database');
const { getMessaging } = require('firebase-admin/messaging');

const titulo = process.argv[2] || '⚽ Sporting Zorzal Jr';
const body   = process.argv[3] || '';

if (!body) {
  console.log('Uso: node enviar.js "Título" "Mensaje"');
  process.exit(1);
}

const serviceAccount = require('./serviceAccount.json');

initializeApp({
  credential: cert(serviceAccount),
  databaseURL: 'https://sporting-zorzal-jr-default-rtdb.firebaseio.com'
});

const db = getDatabase()