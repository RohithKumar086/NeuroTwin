'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SimulationStatus, SimulationResult, SimulationConfig, SIMULATION_STEPS } from '@/types/simulation';
import { runSimulation as apiRunSimulation } from '@/services/api';

interface UseSimulationReturn {
  status: SimulationStatus;
  progress: number;
  currentStep: string;
  result: SimulationResult | null;
  isRunning: boolean;
  error: string | null;
  runSimulation: (config: SimulationConfig) => Promise<void>;
  reset: () => void;
}

export function useSimulation(): UseSimulationReturn {
  const [status, setStatus] = useState<SimulationStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutRef.current.forEach(t => clearTimeout(t));
    timeoutRef.current = [];
  }, []);

  const runSimulation = useCallback(async (config: SimulationConfig) => {
    clearTimeouts();
    setError(null);
    setResult(null);

    // Animate through simulation steps
    const steps = SIMULATION_STEPS;
    const stepDuration = 800;

    for (let i = 0; i < steps.length - 1; i++) {
      const timeout = setTimeout(() => {
        setStatus(steps[i].status);
        setCurrentStep(steps[i].label);
        setProgress(Math.round(((i + 1) / steps.length) * 100));
      }, i * stepDuration);
      timeoutRef.current.push(timeout);
    }

    // After animation, fetch actual result
    const finalTimeout = setTimeout(async () => {
      try {
        const simResult = await apiRunSimulation(config);
        setResult(simResult);
        setStatus('complete');
        setCurrentStep('Simulation Complete');
        setProgress(100);
      } catch {
        setStatus('error');
        setError('Simulation failed. Please try again.');
        setCurrentStep('Error');
      }
    }, (steps.length - 1) * stepDuration);
    timeoutRef.current.push(finalTimeout);
  }, [clearTimeouts]);

  const reset = useCallback(() => {
    clearTimeouts();
    setStatus('idle');
    setProgress(0);
    setCurrentStep('');
    setResult(null);
    setError(null);
  }, [clearTimeouts]);

  useEffect(() => {
    return () => clearTimeouts();
  }, [clearTimeouts]);

  return {
    status,
    progress,
    currentStep,
    result,
    isRunning: status !== 'idle' && status !== 'complete' && status !== 'error',
    error,
    runSimulation,
    reset,
  };
}
