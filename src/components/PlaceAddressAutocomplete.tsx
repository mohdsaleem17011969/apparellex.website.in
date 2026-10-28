/// <reference types="@types/google.maps" />
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { MapPin, Search, Loader2, Check, Sparkles, Navigation } from 'lucide-react';

export interface ParsedAddress {
  formattedAddress: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  location?: { lat: number; lng: number };
}

interface PlaceAddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onAddressSelect: (parsed: ParsedAddress) => void;
  placeholder?: string;
  required?: boolean;
}

export const PlaceAddressAutocomplete: React.FC<PlaceAddressAutocompleteProps> = ({
  value,
  onChange,
  onAddressSelect,
  placeholder = 'Start typing street address, apartment, or landmark...',
  required = true,
}) => {
  const placesLib = useMapsLibrary('places');

  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompleteSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const sessionTokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch suggestions using modern AutocompleteSuggestion API
  useEffect(() => {
    if (!placesLib || !value || value.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const { AutocompleteSessionToken, AutocompleteSuggestion } = placesLib;

    // Create session token if needed (reused per search session until place selected)
    if (!sessionTokenRef.current) {
      sessionTokenRef.current = new AutocompleteSessionToken();
    }

    const request: google.maps.places.AutocompleteRequest = {
      input: value,
      sessionToken: sessionTokenRef.current,
      region: 'in',
    };

    let isMounted = true;
    setIsLoading(true);

    AutocompleteSuggestion.fetchAutocompleteSuggestions(request)
      .then((res) => {
        if (!isMounted) return;
        const validSuggestions = res.suggestions || [];
        setSuggestions(validSuggestions);
        setIsOpen(validSuggestions.length > 0);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!isMounted) return;
        console.warn('Google Places Autocomplete notice:', err);
        setSuggestions([]);
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [placesLib, value]);

  // Handle selection of a prediction
  const handleSelectSuggestion = useCallback(
    async (suggestion: google.maps.places.AutocompleteSuggestion) => {
      if (!placesLib || !suggestion.placePrediction) return;

      setIsLoading(true);
      setIsOpen(false);

      try {
        // 1. Convert prediction to Place object
        const place = suggestion.placePrediction.toPlace();

        // 2. Fetch required details (promise-based)
        await place.fetchFields({
          fields: ['displayName', 'formattedAddress', 'addressComponents', 'location'],
        });

        // 3. Reset session token per Google billing recommendations
        sessionTokenRef.current = null;

        // 4. Parse address components
        let streetNumber = '';
        let route = '';
        let city = '';
        let state = '';
        let postalCode = '';
        let country = '';

        if (place.addressComponents) {
          for (const comp of place.addressComponents) {
            const types = comp.types || [];
            if (types.includes('street_number')) streetNumber = comp.longText || '';
            else if (types.includes('route')) route = comp.longText || '';
            else if (types.includes('locality') || types.includes('sublocality')) city = comp.longText || '';
            else if (types.includes('administrative_area_level_1')) state = comp.shortText || '';
            else if (types.includes('postal_code')) postalCode = comp.longText || '';
            else if (types.includes('country')) country = comp.shortText || '';
          }
        }

        const street = streetNumber ? `${streetNumber} ${route}`.trim() : route || place.displayName || value;
        const formattedAddress = place.formattedAddress || `${street}, ${city}`;

        let loc: { lat: number; lng: number } | undefined;
        if (place.location) {
          loc = {
            lat: typeof place.location.lat === 'function' ? place.location.lat() : (place.location as any).lat,
            lng: typeof place.location.lng === 'function' ? place.location.lng() : (place.location as any).lng,
          };
        }

        onChange(street);
        onAddressSelect({
          formattedAddress,
          street,
          city: city || 'Mumbai',
          state: state || 'MH',
          postalCode: postalCode || '400053',
          country: country || 'IN',
          location: loc || { lat: 19.1382, lng: 72.8258 },
        });
      } catch (err) {
        console.error('Error fetching place fields:', err);
      } finally {
        setIsLoading(false);
      }
    },
    [placesLib, onChange, onAddressSelect, value]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
        e.preventDefault();
        handleSelectSuggestion(suggestions[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          required={required}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setHighlightedIndex(-1);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full text-xs pl-9 pr-9 py-3 border border-black/20 rounded-sm bg-white focus:border-[#FF5757] outline-none transition"
        />
        <MapPin className="w-4 h-4 absolute left-3 top-3.5 text-black/40 pointer-events-none" />

        <div className="absolute right-3 top-3.5 flex items-center gap-1.5 text-black/40">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-[#FF5757]" />
          ) : (
            <span title="Google Places Autocomplete Active" className="inline-flex">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5757]" />
            </span>
          )}
        </div>
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-black/15 rounded-sm shadow-2xl z-50 overflow-hidden animate-fadeIn max-h-64 overflow-y-auto">
          <div className="px-3 py-1.5 bg-[#FAF8F2] border-b border-black/10 flex items-center justify-between text-[10px] text-black/50 font-bold uppercase tracking-wider">
            <span>Google Places Address Suggestions</span>
            <span className="text-[#FF5757]">Instant Pincode Auto-Fill</span>
          </div>

          <ul className="divide-y divide-black/5">
            {suggestions.map((suggestion, index) => {
              const mainText = suggestion.placePrediction?.mainText?.toString() || '';
              const secondaryText = suggestion.placePrediction?.secondaryText?.toString() || '';
              const isHighlighted = highlightedIndex === index;

              return (
                <li
                  key={index}
                  onClick={() => handleSelectSuggestion(suggestion)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`p-3 text-xs flex items-start gap-2.5 cursor-pointer transition ${
                    isHighlighted ? 'bg-[#FF5757]/10 text-black' : 'hover:bg-black/[0.03] text-black/80'
                  }`}
                >
                  <MapPin className="w-4 h-4 text-[#FF5757] shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-black text-xs truncate">
                      {mainText || suggestion.placePrediction?.text?.toString()}
                    </p>
                    {secondaryText && (
                      <p className="text-[11px] text-black/50 truncate mt-0.5">{secondaryText}</p>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="px-3 py-1.5 bg-white border-t border-black/10 flex items-center justify-between text-[9px] text-black/40">
            <span>Use ↑↓ to navigate, Enter to select</span>
            <span className="font-semibold text-black/60">Powered by Google</span>
          </div>
        </div>
      )}
    </div>
  );
};
