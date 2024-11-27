// src/components/Doacoes.js
import React, { useState, useContext } from "react";
import styles from "../styles/Doacoes.module.css";
import { DoacoesContext } from '../context/DoacoesContext'; // Caminho corrigido

const Doacoes = () => {
  const { doacoes, addDoacao } = useContext(DoacoesContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [novaDoacao, setNovaDoacao] = useState({
    doador: "",
    cpf: "",
    data: "",
    tipo: "",
    local: "",
    destinatario: "",
    status: "",
  });

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNovaDoacao((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addDoacao(novaDoacao); // Usa o contexto para adicionar a doação
    setNovaDoacao({
      doador: "",
      cpf: "",
      data: "",
      tipo: "",
      local: "",
      destinatario: "",
      status: "",
    }); // Reseta o formulário
    handleCloseModal();
  };

  return (
    <div className={styles.doacoesDashboardsContainer}>
      <div className={styles.doacoesTopBoardContainer}>
        <nav>
          <ul className={styles.navList}>
            <li className={styles.navListItem}>Admin/</li>
            <li className={styles.navListItem}>
              <strong>Doações</strong>
            </li>
          </ul>
        </nav>
        <h1 className={styles.headerTitleCatastrofes}>Doações</h1>
      </div>
      <input
        type="text"
        className={styles.searchInput}
        placeholder="Pesquise aqui"
      />
      <button className={styles.addButton} onClick={handleOpenModal}>
        <img
          className={styles.imgButtonCatastrofes}
          src="../img/Add User Male.svg"
          alt="Adicionar Doação"
        />
      </button>

      {/* Lista de doações */}
      <div className={styles.containerDoacoes1}>
        <h2 className={styles.h2Doacoes}>Lista de Doações</h2>
        <div className={styles.doacoesData}>
          <p className={styles.doacoesDataBaseFirst}>ID Doação</p>
          <p className={styles.doacoesDataBase}>Doador</p>
          <p className={styles.doacoesDataBase}>Tipo</p>
          <p className={styles.doacoesDataBase}>Data</p>
          <p className={styles.doacoesDataBase}>Local da Entrega</p>
          <p className={styles.doacoesDataBase}>Destinatário</p>
          <p className={styles.doacoesDataBase}>Status</p>
        </div>
        {/* Renderiza as doações cadastradas */}
        {doacoes.map((doacao, index) => (
          <div key={index} className={styles.doacaoItem}>
            <p className={styles.doacoesDataBaseFirst}>{index + 1}</p>
            <p className={styles.doacoesDataBase}>{doacao.doador}</p>
            <p className={styles.doacoesDataBase}>{doacao.tipo}</p>
            <p className={styles.doacoesDataBase}>{doacao.data}</p>
            <p className={styles.doacoesDataBase}>{doacao.local}</p>
            <p className={styles.doacoesDataBase}>{doacao.destinatario}</p>
            <p className={styles.doacoesDataBase}>{doacao.status}</p>
          </div>
        ))}
      </div>

      {/* Modal de cadastro */}
      {isModalOpen && (
        <div id="overlay" className={styles.overlay}>
          <div id="modal" className={styles.modal}>
            <h4 className={styles.modalTitle}>Cadastrar Nova Doação</h4>
            <form id="doacaoForm" className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="doador" className={styles.label}>
                  Doador
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="doador"
                  name="doador"
                  value={novaDoacao.doador}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formRow}>
                <div>
                  <label htmlFor="cpf" className={styles.label}>
                    CPF
                  </label>
                  <input
                    className={styles.input}
                    type="text"
                    id="cpf"
                    name="cpf"
                    maxLength="14"
                    value={novaDoacao.cpf}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="data" className={styles.label}>
                    Data
                  </label>
                  <input
                    className={styles.inputDate}
                    type="date"
                    id="data"
                    name="data"
                    value={novaDoacao.data}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="tipo" className={styles.label}>
                  Tipo
                </label>
                <select
                  className={styles.inputSelect}
                  id="tipo"
                  name="tipo"
                  value={novaDoacao.tipo}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="alimentos">Alimentos não perecíveis</option>
                  <option value="agua">Água potável</option>
                  <option value="roupas">Roupas e Calçados</option>
                  <option value="higiene">Produtos de Higiene Pessoal</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="local" className={styles.label}>
                  Local da Entrega
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="local"
                  name="local"
                  value={novaDoacao.local}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="destinatario" className={styles.label}>
                  Destinatário
                </label>
                <input
                  className={styles.input}
                  type="text"
                  id="destinatario"
                  name="destinatario"
                  value={novaDoacao.destinatario}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="status" className={styles.label}>
                  Status
                </label>
                <select
                  className={styles.inputSelect}
                  id="status"
                  name="status"
                  value={novaDoacao.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione</option>
                  <option value="pendente">Pendente</option>
                  <option value="entregue">Entregue</option>
                  <option value="a-caminho">A Caminho</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              <div className={styles.formActions}>
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

export default Doacoes;
