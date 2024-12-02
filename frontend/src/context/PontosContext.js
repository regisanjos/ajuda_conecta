import React, { createContext, useState, useEffect } from 'react';
export const PontosContext = createContext();
export const PontosProvider = ({ children }) => {
  const [pontos, setPontos] = useState([]);
  useEffect(() => {
    const loadPontos = () => {
      const storedData = localStorage.getItem('pontosColeta');
      const pontosIniciais = storedData ? JSON.parse(storedData) : [];
      setPontos(pontosIniciais);
    };

    loadPontos();
  }, []);
  const addPonto = (novoPonto) => {
    const novosPontos = [...pontos, novoPonto];
    setPontos(novosPontos);
    localStorage.setItem('pontosColeta', JSON.stringify(novosPontos));
  };
  const updatePonto = (id, dadosAtualizados) => {
    const pontosAtualizados = pontos.map((ponto) =>
      ponto.id === id ? { ...ponto, ...dadosAtualizados } : ponto
    );
    setPontos(pontosAtualizados);
    localStorage.setItem('pontosColeta', JSON.stringify(pontosAtualizados));
  };
  const removePonto = (id) => {
    const pontosAtualizados = pontos.filter((ponto) => ponto.id !== id);
    setPontos(pontosAtualizados);
    localStorage.setItem('pontosColeta', JSON.stringify(pontosAtualizados));
  };
  const pontosAtivos = pontos.filter((ponto) => ponto.ativo !== false);

  return (
    <PontosContext.Provider
      value={{
        pontos,
        pontosAtivos,
        addPonto,
        updatePonto,
        removePonto,
      }}
    >
      {children}
    </PontosContext.Provider>
  );
};
