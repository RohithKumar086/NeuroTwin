'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { SystemNode } from '@/types/node';
import { GraphEdge } from '@/types/graph';
import { Alert } from '@/types/alert';
import { getTwinState, getGraph, getAlerts, TwinState } from '@/services/api';

interface SystemState {
  nodes: SystemNode[];
  edges: GraphEdge[];
  alerts: Alert[];
  twinState: TwinState | null;
  selectedNodeId: string | null;
  isLive: boolean;
  isLoading: boolean;
  error: string | null;
  lastUpdate: number;
}

type Action =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_TWIN_STATE'; payload: TwinState }
  | { type: 'SET_GRAPH'; payload: { nodes: SystemNode[]; edges: GraphEdge[] } }
  | { type: 'SET_ALERTS'; payload: Alert[] }
  | { type: 'ADD_ALERT'; payload: Alert }
  | { type: 'SELECT_NODE'; payload: string | null }
  | { type: 'TOGGLE_LIVE' }
  | { type: 'SET_LIVE'; payload: boolean }
  | { type: 'UPDATE_NODE'; payload: { id: string; updates: Partial<SystemNode> } }
  | { type: 'TICK'; payload: { nodes: SystemNode[] } };

const initialState: SystemState = {
  nodes: [],
  edges: [],
  alerts: [],
  twinState: null,
  selectedNodeId: null,
  isLive: true,
  isLoading: true,
  error: null,
  lastUpdate: Date.now(),
};

function reducer(state: SystemState, action: Action): SystemState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_TWIN_STATE':
      return { ...state, twinState: action.payload, isLoading: false, lastUpdate: Date.now() };
    case 'SET_GRAPH':
      return { ...state, nodes: action.payload.nodes, edges: action.payload.edges };
    case 'SET_ALERTS':
      return { ...state, alerts: action.payload };
    case 'ADD_ALERT':
      return { ...state, alerts: [action.payload, ...state.alerts] };
    case 'SELECT_NODE':
      return { ...state, selectedNodeId: action.payload };
    case 'TOGGLE_LIVE':
      return { ...state, isLive: !state.isLive };
    case 'SET_LIVE':
      return { ...state, isLive: action.payload };
    case 'UPDATE_NODE':
      return {
        ...state,
        nodes: state.nodes.map(n =>
          n.id === action.payload.id ? { ...n, ...action.payload.updates } : n
        ),
      };
    case 'TICK':
      return { ...state, nodes: action.payload.nodes, lastUpdate: Date.now() };
    default:
      return state;
  }
}

interface SystemContextValue {
  state: SystemState;
  dispatch: React.Dispatch<Action>;
  selectNode: (id: string | null) => void;
  toggleLive: () => void;
  refreshData: () => Promise<void>;
  getNodeById: (id: string) => SystemNode | undefined;
}

const SystemContext = createContext<SystemContextValue | null>(null);

export function SystemStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refreshData = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const [twinState, graphData, alertsData] = await Promise.all([
        getTwinState(),
        getGraph(),
        getAlerts(),
      ]);
      dispatch({ type: 'SET_TWIN_STATE', payload: twinState });
      dispatch({ type: 'SET_GRAPH', payload: { nodes: graphData.nodes, edges: graphData.edges } });
      dispatch({ type: 'SET_ALERTS', payload: alertsData });
    } catch {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load system data' });
    }
  }, []);

  const selectNode = useCallback((id: string | null) => {
    dispatch({ type: 'SELECT_NODE', payload: id });
  }, []);

  const toggleLive = useCallback(() => {
    dispatch({ type: 'TOGGLE_LIVE' });
  }, []);

  const getNodeById = useCallback((id: string) => {
    return state.nodes.find(n => n.id === id);
  }, [state.nodes]);

  // Initial data load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Live simulation tick
  useEffect(() => {
    if (state.isLive && state.nodes.length > 0) {
      intervalRef.current = setInterval(() => {
        const updatedNodes = state.nodes.map(node => {
          if (node.type === 'sensor') return node;
          const jitter = (base: number, range: number) => {
            return Math.round((base + (Math.random() - 0.5) * range) * 10) / 10;
          };
          return {
            ...node,
            temperature: jitter(node.temperature, 1.2),
            vibration: jitter(node.vibration, 0.3),
            load: Math.max(0, Math.min(100, jitter(node.load, 2))),
            energyConsumption: jitter(node.energyConsumption, 3),
            healthScore: Math.max(0, Math.min(100, jitter(node.healthScore, 0.4))),
            failureProbability: Math.max(0, Math.min(100, jitter(node.failureProbability, 0.3))),
            rpm: node.rpm > 0 ? jitter(node.rpm, 5) : 0,
            pressure: jitter(node.pressure, 0.1),
          };
        });
        dispatch({ type: 'TICK', payload: { nodes: updatedNodes } });
      }, 3000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [state.isLive, state.nodes.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SystemContext.Provider value={{ state, dispatch, selectNode, toggleLive, refreshData, getNodeById }}>
      {children}
    </SystemContext.Provider>
  );
}

export function useSystemState() {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error('useSystemState must be used within SystemStateProvider');
  return ctx;
}
