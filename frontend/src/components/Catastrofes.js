import React, { useState, useContext, useEffect } from "react";
import { CatastrofesContext } from "../context/CatastrofesContext"; // Importa o contexto
import styles from "../styles/Catastrofes.module.css";

const Catastrofes = () => {
  const { catastrofes, adicionarCatastrofe } = useContext(CatastrofesContext); // Acessa o contexto
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddCatastrofe = (event) => {
    event.preventDefault();

    const novaCatastrofe = {
      id: `CAT${catastrofes.length + 1}`,
      nome: event.target.nome.value,
      estado: event.target.estado.value,
      cidade: event.target.cidade.value,
      tipo: event.target.tipo.value,
      data: event.target.data.value,
      gravidade: event.target.gravidade.value,
      status: event.target.status.value,
    };

    adicionarCatastrofe(novaCatastrofe); // Adiciona a catástrofe no contexto
    handleCloseModal(); // Fecha o modal
  };

  return (
    <div className={styles.catastrofesContainer}>
      <div className={styles.topBoardContainer}>
        <nav>
          <ul className={styles.navList}>
            <li className={styles.navListItem}>Admin/</li>
            <li className={styles.navListItem}>
              <strong>Catástrofes</strong>
            </li>
          </ul>
        </nav>
        <h1 className={styles.headerTitleCatastrofes}>Catástrofes</h1>
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
          alt="Adicionar Catástrofe"
        />
      </button>
      <div className={styles.listContainer}>
        <h2 className={styles.listTitle}>Lista de Catástrofes</h2>
        <div className={styles.dataHeader}>
          <p className={styles.dataColumn}>ID Catástrofe</p>
          <p className={styles.dataColumn}>Nome</p>
          <p className={styles.dataColumn}>Estado</p>
          <p className={styles.dataColumn}>Cidade</p>
          <p className={styles.dataColumn}>Tipo</p>
          <p className={styles.dataColumn}>Data</p>
          <p className={styles.dataColumn}>Gravidade</p>
          <p className={styles.dataColumn}>Status</p>
        </div>
        {catastrofes.map((catastrofe) => (
          <div key={catastrofe.id} className={styles.dataRow}>
            <p className={styles.dataColumn}>{catastrofe.id}</p>
            <p className={styles.dataColumn}>{catastrofe.nome}</p>
            <p className={styles.dataColumn}>{catastrofe.estado}</p>
            <p className={styles.dataColumn}>{catastrofe.cidade}</p>
            <p className={styles.dataColumn}>{catastrofe.tipo}</p>
            <p className={styles.dataColumn}>{catastrofe.data}</p>
            <p className={styles.dataColumn}>{catastrofe.gravidade}</p>
            <p className={styles.dataColumn}>{catastrofe.status}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <h4 className={styles.modalTitle}>Cadastrar Nova Catástrofe</h4>
            <form onSubmit={handleAddCatastrofe}>
              <label className={styles.label}>Nome</label>
              <input className={styles.input} name="nome" required />

              <label className={styles.label}>Estado</label>
              <input className={styles.input} name="estado" required />

              <label className={styles.label}>Cidade</label>
              <input className={styles.input} name="cidade" required />

              <label className={styles.label}>Tipo</label>
              <select className={styles.inputSelect} name="tipo" required>
                <option value="">Selecione</option>
                <option value="Terremoto">Terremoto</option>
                <option value="Tsunami">Tsunami</option>
                <option value="Furacão">Furacão</option>
                <option value="Ciclone">Ciclone</option>
              </select>

              <label className={styles.label}>Data</label>
              <input
                className={styles.inputDate}
                type="date"
                name="data"
                required
              />

              <label className={styles.label}>Gravidade</label>
              <select className={styles.inputSelect} name="gravidade" required>
                <option value="">Selecione</option>
                <option value="Alta">Alta</option>
                <option value="Moderada">Moderada</option>
                <option value="Baixa">Baixa</option>
              </select>

              <label className={styles.label}>Status</label>
              <select className={styles.inputSelect} name="status" required>
                <option value="">Selecione</option>
                <option value="Aviso Emitido">Aviso Emitido</option>
                <option value="Em Curso">Em Curso</option>
                <option value="Sob Controle">Sob Controle</option>
              </select>

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

export default Catastrofes;
