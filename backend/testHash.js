const bcrypt = require('bcrypt');

const password = 'Test1234';
const hash = '$2b$10$l/AEQYT4QDP1mzqlFLEqJ.YErz1rDAl7ceusldn9SwM2vPIHT9CPm'; // Substitua pelo hash atualizado no banco

bcrypt.compare(password, hash).then((result) => {
  console.log('Senha válida?', result); // Deve imprimir "true"
});
