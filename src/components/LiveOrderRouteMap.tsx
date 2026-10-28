/// <reference types="@types/google.maps" />
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Map, AdvancedMarker, Polyline, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Bike, MapPin, Zap, Navigation, ShieldCheck, Compass, LocateFixed, Warehouse, Clock, Building2, CheckCircle2 } from 'lucide-react';
import { OrderDetails } from './OrderTracker';

interface LiveOrderRouteMapProps {
  order: OrderDetails;
  secondsRemaining: number;
}

// Apparellex Central Dark Store Warehouse Origin (Andheri West Micro-Hub Pod #1)
export const APPARELLEX_WAREHOUSE_POS = {
  lat: 19.1438,
  lng: 72.8312,
  name: 'Apparellex Andheri West Dark Store Pod #1',
  address: 'Mega Mall, New Link Road, Oshiwara, Andheri West, Mumbai, Maharashtra 400053',
};

// Fallback destination coordinates if order lacks explicit coordinates
const getDestinationCoordinates = (order: OrderDetails): { lat: number; lng: number } => {
  if (order.coordinates && typeof order.coordinates.lat === 'number' && typeof order.coordinates.lng === 'number') {
    return order.coordinates;
  }

  // Derive Andheri West, Mumbai coordinates based on postal code
  const code = (order.postalCode || '').trim();
  if (code.includes('400053')) return { lat: 19.1382, lng: 72.8258 }; // Lokhandwala Complex, Andheri West
  if (code.includes('400058')) return { lat: 19.1205, lng: 72.8465 }; // Andheri West Station / SV Road
  if (code.includes('400061')) return { lat: 19.1315, lng: 72.8160 }; // Versova, Andheri West
  if (code.includes('400049')) return { lat: 19.1025, lng: 72.8262 }; // Juhu / Vile Parle West
  if (code.includes('400102')) return { lat: 19.1390, lng: 72.8420 }; // Oshiwara / Jogeshwari West

  return { lat: 19.1363, lng: 72.8277 }; // Central Andheri West, Mumbai, Maharashtra
};

// Algorithmic street grid waypoint generator connecting Warehouse to Customer Destination in Andheri West
const generateStreetGridWaypoints = (
  start: { lat: number; lng: number },
  end: { lat: number; lng: number },
  destAddress: string
) => {
  const points: { lat: number; lng: number; street: string }[] = [];
  const steps = 9;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = start.lat + (end.lat - start.lat) * t;
    const lng =
      start.lng +
      (end.lng - start.lng) * (t < 0.4 ? t * 0.6 : 0.24 + (t - 0.4) * 1.26);

    let streetLabel = 'Andheri West Transit Corridor';
    if (i === 0) streetLabel = 'Apparellex Pod #1 Loading Bay, Mega Mall, Oshiwara';
    else if (i === 1) streetLabel = 'New Link Road & Oshiwara Signal';
    else if (i === 2) streetLabel = 'Infinity Mall Junction, Andheri West';
    else if (i === 3) streetLabel = 'Lokhandwala Back Road Express Corridor';
    else if (i === steps - 1) streetLabel = `Final Turn onto ${destAddress.split(',')[0] || 'Lokhandwala Main Road'}`;
    else if (i === steps) streetLabel = `Doorstep: ${destAddress}`;
    else streetLabel = `Express Courier Lane (${(t * 1.8).toFixed(1)} km)`;

    points.push({ lat, lng, street: streetLabel });
  }

  return points;
};

export const LiveOrderRouteMap: React.FC<LiveOrderRouteMapProps> = ({ order, secondsRemaining }) => {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');

  const customerPos = useMemo(() => getDestinationCoordinates(order), [order]);

  const fallbackWaypoints = useMemo(
    () => generateStreetGridWaypoints(APPARELLEX_WAREHOUSE_POS, customerPos, order.address),
    [customerPos, order.address]
  );

  const [activeWaypoints, setActiveWaypoints] = useState<{ lat: number; lng: number; street: string }[]>(fallbackWaypoints);
  const [routeDistance, setRouteDistance] = useState<string>('1.8 km');
  const [routeDuration, setRouteDuration] = useState<string>('9 mins');
  const [isRealDirectionsLoaded, setIsRealDirectionsLoaded] = useState(false);

  // Request actual Google Maps Directions if routes library is available
  useEffect(() => {
    setActiveWaypoints(fallbackWaypoints);

    if (!routesLib || typeof window === 'undefined' || !(window as any).google?.maps) {
      return;
    }

    let isMounted = true;
    try {
      const directionsService = new routesLib.DirectionsService();

      directionsService.route(
        {
          origin: APPARELLEX_WAREHOUSE_POS,
          destination: customerPos,
          travelMode: (window as any).google.maps.TravelMode.BICYCLING || (window as any).google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (!isMounted) return;

          if (status === 'OK' && result?.routes?.[0]?.overview_path) {
            const overview = result.routes[0].overview_path;
            const leg = result.routes[0].legs?.[0];

            if (overview.length > 0) {
              const mappedPoints = overview.map((pt, idx) => {
                let street = 'Express Courier Lane';
                if (idx === 0) street = 'Apparellex SoHo Warehouse Pod';
                else if (idx === overview.length - 1) street = `Doorstep: ${order.address}`;
                else if (leg?.steps && leg.steps[idx]) {
                  street = leg.steps[idx].instructions?.replace(/<[^>]*>/g, '') || `En Route`;
                }
                return {
                  lat: pt.lat(),
                  lng: pt.lng(),
                  street,
                };
              });

              setActiveWaypoints(mappedPoints);
              setIsRealDirectionsLoaded(true);

              if (leg?.distance?.text) setRouteDistance(leg.distance.text);
              if (leg?.duration?.text) setRouteDuration(leg.duration.text);
            }
          }
        }
      );
    } catch (err) {
      console.warn('Google Directions route fallback engaged:', err);
    }

    return () => {
      isMounted = false;
    };
  }, [routesLib, customerPos, order.address, fallbackWaypoints]);

  // Fit bounds initially
  useEffect(() => {
    if (map && activeWaypoints.length > 0 && typeof window !== 'undefined' && (window as any).google?.maps) {
      const bounds = new (window as any).google.maps.LatLngBounds();
      bounds.extend(APPARELLEX_WAREHOUSE_POS);
      bounds.extend(customerPos);
      activeWaypoints.forEach((pt) => bounds.extend(pt));
      map.fitBounds(bounds, 50);
    }
  }, [map, activeWaypoints, customerPos]);

  // Progress from 0 (600s left, warehouse) to 1 (0s left, doorstep)
  const progress = Math.max(0, Math.min(1, (600 - secondsRemaining) / 600));

  // Interpolate courier's live location along active waypoints
  const { currentPos, currentStreet, speedKmh } = useMemo(() => {
    if (activeWaypoints.length === 0) {
      return {
        currentPos: APPARELLEX_WAREHOUSE_POS,
        currentStreet: 'Staging at Central Dark Store',
        speedKmh: 0,
      };
    }

    if (progress <= 0.08) {
      return {
        currentPos: activeWaypoints[0],
        currentStreet: 'Staging at Andheri West Micro-Hub Pod #1 Loading Bay, Oshiwara',
        speedKmh: 0,
      };
    }

    if (progress >= 0.96) {
      const last = activeWaypoints[activeWaypoints.length - 1];
      return {
        currentPos: last,
        currentStreet: `Arrived at Doorstep: ${order.address} (5-Min Fit Check Ready)`,
        speedKmh: 0,
      };
    }

    // Active transit along waypoints
    const transitProgress = (progress - 0.08) / 0.88; // 0 to 1
    const totalSegments = activeWaypoints.length - 1;
    const rawIdx = transitProgress * totalSegments;
    const segmentIndex = Math.min(totalSegments - 1, Math.floor(rawIdx));
    const segmentSubProgress = rawIdx - segmentIndex;

    const pA = activeWaypoints[segmentIndex];
    const pB = activeWaypoints[segmentIndex + 1] || pA;

    const lat = pA.lat + (pB.lat - pA.lat) * segmentSubProgress;
    const lng = pA.lng + (pB.lng - pA.lng) * segmentSubProgress;

    return {
      currentPos: { lat, lng },
      currentStreet: pB.street,
      speedKmh: Math.round(24 + Math.sin(progress * 25) * 5),
    };
  }, [progress, activeWaypoints, order.address]);

  // Completed transit path up to courier's current location
  const completedPath = useMemo(() => {
    if (activeWaypoints.length === 0) return [APPARELLEX_WAREHOUSE_POS];
    if (progress <= 0.08) return [activeWaypoints[0]];

    const transitProgress = (progress - 0.08) / 0.88;
    const totalSegments = activeWaypoints.length - 1;
    const segmentIndex = Math.min(totalSegments - 1, Math.floor(transitProgress * totalSegments));

    const pathSlice = activeWaypoints.slice(0, segmentIndex + 1);
    pathSlice.push({ ...currentPos, street: 'Current Courier Position' });
    return pathSlice;
  }, [activeWaypoints, progress, currentPos]);

  // Camera re-centering
  const handleRecenterCourier = () => {
    if (map) {
      map.panTo(currentPos);
      map.setZoom(16);
    }
  };

  const handleFitRoute = () => {
    if (map && typeof window !== 'undefined' && (window as any).google?.maps) {
      const bounds = new (window as any).google.maps.LatLngBounds();
      bounds.extend(APPARELLEX_WAREHOUSE_POS);
      bounds.extend(customerPos);
      activeWaypoints.forEach((pt) => bounds.extend(pt));
      map.fitBounds(bounds, 50);
    }
  };

  return (
    <div className="space-y-3 bg-[#FAF8F2] p-4 rounded-sm border border-black/15 shadow-sm">
      {/* Live Route Telemetry Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-black/10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-[#111111] text-[#FF5757] flex items-center justify-center shrink-0 border border-white/20 shadow">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#1a1a1a]">
                Google Maps Warehouse-to-Doorstep Route
              </h4>
              <span className="text-[9px] bg-[#FF5757] text-white px-2 py-0.5 rounded font-black uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Live In-Transit
              </span>
            </div>
            <p className="text-[11px] text-black/70 truncate max-w-md mt-0.5">
              Courier Tariq M. · Super73 Cargo e-Bike · <span className="font-semibold text-black">{currentStreet}</span>
            </p>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleRecenterCourier}
            className="px-2.5 py-1.5 bg-white hover:bg-black hover:text-white border border-black/20 rounded-sm text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
            title="Focus on Courier GPS"
          >
            <LocateFixed className="w-3.5 h-3.5 text-[#FF5757]" />
            <span>Focus Courier</span>
          </button>
          <button
            type="button"
            onClick={handleFitRoute}
            className="px-2.5 py-1.5 bg-white hover:bg-black hover:text-white border border-black/20 rounded-sm text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5 transition cursor-pointer"
            title="View Full Route Overview"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>
        </div>
      </div>

      {/* Map Viewport Container (Explicit height rule strictly satisfied) */}
      <div className="w-full h-[330px] relative rounded-sm overflow-hidden border border-black/15 shadow-inner bg-[#EFEAE2]">
        <Map
          defaultCenter={{
            lat: (APPARELLEX_WAREHOUSE_POS.lat + customerPos.lat) / 2,
            lng: (APPARELLEX_WAREHOUSE_POS.lng + customerPos.lng) / 2,
          }}
          defaultZoom={14}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          gestureHandling="cooperative"
          disableDefaultUI={false}
          className="w-full h-full"
        >
          {/* Complete Warehouse-to-Doorstep Dispatch Route Polyline */}
          <Polyline
            path={activeWaypoints}
            strokeColor="#111111"
            strokeOpacity={0.45}
            strokeWeight={5}
          />

          {/* Active Completed Segment Traced in Coral */}
          <Polyline
            path={completedPath}
            strokeColor="#FF5757"
            strokeOpacity={1.0}
            strokeWeight={6}
          />

          {/* Warehouse Origin Advanced Marker */}
          <AdvancedMarker
            position={APPARELLEX_WAREHOUSE_POS}
            title={APPARELLEX_WAREHOUSE_POS.name}
          >
            <div className="relative group cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-[#111111] text-[#E5B869] border-2 border-white flex items-center justify-center shadow-lg hover:scale-110 transition">
                <Warehouse className="w-4 h-4" />
              </div>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#111111] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow border border-white/20">
                Warehouse Pod #4
              </div>
            </div>
          </AdvancedMarker>

          {/* Customer Destination Doorstep Advanced Marker */}
          <AdvancedMarker
            position={customerPos}
            title={`Customer Delivery Destination: ${order.address}`}
          >
            <div className="relative group cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-emerald-600 text-white border-2 border-white flex items-center justify-center shadow-xl hover:scale-110 transition">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-emerald-700 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
                Customer Doorstep
              </div>
            </div>
          </AdvancedMarker>

          {/* Real-time Moving Courier Bike Marker */}
          <AdvancedMarker
            position={currentPos}
            title={`Courier Tariq M. (${speedKmh} km/h)`}
          >
            <div className="relative group cursor-pointer">
              <div className="w-10 h-10 rounded-full bg-[#FF5757] text-white border-2 border-white flex items-center justify-center shadow-2xl animate-pulse">
                <Bike className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow flex items-center gap-1 border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{speedKmh > 0 ? `${speedKmh} km/h` : 'At Doorstep'}</span>
              </div>
            </div>
          </AdvancedMarker>
        </Map>

        {/* Live HUD Telemetry Strip */}
        <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md px-3.5 py-2.5 rounded-sm border border-white/10 text-white flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[9px] text-white/50 uppercase font-bold tracking-wider block">
                Warehouse Origin
              </span>
              <span className="font-mono font-bold text-xs text-[#E5B869] flex items-center gap-1">
                <Warehouse className="w-3 h-3 text-[#E5B869]" />
                SoHo Pod #4
              </span>
            </div>

            <div className="h-5 w-px bg-white/20" />

            <div>
              <span className="text-[9px] text-white/50 uppercase font-bold tracking-wider block">
                Live Speed
              </span>
              <span className="font-mono font-black text-xs text-white">
                {speedKmh} km/h
              </span>
            </div>

            <div className="h-5 w-px bg-white/20" />

            <div>
              <span className="text-[9px] text-white/50 uppercase font-bold tracking-wider block">
                Remaining Distance
              </span>
              <span className="font-mono font-black text-xs text-white">
                {(Math.max(0, 1.8 * (1 - progress))).toFixed(2)} km
              </span>
            </div>

            <div className="h-5 w-px bg-white/20 hidden md:block" />

            <div className="hidden md:block">
              <span className="text-[9px] text-white/50 uppercase font-bold tracking-wider block">
                Target Doorstep
              </span>
              <span className="font-medium text-[11px] text-white/90 truncate max-w-[190px] block">
                {order.address}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] text-[#FF5757] uppercase font-bold tracking-wider block">
              Direct Route
            </span>
            <span className="font-bold text-xs text-emerald-400 flex items-center gap-1 justify-end">
              <ShieldCheck className="w-3.5 h-3.5" />
              10-Min GPS Transit
            </span>
          </div>
        </div>
      </div>

      {/* Route Waypoints Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-black/70 bg-white p-2.5 rounded-sm border border-black/10">
        <div className="flex items-center gap-2">
          <Warehouse className="w-3.5 h-3.5 text-[#FF5757] shrink-0" />
          <span className="truncate">
            <strong>Origin:</strong> SoHo Dark Store Hub (108 Mercer St)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="truncate">
            <strong>Destination:</strong> {order.address}, {order.city || 'NY'} {order.postalCode}
          </span>
        </div>
      </div>
    </div>
  );
};
