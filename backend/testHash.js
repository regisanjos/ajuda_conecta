const bcrypt = require('bcrypt'); // ou 'bcryptjs'

const plainPassword = 'Password123';

(async () => {
  try {
    const saltRounds = 10;
    const newHash = await bcrypt.hash(plainPassword, saltRounds);
    console.log('Novo hash gerado:', newHash);

    const isValid = await bcrypt.compare(plainPassword, newHash);
    console.log('Senha válida com novo hash?', isValid);
  } catch (err) {
    console.error('Erro ao gerar ou validar hash:', err.message);
  }
})();
