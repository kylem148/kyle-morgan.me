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
  { id: "python", label: "Python", kind: "tech", r: 0.11 },
  { id: "git", label: "Git", kind: "tech", r: 0.1 },
  { id: "aws", label: "AWS", kind: "tech", r: 0.12 },

  { id: "api", label: "API", kind: "concept", r: 0.08 },
  { id: "auth", label: "Auth", kind: "concept", r: 0.08 },
  { id: "agents", label: "Agents", kind: "concept", r: 0.1 },
  { id: "ux", label: "UX", kind: "concept", r: 0.08 },
  { id: "mcp", label: "MCP", kind: "concept", r: 0.08 },

  { id: "prism", label: "PRISM", kind: "project", r: 0.17 },
  { id: "sjsu", label: "SJSU Navigator", kind: "project", r: 0.17 },
  { id: "secretary", label: "Secretary Agent", kind: "project", r: 0.17 },
  { id: "comanager", label: "Co-Manager", kind: "project", r: 0.17 },
];

const EDGES: EdgeDef[] = [
  // tech cluster
  ["html", "css"], ["css", "js"], ["html", "js"],
  ["js", "ts"], ["js", "react"], ["react", "next"], ["next", "vite"],
  ["node", "mongo"], ["node", "api"], ["api", "auth"],
  ["unity", "js"], ["agents", "api"], ["react", "ux"], ["mcp", "agents"],

  // project → tech
  ["prism", "agents"], ["prism", "api"], ["prism", "ts"], ["prism", "node"],
  ["sjsu", "agents"], ["sjsu", "aws"], ["sjsu", "python"], ["sjsu", "auth"], ["sjsu", "api"],
  ["secretary", "agents"], ["secretary", "mcp"], ["secretary", "auth"], ["secretary", "api"], ["secretary", "python"],
  ["comanager", "agents"], ["comanager", "git"],

  // hub → projects & core
  ["kyle", "prism"], ["kyle", "sjsu"], ["kyle", "secretary"], ["kyle", "comanager"],
  ["kyle", "agents"], ["kyle", "ts"],
];

const NODE_INDEX = new Map(NODES.map((n, i) => [n.id, i]));

// Horizontal slot order for the mountain-range layout. Hand-curated so that
// connected nodes land roughly adjacent and the hub sits near the middle.
const X_ORDER = [
  "aws", "sjsu", "python", "mcp", "secretary", "auth", "api", "prism",
  "agents", "comanager", "git", "ts", "kyle", "node", "mongo", "ux",
  "react", "next", "vite", "unity", "js", "html", "css",
];
const X_SPREAD = 12.0;
const X_ANCHORS = new Float32Array(NODES.length);
X_ORDER.forEach((id, slot) => {
  const i = NODE_INDEX.get(id);
  if (i === undefined) return;
  X_ANCHORS[i] = -X_SPREAD / 2 + (slot + 0.5) * (X_SPREAD / X_ORDER.length);
});

const INK = new THREE.Color(0x0f0e0c);
const MUTED = new THREE.Color(0x7a756c);

type Props = {
  progressRef: RefObject<number>;
  // The section the graph shows through. Rendering pauses while it's offscreen.
  heroRef: RefObject<HTMLElement | null>;
};

export default function GraphScene({ progressRef, heroRef }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    const hero = heroRef.current;
    if (!mount || !hero) return;

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
        color: n.kind === "hub" || n.kind === "project" ? INK : MUTED,
        transparent: true,
        opacity: 0,
      });
      const m = new THREE.Mesh(geom, mat);
      nodeGroup.add(m);
      return m;
    });

    const edgePositions = new Float32Array(edgeIdx.length * 2 * 3);
    const edgeGeom = new THREE.BufferGeometry();
    edgeGeom.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3));
    const edgeMat = new THREE.LineBasicMaterial({
      color: INK,
      transparent: true,
      opacity: 0,
    });
    const edgeLines = new THREE.LineSegments(edgeGeom, edgeMat);
    scene.add(edgeLines);

    // Compile shaders now, so a page opened below the hero doesn't stall the
    // first frame when the hero scrolls back into view.
    renderer.compile(scene, camera);

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

    // Cinematic intro: opacity-only ripple from the hub outward. Positions
    // settle via the normal physics; nodes farther from Kyle just fade in later.
    const introDelay = new Float32Array(N);
    const introDuration = 1.3;
    const introSpread = 1.1;
    const introHold = 0.5; // hub blooms just after the hero text settles
    const introTotal = introHold + introDuration + introSpread;

    const hubX = pos[hubIdx * 3];
    const hubY = pos[hubIdx * 3 + 1];
    const hubZ = pos[hubIdx * 3 + 2];

    let maxD = 0.001;
    for (let i = 0; i < N; i++) {
      const dx = pos[i * 3] - hubX;
      const dy = pos[i * 3 + 1] - hubY;
      const dz = pos[i * 3 + 2] - hubZ;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d > maxD) maxD = d;
    }
    for (let i = 0; i < N; i++) {
      const dx = pos[i * 3] - hubX;
      const dy = pos[i * 3 + 1] - hubY;
      const dz = pos[i * 3 + 2] - hubZ;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      introDelay[i] = introHold + (d / maxD) * introSpread;
    }
    const introProg = new Float32Array(N);

    let raf = 0;
    // Scene clock. It only advances while the loop runs, so the intro and
    // camera sway resume where they paused instead of jumping ahead.
    let t = 0;
    let lastFrame = 0;
    let currentOpacity = 1;
    let driftSeed = 0;
    // True while the canvas holds a drawn frame, false once it's been cleared.
    let drawn = false;

    const render = () => {
      const now = performance.now();
      t += Math.min(0.1, (now - lastFrame) / 1000);
      lastFrame = now;
      const p = Math.max(0, Math.min(1, progressRef.current));

      const targetOpacity = p < 0.22 ? 1 : p > 0.35 ? 0 : 1 - (p - 0.22) / 0.13;
      currentOpacity += (targetOpacity - currentOpacity) * 0.12;

      if (currentOpacity < 0.01) {
        // Faded out: clear once, then skip GPU work until it fades back in.
        if (drawn) {
          renderer.clear();
          drawn = false;
        }
        raf = requestAnimationFrame(render);
        return;
      }

      const introActive = t < introTotal;
      let edgeIntro = 1;

      if (introActive) {
        let sum = 0;
        for (let i = 0; i < N; i++) {
          const local = (t - introDelay[i]) / introDuration;
          const k = Math.max(0, Math.min(1, local));
          const eased = 1 - Math.pow(1 - k, 3);
          introProg[i] = eased;
          sum += eased;
        }
        edgeIntro = sum / N;
      } else {
        for (let i = 0; i < N; i++) introProg[i] = 1;
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

      for (let i = 0; i < N; i++) {
        const m = nodeMeshes[i];
        m.position.set(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);

        const mat = m.material as THREE.MeshBasicMaterial;
        const targetMatOpacity = currentOpacity * introProg[i];
        if (introActive) {
          mat.opacity = targetMatOpacity;
        } else {
          mat.opacity += (targetMatOpacity - mat.opacity) * 0.15;
        }
      }

      for (let k = 0; k < edgeIdx.length; k++) {
        const [a, b] = edgeIdx[k];
        edgePositions[k * 6]     = pos[a * 3];
        edgePositions[k * 6 + 1] = pos[a * 3 + 1];
        edgePositions[k * 6 + 2] = pos[a * 3 + 2];
        edgePositions[k * 6 + 3] = pos[b * 3];
        edgePositions[k * 6 + 4] = pos[b * 3 + 1];
        edgePositions[k * 6 + 5] = pos[b * 3 + 2];
      }
      edgeGeom.attributes.position.needsUpdate = true;
      edgeMat.opacity = 0.35 * currentOpacity * edgeIntro;

      const camP = Math.min(0.2, p);
      const settle = camP / 0.2;
      camera.position.x = Math.sin(t * 0.06) * 0.3;
      camera.position.y = 1.6 + Math.sin(t * 0.05 + 1.2) * 0.12;
      camera.position.z = 10 - settle * 1.0;
      camera.lookAt(0, 1.6, 0);

      renderer.render(scene, camera);
      drawn = true;
      raf = requestAnimationFrame(render);
    };

    const start = () => {
      if (raf) return;
      lastFrame = performance.now();
      raf = requestAnimationFrame(render);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };
    // Every section after the hero is opaque, so the graph can only be seen
    // while the hero is on screen. Don't render it the rest of the time.
    const io = new IntersectionObserver(([entry]) =>
      entry.isIntersecting ? start() : stop(),
    );
    io.observe(hero);

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w === width && h === height) return;
      width = w;
      height = h;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      // setSize clears the canvas. Redraw right away so a resize never
      // presents an empty frame.
      if (drawn) renderer.render(scene, camera);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      stop();
      io.disconnect();
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
  }, [progressRef, heroRef]);

  // Sized with svh instead of bottom-0 so the box, and the canvas in it, keeps
  // its size when a mobile browser's toolbar collapses or expands. The strip it
  // leaves uncovered at the bottom is behind the opaque sections by then.
  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="graph-mask pointer-events-none fixed inset-x-0 top-[42lvh] h-[calc(100svh-42lvh)] z-0 md:top-0 md:h-svh"
    />
  );
}
