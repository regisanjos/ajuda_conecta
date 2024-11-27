import React, { useState, useEffect } from "react";
import TimePicker from "react-time-picker";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import styles from "../styles/User.module.css";

const User = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [horarioAbertura, setHorarioAbertura] = useState("");
    const [horarioFechamento, setHorarioFechamento] = useState("");
    const [doacoesAceitas, setDoacoesAceitas] = useState([]);
    const [novaDoacao, setNovaDoacao] = useState("");
    const [pontosColeta, setPontosColeta] = useState(() => {
        // Recupera os dados do localStorage ao inicializar
        const storedData = localStorage.getItem("pontosColeta");
        return storedData ? JSON.parse(storedData) : [];
    });

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    const handleDoacoesAceitas = () => {
        if (novaDoacao && !doacoesAceitas.includes(novaDoacao)) {
            setDoacoesAceitas([...doacoesAceitas, novaDoacao]);
            setNovaDoacao("");
        }
    };

    const removeDoacao = (doacao) => {
        setDoacoesAceitas(doacoesAceitas.filter((item) => item !== doacao));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const novoPonto = {
            id: `PT${pontosColeta.length + 1}`,
            nome: event.target.nome.value,
            estado: event.target.estado.value,
            cidade: event.target.cidade.value,
            rua: event.target.rua.value,
            numero: event.target.numero.value,
            horario: `${horarioAbertura} - ${horarioFechamento}`,
            doacoes: doacoesAceitas,
        };

        const updatedPontosColeta = [...pontosColeta, novoPonto];
        setPontosColeta(updatedPontosColeta);
        localStorage.setItem("pontosColeta", JSON.stringify(updatedPontosColeta)); // Salva no localStorage

        // Limpa os campos do formulário
        setHorarioAbertura("");
        setHorarioFechamento("");
        setDoacoesAceitas([]);
        handleCloseModal();
    };

    return (
        <div className={styles.userContainer}>
            <h1 className={styles.pageTitle}>Pontos de Coleta</h1>
            <button className={styles.addButton} onClick={handleOpenModal}>
                Adicionar Ponto
            </button>

            <div className={styles.listContainer}>
                <h2 className={styles.listTitle}>Lista de Pontos de Coleta</h2>
                <div className={styles.dataHeader}>
                    <p>ID</p>
                    <p>Nome</p>
                    <p>Cidade</p>
                    <p>Estado</p>
                    <p>Horário</p>
                    <p>Doações</p>
                </div>
                {pontosColeta.map((ponto) => (
                    <div key={ponto.id} className={styles.dataRow}>
                        <p>{ponto.id}</p>
                        <p>{ponto.nome}</p>
                        <p>{ponto.cidade}</p>
                        <p>{ponto.estado}</p>
                        <p>{ponto.horario}</p>
                        <p>{ponto.doacoes.join(", ")}</p>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <h4 className={styles.modalTitle}>Cadastrar Ponto de Coleta</h4>
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.formGroup}>
                                <label>Nome</label>
                                <input className={styles.input} name="nome" required />
                            </div>
                            <div className={styles.inlineGroup}>
                                <div>
                                    <label>Estado</label>
                                    <input className={styles.input} name="estado" required />
                                </div>
                                <div>
                                    <label>Cidade</label>
                                    <input className={styles.input} name="cidade" required />
                                </div>
                            </div>
                            <div className={styles.inlineGroup}>
                                <div>
                                    <label>Rua</label>
                                    <input className={styles.input} name="rua" required />
                                </div>
                                <div>
                                    <label>Número</label>
                                    <input className={styles.input} name="numero" type="number" required />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Horário de Funcionamento</label>
                                <div className={styles.inlineGroup}>
                                    <div>
                                        <label>Início</label>
                                        <TimePicker
                                            onChange={setHorarioAbertura}
                                            value={horarioAbertura}
                                            disableClock
                                        />
                                    </div>
                                    <div>
                                        <label>Fechamento</label>
                                        <TimePicker
                                            onChange={setHorarioFechamento}
                                            value={horarioFechamento}
                                            disableClock
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Doações Aceitas</label>
                                <div className={styles.doacaoInputContainer}>
                                    <input
                                        className={styles.input}
                                        value={novaDoacao}
                                        onChange={(e) => setNovaDoacao(e.target.value)}
                                        placeholder="Ex: Roupas, Alimentos"
                                    />
                                    <button
                                        type="button"
                                        className={styles.addDoacaoButton}
                                        onClick={handleDoacoesAceitas}
                                    >
                                        Adicionar
                                    </button>
                                </div>
                                <ul className={styles.doacoesList}>
                                    {doacoesAceitas.map((item, index) => (
                                        <li key={index} className={styles.doacaoItem}>
                                            {item}
                                            <button
                                                type="button"
                                                className={styles.removeDoacaoButton}
                                                onClick={() => removeDoacao(item)}
                                            >
                                                Remover
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className={styles.modalButtons}>
                                <button className={styles.submitButton} type="submit">
                                    Cadastrar
                                </button>
                                <button
                                    className={styles.closeButton}
                                    type="button"
                                    onClick={handleCloseModal}
                                >
                                    Fechar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default User;
