import { useState, useMemo } from 'react';
import { BottomNav } from '@/components/BottomNav';
import { CreatePostSheet } from '@/components/CreatePostSheet';
import { LocationFilter } from '@/components/explore/LocationFilter';
import { CreatorCard } from '@/components/explore/CreatorCard';
import { CreatorMap } from '@/components/explore/CreatorMap';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { 
  Search, 
  MapPin, 
  SlidersHorizontal, 
  Users, 
  Heart, 
  Sparkles,
  Navigation,
  TrendingUp,
  Filter,
  List,
  Map
} from 'lucide-react';
import { mockCreatorsWithLocation, CreatorWithLocation } from '@/data/locations';
import { useGeolocation } from '@/hooks/useGeolocation';
import { cn } from '@/lib/utils';
import { ProfileType } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

type FilterTab = 'all' | 'nearby' | 'popular' | 'new';
type ProfileFilter = ProfileType | 'all';
type ViewMode = 'list' | 'map';

export default function Explore() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [profileFilter, setProfileFilter] = useState<ProfileFilter>('all');
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  const {
    position,
    isGpsEnabled,
    manualLocation,
    toggleGps,
    setManualLocation,
  } = useGeolocation();

  // Filter and sort creators
  const filteredCreators = useMemo(() => {
    let creators = [...mockCreatorsWithLocation];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      creators = creators.filter(
        (c) =>
          c.username.toLowerCase().includes(query) ||
          c.bio.toLowerCase().includes(query) ||
          c.location.city.toLowerCase().includes(query) ||
          c.location.state.toLowerCase().includes(query) ||
          c.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Location filter (manual location)
    if (manualLocation && !isGpsEnabled) {
      creators = creators.filter((c) => {
        if (manualLocation.city) {
          return c.location.city === manualLocation.city;
        }
        if (manualLocation.state) {
          return c.location.state === manualLocation.state;
        }
        if (manualLocation.country) {
          return c.location.country === manualLocation.country;
        }
        return true;
      });
    }

    // Profile type filter
    if (profileFilter !== 'all') {
      creators = creators.filter((c) => c.profileType === profileFilter);
    }

    // Online filter
    if (showOnlineOnly) {
      creators = creators.filter((c) => c.isOnline);
    }

    // Tab-based sorting/filtering
    switch (activeTab) {
      case 'nearby':
        creators = creators
          .filter((c) => c.distance !== undefined)
          .sort((a, b) => (a.distance || 0) - (b.distance || 0));
        break;
      case 'popular':
        creators = creators.sort((a, b) => b.followers - a.followers);
        break;
      case 'new':
        // Simulating new creators by shuffling
        creators = creators.sort(() => Math.random() - 0.5);
        break;
      default:
        // Default: mix of nearby and popular
        creators = creators.sort((a, b) => {
          const scoreA = a.followers / 1000 - (a.distance || 1000) / 100;
          const scoreB = b.followers / 1000 - (b.distance || 1000) / 100;
          return scoreB - scoreA;
        });
    }

    return creators;
  }, [searchQuery, manualLocation, isGpsEnabled, profileFilter, showOnlineOnly, activeTab]);

  // Nearby creators (for horizontal scroll)
  const nearbyCreators = useMemo(() => {
    return mockCreatorsWithLocation
      .filter((c) => c.distance !== undefined && c.distance < 100)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .slice(0, 8);
  }, []);

  const filterTabs: { id: FilterTab; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'Todos', icon: <Users className="h-4 w-4" /> },
    { id: 'nearby', label: 'Perto', icon: <Navigation className="h-4 w-4" /> },
    { id: 'popular', label: 'Populares', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'new', label: 'Novos', icon: <Sparkles className="h-4 w-4" /> },
  ];

  const profileTypes: { id: ProfileFilter; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'single', label: 'Solteiros' },
    { id: 'dating', label: 'Namorando' },
    { id: 'couple', label: 'Casais' },
    { id: 'throuple', label: 'Trisais' },
  ];

  const getLocationLabel = () => {
    if (isGpsEnabled && position.latitude) {
      return 'Sua localização';
    }
    if (manualLocation) {
      return `${manualLocation.city}, ${manualLocation.state}`;
    }
    return 'Definir local';
  };

  return (
    <div className="min-h-screen bg-background pb-14">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="p-4 space-y-3 max-w-lg mx-auto">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Buscar criadores, locais, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-12 rounded-xl bg-muted border-none h-11"
            />
            <LocationFilter
              isGpsEnabled={isGpsEnabled}
              onToggleGps={toggleGps}
              manualLocation={manualLocation}
              onSetManualLocation={setManualLocation}
            >
              <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-background transition-colors">
                <MapPin className={cn(
                  "h-5 w-5",
                  (isGpsEnabled || manualLocation) ? "text-primary" : "text-muted-foreground"
                )} />
              </button>
            </LocationFilter>
          </div>

          {/* Location indicator */}
          <LocationFilter
            isGpsEnabled={isGpsEnabled}
            onToggleGps={toggleGps}
            manualLocation={manualLocation}
            onSetManualLocation={setManualLocation}
          >
            <button className="flex items-center gap-2 text-sm">
              <div className={cn(
                "h-6 w-6 rounded-full flex items-center justify-center",
                isGpsEnabled ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
              )}>
                {isGpsEnabled ? (
                  <Navigation className="h-3.5 w-3.5" />
                ) : (
                  <MapPin className="h-3.5 w-3.5" />
                )}
              </div>
              <span className={cn(
                "font-medium",
                (isGpsEnabled || manualLocation) ? "text-foreground" : "text-muted-foreground"
              )}>
                {getLocationLabel()}
              </span>
              <span className="text-xs text-muted-foreground">Alterar</span>
            </button>
          </LocationFilter>

          {/* Filter Tabs + View Toggle */}
          <div className="flex gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-1.5",
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
            
            {/* View Toggle */}
            <div className="flex rounded-xl bg-muted p-1">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === 'list'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <List className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === 'map'
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Map className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map View */}
      {viewMode === 'map' ? (
        <div className="h-[calc(100vh-220px)]">
          <CreatorMap
            creators={filteredCreators}
            userPosition={position.latitude && position.longitude ? {
              lat: position.latitude,
              lng: position.longitude
            } : null}
          />
        </div>
      ) : (
        <main className="max-w-lg mx-auto">
        {/* Nearby Creators (horizontal scroll) */}
        {activeTab !== 'nearby' && nearbyCreators.length > 0 && (
          <div className="py-4 border-b border-border">
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="font-semibold flex items-center gap-2">
                <Navigation className="h-4 w-4 text-primary" />
                Perto de você
              </h2>
              <button 
                onClick={() => setActiveTab('nearby')}
                className="text-sm text-primary font-medium"
              >
                Ver todos
              </button>
            </div>
            <ScrollArea className="w-full">
              <div className="flex gap-3 px-4 pb-2">
                {nearbyCreators.map((creator) => (
                  <div key={creator.id} className="w-24 shrink-0">
                    <CreatorCard creator={creator} variant="compact" />
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}

        {/* Profile Type Filter */}
        <div className="px-4 py-3 border-b border-border">
          <ScrollArea className="w-full">
            <div className="flex gap-2 pb-1">
              {profileTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setProfileFilter(type.id)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    profileFilter === type.id
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {type.label}
                </button>
              ))}
              <button
                onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5",
                  showOnlineOnly
                    ? "bg-green-500 text-white"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                )}
              >
                <span className={cn(
                  "h-2 w-2 rounded-full",
                  showOnlineOnly ? "bg-white" : "bg-green-500"
                )} />
                Online
              </button>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Results Count */}
        <div className="px-4 py-3 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filteredCreators.length} {filteredCreators.length === 1 ? 'criador encontrado' : 'criadores encontrados'}
          </p>
          {(manualLocation || profileFilter !== 'all' || showOnlineOnly) && (
            <button
              onClick={() => {
                setManualLocation(null);
                setProfileFilter('all');
                setShowOnlineOnly(false);
                toggleGps(true);
              }}
              className="text-sm text-primary font-medium"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {/* Creators List */}
        <div className="px-4 space-y-3 pb-6">
          <AnimatePresence mode="popLayout">
            {filteredCreators.length > 0 ? (
              filteredCreators.map((creator, index) => (
                <motion.div
                  key={creator.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <CreatorCard creator={creator} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-16 text-center"
              >
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">Nenhum criador encontrado</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Tente ajustar seus filtros ou buscar em outra região
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('');
                    setManualLocation(null);
                    setProfileFilter('all');
                    setShowOnlineOnly(false);
                  }}
                >
                  Limpar filtros
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        </main>
      )}

      <BottomNav onCreateClick={() => setIsCreateOpen(true)} />
      <CreatePostSheet open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  );
}
