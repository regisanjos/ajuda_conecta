import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell,
} from 'recharts';
import styles from '../styles/Dashboard.module.css';

import PontosColeta from './PontosColeta';
import Catastrofes from './Catastrofes';
import Doacoes from './Doacoes';
import Entregas from './Entregas';

import { DoacoesContext } from '../context/DoacoesContext';
import { EntregasContext } from '../context/EntregasContext';
import { PontosContext } from '../context/PontosContext';

function Dashboard() {
    const [activeTab, setActiveTab] = useState('Dashboard');
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const navigate = useNavigate();

    const { doacoes } = useContext(DoacoesContext);

    const { entregas } = useContext(EntregasContext);

    const { pontos, pontosAtivos } = useContext(PontosContext);

    const totalPontos = pontos.length;
    const totalPontosAtivos = pontosAtivos.length;

    const [doacaoFilter, setDoacaoFilter] = useState('Semanal');

    const [dynamicDoacaoData, setDynamicDoacaoData] = useState([]);

    const [entregaFilter, setEntregaFilter] = useState('Semanal');
    const [filteredEntregas, setFilteredEntregas] = useState([]);

    const handleDoacaoFilterChange = (event) => {
        setDoacaoFilter(event.target.value);
    };

    const handleEntregaFilterChange = (event) => {
        setEntregaFilter(event.target.value);
    };

    const aggregateDoacoes = () => {
        const now = new Date();
        let filteredDoacoes = [];

        let startDate = new Date();
        switch (doacaoFilter) {
            case 'Diário':
                startDate.setDate(now.getDate() - 6); // Últimos 7 dias
                break;
            case 'Semanal':
                startDate.setDate(now.getDate() - 27); // Últimas 4 semanas
                break;
            case 'Mensal':
                startDate.setMonth(now.getMonth() - 5); // Últimos 6 meses
                break;
            case 'Trimestral':
                startDate.setMonth(now.getMonth() - 11); // Últimos 12 meses
                break;
            case 'Semestral':
                startDate.setFullYear(now.getFullYear() - 1); // Últimos 2 anos
                break;
            case 'Anual':
                startDate.setFullYear(now.getFullYear() - 5); // Últimos 5 anos
                break;
            default:
                startDate = new Date(0);
        }

        filteredDoacoes = doacoes.filter((doacao) => {
            const doacaoDate = new Date(doacao.data);
            return doacaoDate >= startDate && doacaoDate <= now;
        });

        let aggregation = {};

        filteredDoacoes.forEach((doacao) => {
            const doacaoDate = new Date(doacao.data);
            let key = '';

            switch (doacaoFilter) {
                case 'Diário':
                    key = doacaoDate.toLocaleDateString('pt-BR', { weekday: 'short' });
                    break;
                case 'Semanal':
                    const weekNumber = getWeekNumber(doacaoDate);
                    key = `Semana ${weekNumber}`;
                    break;
                case 'Mensal':
                    key = doacaoDate.toLocaleString('default', { month: 'short' });
                    break;
                case 'Trimestral':
                    const quarter = Math.floor(doacaoDate.getMonth() / 3) + 1;
                    key = `Q${quarter} ${doacaoDate.getFullYear()}`;
                    break;
                case 'Semestral':
                    const half = doacaoDate.getMonth() < 6 ? 'H1' : 'H2';
                    key = `${half} ${doacaoDate.getFullYear()}`;
                    break;
                case 'Anual':
                    key = `${doacaoDate.getFullYear()}`;
                    break;
                default:
                    key = 'All';
            }

            if (aggregation[key]) {
                aggregation[key] += 1;
            } else {
                aggregation[key] = 1;
            }
        });

        const aggregatedData = Object.keys(aggregation).map((key) => ({
            name: key,
            doacoes: aggregation[key],
        }));

        aggregatedData.sort((a, b) => {
            return a.name.localeCompare(b.name, 'pt-BR', { numeric: true });
        });

        setDynamicDoacaoData(aggregatedData);
    };

    const getWeekNumber = (date) => {
        const firstJan = new Date(date.getFullYear(), 0, 1);
        const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
        return Math.ceil((date.getDay() + 1 + days) / 7);
    };

    const filterEntregas = () => {
        const now = new Date();
        let startDate = new Date();

        switch (entregaFilter) {
            case 'Diário':
                startDate.setDate(now.getDate() - 6); // Últimos 7 dias
                break;
            case 'Semanal':
                startDate.setDate(now.getDate() - 27); // Últimas 4 semanas
                break;
            case 'Mensal':
                startDate.setMonth(now.getMonth() - 5); // Últimos 6 meses
                break;
            case 'Trimestral':
                startDate.setMonth(now.getMonth() - 11); // Últimos 12 meses
                break;
            case 'Semestral':
                startDate.setFullYear(now.getFullYear() - 1); // Últimos 2 anos
                break;
            case 'Anual':
                startDate.setFullYear(now.getFullYear() - 5); // Últimos 5 anos
                break;
            default:
                startDate = new Date(0);
        }

        const filtered = entregas.filter((entrega) => {
            const entregaDate = new Date(entrega.data);
            return entregaDate >= startDate && entregaDate <= now;
        });

        const aggregatedData = filtered.reduce((acc, entrega) => {
            const dateKey = entrega.data.split('T')[0];
            acc[dateKey] = acc[dateKey] ? acc[dateKey] + 1 : 1;
            return acc;
        }, {});

        const aggregatedEntregas = Object.keys(aggregatedData).map((key) => ({
            name: key,
            entregas: aggregatedData[key],
        }));

        setFilteredEntregas(aggregatedEntregas);
    };

    useEffect(() => {
        aggregateDoacoes();
    }, [doacoes, doacaoFilter]);

    useEffect(() => {
        filterEntregas();
    }, [entregas, entregaFilter]);

    const handleLogout = () => {
        setIsLoggingOut(true);
        setTimeout(() => {
            navigate('/');
        }, 1500);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'Usuarios':
                return <PontosColeta />;
            case 'Catastrofes':
                return <Catastrofes />;
            case 'Doacoes':
                return <Doacoes />;
            case 'Entregas':
                return <Entregas />;
            default:
                return null;
        }
    };

    const renderEntregasDetalhadas = () => {
        return (
            <div className={styles['dashboard-containerVisoesDetalhadas']} >
                <p className={styles['dashboard-sectionLabel5']}>Visões Detalhadas</p>
                <h2 className={styles['dashboard-sectionTitle2']}>Entregas</h2>
                <div className={styles['dashboard-containerOptions']} >
                    <p className={styles['dashboard-optionLabel']}>Código de Rastreio</p>
                    <p className={styles['dashboard-optionLabel']}>Doador</p>
                    <p className={styles['dashboard-optionLabel']}>CEP Doador</p>
                    <p className={styles['dashboard-optionLabel']}>CEP Destinatário</p>
                    <p className={styles['dashboard-optionLabel']}>Item</p>
                    <p className={styles['dashboard-optionLabel']}>Data</p>
                    <p className={styles['dashboard-optionLabel']}>Status</p>
                </div>
                <div className={styles['dashboard-line']}></div>

                {/* Lista de Entregas */}
                <div className={styles['dashboard-entregasList']}>
                    {entregas.length === 0 ? (
                        <p className={styles['dashboard-noEntregas']}>Nenhuma entrega cadastrada.</p>
                    ) : (
                        entregas.map((entrega) => (
                            <div key={entrega.id} className={styles['dashboard-entregaItem']}>
                                <p className={styles['dashboard-entregaField']}>{entrega.id}</p>
                                <p className={styles['dashboard-entregaField']}>{entrega.cpf}</p>
                                <p className={styles['dashboard-entregaField']}>{entrega.cepDoador}</p>
                                <p className={styles['dashboard-entregaField']}>{entrega.cepDestinatario}</p>
                                <p className={styles['dashboard-entregaField']}>{entrega.itens}</p>
                                <p className={styles['dashboard-entregaField']}>{entrega.data}</p>
                                <p className={styles['dashboard-entregaField']}>{entrega.status}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        );
    };

    if (isLoggingOut) {
        return <div style={{ backgroundColor: 'white', height: '100vh', width: '100vw' }}></div>;
    }

    return (
        <div className={styles['dashboard-container']}>
            {/* Barra lateral */}
            <div className={styles['dashboard-navBarContainer']}>
                <div className={styles['dashboard-logo']}>
                    <img className={styles.dashboardLogoImg} src='img/Group.png' alt="Logo" />
                </div>
                <div className={styles['dashboard-dashboardLine']}></div>

                <div
                    className={`${styles['dashboard-tab']} ${activeTab === 'Dashboard' ? styles['activeTab'] : ''}`}
                    onClick={() => setActiveTab('Dashboard')}
                >
                    <div id="dashboardNav" className={styles['dashboard-containerIcon']} >
                        <img className={styles['dashboard-nav']} src="../img/Performance Macbook.svg" alt="Dashboard" />
                        <p className={styles['dashboard-navText']}>Dashboard</p>
                    </div>
                </div>

                <div
                    className={`${styles['dashboard-tab']} ${activeTab === 'Usuarios' ? styles['activeTab'] : ''}`}
                    onClick={() => setActiveTab('Usuarios')}
                >
                    <div id="userNav" className={styles['dashboard-containerIcon']} >
                        <img className={styles['dashboard-nav']} src="../img/Ponto-nav.png" alt="Pontos de coleta" />
                        <p className={styles['dashboard-navText']}>Pontos de coleta</p>
                    </div>
                </div>

                <div
                    className={`${styles['dashboard-tab']} ${activeTab === 'Catastrofes' ? styles['activeTab'] : ''}`}
                    onClick={() => setActiveTab('Catastrofes')}
                >
                    <div className={styles['dashboard-containerIcon']} >
                        <img className={styles['dashboard-nav']} src="../img/Tornado.svg" alt="Catástrofes" />
                        <p className={styles['dashboard-navText']}>Catástrofes</p>
                    </div>
                </div>

                <div
                    className={`${styles['dashboard-tab']} ${activeTab === 'Doacoes' ? styles['activeTab'] : ''}`}
                    onClick={() => setActiveTab('Doacoes')}
                >
                    <div className={styles['dashboard-containerIcon']} >
                        <img className={styles['dashboard-nav']} src="../img/Successful Delivery.svg" alt="Doações" />
                        <p className={styles['dashboard-navText']}>Doações</p>
                    </div>
                </div>

                <div
                    className={`${styles['dashboard-tab']} ${activeTab === 'Entregas' ? styles['activeTab'] : ''}`}
                    onClick={() => setActiveTab('Entregas')}
                >
                    <div className={styles['dashboard-containerIcon']} >
                        <img className={styles['dashboard-nav']} src="../img/Truck-nav.svg" alt="Entregas" />
                        <p className={styles['dashboard-navText']}>Entregas</p>
                    </div>
                </div>

                <p className={styles['dashboard-pagesTitle']}>Páginas</p>
                <div className={styles['dashboard-containerWhiteLogout']} onClick={handleLogout}>
                    <div className={styles['dashboard-containerIcon']} >
                        <img className={styles['dashboard-nav']} src="../img/Logout.svg" alt="Sair" />
                        <p className={styles['dashboard-navText']}>Sair</p>
                    </div>
                </div>
            </div>

            <div className={styles['dashboard-dashboardsContainer']}>
                {activeTab === 'Dashboard' ? (
                    <>
                        <div className={styles['dashboard-topBoardContainer']}>
                            <nav className={styles['dashboard-navContainer']}>
                                <div className={styles['dashboard-navList']}>
                                    <p className={styles['dashboard-navItem1']}><a className={styles['dashboard-navLink']}>Admin/</a></p>
                                    <p className={styles['dashboard-navItem2']}><strong><a className={styles['dashboard-navLink']}>Dashboards</a></strong></p>
                                </div>
                            </nav>
                            <h1 className={styles['dashboard-title']}>Dashboards</h1>
                        </div>
                        <input type="text" placeholder="Pesquise aqui" className={styles['dashboard-searchInput']} />
                        <Link to="/doar-user" className={styles['dashboard-button']}> MAPA USUÁRIO</Link>

                        <div className={styles['dashboard-donationTodayContainer']}>
                            <p className={styles['dashboard-todayLabel']}>Doações Hoje</p>
                            <div className={styles['dashboard-todayContainer']}>
                                <img className={styles['dashboard-today']} src="../img/Successful Delivery.svg" alt="Doações Hoje" />
                                <h3 className={styles['dashboard-todayText']}>0</h3>
                            </div>
                        </div>
                        <div className={styles['dashboard-usersTodayContainer']}>
                            <p className={styles['dashboard-todayLabel']}>Pontos Hoje</p>
                            <div className={styles['dashboard-todayContainer']}>
                                <img className={styles['dashboard-today']} src="../img/Ponto-nav.png" alt="Pontos Hoje" />
                                <h3 className={styles['dashboard-todayText']}>0</h3>
                            </div>
                        </div>
                        <div className={styles['dashboard-deliveryTodayContainer']}>
                            <p className={styles['dashboard-todayLabel']}>Entregas Hoje</p>
                            <div className={styles['dashboard-todayContainer']}>
                                <img className={styles['dashboard-today']} src="../img/Truck-nav.svg" alt="Entregas Hoje" />
                                <h3 className={styles['dashboard-todayText']}>0</h3>
                            </div>
                        </div>

                        <div className={styles['dashboard-dashboardDelivery']}>
                            <p className={styles['dashboard-sectionLabel1']}>Visões Gerais</p>
                            <p className={styles['dashboard-sectionLabel2']}>Filtro</p>
                            <h2 className={styles['dashboard-sectionTitle']}>Entregas</h2>
                            <select
                                className={styles['dashboard-filtroDelivery']}
                                value={entregaFilter}
                                onChange={handleEntregaFilterChange}
                            >
                                <option>Diário</option>
                                <option>Semanal</option>
                                <option>Mensal</option>
                                <option>Trimestral</option>
                                <option>Semestral</option>
                                <option>Anual</option>
                            </select>
                            <ResponsiveContainer width="100%" height={210}>
                                <BarChart
                                    data={filteredEntregas}
                                    margin={{ top: -30, right: 30, left: 20, bottom: 5 }}
                                >
                                    <defs>
                                        <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#4CAF50" stopOpacity={0.8} />
                                            <stop offset="100%" stopColor="#8BC34A" stopOpacity={0.6} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: "#333", fontSize: 12 }}
                                        axisLine={{ stroke: "#ccc" }}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        tick={{ fill: "#333", fontSize: 12 }}
                                        axisLine={{ stroke: "#ccc" }}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        wrapperStyle={{ backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "5px" }}
                                        contentStyle={{ fontSize: "14px", color: "#333" }}
                                        cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                                    />
                                    <Legend
                                        verticalAlign="top"
                                        height={36}
                                        wrapperStyle={{ color: "#555", fontSize: "14px" }}
                                    />
                                    <Bar
                                        dataKey="entregas"
                                        fill="url(#colorGreen)"
                                        barSize={50}
                                        radius={[10, 10, 0, 0]}
                                    >
                                        {filteredEntregas.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={`rgba(76, 175, 80, ${0.7 + index * 0.1})`}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className={styles['dashboard-catastrofesContainer']}>
                            <h2 className={styles['dashboard-sectionTitle']}>Catástrofes</h2>
                        </div>

                        <div className={styles['dashboard-usersContainer']}>
                            <div className={styles['dashboard-usersGraficoContainer']}></div>
                            <p className={styles['dashboard-usersLabel1']}>Pontos Ativos</p>
                            <h3 className={styles['dashboard-usersText1']}>{totalPontosAtivos}</h3>
                            <p className={styles['dashboard-usersLabel2']}>Pontos Totais</p>
                            <h3 className={styles['dashboard-usersText2']}>{totalPontos}</h3>
                            <p className={styles['dashboard-usersLabel']}>Filtro</p>
                            <select className={styles['dashboard-usersFiltro']}>
                                <option>Diário</option>
                                <option>Semanal</option>
                                <option>Mensal</option>
                                <option>Trimestral</option>
                                <option>Semestral</option>
                                <option>Anual</option>
                            </select>
                        </div>
                        <div className={styles['dashboard-containerDoacoesDashboard']}>
                            <p className={styles['dashboard-sectionLabel4']}>Visões Gerais</p>
                            <h2 className={styles['dashboard-sectionTitle']}>Doações</h2>
                            <p className={styles['dashboard-sectionLabel3']}>Filtro</p>
                            <select
                                className={styles['dashboard-donationsFiltro']}
                                value={doacaoFilter}
                                onChange={handleDoacaoFilterChange}
                            >
                                <option>Diário</option>
                                <option>Semanal</option>
                                <option>Mensal</option>
                                <option>Trimestral</option>
                                <option>Semestral</option>
                                <option>Anual</option>
                            </select>
                            <ResponsiveContainer width="85%" height={400}>
                                <BarChart
                                    data={dynamicDoacaoData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                                >
                                    <defs>
                                        <linearGradient id="colorGreenDonations" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#4CAF50" stopOpacity={0.8} />
                                            <stop offset="100%" stopColor="#8BC34A" stopOpacity={0.6} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: "#333", fontSize: 12 }}
                                        axisLine={{ stroke: "#ccc" }}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        tick={{ fill: "#333", fontSize: 12 }}
                                        axisLine={{ stroke: "#ccc" }}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        wrapperStyle={{ backgroundColor: "#fff", border: "1px solid #ccc", borderRadius: "5px" }}
                                        contentStyle={{ fontSize: "14px", color: "#333" }}
                                        cursor={{ fill: "rgba(0, 0, 0, 0.1)" }}
                                    />
                                    <Legend
                                        verticalAlign="top"
                                        height={36}
                                        wrapperStyle={{ color: "#555", fontSize: "14px" }}
                                    />
                                    <Bar
                                        dataKey="doacoes"
                                        fill="url(#colorGreenDonations)"
                                        barSize={50}
                                        radius={[10, 10, 0, 0]}
                                    >
                                        {dynamicDoacaoData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={`rgba(76, 175, 80, ${0.7 + index * 0.1})`}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className={styles['dashboard-containerFastView']}>
                            <div
                                className={styles['dashboard-containerIcons']}
                                onClick={() => setActiveTab('Usuarios')}
                                style={{ cursor: 'pointer' }}
                            >
                                <img className={styles['dashboard-userIcon']} src="../img/Ponto-nav.png" alt="Pontos" />
                            </div>
                            <div
                                className={styles['dashboard-containerIcons']}
                                onClick={() => setActiveTab('Catastrofes')}
                                style={{ cursor: 'pointer' }}
                            >
                                <img className={styles['dashboard-userIcon']} src="../img/Tornado.svg" alt="Catástrofes" />
                            </div>
                            <div
                                className={styles['dashboard-containerIcons']}
                                onClick={() => setActiveTab('Doacoes')}
                                style={{ cursor: 'pointer' }}
                            >
                                <img className={styles['dashboard-userIcon']} src="../img/Successful Delivery.svg" alt="Doações" />
                            </div>
                            <div
                                className={styles['dashboard-containerIcons']}
                                onClick={() => setActiveTab('Entregas')}
                                style={{ cursor: 'pointer' }}
                            >
                                <img className={styles['dashboard-userIcon']} src="../img/Truck-nav.svg" alt="Entregas" />
                            </div>
                        </div>
                        {renderEntregasDetalhadas()}
                    </>
                ) : (
                    renderTabContent()
                )}
            </div>
        </div>
    );

}

export default Dashboard;
