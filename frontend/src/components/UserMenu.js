import React, { useEffect, useState } from 'react';
import styles from '../styles/UserMenu.module.css';
import { auth } from '../scripts/firebase';

function UserMenu() {
    const [userName, setUserName] = useState('');

    useEffect(() => {
        // Obtém o usuário autenticado do Firebase
        const user = auth.currentUser;
        
        if (user) {
            // Se o usuário foi autenticado com Google ou Facebook, o displayName estará preenchido
            setUserName(user.displayName || user.email); // Caso displayName não exista, exibe o e-mail
        }
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Bem-vindo{userName ? `, ${userName}` : ''}!</h1>
            <div className={styles.menuOptions}>
                <div className={styles.menuItem}>Acompanhar Doações</div>
                <div className={styles.menuItem}>Fazer Doação</div>
                <div className={styles.menuItem}>Perfil</div>
            </div>
        </div>

    );
}

export default UserMenu;
