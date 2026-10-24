import React, { useState, useEffect } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';

interface GoogleMapsWrapperProps {
  children: React.ReactNode;
}

const DEFAULT_API_KEY =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_MAPS_API_KEY) ||
  'AIzaSyB1yiJnC4QnoCdUbBx0q8y48bGkV-kI7jE';

export const GoogleMapsWrapper: React.FC<GoogleMapsWrapperProps> = ({ children }) => {
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  useEffect(() => {
    // Tier 1 Quota Defense: Auth failure & console error monitoring
    const handleQuotaEvent = () => {
      setQuotaExceeded(true);
    };

    window.addEventListener('gmp-quota-exceeded', handleQuotaEvent);

    if (typeof window !== 'undefined') {
      (window as any).gm_authFailure = () => {
        window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
      };

      const origError = console.error;
      console.error = (...args: unknown[]) => {
        origError.apply(console, args);
        const msg = args.map((a) => String(a)).join(' ');
        if (msg.includes('OverQuotaMapError') || msg.includes('QuotaExceededError')) {
          window.dispatchEvent(new CustomEvent('gmp-quota-exceeded'));
        }
      };
    }

    return () => {
      window.removeEventListener('gmp-quota-exceeded', handleQuotaEvent);
    };
  }, []);

  return (
    <APIProvider apiKey={DEFAULT_API_KEY} libraries={['places', 'routes', 'geometry']}>
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-0 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}
      {children}
    </APIProvider>
  );
};
