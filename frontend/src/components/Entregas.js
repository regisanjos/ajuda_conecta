import React, { useState, useContext } from "react";
import { EntregasContext } from "../context/EntregasContext";
import styles from "../styles/Entregas.module.css";

function Entregas() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [novaEntrega, setNovaEntrega] = useState({
    id: "",
    cpf: "",
    cepDoador: "",
    cepDestinatario: "",
    itens: "",
    lote: "",
    data: "",
    status: "Pendente",
  });

  const { entregas, adicionarEntrega } = useContext(EntregasContext);

  const handleAddClick = () => {
    setIsRegistering(true);
  };

  const handleCloseForm = () => {
    setIsRegistering(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNovaEntrega((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    adicionarEntrega(novaEntrega); // Adiciona a nova entrega ao contexto
    setNovaEntrega({
      id: "",
      cpf: "",
      cepDoador: "",
      cepDestinatario: "",
      itens: "",
      lote: "",
      data: "",
      status: "Pendente",
    });
    setIsRegistering(false);
  };

  return (
    <div className={styles.entregasContainer}>
      <div className={styles.entregasTopBoardContainer}>
        <nav>
          <ul className={styles.entregasNavList}>
            <li className={styles.entregasNavListItem}>Admin/</li>
            <li className={styles.entregasNavListItem}>
              <strong>Entregas</strong>
            </li>
          </ul>
        </nav>
        <h1 className={styles.entregasHeaderTitle}>Entregas</h1>
      </div>
      <input
        type="text"
        className={styles.entregasSearchInput}
        placeholder="Pesquise aqui"
      />
      <button className={styles.entregasAddButton} onClick={handleAddClick}>
        <img
          className={styles.entregasImgButton}
          src="../img/Add User Male.svg"
          alt="Adicionar Entrega"
        />
      </button>

      {/* Lista de Entregas */}
      <div className={styles.entregasListContainer}>
        <h2 className={styles.entregasListTitle}>Lista de Entregas</h2>
        <div className={styles.entregasDataHeader}>
          <p className={styles.entregasDataColumn}>ID</p>
          <p className={styles.entregasDataColumn}>CPF</p>
          <p className={styles.entregasDataColumn}>CEP Doador</p>
          <p className={styles.entregasDataColumn}>CEP Destinatário</p>
          <p className={styles.entregasDataColumn}>Itens</p>
          <p className={styles.entregasDataColumn}>Lote</p>
          <p className={styles.entregasDataColumn}>Data</p>
          <p className={styles.entregasDataColumn}>Status</p>
        </div>
        {/* Renderiza as entregas cadastradas */}
        {entregas.map((entrega, index) => (
          <div key={index} className={styles.entregasDataRow}>
            <p className={styles.entregasDataColumn}>{entrega.id}</p>
            <p className={styles.entregasDataColumn}>{entrega.cpf}</p>
            <p className={styles.entregasDataColumn}>{entrega.cepDoador}</p>
            <p className={styles.entregasDataColumn}>{entrega.cepDestinatario}</p>
            <p className={styles.entregasDataColumn}>{entrega.itens}</p>
            <p className={styles.entregasDataColumn}>{entrega.lote}</p>
            <p className={styles.entregasDataColumn}>{entrega.data}</p>
            <p className={styles.entregasDataColumn}>{entrega.status}</p>
          </div>
        ))}
      </div>

      {/* Modal de Cadastro */}
      {isRegistering && (
        <div className={styles.entregasModal}>
          <div className={styles.entregasModalContent}>
            <h2>Cadastrar Nova Entrega</h2>
            <form onSubmit={handleSave}>
              <div className={styles.entregasFormGroup}>
                <label>ID Entrega:</label>
                <input
                  type="text"
                  name="id"
                  value={novaEntrega.id}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.entregasFormGroup}>
                <label>CEP Doador:</label>
                <input
                  type="text"
                  name="cepDoador"
                  value={novaEntrega.cepDoador}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.entregasFormGroup}>
                <label>CEP Destinatário:</label>
                <input
                  type="text"
                  name="cepDestinatario"
                  value={novaEntrega.cepDestinatario}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.entregasFormGroup}>
                <label>Itens:</label>
                <input
                  type="text"
                  name="itens"
                  value={novaEntrega.itens}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.entregasFormGroup}>
                <label>Lote:</label>
                <input
                  type="text"
                  name="lote"
                  value={novaEntrega.lote}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.entregasInlineGroup}>
                <div className={styles.entregasFormGroupInline}>
                  <label>CPF Doador:</label>
                  <input
                    type="text"
                    name="cpf"
                    value={novaEntrega.cpf}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className={styles.entregasFormGroupInline}>
                  <label>Data de Entrega:</label>
                  <input
                    type="date"
                    name="data"
                    value={novaEntrega.data}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.entregasFormGroup}>
                <label>Status:</label>
                <select
                  name="status"
                  value={novaEntrega.status}
                  onChange={handleChange}
                  required
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Entregue">Entregue</option>
                </select>
              </div>
              <div className={styles.entregasModalButtons}>
                <button type="submit" className={styles.entregasSaveButton}>
                  Salvar
                </button>
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className={styles.entregasCancelButton}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Entregas;
