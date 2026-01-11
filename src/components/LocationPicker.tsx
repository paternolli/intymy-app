import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Navigation, X, Search, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationPickerProps {
  open: boolean;
  onClose: () => void;
  onLocationSelect: (location: string) => void;
  currentLocation?: string;
}

// Popular/suggested locations
const suggestedLocations = [
  'São Paulo, SP',
  'Rio de Janeiro, RJ',
  'Belo Horizonte, MG',
  'Curitiba, PR',
  'Porto Alegre, RS',
  'Salvador, BA',
  'Fortaleza, CE',
  'Brasília, DF',
  'Recife, PE',
  'Florianópolis, SC',
];

export function LocationPicker({ open, onClose, onLocationSelect, currentLocation }: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);
  const [currentLocationName, setCurrentLocationName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const filteredLocations = suggestedLocations.filter(loc =>
    loc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada pelo seu navegador');
      return;
    }

    setIsLoadingCurrentLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          // Using reverse geocoding with a free API
          const { latitude, longitude } = position.coords;
          
          // For demo purposes, we'll use a simplified location string
          // In production, you'd use a geocoding API like Google Maps, Mapbox, etc.
          const locationString = `📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          
          // Try to get a readable address using Nominatim (OpenStreetMap)
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14`
            );
            const data = await response.json();
            
            if (data.address) {
              const { city, town, village, suburb, state, country } = data.address;
              const cityName = city || town || village || suburb || '';
              const stateName = state || '';
              
              if (cityName) {
                setCurrentLocationName(`${cityName}${stateName ? ', ' + stateName : ''}`);
              } else {
                setCurrentLocationName(locationString);
              }
            } else {
              setCurrentLocationName(locationString);
            }
          } catch {
            // If geocoding fails, use coordinates
            setCurrentLocationName(locationString);
          }
        } catch (err) {
          setError('Erro ao obter localização');
        } finally {
          setIsLoadingCurrentLocation(false);
        }
      },
      (err) => {
        setIsLoadingCurrentLocation(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Permissão de localização negada');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Localização indisponível');
            break;
          case err.TIMEOUT:
            setError('Tempo esgotado ao obter localização');
            break;
          default:
            setError('Erro ao obter localização');
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleSelectLocation = (location: string) => {
    onLocationSelect(location);
    onClose();
  };

  const handleRemoveLocation = () => {
    onLocationSelect('');
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
          <X className="h-6 w-6" />
        </button>
        <h2 className="font-semibold text-lg">Adicionar localização</h2>
        <div className="w-6" />
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar localização..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-xl"
          />
        </div>
      </div>

      {/* Current location button */}
      <div className="px-4 mb-2">
        <button
          onClick={handleGetCurrentLocation}
          disabled={isLoadingCurrentLocation}
          className="w-full flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20 hover:bg-primary/10 transition-colors"
        >
          {isLoadingCurrentLocation ? (
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          ) : (
            <Navigation className="h-5 w-5 text-primary" />
          )}
          <div className="text-left flex-1">
            <p className="font-medium text-sm">Usar localização atual</p>
            {currentLocationName && (
              <p className="text-xs text-muted-foreground">{currentLocationName}</p>
            )}
          </div>
          {currentLocationName && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleSelectLocation(currentLocationName);
              }}
              className="rounded-full"
            >
              Usar
            </Button>
          )}
        </button>

        {error && (
          <p className="text-xs text-destructive mt-2 px-1">{error}</p>
        )}
      </div>

      {/* Current selected location */}
      {currentLocation && (
        <div className="px-4 mb-4">
          <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{currentLocation}</span>
            </div>
            <button
              onClick={handleRemoveLocation}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Suggested locations */}
      <div className="flex-1 overflow-y-auto">
        <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {searchQuery ? 'Resultados' : 'Sugestões'}
        </p>
        <div className="px-4 space-y-1">
          {filteredLocations.map((location) => (
            <button
              key={location}
              onClick={() => handleSelectLocation(location)}
              className={cn(
                "w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left",
                currentLocation === location && "bg-primary/10"
              )}
            >
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{location}</span>
            </button>
          ))}

          {searchQuery && filteredLocations.length === 0 && (
            <button
              onClick={() => handleSelectLocation(searchQuery)}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted transition-colors text-left"
            >
              <MapPin className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Usar "{searchQuery}"</p>
                <p className="text-xs text-muted-foreground">Adicionar como localização personalizada</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
