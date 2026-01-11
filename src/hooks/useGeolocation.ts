import { useState, useEffect, useCallback } from 'react';
import { Location } from '@/data/locations';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  loading: boolean;
  error: string | null;
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
}

const STORAGE_KEY = 'intymy_location_settings';

interface LocationSettings {
  useGps: boolean;
  manualLocation: Location | null;
}

function getStoredSettings(): LocationSettings {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : { useGps: true, manualLocation: null };
  } catch {
    return { useGps: true, manualLocation: null };
  }
}

function setStoredSettings(settings: LocationSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function useGeolocation(options: UseGeolocationOptions = {}) {
  const [position, setPosition] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: false,
    error: null,
  });

  const [settings, setSettings] = useState<LocationSettings>(getStoredSettings);

  useEffect(() => {
    setStoredSettings(settings);
  }, [settings]);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setPosition(prev => ({
        ...prev,
        error: 'Geolocalização não é suportada pelo seu navegador',
        loading: false,
      }));
      return;
    }

    setPosition(prev => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          loading: false,
          error: null,
        });
      },
      (err) => {
        let errorMessage = 'Erro ao obter localização';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Permissão de localização negada';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Localização indisponível';
            break;
          case err.TIMEOUT:
            errorMessage = 'Tempo esgotado ao obter localização';
            break;
        }
        setPosition(prev => ({
          ...prev,
          error: errorMessage,
          loading: false,
        }));
      },
      {
        enableHighAccuracy: options.enableHighAccuracy ?? true,
        timeout: options.timeout ?? 10000,
        maximumAge: options.maximumAge ?? 0,
      }
    );
  }, [options.enableHighAccuracy, options.timeout, options.maximumAge]);

  const toggleGps = useCallback((enabled: boolean) => {
    setSettings(prev => ({ ...prev, useGps: enabled }));
    if (enabled) {
      requestLocation();
    }
  }, [requestLocation]);

  const setManualLocation = useCallback((location: Location | null) => {
    setSettings(prev => ({ ...prev, manualLocation: location }));
  }, []);

  // Auto-request location on mount if GPS is enabled
  useEffect(() => {
    if (settings.useGps && !position.latitude && !position.loading && !position.error) {
      requestLocation();
    }
  }, [settings.useGps, position.latitude, position.loading, position.error, requestLocation]);

  return {
    position,
    settings,
    requestLocation,
    toggleGps,
    setManualLocation,
    isGpsEnabled: settings.useGps,
    manualLocation: settings.manualLocation,
  };
}
