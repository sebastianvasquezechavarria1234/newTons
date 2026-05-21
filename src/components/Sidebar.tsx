import { useCallback } from 'react';

interface Props {
  gravity: number;
  wind: number;
  restitution: number;
  frictionAir: number;
  magneticAttraction: number;
  onGravityChange: (v: number) => void;
  onWindChange: (v: number) => void;
  onRestitutionChange: (v: number) => void;
  onFrictionAirChange: (v: number) => void;
  onMagneticChange: (v: number) => void;
  onReset: () => void;
}

export function Sidebar({
  gravity,
  wind,
  restitution,
  frictionAir,
  magneticAttraction,
  onGravityChange,
  onWindChange,
  onRestitutionChange,
  onFrictionAirChange,
  onMagneticChange,
  onReset,
}: Props) {
  const sl = useCallback(
    (label: string, val: number, min: number, max: number, step: number, onChange: (v: number) => void) => (
      <div className="flex flex-col gap-1" key={label}>
        <div className="flex justify-between text-xs text-white/70">
          <span>{label}</span>
          <span className="font-mono">{val.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={val}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `rgba(255,255,255,0.15)`,
            accentColor: '#a78bfa',
          }}
        />
      </div>
    ),
    [],
  );

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-5 p-5 rounded-2xl"
      style={{
        width: 240,
        background: 'rgba(15, 15, 30, 0.55)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 40px rgba(0,0,0,0.35)',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white/90 m-0 tracking-wide uppercase">
          Controls
        </h2>
        <button
          onClick={onReset}
          className="text-xs px-2.5 py-1 rounded-lg border-0 cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.7)',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
        >
          Reset
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {sl('Gravity', gravity, -2, 2, 0.05, onGravityChange)}
        {sl('Wind', wind, -1, 1, 0.05, onWindChange)}
        {sl('Bounce', restitution, 0, 1.5, 0.05, onRestitutionChange)}
        {sl('Air Friction', frictionAir, 0, 0.1, 0.005, onFrictionAirChange)}
        {sl('Magnetic', magneticAttraction, 0, 1, 0.05, onMagneticChange)}
      </div>
    </div>
  );
}
