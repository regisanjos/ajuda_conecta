import React, { createContext, useState, useEffect } from "react";

export const CatastrofesContext = createContext();

export const CatastrofesProvider = ({ children }) => {
  const [catastrofes, setCatastrofes] = useState([]);

  useEffect(() => {
    const storedCatastrofes = localStorage.getItem("catastrofes");
    if (storedCatastrofes) {
      setCatastrofes(JSON.parse(storedCatastrofes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("catastrofes", JSON.stringify(catastrofes));
  }, [catastrofes]);

  const adicionarCatastrofe = (novaCatastrofe) => {
    setCatastrofes((prevCatastrofes) => [...prevCatastrofes, novaCatastrofe]);
  };

  return (
    <CatastrofesContext.Provider value={{ catastrofes, adicionarCatastrofe }}>
      {children}
    </CatastrofesContext.Provider>
  );
};
