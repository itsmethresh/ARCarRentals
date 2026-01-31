import { type FC, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import { X, MapPin, Navigation, Search, Building2, Plane, ShoppingBag } from 'lucide-react';
import { cn } from '@utils/helpers';
import 'leaflet/dist/leaflet.css';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: string) => void;
  initialLocation?: string;
}

interface PickupPoint {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  icon: 'office' | 'airport' | 'mall';
}

// Pick-up points in Cebu
const PICKUP_POINTS: PickupPoint[] = [
  {
    id: 'ar-office',
    name: 'AR Car Rentals Office',
    address: 'Main Branch, Cebu City',
    lat: 10.3157,
    lng: 123.8854,
    icon: 'office',
  },
  {
    id: 'airport',
    name: 'Mactan-Cebu International Airport',
    address: 'Lapu-Lapu City, Cebu',
    lat: 10.3074,
    lng: 123.9793,
    icon: 'airport',
  },
  {
    id: 'sm-city',
    name: 'SM City Cebu',
    address: 'North Reclamation Area, Cebu City',
    lat: 10.3119,
    lng: 123.9183,
    icon: 'mall',
  },
  {
    id: 'ayala',
    name: 'Ayala Center Cebu',
    address: 'Cebu Business Park, Cebu City',
    lat: 10.3181,
    lng: 123.9050,
    icon: 'mall',
  },
  {
    id: 'sm-seaside',
    name: 'SM Seaside City Cebu',
    address: 'South Road Properties, Cebu City',
    lat: 10.2817,
    lng: 123.8785,
    icon: 'mall',
  },
  {
    id: 'robinsons',
    name: 'Robinsons Galleria Cebu',
    address: 'General Maxilom Ave, Cebu City',
    lat: 10.3103,
    lng: 123.8936,
    icon: 'mall',
  },
];

// Cebu City center coordinates
const CEBU_CENTER: LatLngExpression = [10.3157, 123.8854];

// Custom marker icons
const createIcon = (color: string) => new Icon({
  iconUrl: `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="32" height="32">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `)}`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const redIcon = createIcon('%23E22B2B');
const blueIcon = createIcon('%233B82F6');
const userIcon = createIcon('%23E22B2B');

// Calculate distance between two points in km (Haversine formula)
const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Get icon component based on type
const getPointIcon = (type: PickupPoint['icon']) => {
  switch (type) {
    case 'airport':
      return <Plane className="h-4 w-4" />;
    case 'mall':
      return <ShoppingBag className="h-4 w-4" />;
    default:
      return <Building2 className="h-4 w-4" />;
  }
};

// Map controller component to handle center/zoom changes
const MapController: FC<{ center: LatLngExpression; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [map, center, zoom]);
  
  return null;
};

/**
 * Location Permission Dialog
 */
const LocationPermissionDialog: FC<{
  onAllow: () => void;
  onDeny: () => void;
}> = ({ onAllow, onDeny }) => (
  <div className="fixed inset-0 z-[70] flex items-center justify-center">
    <div className="absolute inset-0 bg-black/50" onClick={onDeny} />
    <div className="relative bg-[#1a1a2e] rounded-2xl shadow-2xl max-w-sm mx-4 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-[#E22B2B]/20 rounded-full">
            <MapPin className="h-5 w-5 text-[#E22B2B]" />
          </div>
          <h3 className="text-lg font-bold text-white">
            Location Access Required
          </h3>
        </div>
        <p className="text-neutral-300 mb-6">
          AR Car Rentals wants to know your location to find the nearest pick-up points and provide better service.
        </p>
        <div className="space-y-2">
          <button
            onClick={onAllow}
            className="w-full py-3 bg-[#E22B2B] hover:bg-[#c92525] text-white font-semibold rounded-xl transition-colors"
          >
            Allow Location Access
          </button>
          <button
            onClick={onDeny}
            className="w-full py-3 bg-neutral-700 hover:bg-neutral-600 text-white font-medium rounded-xl transition-colors"
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  </div>
);

/**
 * Location Picker Modal Component
 * Allows users to select a pick-up location with OpenStreetMap (Leaflet)
 */
export const LocationPickerModal: FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  initialLocation,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<PickupPoint | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [userAddress, setUserAddress] = useState('');
  const [radius, setRadius] = useState(15); // km
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(CEBU_CENTER);
  const [mapZoom, setMapZoom] = useState(12);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedPoint(null);
      setUserLocation(null);
      setUserAddress('');
      setRadius(15);
      setMapCenter(CEBU_CENTER);
      setMapZoom(12);
      
      // Find initial location if provided
      if (initialLocation) {
        const point = PICKUP_POINTS.find(p => p.name === initialLocation);
        if (point) {
          setSelectedPoint(point);
          setMapCenter([point.lat, point.lng]);
        }
      }
    }
  }, [isOpen, initialLocation]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Reverse geocode using Nominatim (free)
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      const data = await response.json();
      if (data.display_name) {
        setUserAddress(data.display_name);
        setSearchQuery(data.display_name);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  // Handle detect location
  const handleDetectLocation = () => {
    setShowPermissionDialog(true);
  };

  // Handle location permission allow
  const handleAllowLocation = () => {
    setShowPermissionDialog(false);
    setIsLoadingLocation(true);
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setMapCenter([latitude, longitude]);
          setMapZoom(14);
          reverseGeocode(latitude, longitude);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          alert('Unable to get your location. Please enable location services and try again.');
          setIsLoadingLocation(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
      setIsLoadingLocation(false);
    }
  };

  // Filter and sort pickup points based on search and distance
  const filteredPoints = PICKUP_POINTS.filter((point) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === '' ||
      point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      point.address.toLowerCase().includes(searchQuery.toLowerCase());

    // Filter by radius if user location is known
    if (userLocation) {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        point.lat,
        point.lng
      );
      return matchesSearch && distance <= radius;
    }

    return matchesSearch;
  }).sort((a, b) => {
    // Sort by distance if user location is known
    if (userLocation) {
      const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng);
      const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
      return distA - distB;
    }
    return 0;
  });

  // Handle point selection
  const handleSelectPoint = (point: PickupPoint) => {
    setSelectedPoint(point);
    setMapCenter([point.lat, point.lng]);
    setMapZoom(15);
  };

  // Handle confirm
  const handleConfirm = () => {
    if (selectedPoint) {
      onConfirm(selectedPoint.name);
      onClose();
    }
  };

  // Get distance text for a point
  const getDistanceText = (point: PickupPoint) => {
    if (!userLocation) return null;
    const distance = calculateDistance(userLocation.lat, userLocation.lng, point.lat, point.lng);
    return `${distance.toFixed(1)} km away`;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal Content */}
        <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-neutral-200">
            <div>
              <h2 className="text-xl font-bold text-neutral-900">
                Select Pick-up Location
              </h2>
              <p className="text-sm text-neutral-500 mt-1">
                Choose where you'd like to pick up your vehicle
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-neutral-100 rounded-lg transition-colors text-neutral-500 hover:text-neutral-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-hidden p-6">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
              {/* Left Column - Search & Points List */}
              <div className="lg:col-span-2 space-y-4 flex flex-col">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search location or pick-up point..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl text-neutral-700 focus:outline-none focus:ring-2 focus:ring-[#E22B2B] focus:border-transparent"
                  />
                </div>

                {/* Detect Location Button */}
                <button
                  onClick={handleDetectLocation}
                  disabled={isLoadingLocation}
                  className="flex items-center justify-center gap-2 py-3 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-medium rounded-xl transition-colors disabled:opacity-50"
                >
                  {isLoadingLocation ? (
                    <>
                      <div className="w-4 h-4 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <Navigation className="h-4 w-4" />
                      Detect Current Location
                    </>
                  )}
                </button>

                {/* User Location Display */}
                {userAddress && (
                  <div className="p-3 bg-[#E22B2B]/10 border border-[#E22B2B]/20 rounded-xl">
                    <p className="text-xs text-[#E22B2B] font-medium mb-1">Your Location</p>
                    <p className="text-sm text-neutral-700 line-clamp-2">{userAddress}</p>
                  </div>
                )}

                {/* Radius Slider - Only show when user location is detected */}
                {userLocation && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-neutral-700">
                        Search Radius
                      </label>
                      <span className="text-sm font-semibold text-[#E22B2B]">{radius} km</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="50"
                      value={radius}
                      onChange={(e) => setRadius(Number(e.target.value))}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#E22B2B]"
                    />
                    <div className="flex justify-between text-xs text-neutral-500">
                      <span>5 km</span>
                      <span>50 km</span>
                    </div>
                  </div>
                )}

                {/* Pick-up Points List */}
                <div className="flex-1 overflow-y-auto space-y-2 min-h-[200px] max-h-[300px]">
                  <p className="text-sm font-semibold text-neutral-700 mb-2">
                    {userLocation ? 'Nearest Pick-up Points' : 'Available Pick-up Points'}
                  </p>
                  {filteredPoints.length === 0 ? (
                    <div className="text-center py-8 text-neutral-500">
                      <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No pick-up points found within {radius} km</p>
                      <p className="text-sm">Try increasing the search radius</p>
                    </div>
                  ) : (
                    filteredPoints.map((point) => (
                      <button
                        key={point.id}
                        onClick={() => handleSelectPoint(point)}
                        className={cn(
                          'w-full p-3 rounded-xl border-2 transition-all text-left',
                          selectedPoint?.id === point.id
                            ? 'border-[#E22B2B] bg-[#E22B2B]/5'
                            : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'p-2 rounded-lg',
                              selectedPoint?.id === point.id
                                ? 'bg-[#E22B2B] text-white'
                                : 'bg-neutral-100 text-neutral-600'
                            )}
                          >
                            {getPointIcon(point.icon)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-neutral-900 truncate">
                              {point.name}
                            </p>
                            <p className="text-sm text-neutral-500 truncate">
                              {point.address}
                            </p>
                            {userLocation && (
                              <p className="text-xs text-[#E22B2B] mt-1">
                                {getDistanceText(point)}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Right Column - Map */}
              <div className="lg:col-span-3 h-[300px] lg:h-full min-h-[300px] rounded-xl overflow-hidden border border-neutral-200">
                <MapContainer
                  center={CEBU_CENTER}
                  zoom={12}
                  style={{ width: '100%', height: '100%' }}
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  <MapController center={mapCenter} zoom={mapZoom} />

                  {/* User Location Marker */}
                  {userLocation && (
                    <>
                      <Marker
                        position={[userLocation.lat, userLocation.lng]}
                        icon={userIcon}
                      />
                      {/* Radius Circle */}
                      <Circle
                        center={[userLocation.lat, userLocation.lng]}
                        radius={radius * 1000} // Convert km to meters
                        pathOptions={{
                          fillColor: '#E22B2B',
                          fillOpacity: 0.1,
                          color: '#E22B2B',
                          opacity: 0.5,
                          weight: 2,
                        }}
                      />
                    </>
                  )}

                  {/* Pick-up Point Markers */}
                  {filteredPoints.map((point) => (
                    <Marker
                      key={point.id}
                      position={[point.lat, point.lng]}
                      icon={selectedPoint?.id === point.id ? redIcon : blueIcon}
                      eventHandlers={{
                        click: () => handleSelectPoint(point),
                      }}
                    />
                  ))}
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-4 p-6 border-t border-neutral-200">
            <button
              onClick={onClose}
              className="flex-1 py-3 border-2 border-neutral-300 text-neutral-700 font-semibold rounded-xl hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={!selectedPoint}
              className={cn(
                'flex-1 py-3 font-semibold rounded-xl transition-colors',
                selectedPoint
                  ? 'bg-[#E22B2B] hover:bg-[#c92525] text-white'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              )}
            >
              Confirm Location
            </button>
          </div>
        </div>
      </div>

      {/* Location Permission Dialog */}
      {showPermissionDialog && (
        <LocationPermissionDialog
          onAllow={handleAllowLocation}
          onDeny={() => setShowPermissionDialog(false)}
        />
      )}
    </>
  );
};

export default LocationPickerModal;
