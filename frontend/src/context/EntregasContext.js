import React, { createContext, useState } from "react";

// Criando o contexto
export const EntregasContext = createContext();

// Provider para gerenciar as entregas
export const EntregasProvider = ({ children }) => {
  const [entregas, setEntregas] = useState([]);

  // Função para adicionar uma nova entrega
  const adicionarEntrega = (novaEntrega) => {
    setEntregas((prevEntregas) => [...prevEntregas, novaEntrega]);
  };

  return (
    <EntregasContext.Provider value={{ entregas, adicionarEntrega }}>
      {children}
    </EntregasContext.Provider>
  );
};
