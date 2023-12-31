import React from "react";
import { geoCentroid } from "d3-geo";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Annotation
} from "react-simple-maps";

import allStates from "./states2.json";

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const offsets = {
  VT: [50, -8],
  NH: [34, 2],
  MA: [30, -1],
  RI: [28, 2],
  CT: [35, 10],
  NJ: [34, 1],
  DE: [33, 0],
  MD: [47, 10],
};

// Get easyMode from the props
export const MapChart = ({ guessedStates, easyMode, reveal }) => {
    return (
        <ComposableMap projection="geoAlbersUsa">
            <Geographies geography={geoUrl}>
                {({ geographies }) => (
                    <>
                        {geographies.map(geo => {
                            const cur = allStates.find(s => s.val === geo.id);

                            // Decide the fill color based on guessedStates and reveal
                            let fillColor;
                            if (guessedStates.includes(cur?.id)) {
                                fillColor = "green";
                            } else if (reveal) {
                                fillColor = "red";
                            } else {
                                fillColor = "#DDD";
                            }

                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    stroke="#FFF"
                                    geography={geo}
                                    fill={fillColor}
                                />
                            );
                        })}
                        {geographies.map(geo => {
                            const centroid = geoCentroid(geo);
                            const cur = allStates.find(s => s.val === geo.id);
                            return (
                                <g key={geo.rsmKey + "-name"}>
                                    {cur &&
                                    easyMode &&
                                    centroid[0] > -160 &&
                                    centroid[0] < -67 &&
                                    (Object.keys(offsets).indexOf(cur.id) === -1 ? (
                                        <Marker coordinates={centroid}>
                                            <text y="2" fontSize={14} textAnchor="middle">
                                                {/* If the current state has not been guessed, display the abbreviation */}
                                                {easyMode && !guessedStates.includes(cur.id) && cur.id !== 'DC' && cur.id}
                                            </text>
                                        </Marker>
                                    ) : (
                                        <Annotation
                                            subject={centroid}
                                            dx={offsets[cur.id][0]}
                                            dy={offsets[cur.id][1]}
                                        >
                                            <text x={4} fontSize={14} alignmentBaseline="middle">
                                                {/* If the current state has not been guessed, display the abbreviation */}
                                                {easyMode && !guessedStates.includes(cur.id) && cur.id !== 'DC' && cur.id}
                                            </text>
                                        </Annotation>
                                    ))}
                                </g>
                            );
                        })}
                    </>
                )}
            </Geographies>
        </ComposableMap>
    );
};

export default MapChart;
