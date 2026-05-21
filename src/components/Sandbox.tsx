import { useRef, useEffect, useState, useCallback } from 'react';
import { usePhysicsEngine } from '../hooks/usePhysicsEngine';
import { FloatingCard } from './FloatingCard';
import { Sidebar } from './Sidebar';
import { type CardData } from '../types';

const INITIAL_CARDS: CardData[] = [
  { id: 1, title: 'Neural Mesh', description: 'Reinforcement learning on the edge', icon: '🧠', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { id: 2, title: 'Quantum Render', description: 'Real-time ray tracing engine', icon: '⚛️', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
  { id: 3, title: 'Data Vortex', description: 'Streaming analytics pipeline', icon: '🌀', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
  { id: 4, title: 'Wave Sync', description: 'Collaborative audio workstation', icon: '🎵', gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
  { id: 5, title: 'Orbit DB', description: 'Distributed graph database', icon: '🪐', gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { id: 6, title: 'Cipher Core', description: 'Homomorphic encryption layer', icon: '🔐', gradient: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
  { id: 7, title: 'Fusion API', description: 'GraphQL + WebSocket gateway', icon: '⚡', gradient: 'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)' },
  { id: 8, title: 'Pixel Flow', description: 'AI-powered video synthesis', icon: '🎨', gradient: 'linear-gradient(135deg, #5ee7df 0%, #b490ca 100%)' },
];

const DEFAULT_CONTROLS = {
  gravity: 0.5,
  wind: 0,
  restitution: 0.6,
  frictionAir: 0.01,
  magneticAttraction: 0,
};

export function Sandbox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const [registered, setRegistered] = useState(false);
  const [controls, setControls] = useState(DEFAULT_CONTROLS);

  const {
    addBody,
    setGravity,
    setWind,
    setRestitution,
    setFrictionAir,
    setMagneticAttraction,
  } = usePhysicsEngine(containerRef);

  useEffect(() => {
    if (registered) return;
    const entries = Array.from(cardRefs.current.entries());
    if (entries.length < INITIAL_CARDS.length) return;
    for (const [, el] of entries) {
      addBody(el, { density: 0.002 });
    }
    setRegistered(true);
  }, [registered, addBody]);

  const handleCardRef = useCallback((id: number) => (el: HTMLDivElement | null) => {
    if (el) {
      cardRefs.current.set(id, el);
    } else {
      cardRefs.current.delete(id);
    }
  }, []);

  const handleGravity = useCallback(
    (v: number) => {
      setControls((p) => ({ ...p, gravity: v }));
      setGravity(0, v);
    },
    [setGravity],
  );

  const handleWind = useCallback(
    (v: number) => {
      setControls((p) => ({ ...p, wind: v }));
      setWind(v);
    },
    [setWind],
  );

  const handleRestitution = useCallback(
    (v: number) => {
      setControls((p) => ({ ...p, restitution: v }));
      setRestitution(v);
    },
    [setRestitution],
  );

  const handleFrictionAir = useCallback(
    (v: number) => {
      setControls((p) => ({ ...p, frictionAir: v }));
      setFrictionAir(v);
    },
    [setFrictionAir],
  );

  const handleMagnetic = useCallback(
    (v: number) => {
      setControls((p) => ({ ...p, magneticAttraction: v }));
      setMagneticAttraction(v);
    },
    [setMagneticAttraction],
  );

  const handleReset = useCallback(() => {
    setControls(DEFAULT_CONTROLS);
    setGravity(0, DEFAULT_CONTROLS.gravity);
    setWind(DEFAULT_CONTROLS.wind);
    setRestitution(DEFAULT_CONTROLS.restitution);
    setFrictionAir(DEFAULT_CONTROLS.frictionAir);
    setMagneticAttraction(DEFAULT_CONTROLS.magneticAttraction);
  }, [setGravity, setWind, setRestitution, setFrictionAir, setMagneticAttraction]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f1a 100%)',
      }}
    >
      {INITIAL_CARDS.map((card) => (
        <FloatingCard key={card.id} card={card} ref={handleCardRef(card.id)} />
      ))}

      <Sidebar
        gravity={controls.gravity}
        wind={controls.wind}
        restitution={controls.restitution}
        frictionAir={controls.frictionAir}
        magneticAttraction={controls.magneticAttraction}
        onGravityChange={handleGravity}
        onWindChange={handleWind}
        onRestitutionChange={handleRestitution}
        onFrictionAirChange={handleFrictionAir}
        onMagneticChange={handleMagnetic}
        onReset={handleReset}
      />
    </div>
  );
}
