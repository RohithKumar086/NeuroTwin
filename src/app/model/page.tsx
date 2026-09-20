'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { getModelStatus, ModelStatus } from '@/services/api';
import { Brain, GitBranch, Clock, Activity, CheckCircle, ArrowDown } from 'lucide-react';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

const pipelineSteps = [
  { label: 'Sensor Data', desc: 'Raw IoT sensor streams', icon: '📡' },
  { label: 'Feature Engineering', desc: 'Signal processing & feature extraction', icon: '⚙️' },
  { label: 'Graph Construction', desc: 'Build component dependency graph', icon: '🔗' },
  { label: 'Graph Neural Network', desc: 'GATv2 — 4 layers, 12 input features', icon: '🧠' },
  { label: 'Temporal Model', desc: 'GRU — 2 layers, sequence modeling', icon: '📈' },
  { label: 'State Prediction', desc: 'Multi-horizon forecasting', icon: '🔮' },
  { label: 'Digital Twin State', desc: 'Synchronized virtual representation', icon: '🏭' },
  { label: 'Simulation Engine', desc: 'What-if scenario evaluation', icon: '🧪' },
];

export default function ModelPage() {
  const [model, setModel] = useState<ModelStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModelStatus().then(m => { setModel(m); setLoading(false); });
  }, []);

  const lossChartOption = useMemo(() => {
    if (!model) return {};
    return {
      backgroundColor: 'transparent',
      legend: { textStyle: { color: '#9ca3b4', fontSize: 10 }, bottom: 0 },
      grid: { top: 20, right: 20, bottom: 40, left: 50 },
      xAxis: {
        type: 'category',
        data: model.trainingLoss.map((_, i) => `${i + 1}`),
        axisLabel: { color: '#6b7280', fontSize: 9 },
        axisLine: { lineStyle: { color: '#2a2d3a' } },
        name: 'Epoch',
        nameTextStyle: { color: '#6b7280', fontSize: 9 },
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: '#6b7280', fontSize: 9 },
        splitLine: { lineStyle: { color: '#1a1d26' } },
        name: 'Loss',
        nameTextStyle: { color: '#6b7280', fontSize: 9 },
      },
      series: [
        {
          name: 'Training Loss',
          type: 'line',
          data: model.trainingLoss,
          lineStyle: { color: '#06b6d4', width: 2 },
          itemStyle: { color: '#06b6d4' },
          symbol: 'circle',
          symbolSize: 4,
          smooth: true,
        },
        {
          name: 'Validation Loss',
          type: 'line',
          data: model.validationLoss,
          lineStyle: { color: '#8b5cf6', width: 2 },
          itemStyle: { color: '#8b5cf6' },
          symbol: 'circle',
          symbolSize: 4,
          smooth: true,
        },
      ],
    };
  }, [model]);

  if (loading || !model) {
    return (
      <div>
        <div className="skeleton h-8 w-48 mb-2" />
        <div className="skeleton h-4 w-80 mb-6" />
        <div className="skeleton h-96 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Neural Model</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          AI architecture, training metrics, and performance · <span className="font-mono" style={{ color: 'var(--color-warning)' }}>Prototype / Simulated Metrics</span>
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Pipeline Visualization */}
        <div className="col-span-1 rounded-xl p-5" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
          <h3 className="text-xs font-semibold uppercase mb-4" style={{ color: 'var(--color-text-muted)' }}>AI Pipeline</h3>
          <div className="space-y-1">
            {pipelineSteps.map((step, i) => (
              <div key={step.label}>
                <div className="flex items-center gap-3 p-3 rounded-lg transition-colors"
                  style={{ backgroundColor: 'var(--color-bg-tertiary)' }}>
                  <span className="text-lg">{step.icon}</span>
                  <div>
                    <span className="text-xs font-semibold block" style={{ color: 'var(--color-text-primary)' }}>{step.label}</span>
                    <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>{step.desc}</span>
                  </div>
                </div>
                {i < pipelineSteps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown size={14} style={{ color: 'var(--color-border-light)' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Model Info + Metrics */}
        <div className="col-span-2 space-y-4">
          {/* Model Details */}
          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Model Information</h3>
              <div className="flex items-center gap-2">
                <CheckCircle size={12} style={{ color: 'var(--color-healthy)' }} />
                <span className="text-[10px] font-semibold uppercase" style={{ color: 'var(--color-healthy)' }}>Active</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2.5">
              {[
                { label: 'Architecture', value: model.architecture },
                { label: 'Version', value: model.version },
                { label: 'Graph Nodes', value: model.graphNodes },
                { label: 'Graph Edges', value: model.graphEdges },
                { label: 'Input Features', value: model.inputFeatures },
                { label: 'Prediction Horizon', value: model.predictionHorizon },
                { label: 'Last Training', value: new Date(model.lastTraining).toLocaleString() },
                { label: 'Training Duration', value: model.trainingDuration },
              ].map(item => (
                <div key={item.label} className="flex justify-between text-xs py-1">
                  <span style={{ color: 'var(--color-text-muted)' }}>{item.label}</span>
                  <span className="font-mono font-medium" style={{ color: 'var(--color-text-primary)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>
              Performance Metrics
              <span className="text-[10px] font-normal ml-2 px-2 py-0.5 rounded" style={{ backgroundColor: 'var(--color-warning-dim)', color: 'var(--color-warning)' }}>
                Simulated
              </span>
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'MAE', value: model.metrics.mae, format: (v: number) => v.toFixed(4) },
                { label: 'RMSE', value: model.metrics.rmse, format: (v: number) => v.toFixed(4) },
                { label: 'F1 Score', value: model.metrics.f1Score, format: (v: number) => v.toFixed(3) },
                { label: 'Precision', value: model.metrics.precision, format: (v: number) => v.toFixed(3) },
                { label: 'Recall', value: model.metrics.recall, format: (v: number) => v.toFixed(3) },
                { label: 'Accuracy', value: model.metrics.predictionAccuracy, format: (v: number) => `${v}%` },
                { label: 'Confidence', value: model.metrics.modelConfidence, format: (v: number) => `${v}%` },
              ].map(m => (
                <div key={m.label} className="rounded-lg p-3" style={{ backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)' }}>
                  <span className="text-[10px] font-semibold uppercase block" style={{ color: 'var(--color-text-muted)' }}>{m.label}</span>
                  <span className="text-lg font-bold font-mono block mt-1" style={{ color: 'var(--color-accent)' }}>{m.format(m.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Training Loss Curve */}
          <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Training & Validation Loss</h3>
            <ReactECharts option={lossChartOption} style={{ height: 250 }} />
          </div>
        </div>
      </div>
    </div>
  );
}
