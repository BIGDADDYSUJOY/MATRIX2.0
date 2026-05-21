
import React, { useEffect, useRef } from 'react';
import { WaveState } from '../types';

interface WaveEngineProps {
  waveState: WaveState;
}

const WaveEngine: React.FC<WaveEngineProps> = ({ waveState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Optimization: Use a ref bridge to access the latest waveState in the animation loop
  // without triggering a re-setup of the entire requestAnimationFrame cycle on every update.
  const waveStateRef = useRef(waveState);

  useEffect(() => {
    waveStateRef.current = waveState;
  }, [waveState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 800;
      canvas.height = canvas.parentElement?.clientHeight || 300;
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const { targetFrequency, targetIntensity, chaos, phase, mode } = waveStateRef.current;
      const currentFrequency = targetFrequency; // Smooth transition could be added later
      const currentIntensity = targetIntensity;
      const centerY = canvas.height / 2;
      const width = canvas.width;

      // Draw Grid
      // Optimization: Batch all grid lines into a single path and stroke call to minimize GPU draw calls.
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      ctx.beginPath();
      for (let x = 0; x < width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
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

      // Optimization: Pre-calculate loop-invariant values outside the pixel loop.
      const invWidth = 1 / width;
      const freqFactor = Math.PI * 10 * currentFrequency * invWidth;
      const intensityFactor = currentIntensity * 100;
      const chaosIntensity = chaos * 50;

      for (let x = 0; x < width; x++) {
        const angle = x * freqFactor;
        let y = 0;

        if (mode === 'Traveling') {
          y = Math.sin(angle + time + phase) * intensityFactor;
        } else {
          // Standing Wave
          y = Math.sin(angle) * Math.cos(time + phase) * intensityFactor;
        }

        // Add Chaos
        const chaosFactor = Math.sin(time * 2 + x * invWidth * 20) * chaosIntensity;
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
        let py = Math.sin(pNormalizedX * Math.PI * 10 * currentFrequency + time + phase) * (currentIntensity * 100);
        const pChaos = Math.sin(time * 2 + pNormalizedX * 20) * chaos * 50;
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
      ctx.fillText(`Phase: ${waveStateRef.current.phase.toFixed(2)} rad`, dialX - 40, dialY + dialRadius + 20);

      time += 0.05;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
    />
  );
};

export default WaveEngine;
