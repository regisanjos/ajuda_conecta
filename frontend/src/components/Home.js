import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Home.module.css';

function Home() {
    const navigate = useNavigate();

    const handleLoginClick = () => {
        navigate('/login');
    };

    const handleHowDonateClick = () => {
        navigate('/como-doar'); // Navega para a rota "como-doar"
    };

    const handleLogoClick = () => {
        navigate('/'); // Navega para a página inicial
    };

    return (
        
        <div className={styles.bodyColor}>
            <main>
                <div className={styles.logo} onClick={handleLogoClick}> {/* Adiciona o evento de clique */}
                    <div className={styles.circle}></div>
                    <img className={styles.imgHome} src='/img/Home Page PHOTO.svg'></img>
                    <div className={styles.colorBody}></div>
                </div>
                <h1 className={styles.h1Home}>AJUDACONECTA</h1>
                <p className={styles.subtitle}>Seu site que conecta doações</p>
                <p className={styles.p1}>
                    Seu gesto pode fazer a diferença na reconstrução de vidas e na 
                    recuperação de áreas devastadas, promovendo a união em tempos de crise.
                </p>
                <button 
                    id="howDonate" 
                    className={styles.donationButton} 
                    onClick={handleHowDonateClick} // Adiciona o evento de clique
                >
                    Veja como Doar
                </button>
                <button 
                    id="howDonate" 
                    className={styles.donationButton} 
                    onClick={handleHowDonateClick} // Adiciona o evento de clique
                >
                    ?
                </button>
            </main>
        </div>
    );
}

export default Home;
