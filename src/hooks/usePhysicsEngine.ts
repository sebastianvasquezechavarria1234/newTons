import { useEffect, useRef, useCallback } from 'react';
import Matter from 'matter-js';

interface ControlsState {
  wind: number;
  restitution: number;
  frictionAir: number;
  magneticAttraction: number;
}

export function usePhysicsEngine(containerRef: React.RefObject<HTMLDivElement | null>) {
  const engineRef = useRef<Matter.Engine | null>(null);
  const wallsRef = useRef<Matter.Body[]>([]);
  const bodyElementMapRef = useRef<Map<number, HTMLElement>>(new Map());
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const controlsRef = useRef<ControlsState>({
    wind: 0,
    restitution: 0.6,
    frictionAir: 0.01,
    magneticAttraction: 0,
  });
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0.5, scale: 0.001 },
    });
    engineRef.current = engine;
    const { world } = engine;

    const buildWalls = () => {
      const prev = wallsRef.current;
      if (prev.length) {
        Matter.Composite.remove(world, prev);
      }

      const { width, height } = container.getBoundingClientRect();
      const t = 60;
      const w = width + 200;
      const h = height + 200;
      const walls = [
        Matter.Bodies.rectangle(width / 2, -t / 2, w, t, { isStatic: true }),
        Matter.Bodies.rectangle(width / 2, height + t / 2, w, t, { isStatic: true }),
        Matter.Bodies.rectangle(-t / 2, height / 2, t, h, { isStatic: true }),
        Matter.Bodies.rectangle(width + t / 2, height / 2, t, h, { isStatic: true }),
      ];
      wallsRef.current = walls;
      Matter.Composite.add(world, walls);
    };

    buildWalls();

    const ro = new ResizeObserver(buildWalls);
    ro.observe(container);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };

    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) {
        const rect = container.getBoundingClientRect();
        mouseRef.current = { x: t.clientX - rect.left, y: t.clientY - rect.top };
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });

    const mouse = Matter.Mouse.create(container);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Matter.Composite.add(world, mouseConstraint);

    const loop = () => {
      Matter.Engine.update(engine, 1000 / 60);
      const ctrl = controlsRef.current;

      for (const body of Matter.Composite.allBodies(world)) {
        if (body.isStatic || body.isSensor) continue;

        if (ctrl.wind !== 0) {
          Matter.Body.applyForce(body, body.position, {
            x: ctrl.wind * 0.0003,
            y: 0,
          });
        }

        if (ctrl.magneticAttraction > 0) {
          const { x: mx, y: my } = mouseRef.current;
          const dx = mx - body.position.x;
          const dy = my - body.position.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > 0 && dist < 450) {
            const force = ctrl.magneticAttraction * 0.0004;
            Matter.Body.applyForce(body, body.position, {
              x: (dx / dist) * force,
              y: (dy / dist) * force,
            });
          }
        }

        const el = bodyElementMapRef.current.get(body.id);
        if (el) {
          const bw = parseFloat(el.dataset.bodyWidth || '200');
          const bh = parseFloat(el.dataset.bodyHeight || '140');
          el.style.transform = `translate(${body.position.x - bw / 2}px, ${body.position.y - bh / 2}px) rotate(${body.angle}rad)`;
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('touchmove', handleTouchMove);
      Matter.Engine.clear(engine);
    };
  }, [containerRef]);

  const addBody = useCallback((el: HTMLElement, bodyOptions?: Record<string, unknown>) => {
    const engine = engineRef.current;
    const container = containerRef.current;
    if (!engine || !container) return null;

    const bw = parseFloat(el.dataset.bodyWidth || '200');
    const bh = parseFloat(el.dataset.bodyHeight || '140');
    const cw = container.clientWidth;
    const ch = container.clientHeight;
    const x = Math.random() * (cw - bw - 80) + bw / 2 + 40;
    const y = Math.random() * Math.min(ch * 0.4, 200) + 60;

    const body = Matter.Bodies.rectangle(x, y, bw, bh, {
      restitution: controlsRef.current.restitution,
      frictionAir: controlsRef.current.frictionAir,
      density: 0.001,
      ...bodyOptions,
    } as any);

    Matter.Composite.add(engine.world, body);
    bodyElementMapRef.current.set(body.id, el);

    el.style.position = 'absolute';
    el.style.left = '0';
    el.style.top = '0';
    el.style.transform = `translate(${x - bw / 2}px, ${y - bh / 2}px) rotate(0rad)`;
    el.style.willChange = 'transform';

    return body;
  }, [containerRef]);

  const removeBody = useCallback((body: Matter.Body) => {
    const engine = engineRef.current;
    if (!engine) return;
    Matter.Composite.remove(engine.world, body);
    bodyElementMapRef.current.delete(body.id);
  }, []);

  const setGravity = useCallback((x: number, y: number) => {
    const engine = engineRef.current;
    if (!engine) return;
    engine.gravity.x = x;
    engine.gravity.y = y;
  }, []);

  const setWind = useCallback((v: number) => {
    controlsRef.current.wind = v;
  }, []);

  const setRestitution = useCallback((v: number) => {
    controlsRef.current.restitution = v;
    const engine = engineRef.current;
    if (!engine) return;
    for (const b of Matter.Composite.allBodies(engine.world)) {
      if (!b.isStatic) b.restitution = v;
    }
  }, []);

  const setFrictionAir = useCallback((v: number) => {
    controlsRef.current.frictionAir = v;
    const engine = engineRef.current;
    if (!engine) return;
    for (const b of Matter.Composite.allBodies(engine.world)) {
      if (!b.isStatic) b.frictionAir = v;
    }
  }, []);

  const setMagneticAttraction = useCallback((v: number) => {
    controlsRef.current.magneticAttraction = v;
  }, []);

  return {
    addBody,
    removeBody,
    setGravity,
    setWind,
    setRestitution,
    setFrictionAir,
    setMagneticAttraction,
  };
}
