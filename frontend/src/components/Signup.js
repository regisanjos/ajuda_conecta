import React, { useState } from 'react';
import { signup } from '../services/apiService'; // Importando o serviço
import styles from '../styles/Login.module.css';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userData = await signup(email, password, name); // Chamando a função do apiService
            console.log('Cadastro realizado com sucesso:', userData);
            setSuccessMessage('Cadastro realizado com sucesso!');
        } catch (err) {
            setError('Erro ao realizar o cadastro. Tente novamente.');
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleSignup}>
                <input
                    type="text"
                    placeholder="Nome"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="E-mail"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Senha"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && <p className={styles.error}>{error}</p>}
                {successMessage && <p className={styles.success}>{successMessage}</p>}
                <button type="submit">Cadastrar</button>
            </form>
        </div>
    );
}

export default Signup;
