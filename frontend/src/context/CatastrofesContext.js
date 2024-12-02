import React, { createContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const CatastrofesContext = createContext();

export const CatastrofesProvider = ({ children }) => {
    const [catastrofes, setCatastrofes] = useState(() => {
        const savedCatastrofes = localStorage.getItem("catastrofes");
        return savedCatastrofes ? JSON.parse(savedCatastrofes) : [];
    });
    useEffect(() => {
        localStorage.setItem("catastrofes", JSON.stringify(catastrofes));
    }, [catastrofes]);
    useEffect(() => {
        console.log("Catástrofes no Contexto:", catastrofes);
    }, [catastrofes]);
    const adicionarCatastrofe = (catastrofe) => {
        const novaCatastrofe = {
            ...catastrofe,
            id: uuidv4(),
        };
        setCatastrofes(prevCatastrofes => [...prevCatastrofes, novaCatastrofe]);
    };
    const removerCatastrofe = (id) => {
        setCatastrofes(prevCatastrofes => prevCatastrofes.filter(catastrofe => catastrofe.id !== id));
    };
    const atualizarCatastrofe = (id, novosDados) => {
        setCatastrofes(prevCatastrofes =>
            prevCatastrofes.map(catastrofe =>
                catastrofe.id === id ? { ...catastrofe, ...novosDados } : catastrofe
            )
        );
    };

    return (
        <CatastrofesContext.Provider value={{ catastrofes, adicionarCatastrofe, removerCatastrofe, atualizarCatastrofe }}>
            {children}
        </CatastrofesContext.Provider>
    );
};
