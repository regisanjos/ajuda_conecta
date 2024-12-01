import admin from 'firebase-admin';

const serviceAccount = require('./path-to-your-service-account-file.json');  // Caminho para o arquivo .json

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://<your-project-id>.firebaseio.com',  // Substitua pelo seu databaseURL do Firebase
});

export { admin };
