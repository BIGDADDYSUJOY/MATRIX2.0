
import React, { useEffect, useRef } from 'react';
import { WaveState } from '../types';

interface WaveEngineProps {
  waveState: WaveState;
}

const WaveEngine: React.FC<WaveEngineProps> = ({ waveState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // BOLT OPTIMIZATION: Use ref to bridge props to animation loop.
  // This avoids re-initializing the entire canvas and animation loop on every state update.
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
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // BOLT OPTIMIZATION: Hoist calculations out of the hot loop to reduce CPU overhead per frame.
      const freqMultiplier = Math.PI * 10 * currentFrequency;
      const intensityMultiplier = currentIntensity * 100;
      const timePhase = time + phase;
      const standingWaveFactor = mode === 'Standing' ? Math.cos(timePhase) : 0;
      const chaosMultiplier = chaos * 50;
      const time2 = time * 2;

      // Draw Wave
      ctx.beginPath();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';

      for (let x = 0; x < width; x++) {
        const normalizedX = x / width;
        const waveX = normalizedX * freqMultiplier;
        let y = 0;

        if (mode === 'Traveling') {
          y = Math.sin(waveX + timePhase) * intensityMultiplier;
        } else {
          // Standing Wave
          y = Math.sin(waveX) * standingWaveFactor * intensityMultiplier;
        }

        // Add Chaos
        const chaosFactor = Math.sin(time2 + normalizedX * 20) * chaosMultiplier;
        y += chaosFactor;

        if (x === 0) ctx.moveTo(x, centerY + y);
        else ctx.lineTo(x, centerY + y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Particles (Consciousness Particles)
      const particleCount = 2;
      const colors = ['#ef4444', '#22c55e'];
      const time100 = time * 100;
      const halfWidth = width / 2;

      for (let i = 0; i < particleCount; i++) {
        const px = (time100 + i * halfWidth) % width;
        const pNormalizedX = px / width;
        let py = Math.sin(pNormalizedX * freqMultiplier + timePhase) * intensityMultiplier;
        const pChaos = Math.sin(time2 + pNormalizedX * 20) * chaosMultiplier;
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
  }, []); // BOLT OPTIMIZATION: Stable dependency array to prevent effect restarts.

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
    />
  );
};

export default WaveEngine;
