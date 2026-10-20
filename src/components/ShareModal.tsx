import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageCircle, ExternalLink } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotifyToast: (msg: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onNotifyToast,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  // Preferred public shared URL
  const sharedUrl =
    typeof window !== 'undefined' && window.location.origin.includes('run.app')
      ? window.location.href
      : 'https://ais-pre-nymurarspls3yqnu5ugsbj-563741178923.asia-southeast1.run.app';

  const shareText = `Check out Apparellex — 10-minute ultra-fast luxury fashion delivered to your doorstep! Curated by Shaikh Kamran: ${sharedUrl}`;

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sharedUrl);
    setCopied(true);
    onNotifyToast('Website link copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Apparellex | Ultra-Fast Unique Fashion',
        text: 'Get trending, hand-picked fashion delivered to your doorstep in 10 minutes.',
        url: sharedUrl,
      }).catch(() => {});
    } else {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-md w-full rounded-sm overflow-hidden shadow-2xl relative border border-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-black/10 flex items-center justify-between bg-[#111111] text-white">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#FF5757]" />
            <h2 id="share-modal-title" className="text-xs font-black font-fashion uppercase tracking-wider">
              Share Apparellex With Friends
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition p-1 cursor-pointer"
            aria-label="Close share dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="text-center">
            <h3 className="text-xl font-bold font-fashion text-[#1a1a1a]">
              STYLE AT THE SPEED OF LIGHT
            </h3>
            <p className="text-xs text-black/60 mt-1 max-w-xs mx-auto leading-relaxed">
              Invite your friends to experience 10-minute micro-hub fashion delivery with complimentary doorstep fit checks.
            </p>
          </div>

          {/* Primary Action: Direct WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-3.5 px-4 rounded-sm text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 transition-all shadow-md active:scale-98"
          >
            <MessageCircle className="w-5 h-5 fill-white text-white" />
            <span>Share Directly on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </a>

          {/* Copy URL Row */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-black/60">
              Or Copy Website Link:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={sharedUrl}
                className="w-full text-xs p-2.5 bg-[#FAF8F2] border border-black/20 rounded-sm text-black/80 font-mono truncate select-all"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 bg-[#1a1a1a] hover:bg-[#FF5757] text-white rounded-sm text-xs font-bold uppercase tracking-wider transition cursor-pointer shrink-0 flex items-center gap-1.5"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* WhatsApp Message Preview */}
          <div className="bg-[#FAF8F2] p-4 rounded-sm border border-black/10 text-xs space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-black/50 block">
              WhatsApp Message Preview:
            </span>
            <p className="text-black/80 font-light italic leading-relaxed">
              "Check out Apparellex — 10-minute ultra-fast luxury fashion delivered to your doorstep! Curated by Shaikh Kamran: {sharedUrl}"
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-black/10 flex items-center justify-between text-xs text-black/50">
          <span>Works on mobile and WhatsApp Web</span>
          <button
            onClick={onClose}
            className="text-black font-semibold hover:underline cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
