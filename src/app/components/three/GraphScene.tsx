"use client";

import { useEffect, useRef, type RefObject } from "react";
import * as THREE from "three";

type NodeKind = "tech" | "concept" | "project" | "hub";
type NodeDef = { id: string; label: string; kind: NodeKind; r: number };
type EdgeDef = [string, string];

const NODES: NodeDef[] = [
  { id: "kyle", label: "Kyle", kind: "hub", r: 0.22 },

  { id: "html", label: "HTML", kind: "tech", r: 0.1 },
  { id: "css", label: "CSS", kind: "tech", r: 0.1 },
  { id: "js", label: "JS", kind: "tech", r: 0.11 },
  { id: "ts", label: "TS", kind: "tech", r: 0.1 },
  { id: "react", label: "React", kind: "tech", r: 0.12 },
  { id: "next", label: "Next", kind: "tech", r: 0.12 },
  { id: "vite", label: "Vite", kind: "tech", r: 0.1 },
  { id: "node", label: "Node", kind: "tech", r: 0.11 },
  { id: "mongo", label: "Mongo", kind: "tech", r: 0.1 },
  { id: "unity", label: "Unity", kind: "tech", r: 0.12 },

  { id: "api", label: "API", kind: "concept", r: 0.08 },
  { id: "auth", label: "Auth", kind: "concept", r: 0.08 },
  { id: "agents", label: "Agents", kind: "concept", r: 0.1 },
  { id: "ux", label: "UX", kind: "concept", r: 0.08 },

  { id: "prism", label: "PRISM", kind: "project", r: 0.17 },
  { id: "vibe", label: "Vibe Coding", kind: "project", r: 0.17 },
  { id: "resources", label: "Resources", kind: "project", r: 0.17 },
  { id: "surf", label: "Operation Surf", kind: "project", r: 0.17 },
];

const EDGES: EdgeDef[] = [
  // tech cluster
  ["html", "css"], ["css", "js"], ["html", "js"],
  ["js", "ts"], ["js", "react"], ["react", "next"], ["next", "vite"],
  ["node", "mongo"], ["node", "api"], ["api", "auth"],
  ["unity", "js"], ["agents", "api"], ["react", "ux"],

  // project → tech
  ["prism", "agents"], ["prism", "api"], ["prism", "ts"], ["prism", "node"],
  ["vibe", "html"], ["vibe", "css"], ["vibe", "js"], ["vibe", "vite"], ["vibe", "ux"],
  ["resources", "next"], ["resources", "mongo"], ["resources", "node"], ["resources", "react"],
  ["surf", "react"], ["surf", "mongo"], ["surf", "node"], ["surf", "ux"],

  // hub → projects & core
  ["kyle", "prism"], ["kyle", "vibe"], ["kyle", "resources"], ["kyle", "surf"],
  ["kyle", "agents"], ["kyle", "ts"],
];

const NODE_INDEX = new Map(NODES.map((n, i) => [n.id, i]));

// Horizontal slot order for the mountain-range layout. Hand-curated so that
// connected nodes land roughly adjacent and the hub sits near the middle.
const X_ORDER = [
  "auth", "api", "prism", "agents", "ts", "ux",
  "mongo", "node", "resources", "kyle", "vibe",
  "react", "next", "surf", "vite", "unity", "js", "html", "css",
];
const X_SPREAD = 12.0;
const X_ANCHORS = new Float32Array(NODES.length);
X_ORDER.forEach((id, slot) => {
  const i = NODE_INDEX.get(id);
  if (i === undefined) return;
  X_ANCHORS[i] = -X_SPREAD / 2 + (slot + 0.5) * (X_SPREAD / X_ORDER.length);
});

// Precomputed 1-hop subgraph per project/hub for hover highlight.
const HIGHLIGHT_SET: Record<string, Set<string>> = {};
for (const p of NODES.filter((n) => n.kind === "project" || n.kind === "hub")) {
  const s = new Set<string>([p.id]);
  for (const [a, b] of EDGES) {
    if (a === p.id) s.add(b);
    if (b === p.id) s.add(a);
  }
  HIGHLIGHT_SET[p.id] = s;
}

const INK = new THREE.Color(0x0f0e0c);
const ACCENT = new THREE.Color(0xd46a3a);
const MUTED = new THREE.Color(0x7a756c);

type Props = {
  progressRef: RefObject<number>;
  hoverIdRef: RefObject<string | null>;
};

export default function GraphScene({ progressRef, hoverIdRef }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Physics state. Positions seeded near each node's x-anchor so the
    // mountain range forms immediately instead of scrambling into place.
    const N = NODES.length;
    const pos = new Float32Array(N * 3);
    const vel = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pos[i * 3]     = X_ANCHORS[i] + (Math.random() - 0.5) * 0.3;
      pos[i * 3 + 1] = 1.6 + (Math.random() - 0.5) * 1.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
    }
    const hubIdx = NODE_INDEX.get("kyle")!;

    const edgeIdx: [number, number, number][] = EDGES.map(([a, b]) => {
      const ia = NODE_INDEX.get(a)!;
      const ib = NODE_INDEX.get(b)!;
      const la = NODES[ia].kind;
      const lb = NODES[ib].kind;
      const rest = la === "hub" || lb === "hub" ? 2.2 : 1.7;
      return [ia, ib, rest];
    });

    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);
    const nodeMeshes: THREE.Mesh[] = NODES.map((n) => {
      const geom = new THREE.SphereGeometry(n.r, 20, 20);
      const mat = new THREE.MeshBasicMaterial({
        color: INK.clone(),
        transparent: true,
        opacity: 1,
      });
      const m = new THREE.Mesh(geom, mat);
      nodeGroup.add(m);
      return m;
    });

    const edgePositions = new Float32Array(edgeIdx.length * 2 * 3);
    const edgeColors = new Float32Array(edgeIdx.length * 2 * 3);
    const edgeGeom = new THREE.BufferGeometry();
    edgeGeom.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3));
    edgeGeom.setAttribute("color", new THREE.BufferAttribute(edgeColors, 3));
    const edgeMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
    });
    const edgeLines = new THREE.LineSegments(edgeGeom, edgeMat);
    scene.add(edgeLines);

    const stepForces = (dt: number) => {
      const repulse = 1.2;
      const springK = 1.6;
      const xAnchorK = 1.4;
      const centerY = 0.02;
      const centerZ = 0.02;
      const damping = 0.88;
      const forces = new Float32Array(N * 3);

      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pos[i * 3] - pos[j * 3];
          const dy = pos[i * 3 + 1] - pos[j * 3 + 1];
          const dz = pos[i * 3 + 2] - pos[j * 3 + 2];
          const d2 = dx * dx + dy * dy + dz * dz + 0.08;
          const inv = repulse / d2;
          forces[i * 3]     += dx * inv;
          forces[i * 3 + 1] += dy * inv;
          forces[i * 3 + 2] += dz * inv;
          forces[j * 3]     -= dx * inv;
          forces[j * 3 + 1] -= dy * inv;
          forces[j * 3 + 2] -= dz * inv;
        }
      }

      for (const [a, b, rest] of edgeIdx) {
        const dx = pos[b * 3] - pos[a * 3];
        const dy = pos[b * 3 + 1] - pos[a * 3 + 1];
        const dz = pos[b * 3 + 2] - pos[a * 3 + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.0001;
        const f = (d - rest) * springK;
        const ux = dx / d, uy = dy / d, uz = dz / d;
        forces[a * 3]     += ux * f;
        forces[a * 3 + 1] += uy * f;
        forces[a * 3 + 2] += uz * f;
        forces[b * 3]     -= ux * f;
        forces[b * 3 + 1] -= uy * f;
        forces[b * 3 + 2] -= uz * f;
      }

      const anchorY = 1.6;
      for (let i = 0; i < N; i++) {
        forces[i * 3]     += (X_ANCHORS[i] - pos[i * 3])    * xAnchorK;
        forces[i * 3 + 1] -= (pos[i * 3 + 1] - anchorY)     * centerY;
        forces[i * 3 + 2] -= pos[i * 3 + 2]                 * centerZ;
        forces[i * 3 + 2] -= pos[i * 3 + 2] * 0.03;

        const ny = pos[i * 3 + 1];
        if (ny < -0.6) forces[i * 3 + 1] += (-0.6 - ny) * 1.4;
        if (ny > 4.0)  forces[i * 3 + 1] += ( 4.0 - ny) * 1.2;

        vel[i * 3]     = (vel[i * 3]     + forces[i * 3]     * dt) * damping;
        vel[i * 3 + 1] = (vel[i * 3 + 1] + forces[i * 3 + 1] * dt) * damping;
        vel[i * 3 + 2] = (vel[i * 3 + 2] + forces[i * 3 + 2] * dt) * damping;
        pos[i * 3]     += vel[i * 3]     * dt;
        pos[i * 3 + 1] += vel[i * 3 + 1] * dt;
        pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
      }
    };

    // warmup — relax to equilibrium before first paint
    for (let k = 0; k < 180; k++) stepForces(1 / 60);

    let raf = 0;
    const t0 = performance.now();
    let currentOpacity = 1;
    let driftSeed = 0;

    const render = () => {
      const t = (performance.now() - t0) / 1000;
      const p = Math.max(0, Math.min(1, progressRef.current));

      const targetOpacity = p < 0.22 ? 1 : p > 0.35 ? 0 : 1 - (p - 0.22) / 0.13;
      currentOpacity += (targetOpacity - currentOpacity) * 0.12;

      if (currentOpacity < 0.01) {
        renderer.render(new THREE.Scene(), camera);
        raf = requestAnimationFrame(render);
        return;
      }

      stepForces(1 / 60);

      driftSeed += 1;
      if (driftSeed % 90 === 0) {
        for (let i = 0; i < N; i++) {
          if (i === hubIdx) continue;
          vel[i * 3]     += (Math.random() - 0.5) * 0.04;
          vel[i * 3 + 1] += (Math.random() - 0.5) * 0.04;
          vel[i * 3 + 2] += (Math.random() - 0.5) * 0.02;
        }
      }

      const hover = hoverIdRef.current;
      const hi = hover ? HIGHLIGHT_SET[hover] : null;

      for (let i = 0; i < N; i++) {
        const m = nodeMeshes[i];
        m.position.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);

        const n = NODES[i];
        const isIncluded = !hi || hi.has(n.id);
        const isTarget = hi && n.id === hover;

        const base = n.kind === "hub" || n.kind === "project" ? INK : MUTED;
        const target = isTarget ? ACCENT : isIncluded ? base : MUTED;
        const mat = m.material as THREE.MeshBasicMaterial;
        mat.color.lerp(target, 0.12);

        const alpha = hi ? (isIncluded ? 1 : 0.15) : 1;
        mat.opacity += (alpha * currentOpacity - mat.opacity) * 0.15;
      }

      for (let k = 0; k < edgeIdx.length; k++) {
        const [a, b] = edgeIdx[k];
        const na = NODES[a];
        const nb = NODES[b];
        edgePositions[k * 6]     = pos[a * 3];
        edgePositions[k * 6 + 1] = pos[a * 3 + 1];
        edgePositions[k * 6 + 2] = pos[a * 3 + 2];
        edgePositions[k * 6 + 3] = pos[b * 3];
        edgePositions[k * 6 + 4] = pos[b * 3 + 1];
        edgePositions[k * 6 + 5] = pos[b * 3 + 2];

        const bothIn = !hi || (hi.has(na.id) && hi.has(nb.id));
        const highlighted = hi && hi.has(na.id) && hi.has(nb.id);
        const c = highlighted ? ACCENT : bothIn ? INK : MUTED;
        edgeColors[k * 6]     = c.r;
        edgeColors[k * 6 + 1] = c.g;
        edgeColors[k * 6 + 2] = c.b;
        edgeColors[k * 6 + 3] = c.r;
        edgeColors[k * 6 + 4] = c.g;
        edgeColors[k * 6 + 5] = c.b;
      }
      edgeGeom.attributes.position.needsUpdate = true;
      edgeGeom.attributes.color.needsUpdate = true;
      edgeMat.opacity = (hi ? 0.25 : 0.35) * currentOpacity;

      const camP = Math.min(0.2, p);
      const settle = camP / 0.2;
      camera.position.x = Math.sin(t * 0.06) * 0.3;
      camera.position.y = 1.6 + Math.sin(t * 0.05 + 1.2) * 0.12;
      camera.position.z = 10 - settle * 1.0;
      camera.lookAt(0, 1.6, 0);

      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
      renderer.dispose();
      edgeGeom.dispose();
      edgeMat.dispose();
      nodeMeshes.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
    };
  }, [progressRef, hoverIdRef]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, #000 0%, #000 40%, rgba(0,0,0,0.25) 65%, transparent 80%)",
        maskImage:
          "linear-gradient(to bottom, #000 0%, #000 40%, rgba(0,0,0,0.25) 65%, transparent 80%)",
      }}
    />
  );
}
