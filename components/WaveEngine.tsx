
import React, { useEffect, useRef } from 'react';
import { WaveState } from '../types';

interface WaveEngineProps {
  waveState: WaveState;
}

const WaveEngine: React.FC<WaveEngineProps> = ({ waveState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // BOLT OPTIMIZATION: Store waveState in a ref to bridge it to the animation loop
  // without triggering useEffect re-runs and animation restarts.
  const stateRef = useRef(waveState);

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
      // BOLT OPTIMIZATION: HiDPI (Retina) support for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.parentElement?.clientWidth || 800;
      const displayHeight = canvas.parentElement?.clientHeight || 300;

      canvas.width = displayWidth * dpr;
      canvas.height = displayHeight * dpr;
      canvas.style.width = `${displayWidth}px`;
      canvas.style.height = `${displayHeight}px`;

      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = () => {
      // Use logical dimensions for drawing after ctx.scale
      const logicalWidth = canvas.width / (window.devicePixelRatio || 1);
      const logicalHeight = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      const { targetFrequency, targetIntensity, chaos, phase, mode } = stateRef.current;

      // BOLT OPTIMIZATION: Pre-calculate constants outside the inner pixel loop
      const currentFrequency = targetFrequency;
      const currentIntensity = targetIntensity;
      const centerY = logicalHeight / 2;
      const width = logicalWidth;

      const freqFactor = Math.PI * 10 * currentFrequency;
      const amplitude = currentIntensity * 100;
      const chaosAmplitude = chaos * 50;

      // Draw Grid
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, logicalHeight);
        ctx.stroke();
      }
      for (let y = 0; y < logicalHeight; y += gridSize) {
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
        const normalizedX = x / width;
        let y = 0;

        // BOLT OPTIMIZATION: Using pre-calculated freqFactor and amplitude
        const waveAngle = normalizedX * freqFactor + time + phase;

        if (mode === 'Traveling') {
          y = Math.sin(waveAngle) * amplitude;
        } else {
          // Standing Wave
          y = Math.sin(normalizedX * freqFactor) * Math.cos(time + phase) * amplitude;
        }

        // Add Chaos - BOLT OPTIMIZATION: Use pre-calculated chaosAmplitude
        const chaosFactor = Math.sin(time * 2 + normalizedX * 20) * chaosAmplitude;
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

        // BOLT OPTIMIZATION: Using pre-calculated freqFactor and amplitude
        let py = Math.sin(pNormalizedX * freqFactor + time + phase) * amplitude;
        const pChaos = Math.sin(time * 2 + pNormalizedX * 20) * chaosAmplitude;
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
  }, []); // BOLT OPTIMIZATION: Animation loop runs once and uses stateRef to stay updated

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
    />
  );
};

export default WaveEngine;
