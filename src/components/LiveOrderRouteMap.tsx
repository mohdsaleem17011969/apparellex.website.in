import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Map, AdvancedMarker, Polyline, useMap } from '@vis.gl/react-google-maps';
import { Bike, MapPin, Zap, Navigation, ShieldCheck, Compass, LocateFixed } from 'lucide-react';
import { OrderDetails } from './OrderTracker';

interface LiveOrderRouteMapProps {
  order: OrderDetails;
  secondsRemaining: number;
}

// Generate intermediate waypoints between micro-hub and customer address
const SOHO_HUB_POS = { lat: 40.7259, lng: -73.9983 };

const ROUTE_WAYPOINTS = [
  { lat: 40.7259, lng: -73.9983, street: 'SoHo Micro-Hub Loading Bay' },
  { lat: 40.7272, lng: -73.9975, street: 'Mercer St & Spring St' },
  { lat: 40.7291, lng: -73.9961, street: 'Broadway & Prince St' },
  { lat: 40.7315, lng: -73.9942, street: 'Broadway & 8th St' },
  { lat: 40.7348, lng: -73.9922, street: 'Union Square South' },
  { lat: 40.7380, lng: -73.9902, street: 'Broadway & 18th St' },
  { lat: 40.7420, lng: -73.9918, street: '6th Ave & 21st St' },
  { lat: 40.7465, lng: -73.9935, street: '7th Ave & 26th St' },
  { lat: 40.7505, lng: -73.9934, street: 'Destination: Evergreen Terrace' },
];

export const LiveOrderRouteMap: React.FC<LiveOrderRouteMapProps> = ({ order, secondsRemaining }) => {
  const map = useMap();

  // Progress from 0 (just started, 600s) to 1 (arrived, 0s)
  const progress = Math.max(0, Math.min(1, (600 - secondsRemaining) / 600));

  // Compute current courier location along waypoints
  const { currentPos, currentStreet, speedKmh } = useMemo(() => {
    if (progress <= 0.1) {
      // Stage 1: Order received & preparing at hub
      return {
        currentPos: ROUTE_WAYPOINTS[0],
        currentStreet: 'Staging at SoHo Micro-Hub Pod',
        speedKmh: 0,
      };
    }

    if (progress >= 0.95) {
      // Stage 4: Arrived at doorstep
      const last = ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1];
      return {
        currentPos: last,
        currentStreet: 'Arrived at your doorstep (5-min fit check ready)',
        speedKmh: 0,
      };
    }

    // Active transit along waypoints
    const transitProgress = (progress - 0.1) / 0.85; // 0 to 1
    const totalSegments = ROUTE_WAYPOINTS.length - 1;
    const segmentIndex = Math.min(totalSegments - 1, Math.floor(transitProgress * totalSegments));
    const segmentSubProgress = (transitProgress * totalSegments) - segmentIndex;

    const pA = ROUTE_WAYPOINTS[segmentIndex];
    const pB = ROUTE_WAYPOINTS[segmentIndex + 1];

    const lat = pA.lat + (pB.lat - pA.lat) * segmentSubProgress;
    const lng = pA.lng + (pB.lng - pA.lng) * segmentSubProgress;

    return {
      currentPos: { lat, lng },
      currentStreet: pB.street,
      speedKmh: Math.round(24 + Math.sin(progress * 20) * 6),
    };
  }, [progress]);

  const customerPos = ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1];

  // Camera re-center handler
  const handleRecenterCourier = () => {
    if (map) {
      map.panTo(currentPos);
      map.setZoom(16);
    }
  };

  const handleFitRoute = () => {
    if (map && typeof window !== 'undefined' && (window as any).google?.maps) {
      const bounds = new (window as any).google.maps.LatLngBounds();
      ROUTE_WAYPOINTS.forEach((pt) => bounds.extend(pt));
      map.fitBounds(bounds, 40);
    }
  };

  return (
    <div className="space-y-3 bg-[#FAF8F2] p-4 rounded-sm border border-black/15 shadow-sm">
      {/* Live Radar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-black/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#111111] text-[#FF5757] flex items-center justify-center shrink-0">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-[#1a1a1a]">
                Google Maps GPS Courier Radar
              </h4>
              <span className="text-[9px] bg-[#FF5757] text-white px-1.5 py-0.5 rounded font-black uppercase tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Live Telemetry
              </span>
            </div>
            <p className="text-[11px] text-black/60 truncate max-w-sm">
              Courier Tariq M. · Super73 RX Cargo · {currentStreet}
            </p>
          </div>
        </div>

        {/* View Controls */}
        <div className="flex items-center gap-2">
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
            title="View Full Route"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>
        </div>
      </div>

      {/* Map Viewport with strict height */}
      <div className="w-full h-[320px] relative rounded-sm overflow-hidden border border-black/15 shadow-inner">
        <Map
          defaultCenter={{ lat: 40.738, lng: -73.995 }}
          defaultZoom={14}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          gestureHandling="cooperative"
          disableDefaultUI={false}
          className="w-full h-full"
        >
          {/* Complete Courier Dispatch Route Polyline */}
          <Polyline
            path={ROUTE_WAYPOINTS}
            strokeColor="#111111"
            strokeOpacity={0.4}
            strokeWeight={4}
          />

          {/* Active Completed Segment Polyline */}
          <Polyline
            path={[ROUTE_WAYPOINTS[0], currentPos]}
            strokeColor="#FF5757"
            strokeOpacity={1.0}
            strokeWeight={5}
          />

          {/* Micro-Hub Origin Advanced Marker */}
          <AdvancedMarker
            position={ROUTE_WAYPOINTS[0]}
            title="Apparellex SoHo Micro-Hub"
          >
            <div className="w-8 h-8 rounded-full bg-[#111111] text-white border-2 border-white flex items-center justify-center shadow-md">
              <span className="text-[10px] font-black font-fashion">HUB</span>
            </div>
          </AdvancedMarker>

          {/* Customer Destination Advanced Marker */}
          <AdvancedMarker
            position={customerPos}
            title={`Customer Address: ${order.address}`}
          >
            <div className="w-9 h-9 rounded-full bg-emerald-600 text-white border-2 border-white flex items-center justify-center shadow-xl">
              <MapPin className="w-4 h-4" />
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
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>{speedKmh} km/h</span>
              </div>
            </div>
          </AdvancedMarker>
        </Map>

        {/* Live HUD telemetry overlay */}
        <div className="absolute bottom-3 left-3 right-3 bg-black/85 backdrop-blur-md px-3.5 py-2.5 rounded-sm border border-white/10 text-white flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div>
              <span className="text-[9px] text-white/50 uppercase font-bold tracking-wider block">
                Current Speed
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
            <div className="h-5 w-px bg-white/20 hidden sm:block" />
            <div className="hidden sm:block">
              <span className="text-[9px] text-white/50 uppercase font-bold tracking-wider block">
                Target Doorstep
              </span>
              <span className="font-medium text-[11px] text-white/90 truncate max-w-[180px] block">
                {order.address}
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] text-[#FF5757] uppercase font-bold tracking-wider block">
              Direct Radar
            </span>
            <span className="font-bold text-xs text-emerald-400 flex items-center gap-1 justify-end">
              <ShieldCheck className="w-3.5 h-3.5" />
              Encrypted Route
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
