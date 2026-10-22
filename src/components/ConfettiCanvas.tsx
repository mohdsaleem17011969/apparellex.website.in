import React, { useEffect, useRef } from 'react';

interface ConfettiCanvasProps {
  active: boolean;
  onComplete?: () => void;
  durationMs?: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: 'rect' | 'circle' | 'ribbon';
  width: number;
  height: number;
  rotation: number;
  rotationSpeed: number;
  tilt: number;
  tiltSpeed: number;
  opacity: number;
}

const LUXURY_PALETTE = [
  '#FF5757', // Apparellex Coral Red
  '#FF8585', // Soft Coral
  '#E5B869', // Champagne Gold
  '#F4D085', // Light Gold
  '#111111', // Matte Noir
  '#FFFFFF', // Pure White
  '#CBD5E1', // Silver Sheen
];

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({
  active,
  onComplete,
  durationMs = 4000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const startTime = performance.now();

    // Set canvas dimensions to parent bounding rect
    const updateSize = () => {
      if (!canvas || !canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    updateSize();

    const parentWidth = canvas.parentElement ? canvas.parentElement.clientWidth : 600;
    const parentHeight = canvas.parentElement ? canvas.parentElement.clientHeight : 500;

    // Create a tasteful, subtle count of particles (~45-55)
    const particleCount = 52;
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const color = LUXURY_PALETTE[Math.floor(Math.random() * LUXURY_PALETTE.length)];
      const rand = Math.random();
      const shape: Particle['shape'] = rand > 0.6 ? 'rect' : rand > 0.3 ? 'ribbon' : 'circle';

      // Launch particles from upper center area with gentle outwards spread
      const originX = parentWidth * (0.35 + Math.random() * 0.3);
      const originY = parentHeight * (0.12 + Math.random() * 0.1);

      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.4; // Upwards cone
      const speed = 3.5 + Math.random() * 5.5;

      particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 3 + Math.random() * 3,
        color,
        shape,
        width: shape === 'ribbon' ? 3 + Math.random() * 2 : 5 + Math.random() * 5,
        height: shape === 'ribbon' ? 10 + Math.random() * 6 : 4 + Math.random() * 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 6,
        tilt: Math.random() * Math.PI,
        tiltSpeed: 0.05 + Math.random() * 0.08,
        opacity: 1,
      });
    }

    const render = (now: number) => {
      const elapsed = now - startTime;
      const progress = elapsed / durationMs;

      ctx.clearRect(0, 0, parentWidth, parentHeight);

      let aliveCount = 0;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Apply physics
        p.vy += 0.13; // gentle gravity
        p.vx *= 0.985; // horizontal drag
        p.vy *= 0.99; // vertical drag

        // Mild oscillating breeze effect
        p.x += p.vx + Math.sin(p.tilt) * 0.8;
        p.y += p.vy;

        p.rotation += p.rotationSpeed;
        p.tilt += p.tiltSpeed;

        // Fade out smoothly in the last third of duration
        if (progress > 0.65) {
          p.opacity = Math.max(0, 1 - (progress - 0.65) / 0.35);
        }

        if (p.opacity > 0 && p.y < parentHeight + 20) {
          aliveCount++;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.scale(Math.cos(p.tilt), 1); // 3D flip effect
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          if (p.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else {
            // Rect or ribbon
            ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
          }

          ctx.restore();
        }
      }

      if (progress < 1 && aliveCount > 0) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, parentWidth, parentHeight);
        if (onComplete) onComplete();
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, durationMs, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-40 w-full h-full"
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
};
