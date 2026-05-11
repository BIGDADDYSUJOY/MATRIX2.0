
import React, { useEffect, useRef } from 'react';
import { WaveState } from '../types';

interface WaveEngineProps {
  waveState: WaveState;
}

const WaveEngine: React.FC<WaveEngineProps> = ({ waveState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const waveStateRef = useRef(waveState);

  // Keep waveStateRef in sync without restarting the animation loop
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
      // ⚡ Bolt: HiDPI Canvas Scaling
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
      const displayWidth = canvas.width / (window.devicePixelRatio || 1);
      const displayHeight = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Read from ref to avoid loop restarts on state change
      const { targetFrequency, targetIntensity, chaos, phase, mode } = waveStateRef.current;

      // ⚡ Bolt: Pre-calculate constants to reduce operations in pixel loop
      const freqFactor = Math.PI * 10 * targetFrequency;
      const ampFactor = targetIntensity * 100;
      const chaosAmp = chaos * 50;
      const standingWaveTimeFactor = Math.cos(time + phase);

      const centerY = displayHeight / 2;

      // Draw Grid
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < displayWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, displayHeight);
        ctx.stroke();
      }
      for (let y = 0; y < displayHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(displayWidth, y);
        ctx.stroke();
      }

      // Draw Wave
      ctx.beginPath();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';

      for (let x = 0; x < displayWidth; x++) {
        const normalizedX = x / displayWidth;
        const waveX = normalizedX * freqFactor;
        let y = 0;

        if (mode === 'Traveling') {
          y = Math.sin(waveX + time + phase) * ampFactor;
        } else {
          // Standing Wave
          y = Math.sin(waveX) * standingWaveTimeFactor * ampFactor;
        }

        // Add Chaos
        y += Math.sin(time * 2 + normalizedX * 20) * chaosAmp;

        if (x === 0) ctx.moveTo(x, centerY + y);
        else ctx.lineTo(x, centerY + y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Particles (Consciousness Particles)
      const particleCount = 2;
      const colors = ['#ef4444', '#22c55e'];
      for (let i = 0; i < particleCount; i++) {
        const px = (time * 100 + i * displayWidth / 2) % displayWidth;
        const pNormalizedX = px / displayWidth;
        const pWaveX = pNormalizedX * freqFactor;
        let py = Math.sin(pWaveX + time + phase) * ampFactor;
        py += Math.sin(time * 2 + pNormalizedX * 20) * chaosAmp;

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
      const dialX = displayWidth - 80;
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
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
    />
  );
};

export default WaveEngine;
