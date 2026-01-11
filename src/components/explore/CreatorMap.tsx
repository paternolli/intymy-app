import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CreatorWithLocation, cityCoordinates } from '@/data/locations';
import { ProfileAvatar } from '@/components/ProfileAvatar';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Navigation, X } from 'lucide-react';
import { getProfileTypeLabel } from '@/data/mockData';
import { useUserRelationships } from '@/hooks/useUserRelationships';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface CreatorMapProps {
  creators: CreatorWithLocation[];
  userPosition?: { lat: number; lng: number } | null;
  onCreatorSelect?: (creator: CreatorWithLocation) => void;
}

// Custom marker icon creator
const createCustomIcon = (isOnline: boolean, profileType: string) => {
  const color = isOnline ? '#22c55e' : '#6b7280';
  const bgColor = profileType === 'couple' ? '#ec4899' : 
                  profileType === 'throuple' ? '#a855f7' : 
                  profileType === 'dating' ? '#f43f5e' : '#3b82f6';
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        border-radius: 50% 50% 50% 0;
        background: ${bgColor};
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        border: 3px solid white;
      ">
        <div style="
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: ${color};
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

// User location marker
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `
    <div style="
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #3b82f6;
      border: 4px solid white;
      box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
    ">
      <div style="
        position: absolute;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(59, 130, 246, 0.2);
        top: -10px;
        left: -10px;
        animation: pulse 2s infinite;
      "></div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

// Component to handle map center updates
function MapController({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
}

export function CreatorMap({ creators, userPosition, onCreatorSelect }: CreatorMapProps) {
  const navigate = useNavigate();
  const [selectedCreator, setSelectedCreator] = useState<CreatorWithLocation | null>(null);
  const { isFollowing, toggleFollow } = useUserRelationships();

  // Get coordinates for each creator
  const creatorsWithCoords = creators.map(creator => ({
    ...creator,
    coordinates: creator.coordinates || cityCoordinates[creator.location.city] || null,
  })).filter(c => c.coordinates);

  // Calculate map center
  const defaultCenter: [number, number] = userPosition 
    ? [userPosition.lat, userPosition.lng]
    : [-23.5505, -46.6333]; // São Paulo default

  const handleCreatorClick = (creator: CreatorWithLocation) => {
    setSelectedCreator(creator);
    onCreatorSelect?.(creator);
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  return (
    <div className="relative w-full h-full">
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.5); opacity: 0.2; }
          100% { transform: scale(1); opacity: 0.5; }
        }
        .leaflet-container {
          font-family: inherit;
        }
        .custom-marker {
          background: transparent;
          border: none;
        }
        .user-location-marker {
          background: transparent;
          border: none;
        }
      `}</style>
      
      <MapContainer
        center={defaultCenter}
        zoom={10}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={defaultCenter} />

        {/* User location marker */}
        {userPosition && (
          <Marker 
            position={[userPosition.lat, userPosition.lng]} 
            icon={userLocationIcon}
          >
            <Popup>
              <div className="text-center py-1">
                <p className="font-medium text-sm">Você está aqui</p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Creator markers */}
        {creatorsWithCoords.map((creator) => (
          <Marker
            key={creator.id}
            position={[creator.coordinates!.lat, creator.coordinates!.lng]}
            icon={createCustomIcon(creator.isOnline, creator.profileType)}
            eventHandlers={{
              click: () => handleCreatorClick(creator),
            }}
          >
            <Popup>
              <div className="min-w-[200px] p-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="relative shrink-0">
                    <img 
                      src={creator.members[0].avatar} 
                      alt={creator.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    {creator.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate flex items-center gap-1">
                      {creator.username}
                      {creator.isVerified && <VerifiedBadge size="sm" />}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getProfileTypeLabel(creator.profileType)}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{creator.bio}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {formatFollowers(creator.followers)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {creator.location.city}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/profile/${creator.id}`)}
                  className="w-full py-1.5 px-3 bg-primary text-primary-foreground text-xs font-medium rounded-lg"
                >
                  Ver perfil
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Selected Creator Card Overlay */}
      <AnimatePresence>
        {selectedCreator && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-4 left-4 right-4 z-[1000]"
          >
            <div className="bg-card rounded-2xl shadow-xl border border-border p-4">
              <button
                onClick={() => setSelectedCreator(null)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-muted hover:bg-muted/80"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => navigate(`/profile/${selectedCreator.id}`)}
                  className="relative shrink-0"
                >
                  <ProfileAvatar
                    profileType={selectedCreator.profileType}
                    members={selectedCreator.members}
                    size="lg"
                    showRing={selectedCreator.isOnline}
                  />
                  {selectedCreator.isOnline && (
                    <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-card" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <button 
                    onClick={() => navigate(`/profile/${selectedCreator.id}`)}
                    className="text-left w-full"
                  >
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold truncate">{selectedCreator.username}</p>
                      {selectedCreator.isVerified && <VerifiedBadge size="sm" />}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">{selectedCreator.bio}</p>
                  </button>

                  <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {formatFollowers(selectedCreator.followers)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {selectedCreator.location.city}
                    </span>
                    {selectedCreator.distance && (
                      <span className="text-primary font-medium">
                        {selectedCreator.distance < 1 
                          ? `${Math.round(selectedCreator.distance * 1000)}m` 
                          : `${selectedCreator.distance.toFixed(1)}km`}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  variant={isFollowing(selectedCreator.id) ? "outline" : "default"}
                  className={cn(
                    "flex-1 h-9 rounded-full",
                    isFollowing(selectedCreator.id) && "bg-muted text-foreground"
                  )}
                  onClick={() => toggleFollow(selectedCreator.id, selectedCreator.username)}
                >
                  {isFollowing(selectedCreator.id) ? 'Seguindo' : 'Seguir'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 h-9 rounded-full"
                  onClick={() => navigate(`/profile/${selectedCreator.id}`)}
                >
                  Ver perfil
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Legend */}
      <div className="absolute top-4 right-4 z-[1000] bg-card/95 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-border">
        <p className="text-xs font-medium mb-2">Legenda</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Solteiro(a)</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-rose-500" />
            <span>Namorando</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-pink-500" />
            <span>Casal</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 rounded-full bg-purple-500" />
            <span>Trisal</span>
          </div>
          <div className="h-px bg-border my-1.5" />
          <div className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span>Online</span>
          </div>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute bottom-24 right-4 z-[1000] flex flex-col gap-1">
        <button 
          className="w-10 h-10 bg-card rounded-lg shadow-lg border border-border flex items-center justify-center text-lg font-medium hover:bg-muted"
          onClick={() => {
            const map = document.querySelector('.leaflet-container') as any;
            if (map?._leaflet_map) {
              map._leaflet_map.zoomIn();
            }
          }}
        >
          +
        </button>
        <button 
          className="w-10 h-10 bg-card rounded-lg shadow-lg border border-border flex items-center justify-center text-lg font-medium hover:bg-muted"
          onClick={() => {
            const map = document.querySelector('.leaflet-container') as any;
            if (map?._leaflet_map) {
              map._leaflet_map.zoomOut();
            }
          }}
        >
          −
        </button>
      </div>
    </div>
  );
}
