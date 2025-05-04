// src/components/Map.tsx
import React, { useEffect, useRef } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat } from "ol/proj";

const OpenLayersMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(), // בסיס OSM - אפשר להחליף ב־XYZ אחר
        }),
      ],
      view: new View({
        center: fromLonLat([35.2137, 31.7683]), // ישראל
        zoom: 7,
      }),
    });

    return () => map.setTarget(undefined); // ניקוי
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "1000px" }} />;
};

export default OpenLayersMap;
