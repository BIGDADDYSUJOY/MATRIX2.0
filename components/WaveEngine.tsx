
import React, { useEffect, useRef } from 'react';
import { WaveState } from '../types';

interface WaveEngineProps {
  waveState: WaveState;
}

const WaveEngine: React.FC<WaveEngineProps> = ({ waveState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Use a ref to bridge state into the animation loop without restarting the effect
  const stateRef = useRef(waveState);
  // Cache logical dimensions to avoid layout thrashing in the render loop
  const dimsRef = useRef({ width: 800, height: 300 });

  useEffect(() => {
    stateRef.current = waveState;
  }, [waveState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Performance: alpha: false for faster compositing since background is solid black
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.parentElement?.getBoundingClientRect();
      const width = rect?.width || 800;
      const height = rect?.height || 300;

      dimsRef.current = { width, height };

      // HiDPI Support: Scale internal resolution by DPR
      canvas.width = width * dpr;
      canvas.height = height * dpr;

      // Reset transform then apply scale to maintain logical coordinate system
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      // Style dimensions stay at logical size
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      const { width, height } = dimsRef.current;

      // Use fillRect instead of clearRect for context with alpha: false
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);

      const { targetFrequency, targetIntensity, chaos, phase, mode } = stateRef.current;
      const centerY = height / 2;

      // Performance: Pre-calculate factors to avoid redundant math in loops
      const freqFactor = Math.PI * 10 * targetFrequency;
      const ampFactor = targetIntensity * 100;
      const invWidth = 1 / width;
      const chaosFactorBase = chaos * 50;
      const cosFactor = Math.cos(time + phase);

      // Draw Grid - Performance: Batch all lines into one beginPath/stroke call
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
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
          y = Math.sin(normalizedX * freqFactor) * cosFactor * ampFactor;
        }

        // Add Chaos
        const chaosFactor = Math.sin(time * 2 + normalizedX * 20) * chaosFactorBase;
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
        const pNormalizedX = px * invWidth;
        let py = Math.sin(pNormalizedX * freqFactor + time + phase) * ampFactor;
        const pChaos = Math.sin(time * 2 + pNormalizedX * 20) * chaosFactorBase;
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
  }, []); // Only run on mount

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
    />
  );
};

export default WaveEngine;
