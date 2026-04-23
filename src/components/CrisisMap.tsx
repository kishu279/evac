"use client";

import { useEffect, useRef, useState } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";

export const CrisisMap = ({ locationString }: { locationString?: string }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Default New Delhi
  const defaultCenter = { lat: 28.6139, lng: 77.2090 };

  useEffect(() => {
    const initMap = async () => {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.warn("No Google Maps API Key provided.");
        return;
      }
      setOptions({ key: apiKey, v: "weekly", libraries: ["places", "geocoding"] });
      await importLibrary("maps");

      if (mapRef.current && !map) {
        const newMap = new google.maps.Map(mapRef.current, {
          center: defaultCenter,
          zoom: 16,
          mapId: "DEMO_MAP_ID", // Using default styling or a map ID if configured
          disableDefaultUI: true,
          zoomControl: true,
          backgroundColor: '#09090b',
        });
        setMap(newMap);
      }
    };
    initMap();
  }, []);

  useEffect(() => {
    if (!map || !window.google) return;

    if (locationString) {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: locationString + " New Delhi" }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          const loc = results[0].geometry.location;
          map.setCenter(loc);
          
          // Clear previous markers/circles (for simplicity in this demo, we'll just draw new ones)
          new google.maps.Marker({
            map,
            position: loc,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#ef4444",
              fillOpacity: 1,
              strokeColor: "#ffffff",
              strokeWeight: 2,
            }
          });

          new google.maps.Circle({ map, center: loc, radius: 100, fillColor: "#ef4444", fillOpacity: 0.2, strokeColor: "#ef4444", strokeWeight: 1 });
          new google.maps.Circle({ map, center: loc, radius: 200, fillColor: "#eab308", fillOpacity: 0.15, strokeColor: "#eab308", strokeWeight: 1 });
        }
      });
    } else {
      map.setCenter(defaultCenter);
    }
  }, [map, locationString]);

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden flex flex-col h-[320px]">
      <div ref={mapRef} className="flex-1 w-full bg-zinc-950 relative">
        {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
          <div className="absolute inset-0 flex items-center justify-center text-zinc-500 text-sm p-4 text-center z-10">
            Google Maps API Key not configured. Map disabled.
          </div>
        )}
      </div>
      <div className="bg-zinc-950 p-2 border-t border-zinc-800 shrink-0 flex justify-center gap-4 text-xs font-bold text-zinc-400 uppercase tracking-widest">
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500" /> Danger (100m)</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500" /> Caution (200m)</div>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500" /> Safe</div>
      </div>
    </div>
  );
};
