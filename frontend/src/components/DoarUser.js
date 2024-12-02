// src/components/DoarUser.js
import React, { useContext, useState } from "react";
import HeaderUser from "./HeaderUser";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";
import { CatastrofesContext } from "../context/CatastrofesContext";
import styles from "../styles/DoarUser.module.css";
import { cidades } from "../components/cidades";

const brazilGeoUrl =
  "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

const siglasEstados = {
  Acre: "AC",
  Alagoas: "AL",
  Amapá: "AP",
  Amazonas: "AM",
  Bahia: "BA",
  Ceará: "CE",
  "Distrito Federal": "DF",
  "Espírito Santo": "ES",
  Goiás: "GO",
  Maranhão: "MA",
  "Mato Grosso": "MT",
  "Mato Grosso do Sul": "MS",
  "Minas Gerais": "MG",
  Pará: "PA",
  Paraíba: "PB",
  Paraná: "PR",
  Pernambuco: "PE",
  Piauí: "PI",
  "Rio de Janeiro": "RJ",
  "Rio Grande do Norte": "RN",
  "Rio Grande do Sul": "RS",
  Rondônia: "RO",
  Roraima: "RR",
  "Santa Catarina": "SC",
  "São Paulo": "SP",
  Sergipe: "SE",
  Tocantins: "TO",
};

function DoarUser() {
  const { catastrofes } = useContext(CatastrofesContext);
  const [activeMarker, setActiveMarker] = useState(null);

  const pontosColeta = JSON.parse(localStorage.getItem("pontosColeta")) || [];

  const getCityCoordinates = (cityName, stateName) => {
    if (!cidades || !Array.isArray(cidades)) {
      console.error("Cidades data is not available or is not an array.");
      return null;
    }
    const city = cidades.find(
      (c) =>
        c.nome.toLowerCase() === cityName.toLowerCase() &&
        c.estado.toLowerCase() === stateName.toLowerCase()
    );
    if (city) {
      return [city.longitude, city.latitude];
    } else {
      console.warn(
        `Coordinates not found for city: ${cityName}, state: ${stateName}`
      );
      return null;
    }
  };

  const getColorByGravidade = (gravidade) => {
    switch (gravidade) {
      case "Alta":
        return "#FF4D4F";
      case "Moderada":
        return "#FFA500";
      case "Baixa":
        return "#FFFF00";
      default:
        return "#84DA15";
    }
  };

  const gravidadePorEstado = {};
  catastrofes.forEach((catastrofe) => {
    const estado = catastrofe.estado;
    const gravidade = catastrofe.gravidade;
    const niveis = { Baixa: 1, Moderada: 2, Alta: 3 };
    if (
      !gravidadePorEstado[estado] ||
      niveis[gravidade] > niveis[gravidadePorEstado[estado]]
    ) {
      gravidadePorEstado[estado] = gravidade;
    }
  });

  const coletaMarkers = pontosColeta.map((ponto) => {
    const coordinates = getCityCoordinates(ponto.cidade, ponto.estado);
    return {
      uniqueId: `${ponto.nome}-${ponto.cidade}-${ponto.estado}`,
      nome: ponto.nome,
      coordinates: coordinates,
      info: ponto,
    };
  });

  const getStateCentroidPosition = (geo) => {
    const centroid = geoCentroid(geo);
    const estadoNome = geo.properties.name;
    const abbrev = siglasEstados[estadoNome] || estadoNome;
    return { coordinates: centroid, abbrev };
  };

  return (
    <div className={styles.containerDonationUser}>
      <HeaderUser />
      <div className={styles.content}>
        <h1 className={styles.title}>
          Mapa de Catástrofes e Pontos de Coleta
        </h1>
        <div className={styles.mapContainer}>
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              scale: 500,
              center: [-55, -15],
            }}
            width={500}
            height={500}
            style={{ width: "100%", height: "100%" }}
          >
            <ZoomableGroup>
              <Geographies geography={brazilGeoUrl}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const estadoNome = geo.properties.name;
                    const gravidade = gravidadePorEstado[estadoNome];
                    const fillColor = gravidade
                      ? getColorByGravidade(gravidade)
                      : "#D6D6DA";
                    const centroidData = getStateCentroidPosition(geo);

                    return (
                      <g key={geo.rsmKey}>
                        <Geography
                          geography={geo}
                          style={{
                            default: { fill: fillColor, outline: "none" },
                            hover: {
                              fill: "#76C012",
                              outline: "none",
                              cursor: "pointer",
                            },
                            pressed: { fill: "#E42", outline: "none" },
                          }}
                        />
                        {centroidData && (
                          <Marker coordinates={centroidData.coordinates}>
                            <text
                              textAnchor="middle"
                              y={2}
                              className={styles.markerText}
                            >
                              {centroidData.abbrev}
                            </text>
                          </Marker>
                        )}
                      </g>
                    );
                  })
                }
              </Geographies>

              {coletaMarkers.map(
                (marker) =>
                  marker.coordinates && (
                    <Marker
                      key={`ponto-${marker.uniqueId}`}
                      coordinates={marker.coordinates}
                    >
                      <circle
                        r={5}
                        fill="#0000FF"
                        stroke="#fff"
                        strokeWidth={1}
                        onMouseEnter={() => setActiveMarker(marker.uniqueId)}
                        onMouseLeave={() => setActiveMarker(null)}
                        className={`${styles.marker} ${
                          activeMarker === marker.uniqueId ? styles.selected : ""
                        }`}
                        aria-label={`Ponto de coleta: ${marker.nome}`}
                        role="button"
                        tabIndex={0}
                      />
                      {activeMarker === marker.uniqueId && (
                        <g>
                          <foreignObject
                            x={10}
                            y={-50}
                            width={200}
                            height={150}
                            pointerEvents="none"
                          >
                            <div
                              className={`${styles.customTooltip} ${styles.customTooltipVisible}`}
                            >
                              <h2 className={styles.tooltipTitle}>{marker.nome}</h2>
                              <p className={styles.tooltipText}>
                                <strong className={styles.tooltipStrong}>
                                  Endereço:
                                </strong>{" "}
                                {marker.info.rua && marker.info.numero
                                  ? `${marker.info.rua}, ${marker.info.numero} `
                                  : ""}
                                {marker.info.cidade} -{" "}
                                {siglasEstados[marker.info.estado] ||
                                  marker.info.estado}
                              </p>
                              <p className={styles.tooltipText}>
                                <strong className={styles.tooltipStrong}>
                                  Horário:
                                </strong>{" "}
                                {marker.info.horario}
                              </p>
                              <p className={styles.tooltipText}>
                                <strong className={styles.tooltipStrong}>
                                  Doações:
                                </strong>{" "}
                                {marker.info.doacoes.join(", ")}
                              </p>
                            </div>
                          </foreignObject>
                        </g>
                      )}
                    </Marker>
                  )
              )}
            </ZoomableGroup>
          </ComposableMap>
        </div>
      </div>
    </div>
  );
}

export default DoarUser;
