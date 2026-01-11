import { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Navigation, Globe, ChevronRight } from 'lucide-react';
import { countries, Location } from '@/data/locations';
import { cn } from '@/lib/utils';

interface LocationFilterProps {
  isGpsEnabled: boolean;
  onToggleGps: (enabled: boolean) => void;
  manualLocation: Location | null;
  onSetManualLocation: (location: Location | null) => void;
  children?: React.ReactNode;
}

export function LocationFilter({
  isGpsEnabled,
  onToggleGps,
  manualLocation,
  onSetManualLocation,
  children,
}: LocationFilterProps) {
  const [open, setOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>(manualLocation?.country || '');
  const [selectedState, setSelectedState] = useState<string>(manualLocation?.state || '');
  const [selectedCity, setSelectedCity] = useState<string>(manualLocation?.city || '');

  const country = countries.find(c => c.name === selectedCountry);
  const state = country?.states.find(s => s.name === selectedState);

  useEffect(() => {
    if (manualLocation) {
      setSelectedCountry(manualLocation.country);
      setSelectedState(manualLocation.state);
      setSelectedCity(manualLocation.city);
    }
  }, [manualLocation]);

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value);
    setSelectedState('');
    setSelectedCity('');
  };

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedCity('');
  };

  const handleApply = () => {
    if (selectedCountry && selectedState && selectedCity) {
      onSetManualLocation({
        country: selectedCountry,
        state: selectedState,
        city: selectedCity,
      });
    }
    setOpen(false);
  };

  const handleClearLocation = () => {
    setSelectedCountry('');
    setSelectedState('');
    setSelectedCity('');
    onSetManualLocation(null);
  };

  const getLocationLabel = () => {
    if (isGpsEnabled) {
      return 'Usando GPS';
    }
    if (manualLocation) {
      return `${manualLocation.city}, ${manualLocation.state}`;
    }
    return 'Selecionar local';
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {children || (
          <Button variant="outline" className="gap-2">
            <MapPin className="h-4 w-4" />
            {getLocationLabel()}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-3xl max-h-[85vh] overflow-auto">
        <SheetHeader className="text-left pb-4">
          <SheetTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Localização
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 pb-6">
          {/* GPS Toggle */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-3">
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center",
                isGpsEnabled ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              )}>
                <Navigation className="h-5 w-5" />
              </div>
              <div>
                <Label htmlFor="gps-toggle" className="text-base font-medium">
                  Usar minha localização
                </Label>
                <p className="text-sm text-muted-foreground">
                  Encontre criadores próximos a você
                </p>
              </div>
            </div>
            <Switch
              id="gps-toggle"
              checked={isGpsEnabled}
              onCheckedChange={(checked) => {
                onToggleGps(checked);
                if (checked) {
                  handleClearLocation();
                }
              }}
            />
          </div>

          {/* Manual Location Selection */}
          <div className={cn(
            "space-y-4 transition-opacity",
            isGpsEnabled && "opacity-50 pointer-events-none"
          )}>
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Globe className="h-4 w-4" />
              Ou escolha uma região específica
            </div>

            {/* Country */}
            <div className="space-y-2">
              <Label>País</Label>
              <Select value={selectedCountry} onValueChange={handleCountryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o país" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.code} value={c.name}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* State */}
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select 
                value={selectedState} 
                onValueChange={handleStateChange}
                disabled={!selectedCountry}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o estado" />
                </SelectTrigger>
                <SelectContent>
                  {country?.states.map((s) => (
                    <SelectItem key={s.code} value={s.name}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label>Cidade</Label>
              <Select 
                value={selectedCity} 
                onValueChange={setSelectedCity}
                disabled={!selectedState}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a cidade" />
                </SelectTrigger>
                <SelectContent>
                  {state?.cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Quick Locations */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Locais populares</p>
            <div className="flex flex-wrap gap-2">
              {[
                { country: 'Brasil', state: 'São Paulo', city: 'São Paulo' },
                { country: 'Brasil', state: 'Rio de Janeiro', city: 'Rio de Janeiro' },
                { country: 'Brasil', state: 'Minas Gerais', city: 'Belo Horizonte' },
                { country: 'Brasil', state: 'Bahia', city: 'Salvador' },
              ].map((loc) => (
                <button
                  key={`${loc.city}-${loc.state}`}
                  onClick={() => {
                    if (!isGpsEnabled) {
                      setSelectedCountry(loc.country);
                      setSelectedState(loc.state);
                      setSelectedCity(loc.city);
                    }
                  }}
                  disabled={isGpsEnabled}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm transition-colors",
                    manualLocation?.city === loc.city
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80",
                    isGpsEnabled && "opacity-50"
                  )}
                >
                  {loc.city}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            {manualLocation && !isGpsEnabled && (
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleClearLocation}
              >
                Limpar
              </Button>
            )}
            <Button
              className="flex-1"
              onClick={handleApply}
              disabled={isGpsEnabled || !selectedCity}
            >
              Aplicar
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
