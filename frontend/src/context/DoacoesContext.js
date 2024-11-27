
import React, { createContext, useState, useEffect } from 'react';

export const DoacoesContext = createContext();

export const DoacoesProvider = ({ children }) => {
    const [doacoes, setDoacoes] = useState([]);

    useEffect(() => {
        const storedDoacoes = localStorage.getItem('doacoes');
        if (storedDoacoes) {
            setDoacoes(JSON.parse(storedDoacoes));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('doacoes', JSON.stringify(doacoes));
    }, [doacoes]);

    const addDoacao = (novaDoacao) => {
        setDoacoes((prevDoacoes) => [...prevDoacoes, novaDoacao]);
    };

    return (
        <DoacoesContext.Provider value={{ doacoes, addDoacao }}>
            {children}
        </DoacoesContext.Provider>
    );
};
