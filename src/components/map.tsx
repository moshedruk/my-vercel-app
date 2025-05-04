// src/components/Map.tsx
import React, { useEffect, useRef, useState } from "react";
import "ol/ol.css";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import axios from "axios";

const OpenLayersMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ lat: number; lon: number; elevation?: number } | null>(null);
  console.log(coords)

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([35.2137, 31.7683]), // ירושלים
        zoom: 7,
      }),
    });

    map.on("pointermove", async (evt) => {
      const lonLat = toLonLat(evt.coordinate);
      const [lon, lat] = lonLat;

      try {
        const res = await axios.get(
          `https://api.opentopodata.org/v1/test-dataset?locations=${lat},${lon}`
        );

        const elevation = res.data.results?.[0]?.elevation ?? null;

        setCoords({ lat, lon, elevation });
      } catch (err) {
        console.error("Elevation error:", err);
        setCoords({ lat, lon });
      }
    });

    return () => map.setTarget(undefined);
  }, []);

  return (
    <div>
      <div style={{ height: "500px", width: "100%" }} ref={mapRef} />
      <div style={{ padding: "10px", fontFamily: "monospace" }}>
        {coords ? (
          <div>
            <div>Lat: {coords.lat.toFixed(5)}, Lon: {coords.lon.toFixed(5)}</div>
            <div>Elevation: {coords.elevation !== undefined ? `${coords.elevation} meters` : "..."}</div>
          </div>
        ) : (
          "העבר את העכבר על המפה..."
        )}
      </div>
    </div>
  );
};

export default OpenLayersMap;
