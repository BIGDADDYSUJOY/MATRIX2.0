
import React, { useEffect, useRef } from 'react';
import { WaveState } from '../types';

interface WaveEngineProps {
  waveState: WaveState;
}

const WaveEngine: React.FC<WaveEngineProps> = ({ waveState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveStateRef = useRef(waveState);

  // Sync ref with latest props to avoid effect re-runs
  waveStateRef.current = waveState;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement?.getBoundingClientRect();
      const displayWidth = rect?.width || 800;
      const displayHeight = rect?.height || 300;

      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      const state = waveStateRef.current;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      ctx.clearRect(0, 0, width, height);

      const { targetFrequency, targetIntensity, chaos, phase, mode } = state;
      const currentFrequency = targetFrequency; // Smooth transition could be added later
      const currentIntensity = targetIntensity;
      const centerY = height / 2;

      // Optimization: Pre-calculate factors to minimize per-pixel computation
      const invWidth = 1 / width;
      const freqFactor = Math.PI * 10 * currentFrequency;
      const ampFactor = currentIntensity * 100;
      const chaosAmp = chaos * 50;

      // Draw Grid
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Wave
      ctx.beginPath();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';

      for (let x = 0; x < width; x++) {
        const normalizedX = x * invWidth;
        let y = 0;

        if (mode === 'Traveling') {
          y = Math.sin(normalizedX * freqFactor + time + phase) * ampFactor;
        } else {
          // Standing Wave
          y = Math.sin(normalizedX * freqFactor) * Math.cos(time + phase) * ampFactor;
        }

        // Add Chaos
        const chaosFactor = Math.sin(time * 2 + normalizedX * 20) * chaosAmp;
        y += chaosFactor;

        if (x === 0) ctx.moveTo(x, centerY + y);
        else ctx.lineTo(x, centerY + y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Particles (Consciousness Particles)
      const particleCount = 2;
      const colors = ['#ef4444', '#22c55e'];
      const halfWidth = width * 0.5;
      for (let i = 0; i < particleCount; i++) {
        const px = (time * 100 + i * halfWidth) % width;
        const pNormalizedX = px * invWidth;
        let py = Math.sin(pNormalizedX * freqFactor + time + phase) * ampFactor;
        const pChaos = Math.sin(time * 2 + pNormalizedX * 20) * chaosAmp;
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
      ctx.fillText(`Phase: ${state.phase.toFixed(2)} rad`, dialX - 40, dialY + dialRadius + 20);

      time += 0.05;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []); // Empty dependency array: animation loop runs continuously

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
    />
  );
};

export default WaveEngine;
