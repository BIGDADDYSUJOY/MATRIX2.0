
import React, { useEffect, useRef } from 'react';
import { WaveState } from '../types';

interface WaveEngineProps {
  waveState: WaveState;
}

/**
 * WaveEngine: High-performance canvas renderer for SHUNYA wave dynamics.
 *
 * OPTIMIZATIONS:
 * 1. Prop-to-Ref Bridging: Uses a ref for waveState to avoid expensive useEffect
 *    cleanup/restart cycles on every prop change.
 * 2. HiDPI Scaling: Automatically adjusts for window.devicePixelRatio to maintain
 *    crisp rendering on Retina displays.
 * 3. Batch Drawing: Grid lines are batched into a single path to reduce draw calls.
 * 4. Pre-calculation: Mathematical constants are calculated once per frame outside
 *    the pixel-iteration loops.
 */
const WaveEngine: React.FC<WaveEngineProps> = ({ waveState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(waveState);
  const dimensionsRef = useRef({ width: 0, height: 0, dpr: 1 });

  // Keep stateRef in sync without triggering effects
  useEffect(() => {
    stateRef.current = waveState;
  }, [waveState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.parentElement?.clientWidth || 800;
      const height = canvas.parentElement?.clientHeight || 300;

      canvas.width = width * dpr;
      canvas.height = height * dpr;

      // Reset transform before scaling to avoid cumulative effects
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      dimensionsRef.current = { width, height, dpr };
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      const { width, height } = dimensionsRef.current;
      const { targetFrequency, targetIntensity, chaos, phase, mode } = stateRef.current;

      ctx.clearRect(0, 0, width, height);

      const centerY = height / 2;
      const gridSize = 40;

      // OPTIMIZATION: Batched Grid Rendering
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();

      // OPTIMIZATION: Pre-calculate constants outside loop
      const freqFactor = Math.PI * 10 * targetFrequency;
      const intensityPixels = targetIntensity * 100;
      const chaosAmplitude = chaos * 50;
      const time2 = time * 2;

      // Draw Wave
      ctx.beginPath();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';

      for (let x = 0; x < width; x++) {
        const normalizedX = x / width;
        let y = 0;

        if (mode === 'Traveling') {
          y = Math.sin(normalizedX * freqFactor + time + phase) * intensityPixels;
        } else {
          // Standing Wave
          y = Math.sin(normalizedX * freqFactor) * Math.cos(time + phase) * intensityPixels;
        }

        // Add Chaos
        const chaosFactor = Math.sin(time2 + normalizedX * 20) * chaosAmplitude;
        y += chaosFactor;

        if (x === 0) ctx.moveTo(x, centerY + y);
        else ctx.lineTo(x, centerY + y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Particles (Consciousness Particles)
      const particleCount = 2;
      const colors = ['#ef4444', '#22c55e'];
      for (let i = 0; i < particleCount; i++) {
        const px = (time * 100 + i * width / 2) % width;
        const pNormalizedX = px / width;

        let py = 0;
        if (mode === 'Traveling') {
            py = Math.sin(pNormalizedX * freqFactor + time + phase) * intensityPixels;
        } else {
            py = Math.sin(pNormalizedX * freqFactor) * Math.cos(time + phase) * intensityPixels;
        }

        const pChaos = Math.sin(time2 + pNormalizedX * 20) * chaosAmplitude;
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
      ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.font = '10px monospace';
      ctx.fillText(`Phase: ${stateRef.current.phase.toFixed(2)} rad`, dialX - 40, dialY + dialRadius + 20);

      time += 0.05;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []); // Empty dependency array ensures this effect only runs once

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
    />
  );
};

export default WaveEngine;
