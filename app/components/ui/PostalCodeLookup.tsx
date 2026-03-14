"use client";

import React, { useState, useCallback } from "react";
import { Loader2, MapPin } from "lucide-react";

interface Place {
  placeName: string;
  state: string;
}

interface Props {
  onAddressFill: (address: string) => void;
}

export default function PostalCodeLookup({ onAddressFill }: Props) {
  const [postalCode, setPostalCode] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [lookingUp, setLookingUp] = useState(false);
  const [error, setError] = useState("");

  const lookup = useCallback(
    async (code: string) => {
      setLookingUp(true);
      setError("");
      setPlaces([]);

      try {
        const res = await fetch(`https://api.zippopotam.us/th/${code}`);
        if (!res.ok) {
          setError("ไม่พบรหัสไปรษณีย์นี้");
          return;
        }
        const data = await res.json();
        const foundPlaces: Place[] = (data.places || []).map((p: any) => ({
          placeName: p["place name"],
          state: p.state,
        }));
        setPlaces(foundPlaces);

        if (foundPlaces.length > 0) {
          const p = foundPlaces[0];
          onAddressFill(`${p.placeName}, ${p.state}, Thailand ${code}`);
        }
      } catch {
        setError("ค้นหาไม่สำเร็จ");
      } finally {
        setLookingUp(false);
      }
    },
    [onAddressFill]
  );

  const handleChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 5);
    setPostalCode(digits);
    setError("");
    setPlaces([]);

    if (digits.length === 5) {
      lookup(digits);
    }
  };

  const selectPlace = (p: Place) => {
    onAddressFill(`${p.placeName}, ${p.state}, Thailand ${postalCode}`);
  };

  return (
    <div className="space-y-2">
      <div>
        <label className="text-sm font-bold text-teak-dark mb-1 flex items-center gap-1 block">
          <MapPin size={14} className="text-gold" /> รหัสไปรษณีย์ / Postal Code
        </label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            maxLength={5}
            value={postalCode}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="e.g. 50230"
            className="w-full py-3 px-4 border-2 border-cream-alt rounded-lg focus:border-gold focus:ring-1 focus:ring-gold outline-none bg-white text-text-main"
          />
          {lookingUp && (
            <Loader2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gold" />
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {places.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {places.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => selectPlace(p)}
              className="text-xs px-3 py-1.5 bg-gold-soft/20 border border-gold-soft/40 rounded-full text-teak-dark hover:bg-gold-soft/40 transition-colors"
            >
              {p.placeName}
            </button>
          ))}
        </div>
      )}

      {places.length > 0 && !lookingUp && (
        <p className="text-xs text-success flex items-center gap-1">
          <MapPin size={12} />
          {places[0].placeName}, {places[0].state}
        </p>
      )}
    </div>
  );
}
