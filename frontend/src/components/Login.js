import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/apiService'; // Importando o serviço de autenticação
import { auth } from '../scripts/firebase'; // Importando a instância do Firebase
import styles from '../styles/Login.module.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            // Verifica a autenticação com o Firebase (email e senha)
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;

            // Obtém o ID Token do Firebase
            const token = await user.getIdToken();
            
            // Passa o token JWT para o backend
            const userData = await login(token); // Chama o serviço para fazer login com JWT

            // Sucesso no login, redireciona para o Dashboard
            console.log('Usuário autenticado:', userData);
            navigate('/dashboard'); // Redireciona para o dashboard após o login
        } catch (err) {
            setError('Erro ao fazer login. Verifique suas credenciais.');
        }
    };

    return (
        <div className={styles.container}>
            <form onSubmit={handleLogin}>
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
                <button type="submit">Login</button>
            </form>
        </div>
    );
}

export default Login;
