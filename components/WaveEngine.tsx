
import React, { useEffect, useRef } from 'react';
import { WaveState } from '../types';

interface WaveEngineProps {
  waveState: WaveState;
}

const WaveEngine: React.FC<WaveEngineProps> = ({ waveState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

      const { targetFrequency, targetIntensity, chaos, phase, mode } = waveState;
      const currentFrequency = targetFrequency;
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

      // SHUNYA SUPERPOSITION: Background shadow wave (The "Not Thing")
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 4;
      for (let x = 0; x < width; x++) {
        const normalizedX = x / width;
        const y = Math.cos(normalizedX * Math.PI * 10 * currentFrequency - time * 0.5) * (currentIntensity * 120);
        if (x === 0) ctx.moveTo(x, centerY + y);
        else ctx.lineTo(x, centerY + y);
      }
      ctx.stroke();

      // Draw Main Wave (The "Thing")
      ctx.beginPath();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 15;
      ctx.shadowColor = 'rgba(59, 130, 246, 0.5)';

      for (let x = 0; x < width; x++) {
        const normalizedX = x / width;
        let y = 0;

        if (mode === 'Traveling') {
          y = Math.sin(normalizedX * Math.PI * 10 * currentFrequency + time + phase) * (currentIntensity * 100);
        } else {
          y = Math.sin(normalizedX * Math.PI * 10 * currentFrequency) * Math.cos(time + phase) * (currentIntensity * 100);
        }

        const chaosFactor = Math.sin(time * 2 + normalizedX * 20) * chaos * 50;
        y += chaosFactor;

        if (x === 0) ctx.moveTo(x, centerY + y);
        else ctx.lineTo(x, centerY + y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw Particles
      const particleCount = 3; // Added a 3rd "Maquation" particle
      const colors = ['#ef4444', '#22c55e', '#a855f7'];
      for (let i = 0; i < particleCount; i++) {
        const px = (time * (80 + i * 20) + i * width / 3) % width;
        const pNormalizedX = px / width;
        let py = Math.sin(pNormalizedX * Math.PI * 10 * currentFrequency + time + phase) * (currentIntensity * 100);
        const pChaos = Math.sin(time * 2 + pNormalizedX * 20) * chaos * 50;
        py += pChaos;

        ctx.fillStyle = colors[i % colors.length];
        ctx.beginPath();
        ctx.arc(px, centerY + py, i === 2 ? 6 : 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 15;
        ctx.shadowColor = colors[i % colors.length];
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Draw Phase Dial
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
      ctx.lineTo(dialX + Math.cos(angle) * dialRadius, dialY + Math.sin(angle) * dialRadius);
      ctx.stroke();

      time += 0.05;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [waveState]);

  return (
    <canvas ref={canvasRef} className="w-full h-full block" />
  );
};

export default WaveEngine;
