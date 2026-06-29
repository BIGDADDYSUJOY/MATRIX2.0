/**
 * MATRIX 2.0 | SHUNYA Mathematics Layer
 * Pure functions for wave dynamics and chaos modeling.
 */

export const calculateWaveY = (
  normalizedX: number,
  time: number,
  phase: number,
  freqFactor: number,
  ampFactor: number,
  chaosFactorBase: number,
  cosFactor: number,
  isTraveling: boolean
): number => {
  let y = 0;

  if (isTraveling) {
    y = Math.sin(normalizedX * freqFactor + time + phase) * ampFactor;
  } else {
    y = Math.sin(normalizedX * freqFactor) * cosFactor * ampFactor;
  }

  // Add Chaos (Nonlinear disruption)
  const chaosFactor = Math.sin(time * 2 + normalizedX * 20) * chaosFactorBase;
  y += chaosFactor;

  return y;
};

export const getWaveFactors = (
  width: number,
  currentFrequency: number,
  currentIntensity: number,
  chaos: number,
  time: number,
  phase: number,
  mode: 'Traveling' | 'Standing'
) => {
  return {
    invWidth: 1 / width,
    freqFactor: Math.PI * 10 * currentFrequency,
    ampFactor: currentIntensity * 100,
    chaosFactorBase: chaos * 50,
    cosFactor: mode !== 'Traveling' ? Math.cos(time + phase) : 1,
    isTraveling: mode === 'Traveling'
  };
};
