import React, { useState, useEffect, useMemo } from 'react';
import { Map, AdvancedMarker, Circle, useMap } from '@vis.gl/react-google-maps';
import { Bike, MapPin, Zap, Navigation, ShieldCheck, Clock } from 'lucide-react';

interface PincodeDeliveryMapProps {
  pincode: string;
  isEligible: boolean;
}

interface MicroHubLocation {
  id: string;
  name: string;
  address: string;
  position: { lat: number; lng: number };
  couriersAvailable: number;
}

const MICRO_HUBS: MicroHubLocation[] = [
  {
    id: 'hub-andheri-west',
    name: 'Andheri West Flagship Micro-Hub (Pod 01)',
    address: 'Mega Mall, New Link Road, Oshiwara, Andheri West, Mumbai 400053',
    position: { lat: 19.1438, lng: 72.8312 },
    couriersAvailable: 8,
  },
  {
    id: 'hub-lokhandwala',
    name: 'Lokhandwala Express Pod (Pod 02)',
    address: 'Lokhandwala Complex Market, Andheri West, Mumbai 400053',
    position: { lat: 19.1385, lng: 72.8265 },
    couriersAvailable: 6,
  },
  {
    id: 'hub-versova',
    name: 'Versova Coastal Hub (Pod 03)',
    address: 'Yari Road, Versova, Andheri West, Mumbai 400061',
    position: { lat: 19.1320, lng: 72.8155 },
    couriersAvailable: 5,
  },
  {
    id: 'hub-juhu',
    name: 'Juhu Prime Pod (Pod 04)',
    address: 'Juhu Tara Road, Mumbai 400049',
    position: { lat: 19.1025, lng: 72.8262 },
    couriersAvailable: 7,
  },
];

// Helper to resolve coordinates from common pincodes/neighborhoods in Andheri West, Mumbai
const resolvePincodePosition = (pincode: string): { position: { lat: number; lng: number }; label: string } => {
  const clean = pincode.toLowerCase().trim();
  if (clean.includes('400053') || clean.includes('lokhandwala') || clean.includes('andheri west') || clean.includes('oshiwara')) {
    return { position: { lat: 19.1382, lng: 72.8258 }, label: 'Lokhandwala Complex, Andheri West' };
  }
  if (clean.includes('400058') || clean.includes('station') || clean.includes('sv road') || clean.includes('amrut nagar')) {
    return { position: { lat: 19.1205, lng: 72.8465 }, label: 'Andheri West Station / SV Road' };
  }
  if (clean.includes('400061') || clean.includes('versova') || clean.includes('yari')) {
    return { position: { lat: 19.1315, lng: 72.8160 }, label: 'Versova, Andheri West' };
  }
  if (clean.includes('400049') || clean.includes('juhu')) {
    return { position: { lat: 19.1025, lng: 72.8262 }, label: 'Juhu / Vile Parle West' };
  }
  if (clean.includes('400102') || clean.includes('jogeshwari')) {
    return { position: { lat: 19.1390, lng: 72.8420 }, label: 'Oshiwara / Jogeshwari West' };
  }
  // Default to central Andheri West, Mumbai, Maharashtra
  return { position: { lat: 19.1363, lng: 72.8277 }, label: `${pincode} · Andheri West, Mumbai` };
};

// Calculates Euclidean distance approximation in km
const getDistanceKm = (
  p1: { lat: number; lng: number },
  p2: { lat: number; lng: number }
): number => {
  const dLat = (p2.lat - p1.lat) * 111.32;
  const dLng = (p2.lng - p1.lng) * (40075 * Math.cos(((p1.lat + p2.lat) / 2) * (Math.PI / 180)) / 360);
  return Math.sqrt(dLat * dLat + dLng * dLng);
};

export const PincodeDeliveryMap: React.FC<PincodeDeliveryMapProps> = ({ pincode, isEligible }) => {
  const { position: targetPos, label: zoneLabel } = useMemo(
    () => resolvePincodePosition(pincode),
    [pincode]
  );

  // Find nearest micro-hub
  const nearestHub = useMemo(() => {
    let closest = MICRO_HUBS[0];
    let minDist = getDistanceKm(targetPos, closest.position);
    for (let i = 1; i < MICRO_HUBS.length; i++) {
      const dist = getDistanceKm(targetPos, MICRO_HUBS[i].position);
      if (dist < minDist) {
        minDist = dist;
        closest = MICRO_HUBS[i];
      }
    }
    return closest;
  }, [targetPos]);

  const distanceKm = useMemo(() => {
    return Number(getDistanceKm(targetPos, nearestHub.position).toFixed(1));
  }, [targetPos, nearestHub]);

  const estimatedMins = Math.max(5, Math.min(10, Math.round(distanceKm * 2.8 + 3)));

  // Center between hub and destination
  const center = useMemo(() => ({
    lat: (targetPos.lat + nearestHub.position.lat) / 2,
    lng: (targetPos.lng + nearestHub.position.lng) / 2,
  }), [targetPos, nearestHub]);

  return (
    <div className="space-y-3">
      {/* Map Header telemetry */}
      <div className="flex items-center justify-between text-xs bg-[#111111] text-white px-3.5 py-2.5 rounded-t-sm">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-[11px] uppercase tracking-wider">
            Google Maps Radar Active
          </span>
          <span className="text-white/40">|</span>
          <span className="text-white/80 text-[11px] font-medium">{zoneLabel}</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
          <Zap className="w-3.5 h-3.5 text-[#FF5757] fill-[#FF5757]" />
          <span>{estimatedMins} Mins Dispatch</span>
        </div>
      </div>

      {/* Map Container with explicit CSS height */}
      <div className="w-full h-[260px] relative rounded-b-sm overflow-hidden border border-black/15 shadow-inner">
        <Map
          defaultCenter={center}
          defaultZoom={14}
          mapId="DEMO_MAP_ID"
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          gestureHandling="cooperative"
          disableDefaultUI={false}
          className="w-full h-full"
        >
          {/* Micro-Hub 10-Minute Courier Service Radius (1,800m) */}
          <Circle
            center={nearestHub.position}
            radius={1800}
            strokeColor="#FF5757"
            strokeOpacity={0.8}
            strokeWeight={2}
            fillColor="#FF5757"
            fillOpacity={0.08}
          />

          {/* Micro-Hub Advanced Marker */}
          <AdvancedMarker
            position={nearestHub.position}
            title={nearestHub.name}
          >
            <div className="relative group cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-[#111111] text-white border-2 border-[#FF5757] flex items-center justify-center shadow-xl">
                <Bike className="w-4 h-4 text-[#FF5757]" />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow">
                {nearestHub.name.split(' (')[0]}
              </div>
            </div>
          </AdvancedMarker>

          {/* Customer Destination Pincode Marker */}
          <AdvancedMarker
            position={targetPos}
            title={`Your Delivery Address: ${pincode}`}
          >
            <div className="relative group cursor-pointer animate-bounce">
              <div className="w-9 h-9 rounded-full bg-[#FF5757] text-white border-2 border-white flex items-center justify-center shadow-2xl">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#FF5757] text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded shadow">
                {pincode}
              </div>
            </div>
          </AdvancedMarker>
        </Map>

        {/* Floating Telemetry Pill */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-sm shadow-md border border-black/10 text-[11px] text-[#1a1a1a] flex items-center gap-2">
          <Navigation className="w-3.5 h-3.5 text-[#FF5757]" />
          <span>
            Distance: <strong>{distanceKm} km</strong> (~{estimatedMins} min courier ETA)
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
        <div className="bg-[#FAF8F2] border border-black/10 p-2.5 rounded-sm">
          <span className="text-[10px] text-black/50 uppercase font-bold tracking-wider block">
            Nearest Dispatch Hub
          </span>
          <span className="font-bold text-black text-xs truncate block mt-0.5">
            {nearestHub.name.split(' (')[0]}
          </span>
        </div>
        <div className="bg-[#FAF8F2] border border-black/10 p-2.5 rounded-sm">
          <span className="text-[10px] text-black/50 uppercase font-bold tracking-wider block">
            Fleet Capacity
          </span>
          <span className="font-bold text-emerald-700 text-xs flex items-center gap-1 mt-0.5">
            <Bike className="w-3.5 h-3.5 text-[#FF5757]" />
            {nearestHub.couriersAvailable} Couriers On Standby
          </span>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-[#FAF8F2] border border-black/10 p-2.5 rounded-sm">
          <span className="text-[10px] text-black/50 uppercase font-bold tracking-wider block">
            SLA Guarantee
          </span>
          <span className="font-bold text-black text-xs flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            10-Min Doorstep Try-On
          </span>
        </div>
      </div>
    </div>
  );
};
