import React, { useEffect, useState } from 'react';
import { APIProvider, Map, Marker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

interface PickupPointMapProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
  onNameSuggestion?: (name: string) => void;
}

const boundsBrazil = {
  north: 5.27,
  south: -33.75,
  west: -73.99,
  east: -28.85
};

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#1f2937' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1f2937' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#9ca3af' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3f4f6' }]
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#e5e7eb' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#111827' }]
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#10b981' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#374151' }]
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#111827' }]
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca3af' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#4b5563' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2937' }]
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f59e0b' }]
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0f172a' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#4b5563' }]
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#0f172a' }]
  }
];

function PickupPointMapContent({ lat, lng, onChange, onNameSuggestion }: PickupPointMapProps) {
  const map = useMap();
  const placesLibrary = useMapsLibrary('places');
  const geocodingLibrary = useMapsLibrary('geocoding');

  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (!placesLibrary) return;
    setAutocompleteService(new placesLibrary.AutocompleteService());
  }, [placesLibrary]);

  useEffect(() => {
    if (!geocodingLibrary) return;
    setGeocoder(new geocodingLibrary.Geocoder());
  }, [geocodingLibrary]);

  useEffect(() => {
    if (!searchQuery.trim() || !autocompleteService) {
      setPredictions([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      setIsSearching(true);
      autocompleteService.getPlacePredictions(
        {
          input: searchQuery,
          componentRestrictions: { country: 'BR' },
        },
        (results, status) => {
          if (status === 'OK' && results) {
            setPredictions(results.slice(0, 5));
          } else {
            setPredictions([]);
          }
          setIsSearching(false);
        }
      );
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, autocompleteService]);

  const performReverseGeocode = (latitude: number, longitude: number) => {
    if (!geocoder) return;
    geocoder.geocode(
      { location: { lat: latitude, lng: longitude } },
      (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const result = results[0];
          const addressComponents = result.address_components;
          const route = addressComponents.find(c => c.types.includes('route'))?.long_name;
          const number = addressComponents.find(c => c.types.includes('street_number'))?.long_name;
          const establishment = addressComponents.find(c => c.types.includes('establishment') || c.types.includes('point_of_interest'))?.long_name;

          let name = '';
          if (establishment) {
            name = establishment;
          } else if (route) {
            name = route + (number ? `, ${number}` : '');
          } else {
            name = result.formatted_address;
          }

          if (onNameSuggestion && name) {
            onNameSuggestion(name);
          }
        }
      }
    );
  };

  const handlePredictionSelect = (prediction: google.maps.places.AutocompletePrediction) => {
    if (!geocoder) return;

    setIsSearching(true);
    geocoder.geocode({ placeId: prediction.place_id }, (results, status) => {
      setIsSearching(false);
      if (status === 'OK' && results && results[0]) {
        const result = results[0];
        const nextLat = result.geometry.location.lat();
        const nextLng = result.geometry.location.lng();

        onChange(nextLat, nextLng);

        const mainText = prediction.structured_formatting.main_text || prediction.description;
        if (onNameSuggestion && mainText) {
          onNameSuggestion(mainText);
        }

        setSearchQuery(prediction.description);
        setShowDropdown(false);

        if (map) {
          map.panTo({ lat: nextLat, lng: nextLng });
          map.setZoom(15);
        }
      }
    });
  };

  const handleMapClick = (e: any) => {
    const latLng = e.detail?.latLng || e.latLng;
    if (latLng) {
      const nextLat = typeof latLng.lat === 'function' ? latLng.lat() : latLng.lat;
      const nextLng = typeof latLng.lng === 'function' ? latLng.lng() : latLng.lng;
      onChange(nextLat, nextLng);
      performReverseGeocode(nextLat, nextLng);
    }
  };

  const handleDragEnd = (e: any) => {
    const latLng = e.latLng;
    if (latLng) {
      const nextLat = latLng.lat();
      const nextLng = latLng.lng();
      onChange(nextLat, nextLng);
      performReverseGeocode(nextLat, nextLng);
    }
  };

  const center = lat && lng ? { lat, lng } : { lat: -10.9472, lng: -37.0731 };
  const zoom = lat && lng ? 15 : 9;

  return (
    <div className="flex flex-col gap-3 w-full relative">
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar endereço no mapa..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 250)}
          className="w-full px-4 py-2.5 border border-[#C3C6D7] rounded-[12px] text-sm outline-none focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/15 pr-10 bg-white text-[#131B2E]"
        />
        {isSearching && (
          <div className="absolute right-3 top-3">
            <svg className="animate-spin h-5 w-5 text-[#2563EB]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}

        {showDropdown && predictions.length > 0 && (
          <ul className="absolute left-0 right-0 mt-1 bg-white border border-[#C3C6D7]/40 rounded-[12px] shadow-lg max-h-60 overflow-y-auto z-[9999] py-1.5">
            {predictions.map((prediction) => (
              <li
                key={prediction.place_id}
                onMouseDown={() => handlePredictionSelect(prediction)}
                className="px-4 py-2 hover:bg-[#F0F4FF] cursor-pointer text-sm text-[#131B2E] transition-colors duration-150 flex flex-col gap-0.5"
              >
                <span className="font-semibold">{prediction.structured_formatting.main_text}</span>
                <span className="text-xs text-[#6B7280]">{prediction.structured_formatting.secondary_text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="w-full h-[320px] rounded-[18px] border border-[#C3C6D7]/40 overflow-hidden z-10">
        <Map
          defaultCenter={center}
          defaultZoom={zoom}
          gestureHandling="cooperative"
          disableDefaultUI={true}
          restriction={{
            latLngBounds: boundsBrazil,
            strictBounds: true
          }}
          onClick={handleMapClick}
          styles={darkMapStyle}
        >
          <Marker
            position={center}
            draggable={true}
            onDragEnd={handleDragEnd}
          />
        </Map>
      </div>
    </div>
  );
}

export function PickupPointMap(props: PickupPointMapProps) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  return (
    <APIProvider apiKey={apiKey} libraries={['places', 'geocoding']}>
      <PickupPointMapContent {...props} />
    </APIProvider>
  );
}
