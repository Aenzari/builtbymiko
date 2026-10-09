"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Line, Text } from "@react-three/drei";
import * as THREE from "three";
import { TOPOLOGY_NODES, TOPOLOGY_EDGES, findNode, nodeVector } from "./topology-data";

function damp(current: number, target: number, lambda: number, dt: number) {
  return THREE.MathUtils.damp(current, target, lambda, dt);
}

/**
 * Tracks pointer velocity (px/ms, smoothed) and normalized scroll progress
 * entirely in refs — neither ever triggers a React re-render, since both
 * update at input/scroll frequency and are only ever read inside
 * `useFrame`.
 */
function useInputSignals(isCoarsePointer: boolean) {
  const velocity = useRef(0);
  const scrollProgress = useRef(0);

  useEffect(() => {
    if (isCoarsePointer) return;

    let lastX = 0;
    let lastY = 0;
    let lastTime = performance.now();
    let hasLast = false;

    function handlePointerMove(e: PointerEvent) {
      const now = performance.now();
      const dt = Math.max(now - lastTime, 1);
      if (hasLast) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        const instantVelocity = Math.sqrt(dx * dx + dy * dy) / dt;
        // Smooth so a single fast pixel jump doesn't spike the whole scene.
        velocity.current = velocity.current * 0.8 + instantVelocity * 0.2;
      }
      lastX = e.clientX;
      lastY = e.clientY;
      lastTime = now;
      hasLast = true;
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [isCoarsePointer]);

  useEffect(() => {
    function handleScroll() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      scrollProgress.current = max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { velocity, scrollProgress };
}

interface PulseData {
  edgeIndex: number;
  /** 0–1 position along the edge. */
  t: number;
  speed: number;
}

const PULSE_COUNT = 10;
const BASE_PULSE_SPEED = 0.18;
const MAX_VELOCITY_BOOST = 1.8;

function TopologyGraph({
  velocity,
  scrollProgress,
}: {
  velocity: React.MutableRefObject<number>;
  scrollProgress: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseMeshRefs = useRef<(THREE.Mesh | null)[]>([]);

  const edgeVectors = useMemo(
    () =>
      TOPOLOGY_EDGES.map((edge) => ({
        from: nodeVector(findNode(edge.from)),
        to: nodeVector(findNode(edge.to)),
      })),
    []
  );

  const pulses = useRef<PulseData[]>(
    Array.from({ length: PULSE_COUNT }, (_, i) => ({
      edgeIndex: i % TOPOLOGY_EDGES.length,
      t: (i / PULSE_COUNT) % 1,
      speed: BASE_PULSE_SPEED * (0.7 + Math.random() * 0.6),
    }))
  );

  const nodeScaleRefs = useRef<(THREE.Mesh | null)[]>([]);
  const queryBurst = useRef(0);

  useEffect(() => {
    const trigger = () => {
      queryBurst.current = 1;
      pulses.current.forEach((pulse, index) => {
        pulse.t = index / pulses.current.length;
        pulse.speed = 0.7;
      });
    };
    window.addEventListener("simulate-query", trigger);
    return () => window.removeEventListener("simulate-query", trigger);
  }, []);

  useFrame((state, rawDelta) => {
    const delta = Math.min(rawDelta, 1 / 30);
    const elapsed = state.clock.elapsedTime;
    const group = groupRef.current;
    if (!group) return;

    // Scroll maps to a slow, deliberate tilt of the whole graph — reading
    // the topology from a different angle as the visitor moves through the
    // page, rather than a literal parallax scrub.
    const targetRotationX = scrollProgress.current * 0.5 - 0.1;
    group.rotation.x = damp(group.rotation.x, targetRotationX, 3, delta);
    group.rotation.y = damp(group.rotation.y, Math.sin(elapsed * 0.08) * 0.25, 2, delta);

    // Cursor velocity boosts pulse travel speed and a subtle emissive pulse
    // on the nodes, so fast mouse movement reads as "activity" moving
    // through the system rather than an isolated cursor effect.
    const velocityBoost = 1 + Math.min(velocity.current * 0.35, MAX_VELOCITY_BOOST);
    queryBurst.current = Math.max(0, queryBurst.current - delta * 0.7);

    for (let i = 0; i < pulses.current.length; i++) {
      const pulse = pulses.current[i];
      pulse.t += delta * pulse.speed * velocityBoost;
      if (pulse.t > 1) {
        pulse.t = 0;
        pulse.edgeIndex = Math.floor(Math.random() * TOPOLOGY_EDGES.length);
      }

      const { from, to } = edgeVectors[pulse.edgeIndex];
      const mesh = pulseMeshRefs.current[i];
      if (mesh) {
        mesh.position.lerpVectors(from, to, pulse.t);
        const fade = Math.sin(pulse.t * Math.PI); // fade in/out at each edge's endpoints
        mesh.scale.setScalar(0.5 + fade * 0.7);
      }
    }

    // Idle breathing on each node, independent of pulse activity, so the
    // graph never looks frozen even with the pointer at rest.
    for (let i = 0; i < TOPOLOGY_NODES.length; i++) {
      const mesh = nodeScaleRefs.current[i];
      if (!mesh) continue;
      const breathe = 1 + Math.sin(elapsed * 0.8 + i) * 0.06;
      mesh.scale.setScalar(breathe);
    }
  });

  return (
    <group ref={groupRef}>
      {TOPOLOGY_EDGES.map((edge, i) => {
        const from = findNode(edge.from);
        const to = findNode(edge.to);
        return (
          <Line
            key={`${edge.from}-${edge.to}`}
            points={[from.position, to.position]}
            color="#38BDF8"
            transparent
            opacity={0.28 + queryBurst.current * 0.45}
            lineWidth={1}
          />
        );
      })}

      {TOPOLOGY_NODES.map((node, i) => (
        <group key={node.id} position={node.position}>
          <mesh ref={(el) => { nodeScaleRefs.current[i] = el; }}>
            <sphereGeometry args={[node.radius, 20, 20]} />
            <meshStandardMaterial
              color={node.color}
              emissive={node.color}
              emissiveIntensity={0.35 + queryBurst.current * 1.5}
              roughness={0.4}
              metalness={0.1}
            />
          </mesh>
          <Text
            position={[0, node.radius + 0.22, 0]}
            fontSize={0.12}
            color="#A4B0A4"
            anchorX="center"
            anchorY="bottom"
            font={undefined}
          >
            {node.label}
          </Text>
        </group>
      ))}

      {pulses.current.map((_, i) => (
        <mesh key={i} ref={(el) => { pulseMeshRefs.current[i] = el; }}>
          <sphereGeometry args={[0.045, 10, 10]} />
          <meshBasicMaterial color="#F59E0B" transparent opacity={0.95} />
        </mesh>
      ))}
    </group>
  );
}

function VisibilityGate({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true);
  const { invalidate } = useThree();

  useEffect(() => {
    function handleVisibility() {
      setIsVisible(document.visibilityState === "visible");
      if (document.visibilityState === "visible") invalidate();
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [invalidate]);

  return isVisible ? <>{children}</> : null;
}

export function TopologyCanvas() {
  const [isCoarsePointer, setIsCoarsePointer] = useState(false);
  const { velocity, scrollProgress } = useInputSignals(isCoarsePointer);

  useEffect(() => {
    setIsCoarsePointer(!window.matchMedia("(pointer: fine)").matches);
  }, []);

  const dpr = useMemo<[number, number]>(() => [1, 1.5], []);

  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: true, powerPreference: "low-power", alpha: true }}
      camera={{ position: [0, 0, 6], fov: 42 }}
      className="!touch-none pointer-events-auto"
      aria-hidden="true"
    >
      <VisibilityGate>
        <ambientLight intensity={0.9} />
        <pointLight position={[4, 4, 5]} intensity={25} color="#F1F5ED" />
        <pointLight position={[-3, -2, -2]} intensity={12} color="#B7F36B" />
        <TopologyGraph velocity={velocity} scrollProgress={scrollProgress} />
      </VisibilityGate>
    </Canvas>
  );
}
