
import React, { useEffect, useRef } from 'react';
import { WaveState } from '../types';

interface WaveEngineProps {
  waveState: WaveState;
}

const WaveEngine: React.FC<WaveEngineProps> = ({ waveState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(waveState);

  // Sync ref with latest prop state without re-triggering effect
  useEffect(() => {
    stateRef.current = waveState;
  }, [waveState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Use alpha: false for performance since background is solid black
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const dimensions = { width: 0, height: 0 };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;

      dimensions.width = rect.width;
      dimensions.height = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      const { width, height } = dimensions;
      if (width === 0) {
        animationId = requestAnimationFrame(draw);
        return;
      }

      // Faster clear on opaque canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const { targetFrequency, targetIntensity, chaos, phase, mode } = stateRef.current;
      const currentFrequency = targetFrequency;
      const currentIntensity = targetIntensity;
      const centerY = height / 2;

      // Optimization: Hoist invariant calculations
      const invWidth = 1 / width;
      const freqFactor = Math.PI * 10 * currentFrequency * invWidth;
      const ampFactor = currentIntensity * 100;
      const chaosFactorBase = chaos * 50;
      const chaosXFactor = 20 * invWidth;
      const cosFactor = mode === 'Standing' ? Math.cos(time + phase) : 1;

      // Draw Grid - Batched for performance
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // Draw Wave
      ctx.beginPath();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';

      for (let x = 0; x < width; x++) {
        const angle = x * freqFactor;
        let y = 0;

        if (mode === 'Traveling') {
          y = Math.sin(angle + time + phase) * ampFactor;
        } else {
          // Standing Wave
          y = Math.sin(angle) * cosFactor * ampFactor;
        }

        // Add Chaos
        const chaosFactor = Math.sin(time * 2 + x * chaosXFactor) * chaosFactorBase;
        y += chaosFactor;

        if (x === 0) ctx.moveTo(x, centerY + y);
        else ctx.lineTo(x, centerY + y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Particles (Consciousness Particles)
      const particleCount = 2;
      const colors = ['#ef4444', '#22c55e'];
      const pTimeOffset = time + phase;
      for (let i = 0; i < particleCount; i++) {
        const px = (time * 100 + i * width / 2) % width;
        const pAngle = px * freqFactor;
        let py = Math.sin(pAngle + pTimeOffset) * ampFactor;
        const pChaos = Math.sin(time * 2 + px * chaosXFactor) * chaosFactorBase;
        py += pChaos;

        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(px, centerY + py, 4, 0, Math.PI * 2);
        ctx.fill();
        // Glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = colors[i % colors.length];
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw Phase Dial (Top Right)
      const dialX = width - 80;
      const dialY = 60;
      const dialRadius = 30;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.arc(dialX, dialY, dialRadius, 0, Math.PI * 2);
      ctx.stroke();

      const angle = (phase + time) % (Math.PI * 2);
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(dialX, dialY);
      ctx.lineTo(
        dialX + Math.cos(angle) * dialRadius,
        dialY + Math.sin(angle) * dialRadius
      );
      ctx.stroke();

      // UI Text
      const currentPhase = stateRef.current.phase;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '10px monospace';
      ctx.fillText(`Phase: ${currentPhase.toFixed(2)} rad`, dialX - 40, dialY + dialRadius + 20);

      time += 0.05;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []); // Run once on mount

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
    />
  );
};

export default WaveEngine;
