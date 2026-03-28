"use client";

import React, { useMemo } from "react";
import { useCampaign } from "@/store/CampaignStore";
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Dictionary of main SC cities coordinates (Simplified for demo)
const SC_CITIES_COORDS: Record<string, [number, number]> = {
  "florianópolis": [-27.5954, -48.5480],
  "florianopolis": [-27.5954, -48.5480],
  "joinville": [-26.3045, -48.8487],
  "blumenau": [-26.9194, -49.0661],
  "são josé": [-27.6136, -48.6266],
  "sao jose": [-27.6136, -48.6266],
  "criciúma": [-28.6760, -49.3732],
  "criciuma": [-28.6760, -49.3732],
  "chapecó": [-27.1004, -52.6154],
  "chapeco": [-27.1004, -52.6154],
  "itajai": [-26.9078, -48.6619],
  "itajaí": [-26.9078, -48.6619],
  "lages": [-27.8171, -50.3260],
  "jaraguá do sul": [-26.4842, -49.0722],
  "jaragua do sul": [-26.4842, -49.0722],
  "palhoça": [-27.6441, -48.6672],
  "palhoca": [-27.6441, -48.6672],
  "balneário camboriú": [-26.9906, -48.6346],
  "balneario camboriu": [-26.9906, -48.6346],
  "tubarão": [-28.4697, -49.0069],
  "tubarao": [-28.4697, -49.0069],
  "brusque": [-27.0984, -48.9113],
  "são bento do sul": [-26.2497, -49.3789],
  "sao bento do sul": [-26.2497, -49.3789],
};

function ClickableMarker({ city, isActive, hasFilter, onCityClick }: any) {
  return (
    <CircleMarker
      center={city.coords}
      radius={city.radius}
      fillColor={isActive ? "#f97316" : "#009b3a"} // Laranja se ativo, verde se inativo
      color="#ffffff"
      weight={1.5}
      opacity={0.8}
      fillOpacity={hasFilter && !isActive ? 0.3 : 0.6}
      eventHandlers={{
        click: () => onCityClick(city.originalName),
      }}
      className="transition-all duration-300 hover:fillOpacity-100 cursor-pointer marker-pulse"
    >
      <Popup className="rounded-lg shadow-xl border-none">
        <div className="p-1">
          <h4 className="font-bold text-gray-800 text-sm mb-1">{city.originalName.toUpperCase()}</h4>
          <div className="flex items-center gap-2 text-podemos-blue bg-blue-50 px-2 py-1 rounded text-xs font-medium mb-1">
            <span className="font-bold">{city.count.toLocaleString()}</span> eleitores
          </div>
          <p className="text-xs text-gray-400">Clique no círculo para filtrar</p>
        </div>
      </Popup>
    </CircleMarker>
  );
}

// Para fechar qualquer popup aberto quando o filtro muda globalmente (opcional, pode ser complexo no leaflet)
export default function SCMap() {
  const { filteredData, filters, setFilter } = useCampaign();

  const cityData = useMemo(() => {
    // Para o mapa mostrar onde estão os filtros, se eu clicar eu quero manter o mapa da cidade ativo
    // O mapa de calor deve mostrar o que está filtrado agora
    const counts = filteredData.reduce((acc, curr) => {
      const city = curr.cidade ? curr.cidade.trim() : "";
      if (city) {
        acc[city] = (acc[city] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([name, count]) => {
        const key = name.toLowerCase();
        // Fallback random coord near SC center if not in dict (just for visual populated representation)
        // SC Center is approx [-27.27, -50.49]
        let coords = SC_CITIES_COORDS[key];
        if (!coords) {
            // Give a slight jitter around SC center for unknown cities so they don't stack perfectly
            const latJitter = (Math.random() - 0.5) * 2;
            const lngJitter = (Math.random() - 0.5) * 4;
            coords = [-27.27 + latJitter, -50.49 + lngJitter] as [number, number];
        }
        
        return {
          originalName: name,
          name: key,
          count,
          coords,
          // Calculate radius based on count
          radius: Math.max(8, Math.min(30, Math.sqrt(count) * 2))
        };
      })
      .sort((a, b) => b.count - a.count); // Render larger circles first so smaller ones are clickable on top
  }, [filteredData]);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden border border-gray-100 relative z-0" style={{ minHeight: '400px' }}>
      <MapContainer 
        center={[-27.2748, -50.4928]} // Center of Santa Catarina
        zoom={7} 
        style={{ height: '100%', minHeight: '400px', width: '100%', backgroundColor: '#f8fafc' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {cityData.map((city, idx) => {
          const isActive = filters.cidade === city.originalName;
          const hasFilter = filters.cidade !== undefined;
          
          return (
            <ClickableMarker 
              key={`${city.originalName}-${idx}`} 
              city={city} 
              isActive={isActive}
              hasFilter={hasFilter}
              onCityClick={(cityName: string) => setFilter('cidade', cityName)} 
            />
          );
        })}
      </MapContainer>
    </div>
  );
}
