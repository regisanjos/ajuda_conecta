import React, { createContext, useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
export const EntregasContext = createContext();
export const EntregasProvider = ({ children }) => {
  const [entregas, setEntregas] = useState(() => {
    const armazenadas = localStorage.getItem('entregas');
    const parsed = armazenadas ? JSON.parse(armazenadas) : [];
    console.log("Entregas carregadas do localStorage:", parsed);
    return parsed;
  });

  useEffect(() => {
    localStorage.setItem('entregas', JSON.stringify(entregas));
  }, [entregas]);
  const adicionarEntrega = (novaEntrega) => {
    const entregaComId = { ...novaEntrega, id: uuidv4() };
    console.log("Adicionando entrega:", entregaComId);
    setEntregas((prevEntregas) => [...prevEntregas, entregaComId]);
  };
  const removerEntrega = (id) => {
    console.log("Removendo entrega com ID:", id);
    setEntregas((prevEntregas) => prevEntregas.filter(entrega => entrega.id !== id));
  };
  const editarEntrega = (id, entregaAtualizada) => {
    console.log("Editando entrega com ID:", id, "Dados atualizados:", entregaAtualizada);
    setEntregas((prevEntregas) =>
      prevEntregas.map(entrega =>
        entrega.id === id ? { ...entrega, ...entregaAtualizada } : entrega
      )
    );
  };

  return (
    <EntregasContext.Provider value={{ entregas, adicionarEntrega, removerEntrega, editarEntrega }}>
      {children}
    </EntregasContext.Provider>
  );
};
