import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

interface PickupPointMapProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
}

export function PickupPointMap({ lat, lng, onChange }: PickupPointMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const DefaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    const map = L.map(mapContainerRef.current).setView([lat, lng], 13);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
    markerRef.current = marker;

    marker.on('dragend', () => {
      const position = marker.getLatLng();
      onChange(position.lat, position.lng);
    });

    map.on('click', (e) => {
      const { lat: clickLat, lng: clickLng } = e.latlng;
      marker.setLatLng([clickLat, clickLng]);
      onChange(clickLat, clickLng);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && markerRef.current) {
      const currentPos = markerRef.current.getLatLng();
      if (currentPos.lat !== lat || currentPos.lng !== lng) {
        markerRef.current.setLatLng([lat, lng]);
        mapRef.current.panTo([lat, lng]);
      }
    }
  }, [lat, lng]);

  useEffect(() => {
    if (!searchQuery.trim()) return;

    const delayDebounce = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
        );
        const data = await response.json();
        if (data && data.length > 0) {
          const result = data[0];
          const searchLat = parseFloat(result.lat);
          const searchLng = parseFloat(result.lon);
          onChange(searchLat, searchLng);
        }
      } catch (err) {
        // Silencia erros de busca
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, onChange]);

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar endereço no mapa..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-[#C3C6D7] rounded-[12px] text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15 pr-10"
        />
        {isSearching && (
          <div className="absolute right-3 top-2.5">
            <svg className="animate-spin h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}
      </div>
      <div ref={mapContainerRef} className="w-full h-[320px] rounded-[18px] border border-[#C3C6D7]/40 overflow-hidden z-10" />
    </div>
  );
}
