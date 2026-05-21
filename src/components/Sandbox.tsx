import { useRef, useEffect, useState, useCallback } from 'react';
import { usePhysicsEngine } from '../hooks/usePhysicsEngine';
import { FloatingCard } from './FloatingCard';
import { Sidebar } from './Sidebar';
import { type CardData } from '../types';

const INITIAL_CARDS: CardData[] = [
  { id: 1, title: 'Neural Mesh', description: 'Reinforcement learning on the edge', image: '/048155170c820a3dad81ae1e5b043538.jpg' },
  { id: 2, title: 'Quantum Render', description: 'Real-time ray tracing engine', image: '/16d276dae2b866be1c8faed7ccc1bb15.jpg' },
  { id: 3, title: 'Data Vortex', description: 'Streaming analytics pipeline', image: '/47c98aecdfdaa0e4c8a585642981b357.jpg' },
  { id: 4, title: 'Wave Sync', description: 'Collaborative audio workstation', image: '/8496ace83d5a13daeb68a6516c58dd99.jpg' },
  { id: 5, title: 'Orbit DB', description: 'Distributed graph database', image: '/c09384d9ab2dade46db96408a33caba9.jpg' },
  { id: 6, title: 'Cipher Core', description: 'Homomorphic encryption layer', image: '/ce7d991bd59fe943385fbea80dd7b222.jpg' },
  { id: 7, title: 'Fusion API', description: 'GraphQL + WebSocket gateway', image: '/d5b90ec3e614ccd60a5479919c95dd4e.jpg' },
  { id: 8, title: 'Pixel Flow', description: 'AI-powered video synthesis', image: '/048155170c820a3dad81ae1e5b043538.jpg' },
  { id: 9, title: 'Echo Shell', description: 'Voice-controlled terminal', image: '/16d276dae2b866be1c8faed7ccc1bb15.jpg' },
  { id: 10, title: 'Prism View', description: 'Augmented reality debugger', image: '/47c98aecdfdaa0e4c8a585642981b357.jpg' },
  { id: 11, title: 'Flux Gate', description: 'Event-driven microservices', image: '/8496ace83d5a13daeb68a6516c58dd99.jpg' },
  { id: 12, title: 'Nova Core', description: 'Edge computing runtime', image: '/c09384d9ab2dade46db96408a33caba9.jpg' },
  { id: 13, title: 'Blink Cache', description: 'In-memory data grid', image: '/ce7d991bd59fe943385fbea80dd7b222.jpg' },
  { id: 14, title: 'Apex Sync', description: 'Real-time collaboration hub', image: '/d5b90ec3e614ccd60a5479919c95dd4e.jpg' },
  { id: 15, title: 'Lens Core', description: 'Computer vision toolkit', image: '/048155170c820a3dad81ae1e5b043538.jpg' },
  { id: 16, title: 'Pulse Mesh', description: 'IoT sensor network', image: '/16d276dae2b866be1c8faed7ccc1bb15.jpg' },
  { id: 17, title: 'Forge CL', description: 'GPU compute pipeline', image: '/47c98aecdfdaa0e4c8a585642981b357.jpg' },
  { id: 18, title: 'Drift Log', description: 'Distributed tracing system', image: '/8496ace83d5a13daeb68a6516c58dd99.jpg' },
  { id: 19, title: 'Halo Auth', description: 'Zero-trust identity layer', image: '/c09384d9ab2dade46db96408a33caba9.jpg' },
  { id: 20, title: 'Void FS', description: 'Decentralized file storage', image: '/ce7d991bd59fe943385fbea80dd7b222.jpg' },
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
        background: '#000',
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
