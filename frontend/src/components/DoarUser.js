import React from "react";
import HeaderUser from "./HeaderUser";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import styles from "../styles/DoarUser.module.css";

const brazilGeoUrl =
  "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson";

function DoarUser() {
  const handleStateClick = (stateName) => {
  };

  return (
    <div className={styles.container}>
      <HeaderUser />
      <div className={styles.content}>
        <h1 className={styles.title}>Selecione um estado para doar</h1>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            scale: 500, // Ajusta o tamanho do mapa
            center: [-55, -25], // Mantém o mapa centralizado
          }}
        >
          <Geographies geography={brazilGeoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={() => handleStateClick(geo.properties.name)}
                  style={{
                    default: {
                      fill: "#84DA15", // Cor verde para todos os estados
                      outline: "none",
                    },
                    hover: {
                      fill: "#76C012", // Cor verde mais escura ao passar o mouse
                      outline: "none",
                      cursor: "pointer",
                    },
                    pressed: {
                      fill: "#E42", // Cor verde mais intensa ao clicar
                      outline: "none",
                    },
                  }}
                />
              ))
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
}

export default DoarUser;
