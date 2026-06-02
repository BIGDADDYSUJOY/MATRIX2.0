
import React, { useEffect, useRef } from 'react';
import { WaveState } from '../types';

interface WaveEngineProps {
  waveState: WaveState;
}

const WaveEngine: React.FC<WaveEngineProps> = ({ waveState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveStateRef = useRef(waveState);

  // Sync ref with props to allow the animation loop to access latest state without restarting
  useEffect(() => {
    waveStateRef.current = waveState;
  }, [waveState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Set alpha to false for better performance as background is solid
    const ctx = canvas.getContext('2d', { alpha: false });
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
      // Use fillRect instead of clearRect for better performance on non-alpha contexts
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const { targetFrequency, targetIntensity, chaos, phase, mode } = waveStateRef.current;
      const currentFrequency = targetFrequency;
      const currentIntensity = targetIntensity;
      const centerY = canvas.height / 2;
      const width = canvas.width;

      // Draw Grid - Batched into a single path for performance
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
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

      // Bolt Optimization: Hoist invariant calculations out of the pixel loop
      const freqFactor = (Math.PI * 10 * currentFrequency) / width;
      const ampFactor = currentIntensity * 100;
      const chaosFactorBase = chaos * 50;
      const timePhase = time + phase;
      const chaosStepFactor = 20 / width;
      const cosTimePhase = Math.cos(timePhase);

      for (let x = 0; x < width; x++) {
        let y = 0;
        const angle = x * freqFactor;

        if (mode === 'Traveling') {
          y = Math.sin(angle + timePhase) * ampFactor;
        } else {
          // Standing Wave
          y = Math.sin(angle) * cosTimePhase * ampFactor;
        }

        // Add Chaos - Hoisted normalized calculation
        const chaosFactor = Math.sin(time * 2 + x * chaosStepFactor) * chaosFactorBase;
        y += chaosFactor;

        if (x === 0) ctx.moveTo(x, centerY + y);
        else ctx.lineTo(x, centerY + y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Particles (Consciousness Particles)
      const particleCount = 2;
      const colors = ['#ef4444', '#22c55e'];
      const invWidth = 1 / width;
      for (let i = 0; i < particleCount; i++) {
        const px = (time * 100 + i * width * 0.5) % width;
        const pNormalizedX = px * invWidth;
        let py = Math.sin(pNormalizedX * Math.PI * 10 * currentFrequency + timePhase) * ampFactor;
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
      ctx.fillText(`Phase: ${waveStateRef.current.phase.toFixed(2)} rad`, dialX - 40, dialY + dialRadius + 20);

      time += 0.05;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []); // Empty dependency array means loop only starts once

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
    />
  );
};

export default WaveEngine;
