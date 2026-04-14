const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Se dispara cada vez que se crea un nuevo documento en /notificaciones
exports.enviarPush = functions.database.ref('/notificaciones/{id}')
  .onCreate(async (snap, context) => {
    const data = snap.val();
    if (!data || data.enviado) return null;

    // Marcar como enviado para no mandar dos veces
    await snap.ref.update({ enviado: true });

    // Obtener todos los tokens
    const tokensSnap = await admin.database().ref('push_tokens').once('value');
    const tokensData = tokensSnap.val();
    if (!tokensData) return null;

    const tokens = Object.values(tokensData).map(t => t.token).filter(Boolean);
    if (tokens.length === 0) return null;

    // Armar el mensaje
    const message = {
      notification: {
        title: data.titulo || '⚽ Sporting Zorzal Jr',
        body: data.body || ''
      },
      tokens: tokens
    };

    // Enviar
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`Enviado: ${response.successCount} ok, ${response.failureCount} fallidos`);
    return null;
  });
