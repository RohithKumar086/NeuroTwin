'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSimulation } from '@/hooks/useSimulation';
import { useSystemState } from '@/hooks/useSystemState';
import { SimulationConfig, SIMULATION_STEPS } from '@/types/simulation';
import { mockScenarioConfigs, mockScenarioResults } from '@/data/mockScenarios';
import Badge from '@/components/ui/Badge';
import { Play, RotateCcw, CheckCircle, Loader2, ArrowRight, AlertTriangle, Zap, Thermometer, Heart, Activity } from 'lucide-react';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

export default function SimulationPage() {
  const { state } = useSystemState();
  const { status, progress, currentStep, result, isRunning, error, runSimulation, reset } = useSimulation();
  const [selectedScenario, setSelectedScenario] = useState(mockScenarioConfigs[1].id);
  const [customTemp, setCustomTemp] = useState('85');
  const [customLoad, setCustomLoad] = useState('90');
  const [showComparison, setShowComparison] = useState(false);

  const machineNodes = useMemo(() => state.nodes.filter(n => n.type !== 'sensor'), [state.nodes]);

  const handleRunSimulation = () => {
    const config = mockScenarioConfigs.find(s => s.id === selectedScenario) || mockScenarioConfigs[1];
    runSimulation(config);
  };

  const comparisonData = useMemo(() => {
    return mockScenarioResults.filter(r => r.status === 'complete');
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-text-primary)' }}>Digital Twin Simulation</h1>
        <p className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
          Run what-if scenarios — predict how the system responds to changes before applying them
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Left: Configuration */}
        <div className="col-span-1 space-y-4">
          {/* Pre-built Scenarios */}
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: 'var(--color-text-muted)' }}>Scenario</h3>
            <div className="space-y-2">
              {mockScenarioConfigs.map(sc => (
                <button key={sc.id}
                  onClick={() => setSelectedScenario(sc.id)}
                  className="w-full text-left p-3 rounded-lg transition-colors cursor-pointer"
                  style={{
                    backgroundColor: selectedScenario === sc.id ? 'var(--color-bg-hover)' : 'var(--color-bg-tertiary)',
                    border: `1px solid ${selectedScenario === sc.id ? 'var(--color-accent)' : 'var(--color-border)'}`,
                  }}>
                  <span className="text-xs font-semibold block" style={{ color: selectedScenario === sc.id ? 'var(--color-accent)' : 'var(--color-text-primary)' }}>
                    {sc.name}
                  </span>
                  <span className="text-[10px] mt-0.5 block" style={{ color: 'var(--color-text-muted)' }}>{sc.description}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Parameters */}
          <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
            <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: 'var(--color-text-muted)' }}>Custom Parameters</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-medium block mb-1" style={{ color: 'var(--color-text-secondary)' }}>Temperature (°C)</label>
                <input type="number" value={customTemp} onChange={e => setCustomTemp(e.target.value)}
                  min="-20" max="200"
                  className="w-full h-8 px-3 rounded-lg text-xs outline-none"
                  style={{ backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                {(Number(customTemp) < -20 || Number(customTemp) > 200) && (
                  <span className="text-[10px] mt-0.5 block" style={{ color: 'var(--color-critical)' }}>Temperature must be between -20°C and 200°C</span>
                )}
              </div>
              <div>
                <label className="text-[10px] font-medium block mb-1" style={{ color: 'var(--color-text-secondary)' }}>Load (%)</label>
                <input type="number" value={customLoad} onChange={e => setCustomLoad(e.target.value)}
                  min="0" max="100"
                  className="w-full h-8 px-3 rounded-lg text-xs outline-none"
                  style={{ backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }} />
                {(Number(customLoad) < 0 || Number(customLoad) > 100) && (
                  <span className="text-[10px] mt-0.5 block" style={{ color: 'var(--color-critical)' }}>Load must be between 0% and 100%</span>
                )}
              </div>
            </div>
          </div>

          {/* Run / Reset */}
          <div className="flex gap-2">
            <button onClick={handleRunSimulation} disabled={isRunning}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
              style={{
                background: 'linear-gradient(135deg, var(--color-accent-dim), var(--color-prediction-dim))',
                border: '1px solid rgba(6,182,212,0.3)',
                color: 'var(--color-accent)',
              }}>
              {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
              {isRunning ? 'Running...' : 'Run Simulation'}
            </button>
            <button onClick={reset}
              className="px-4 py-3 rounded-xl text-sm font-medium cursor-pointer"
              style={{ backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}>
              <RotateCcw size={16} />
            </button>
          </div>

          {/* Compare button */}
          <button onClick={() => setShowComparison(!showComparison)}
            className="w-full py-2.5 rounded-xl text-xs font-medium cursor-pointer"
            style={{ backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)', color: 'var(--color-prediction)' }}>
            {showComparison ? 'Hide' : 'Show'} Scenario Comparison
          </button>
        </div>

        {/* Right: Results */}
        <div className="col-span-2 space-y-4">
          {/* Simulation Progress */}
          {(isRunning || status === 'complete') && (
            <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
              <h3 className="text-xs font-semibold uppercase mb-4" style={{ color: 'var(--color-text-muted)' }}>Simulation Progress</h3>
              <div className="flex items-center gap-2">
                {SIMULATION_STEPS.map((step, i) => {
                  const stepIdx = SIMULATION_STEPS.findIndex(s => s.status === status);
                  const isComplete = i <= stepIdx || status === 'complete';
                  const isCurrent = i === stepIdx && status !== 'complete';
                  return (
                    <div key={step.status} className="flex items-center gap-2 flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${isCurrent ? 'animate-pulse-subtle' : ''}`}
                          style={{
                            backgroundColor: isComplete ? 'var(--color-accent-dim)' : 'var(--color-bg-tertiary)',
                            color: isComplete ? 'var(--color-accent)' : 'var(--color-text-muted)',
                            border: `1px solid ${isComplete ? 'rgba(6,182,212,0.3)' : 'var(--color-border)'}`,
                          }}>
                          {isComplete ? <CheckCircle size={14} /> : i + 1}
                        </div>
                        <span className="text-[9px] mt-1 text-center" style={{
                          color: isComplete ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                        }}>{step.label}</span>
                      </div>
                      {i < SIMULATION_STEPS.length - 1 && (
                        <div className="h-px flex-1 mt-[-16px]" style={{
                          backgroundColor: isComplete ? 'var(--color-accent)' : 'var(--color-border)',
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results */}
          {result && status === 'complete' && (
            <>
              {/* Baseline vs Simulated */}
              <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>Baseline vs Simulated</h3>
                  <span className="text-[10px] font-mono" style={{ color: 'var(--color-text-muted)' }}>
                    Confidence: <span style={{ color: 'var(--color-prediction)' }}>{result.confidence}%</span>
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { label: 'Health', icon: <Heart size={14} />, baseline: result.baseline.overallHealth, sim: result.simulated.overallHealth, unit: '%', goodDirection: 'up' },
                    { label: 'Energy', icon: <Zap size={14} />, baseline: result.baseline.energyConsumption, sim: result.simulated.energyConsumption, unit: 'kW', goodDirection: 'down' },
                    { label: 'Temperature', icon: <Thermometer size={14} />, baseline: result.baseline.avgTemperature, sim: result.simulated.avgTemperature, unit: '°C', goodDirection: 'down' },
                    { label: 'Failure Risk', icon: <AlertTriangle size={14} />, baseline: result.baseline.failureRisk, sim: result.simulated.failureRisk, unit: '%', goodDirection: 'down' },
                    { label: 'Efficiency', icon: <Activity size={14} />, baseline: result.baseline.productionEfficiency, sim: result.simulated.productionEfficiency, unit: '%', goodDirection: 'up' },
                  ].map(m => {
                    const delta = m.sim - m.baseline;
                    const isWorse = m.goodDirection === 'up' ? delta < 0 : delta > 0;
                    return (
                      <div key={m.label} className="rounded-lg p-3" style={{ backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)' }}>
                        <div className="flex items-center gap-1.5 mb-2" style={{ color: 'var(--color-text-muted)' }}>
                          {m.icon}
                          <span className="text-[10px] font-semibold uppercase">{m.label}</span>
                        </div>
                        <div className="text-xs mb-1" style={{ color: 'var(--color-text-secondary)' }}>
                          <span className="font-mono">{m.baseline}</span> <span style={{ color: 'var(--color-text-muted)' }}>→</span>{' '}
                          <span className="font-mono font-bold" style={{ color: isWorse ? 'var(--color-critical)' : 'var(--color-healthy)' }}>{m.sim}</span>
                          <span className="text-[10px] ml-0.5" style={{ color: 'var(--color-text-muted)' }}>{m.unit}</span>
                        </div>
                        <span className="text-[10px] font-mono" style={{ color: isWorse ? 'var(--color-critical)' : 'var(--color-healthy)' }}>
                          {delta > 0 ? '+' : ''}{delta.toFixed(1)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Propagation Path */}
              {result.propagationPath.length > 0 && (
                <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Failure Propagation</h3>
                  <div className="space-y-3">
                    {result.propagationPath.map((step, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0" style={{
                          backgroundColor: 'var(--color-critical-dim)', color: 'var(--color-critical)', border: '1px solid rgba(239,68,68,0.3)',
                        }}>{step.step}</div>
                        <div className="flex-1 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)' }}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>{step.fromNodeName}</span>
                            <ArrowRight size={12} style={{ color: 'var(--color-text-muted)' }} />
                            <span className="text-xs font-semibold" style={{ color: 'var(--color-critical)' }}>{step.toNodeName}</span>
                          </div>
                          <p className="text-[11px]" style={{ color: 'var(--color-text-secondary)' }}>{step.effect}</p>
                          <span className="text-[10px] font-mono mt-1 block" style={{ color: 'var(--color-text-muted)' }}>Delay: {step.delay}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Affected Components */}
              {result.affectedComponents.length > 0 && (
                <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
                  <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Affected Components</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {result.affectedComponents.map(comp => (
                      <div key={comp.nodeId} className="p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg-tertiary)', border: '1px solid var(--color-border)' }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold" style={{ color: 'var(--color-text-primary)' }}>{comp.nodeName}</span>
                          <Badge status={comp.impactLevel === 'critical' ? 'critical' : comp.impactLevel === 'high' ? 'warning' : 'info'} label={comp.impactLevel} />
                        </div>
                        <div className="space-y-1 text-[11px]">
                          <div className="flex justify-between" style={{ color: 'var(--color-text-secondary)' }}>
                            <span>Health Δ</span>
                            <span className="font-mono" style={{ color: comp.healthChange < 0 ? 'var(--color-critical)' : 'var(--color-healthy)' }}>
                              {comp.healthChange > 0 ? '+' : ''}{comp.healthChange.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between" style={{ color: 'var(--color-text-secondary)' }}>
                            <span>Failure Prob. Δ</span>
                            <span className="font-mono" style={{ color: comp.failureProbChange > 0 ? 'var(--color-critical)' : 'var(--color-healthy)' }}>
                              +{comp.failureProbChange.toFixed(1)}%
                            </span>
                          </div>
                          <div className="flex justify-between" style={{ color: 'var(--color-text-secondary)' }}>
                            <span>Recovery</span>
                            <span className="font-mono">{comp.estimatedRecovery}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Idle state */}
          {status === 'idle' && !showComparison && (
            <div className="rounded-xl p-16 flex flex-col items-center justify-center" style={{
              backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
            }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{
                background: 'linear-gradient(135deg, var(--color-accent-dim), var(--color-prediction-dim))',
                border: '1px solid var(--color-border)',
              }}>
                <Play size={28} style={{ color: 'var(--color-accent)' }} />
              </div>
              <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--color-text-primary)' }}>Select a Scenario</h3>
              <p className="text-xs text-center max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
                Choose a pre-built scenario or customize parameters, then run the simulation to see predicted outcomes.
              </p>
            </div>
          )}

          {/* Scenario Comparison */}
          {showComparison && (
            <div className="rounded-xl p-5" style={{ backgroundColor: 'var(--color-bg-card)', border: '1px solid var(--color-border)' }}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--color-text-primary)' }}>Scenario Comparison</h3>
              <ReactECharts
                option={{
                  backgroundColor: 'transparent',
                  legend: { textStyle: { color: '#9ca3b4', fontSize: 10 }, bottom: 0 },
                  grid: { top: 20, right: 20, bottom: 40, left: 50 },
                  xAxis: {
                    type: 'category',
                    data: ['Health', 'Energy', 'Temperature', 'Failure Risk', 'Efficiency'],
                    axisLabel: { color: '#6b7280', fontSize: 10 },
                    axisLine: { lineStyle: { color: '#2a2d3a' } },
                  },
                  yAxis: {
                    type: 'value',
                    axisLabel: { color: '#6b7280', fontSize: 10 },
                    splitLine: { lineStyle: { color: '#1a1d26' } },
                  },
                  series: comparisonData.map((r, i) => ({
                    name: r.config.name,
                    type: 'bar',
                    data: [
                      r.simulated.overallHealth,
                      r.simulated.energyConsumption / 20,
                      r.simulated.avgTemperature,
                      r.simulated.failureRisk,
                      r.simulated.productionEfficiency,
                    ],
                    itemStyle: { color: ['#06b6d4', '#ef4444', '#f59e0b'][i], borderRadius: [4, 4, 0, 0] },
                    barGap: '10%',
                  })),
                }}
                style={{ height: 300 }}
              />
            </div>
          )}

          {error && (
            <div className="rounded-xl p-4" style={{ backgroundColor: 'var(--color-critical-dim)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <p className="text-xs font-medium" style={{ color: 'var(--color-critical)' }}>{error}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
