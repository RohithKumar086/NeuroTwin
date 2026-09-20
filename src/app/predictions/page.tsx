'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { usePrediction } from '@/hooks/usePrediction';
import { useSystemState } from '@/hooks/useSystemState';
import { PredictionHorizon, HORIZON_LABELS, Prediction } from '@/types/prediction';
import { getPredictionSummary } from '@/services/api';
import Badge from '@/components/ui/Badge';
import SkeletonLoader from '@/components/ui/SkeletonLoader';
import { TrendingUp, TrendingDown, Minus, Brain, Clock, AlertTriangle } from 'lucide-react';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

const horizons: PredictionHorizon[] = ['5m', '15m', '30m', '1h', '6h', '24h'];

export default function PredictionsPage() {
  const { state } = useSystemState();
  const [selectedNode, setSelectedNode] = useState('mot-001');
  const { predictions, isLoading, selectedHorizon, setHorizon } = usePrediction(selectedNode);
  const [summary, setSummary] = useState<{ overallConfidence: number; predictionsGenerated: number; highRiskPredictions: number } | null>(null);

  useEffect(() => {
    getPredictionSummary().then(setSummary);
  }, []);

  const machineNodes = useMemo(() =>
    state.nodes.filter(n => n.type !== 'sensor'),
    [state.nodes]
  );

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Neural State Prediction</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          Current State → Predicted State · Powered by GNN + Temporal Model
        </p>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="rounded-xl p-4 flex items-center gap-3" style={{
            backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
          }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
              backgroundColor: 'var(--color-info-dim)', color: 'var(--color-info)',
            }}>
              <Brain size={18} />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>Prediction Confidence</span>
              <div className="text-lg font-bold" style={{ color: 'var(--color-info)' }}>{summary.overallConfidence}%</div>
            </div>
          </div>
          <div className="rounded-xl p-4 flex items-center gap-3" style={{
            backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
          }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
              backgroundColor: 'var(--color-prediction-dim)', color: 'var(--color-prediction)',
            }}>
              <Clock size={18} />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>Predictions Generated</span>
              <div className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>{summary.predictionsGenerated}</div>
            </div>
          </div>
          <div className="rounded-xl p-4 flex items-center gap-3" style={{
            backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
          }}>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
              backgroundColor: 'var(--color-critical-dim)', color: 'var(--color-critical)',
            }}>
              <AlertTriangle size={18} />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase" style={{ color: 'var(--color-text-muted)' }}>High Risk Predictions</span>
              <div className="text-lg font-bold" style={{ color: 'var(--color-critical)' }}>{summary.highRiskPredictions}</div>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {/* Component Selector */}
          <select
            value={selectedNode}
            onChange={(e) => setSelectedNode(e.target.value)}
            className="h-9 px-3 rounded-lg text-xs outline-none cursor-pointer"
            style={{
              backgroundColor: 'var(--color-bg-tertiary)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-primary)',
            }}
          >
            {machineNodes.map(n => (
              <option key={n.id} value={n.id}>{n.name}</option>
            ))}
          </select>
        </div>

        {/* Horizon Selector */}
        <div className="flex gap-1">
          {horizons.map(h => (
            <button
              key={h}
              onClick={() => setHorizon(h)}
              className="px-3 py-1.5 rounded-lg text-[11px] font-medium transition-colors cursor-pointer"
              style={{
                backgroundColor: selectedHorizon === h ? 'var(--color-prediction-dim)' : 'var(--color-bg-tertiary)',
                color: selectedHorizon === h ? 'var(--color-prediction)' : 'var(--color-text-secondary)',
                border: `1px solid ${selectedHorizon === h ? 'rgba(139,92,246,0.3)' : 'var(--color-border)'}`,
              }}
            >
              {HORIZON_LABELS[h]}
            </button>
          ))}
        </div>
      </div>

      {/* Prediction Charts */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonLoader key={i} type="chart" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {predictions.map(pred => (
            <PredictionChart key={pred.id} prediction={pred} />
          ))}
        </div>
      )}
    </div>
  );
}

function PredictionChart({ prediction }: { prediction: Prediction }) {
  const TrendIcon = prediction.trend === 'increasing' ? TrendingUp : prediction.trend === 'decreasing' ? TrendingDown : Minus;
  const trendColor = prediction.riskLevel === 'high' ? 'var(--color-critical)' : prediction.riskLevel === 'medium' ? 'var(--color-warning)' : 'var(--color-healthy)';

  const option = useMemo(() => ({
    backgroundColor: 'transparent',
    grid: { top: 40, right: 20, bottom: 30, left: 50 },
    xAxis: {
      type: 'time',
      axisLine: { lineStyle: { color: '#2a2d3a' } },
      axisLabel: { color: '#6b7280', fontSize: 9 },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisLabel: { color: '#6b7280', fontSize: 9 },
      splitLine: { lineStyle: { color: '#1a1d26' } },
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#151820',
      borderColor: '#2a2d3a',
      textStyle: { color: '#e8eaf0', fontSize: 11 },
    },
    series: [
      // Confidence band
      {
        name: 'Confidence Band',
        type: 'line',
        data: prediction.predicted.map(p => [p.timestamp, p.upper]),
        lineStyle: { opacity: 0 },
        areaStyle: { opacity: 0 },
        stack: 'confidence',
        symbol: 'none',
      },
      {
        name: 'Confidence Lower',
        type: 'line',
        data: prediction.predicted.map(p => [p.timestamp, p.lower]),
        lineStyle: { opacity: 0 },
        areaStyle: {
          color: 'rgba(139, 92, 246, 0.08)',
        },
        stack: 'confidence',
        symbol: 'none',
      },
      // Historical
      {
        name: 'Historical',
        type: 'line',
        data: prediction.historical.map(p => [p.timestamp, p.value]),
        lineStyle: { color: '#06b6d4', width: 2 },
        itemStyle: { color: '#06b6d4' },
        symbol: 'none',
        smooth: true,
      },
      // Predicted
      {
        name: 'Predicted',
        type: 'line',
        data: prediction.predicted.map(p => [p.timestamp, p.value]),
        lineStyle: { color: '#8b5cf6', width: 2, type: 'dashed' },
        itemStyle: { color: '#8b5cf6' },
        symbol: 'none',
        smooth: true,
      },
    ],
  }), [prediction]);

  return (
    <div className="rounded-xl p-4" style={{
      backgroundColor: 'var(--color-bg-card)',
      border: '1px solid var(--color-border)',
    }}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>{prediction.metric}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg font-bold font-mono" style={{ color: 'var(--color-text-primary)' }}>
              {prediction.currentValue}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>→</span>
            <span className="text-lg font-bold font-mono" style={{ color: 'var(--color-prediction)' }}>
              {prediction.predictedValue}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{prediction.unit}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TrendIcon size={14} style={{ color: trendColor }} />
          <Badge status={prediction.riskLevel === 'high' ? 'critical' : prediction.riskLevel === 'medium' ? 'warning' : 'healthy'}
            label={prediction.riskLevel} />
        </div>
      </div>
      <ReactECharts option={option} style={{ height: 200 }} opts={{ renderer: 'canvas' }} />
      <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
        <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
          Confidence: <span className="font-mono font-semibold" style={{ color: 'var(--color-prediction)' }}>{prediction.confidence}%</span>
        </span>
        <div className="flex items-center gap-4 text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 rounded" style={{ backgroundColor: '#06b6d4' }} /> Historical
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-0.5 rounded" style={{ backgroundColor: '#8b5cf6', borderBottom: '1px dashed #8b5cf6' }} /> Predicted
          </span>
        </div>
      </div>
      <p className="text-[10px] mt-2 leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>{prediction.explanation}</p>
    </div>
  );
}
