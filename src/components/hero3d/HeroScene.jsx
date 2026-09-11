import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  MeshDistortMaterial,
  Environment,
  Lightformer,
  Float,
} from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

/* Brand palette (mirrors the CSS custom properties). */
const ACCENT = '#39d353'; // green
const ACCENT_2 = '#2dd4bf'; // teal
const ACCENT_3 = '#58a6ff'; // blue

/* Per-frame delta clamp. Doubles as the mechanism that keeps motion continuous
   across an offscreen pause: R3F zeroes clock.elapsedTime every time the loop
   restarts (frameloop never -> always on scroll-back), so any elapsedTime-driven
   animation would snap to phase 0. We instead accumulate our own clock from the
   (clamped) delta, which pauses and resumes seamlessly. */
const TICK = 0.05;

/* ------------------------------------------------------------------
   Central faceted crystal: a real icosahedral mesh with a living
   distortion shader, wrapped in a wireframe shell, lit from a glowing
   emissive core. Genuine geometry — z-buffered, occluding, reflecting
   the procedural environment.
   ------------------------------------------------------------------ */
function Crystal({ reduced }) {
  const mat = useRef();
  const t = useRef(0);

  // Drive the distortion uniform from our own accumulated clock so the surface
  // morph survives frameloop pauses. drei's MeshDistortMaterial also writes
  // material.time from clock.elapsedTime in its own useFrame, but this parent
  // useFrame is the last subscriber (parent effects run after child effects),
  // so our value wins. speed={0} under reduced motion freezes it entirely.
  useFrame((_, dt) => {
    if (reduced || !mat.current) return;
    t.current += Math.min(dt, TICK);
    mat.current.time = t.current * 1.5;
  });

  return (
    <group>
      {/* outer wireframe shell — gives the "engineered" read */}
      <mesh scale={1.34}>
        <icosahedronGeometry args={[1, 1]} />
        <meshBasicMaterial color={ACCENT_2} wireframe transparent opacity={0.14} />
      </mesh>

      {/* main metallic body with animated surface distortion */}
      <mesh>
        <icosahedronGeometry args={[1, 6]} />
        <MeshDistortMaterial
          ref={mat}
          color="#0e2a1f"
          emissive={ACCENT}
          emissiveIntensity={0.22}
          metalness={0.62}
          roughness={0.18}
          distort={reduced ? 0.08 : 0.34}
          speed={reduced ? 0 : 1.5}
        />
      </mesh>

      {/* glowing energy core — drives the bloom */}
      <mesh scale={0.46}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial
          color={ACCENT}
          emissive={ACCENT}
          emissiveIntensity={2.6}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------
   Orbiting shards: small octahedra that genuinely pass in front of and
   behind the crystal (real occlusion via the depth buffer). Radii and
   vertical/depth spread are tuned to keep every shard inside the square
   frame (and the canvas vignette) across its whole orbit.
   ------------------------------------------------------------------ */
function Shards({ reduced }) {
  const ring = useRef();
  const shards = useMemo(() => {
    const colors = [ACCENT, ACCENT_2, ACCENT_3, ACCENT_2, ACCENT_3, ACCENT];
    return Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2;
      const radius = 1.3 + (i % 3) * 0.2;
      return {
        position: [
          Math.cos(a) * radius,
          Math.sin(a * 1.4) * 0.65,
          Math.sin(a) * radius * 0.55,
        ],
        scale: 0.16 + (i % 3) * 0.08,
        color: colors[i % colors.length],
        speed: 0.5 + (i % 4) * 0.18,
      };
    });
  }, []);

  useFrame((_, dt) => {
    if (reduced || !ring.current) return;
    ring.current.rotation.y += Math.min(dt, TICK) * 0.16;
  });

  return (
    <group ref={ring}>
      {shards.map((s, i) => (
        <Float
          key={i}
          speed={reduced ? 0 : s.speed * 2.5}
          rotationIntensity={reduced ? 0 : 1.1}
          floatIntensity={reduced ? 0 : 1.2}
        >
          <mesh position={s.position} scale={s.scale}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={s.color}
              emissive={s.color}
              emissiveIntensity={0.55}
              metalness={0.55}
              roughness={0.25}
            />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------
   Lights: a static key + two colored point lights that orbit the scene,
   throwing moving specular highlights across the metal. Explicit t=0
   positions so the static (reduced-motion / first) frame is correctly lit;
   the orbit is driven by the accumulated clock so it resumes in phase.
   ------------------------------------------------------------------ */
function Lights({ reduced }) {
  const green = useRef();
  const blue = useRef();
  const t = useRef(0);

  useFrame((_, dt) => {
    if (reduced) return;
    t.current += Math.min(dt, TICK);
    const time = t.current;
    if (green.current) {
      green.current.position.set(Math.sin(time * 0.7) * 4, Math.cos(time * 0.5) * 3, 3.5);
    }
    if (blue.current) {
      blue.current.position.set(Math.cos(time * 0.6) * -4, Math.sin(time * 0.85) * 3, 2.5);
    }
  });

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight position={[4, 5, 4]} intensity={2.4} />
      <pointLight ref={green} position={[0, 3, 3.5]} color={ACCENT} intensity={90} distance={16} decay={2} />
      <pointLight ref={blue} position={[-4, 0, 2.5]} color={ACCENT_3} intensity={90} distance={16} decay={2} />
      <pointLight color={ACCENT_2} intensity={45} distance={14} decay={2} position={[0, -3, -4]} />
    </>
  );
}

/* ------------------------------------------------------------------
   Rig: subtle camera parallax from the *global* pointer (canvas is
   pointer-events:none, so this never interferes with page scroll/clicks).
   No-op under reduced motion — camera stays put.
   ------------------------------------------------------------------ */
function Rig({ reduced }) {
  const { camera } = useThree();
  const target = useRef([0, 0]);

  useEffect(() => {
    if (reduced) return undefined;
    const onMove = (e) => {
      // Mutate in place — no per-event allocation.
      target.current[0] = (e.clientX / window.innerWidth) * 2 - 1;
      target.current[1] = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  useFrame(() => {
    if (reduced) return;
    // Small fraction of the view half-extent — a gentle, subtle parallax.
    camera.position.x += (target.current[0] * 0.35 - camera.position.x) * 0.04;
    camera.position.y += (-target.current[1] * 0.25 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

/* Slow idle auto-rotation of the whole assembly. */
function SpinGroup({ reduced, children }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (reduced || !ref.current) return;
    ref.current.rotation.y += Math.min(dt, TICK) * 0.12;
  });
  return <group ref={ref}>{children}</group>;
}

/* Stable element reference so drei's <Environment frames={1}> renders its
   cubemap exactly once. New child identity on each scroll toggle would re-run
   the (one-shot) FBO render, so this is hoisted out of the component. */
const ENV_LIGHTS = (
  <>
    <Lightformer form="rect" intensity={2} color={ACCENT_3} position={[3, 3, 2]} scale={5} />
    <Lightformer form="rect" intensity={2} color={ACCENT} position={[-4, -1, 2]} scale={5} />
    <Lightformer form="circle" intensity={1.4} color={ACCENT_2} position={[0, 4, -3]} scale={4} />
  </>
);

export default function HeroScene({
  reduced = false,
  frameloop = 'always',
  dpr = [1, 2],
  bloom = true,
}) {
  return (
    <Canvas
      className="hero3d-canvas"
      frameloop={frameloop}
      dpr={dpr}
      // alpha: transparent so the scene composites over the page. antialias only
      // when bloom is OFF — with bloom the postprocessing composer runs its own
      // multisampled pass, so a multisampled default backbuffer would be wasted.
      gl={{ antialias: !bloom, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 5], fov: 45 }}
    >
      <Lights reduced={reduced} />

      {/* Procedural studio environment — no network HDRI. Gives the metal
          something brand-colored to reflect. Rendered once (frames=1). */}
      <Environment resolution={256} frames={1}>
        {ENV_LIGHTS}
      </Environment>

      <SpinGroup reduced={reduced}>
        <Crystal reduced={reduced} />
      </SpinGroup>
      <Shards reduced={reduced} />

      <Rig reduced={reduced} />

      {bloom && (
        <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={0.55} intensity={0.85} radius={0.6} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
