'use client';

import { useState, useEffect, useCallback } from 'react';
import { Prediction, PredictionHorizon } from '@/types/prediction';
import { getPredictions } from '@/services/api';

interface UsePredictionReturn {
  predictions: Prediction[];
  isLoading: boolean;
  error: string | null;
  selectedHorizon: PredictionHorizon;
  setHorizon: (h: PredictionHorizon) => void;
  refresh: () => Promise<void>;
}

export function usePrediction(nodeId?: string): UsePredictionReturn {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHorizon, setSelectedHorizon] = useState<PredictionHorizon>('1h');

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPredictions(nodeId);
      setPredictions(data.map(p => ({ ...p, horizon: selectedHorizon })));
    } catch {
      setError('Failed to load predictions');
    } finally {
      setIsLoading(false);
    }
  }, [nodeId, selectedHorizon]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    predictions,
    isLoading,
    error,
    selectedHorizon,
    setHorizon: setSelectedHorizon,
    refresh,
  };
}
