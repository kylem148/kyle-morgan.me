"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { AGENTS, MANAGER, AGENT_EDGES, type Agent } from "@/content/agents";

type Props = {
  /** id of the node to highlight. Parent owns auto-cycle vs user-hover logic. */
  focusId: string | null;
  /** fires when the user hovers a sphere; null when they leave or hit empty space. */
  onHoverChange: (agent: Agent | null) => void;
};

const INK = new THREE.Color(0x0f0e0c);
const ACCENT = new THREE.Color(0xd46a3a);
const MUTED = new THREE.Color(0x8a8479);

export default function AgentGlobe({ focusId, onHoverChange }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  // Keep the latest external values in refs so the scene isn't rebuilt on
  // each prop change.
  const focusIdRef = useRef(focusId);
  const onHoverRef = useRef(onHoverChange);
  useEffect(() => {
    focusIdRef.current = focusId;
  }, [focusId]);
  useEffect(() => {
    onHoverRef.current = onHoverChange;
  }, [onHoverChange]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.85));
    const key = new THREE.DirectionalLight(0xffffff, 0.45);
    key.position.set(3, 2, 4);
    scene.add(key);

    const group = new THREE.Group();
    scene.add(group);

    // Manager at origin; agents on a Fibonacci sphere shell.
    const allNodes: Agent[] = [MANAGER, ...AGENTS];
    const shellRadius = 0.9;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));
    const basePositions: Record<string, THREE.Vector3> = {
      [MANAGER.id]: new THREE.Vector3(0, 0, 0),
    };
    AGENTS.forEach((agent, i) => {
      const denom = Math.max(1, AGENTS.length - 1);
      const y = 1 - (i / denom) * 2;
      const rAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const phi = goldenAngle * i;
      basePositions[agent.id] = new THREE.Vector3(
        Math.cos(phi) * rAtY * shellRadius,
        y * shellRadius,
        Math.sin(phi) * rAtY * shellRadius
      );
    });

    type NodeRecord = {
      mesh: THREE.Mesh;
      material: THREE.MeshStandardMaterial;
      agent: Agent;
      base: THREE.Vector3;
      phase: number;
    };

    const nodes: NodeRecord[] = allNodes.map((agent) => {
      const r = agent.id === MANAGER.id ? 0.22 : 0.13;
      const geom = new THREE.SphereGeometry(r, 24, 24);
      const material = new THREE.MeshStandardMaterial({
        color: INK.clone(),
        metalness: 0.2,
        roughness: 0.55,
      });
      const mesh = new THREE.Mesh(geom, material);
      mesh.position.copy(basePositions[agent.id]);
      group.add(mesh);
      return {
        mesh,
        material,
        agent,
        base: basePositions[agent.id].clone(),
        phase: Math.random() * Math.PI * 2,
      };
    });

    const nodeById = new Map(nodes.map((n) => [n.agent.id, n]));

    const edgePositions = new Float32Array(AGENT_EDGES.length * 2 * 3);
    const edgeGeom = new THREE.BufferGeometry();
    edgeGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(edgePositions, 3)
    );
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x0f0e0c,
      transparent: true,
      opacity: 0.22,
    });
    const edgeLines = new THREE.LineSegments(edgeGeom, edgeMat);
    group.add(edgeLines);

    // Raycast pointer → emit hover events. The visual highlight is driven
    // exclusively by focusIdRef (parent-owned).
    const raycaster = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    let pointerHover: string | null = null;
    const nodeMeshes = nodes.map((n) => n.mesh);

    const handlePointer = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      ndc.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      ndc.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(ndc, camera);
      const hits = raycaster.intersectObjects(nodeMeshes, false);
      const hit = hits[0]
        ? nodes.find((n) => n.mesh === hits[0].object) ?? null
        : null;
      const newId = hit?.agent.id ?? null;
      if (newId !== pointerHover) {
        pointerHover = newId;
        onHoverRef.current(hit?.agent ?? null);
      }
    };
    const handleLeave = () => {
      if (pointerHover !== null) {
        pointerHover = null;
        onHoverRef.current(null);
      }
    };
    mount.addEventListener("pointermove", handlePointer);
    mount.addEventListener("pointerleave", handleLeave);

    let raf = 0;
    const t0 = performance.now();

    const render = () => {
      const t = (performance.now() - t0) / 1000;

      group.rotation.y = t * 0.08;
      group.rotation.x = Math.sin(t * 0.04) * 0.1;

      const focused = focusIdRef.current;

      for (const n of nodes) {
        const wob = 0.03;
        n.mesh.position.set(
          n.base.x + Math.sin(t * 0.6 + n.phase) * wob,
          n.base.y + Math.cos(t * 0.5 + n.phase) * wob,
          n.base.z + Math.sin(t * 0.4 + n.phase * 1.3) * wob
        );
        const target = focused === n.agent.id ? ACCENT : focused ? MUTED : INK;
        n.material.color.lerp(target, 0.12);
      }

      for (let k = 0; k < AGENT_EDGES.length; k++) {
        const [a, b] = AGENT_EDGES[k];
        const na = nodeById.get(a)!.mesh;
        const nb = nodeById.get(b)!.mesh;
        edgePositions[k * 6] = na.position.x;
        edgePositions[k * 6 + 1] = na.position.y;
        edgePositions[k * 6 + 2] = na.position.z;
        edgePositions[k * 6 + 3] = nb.position.x;
        edgePositions[k * 6 + 4] = nb.position.y;
        edgePositions[k * 6 + 5] = nb.position.z;
      }
      edgeGeom.attributes.position.needsUpdate = true;

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
      mount.removeEventListener("pointermove", handlePointer);
      mount.removeEventListener("pointerleave", handleLeave);
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      edgeGeom.dispose();
      edgeMat.dispose();
      nodes.forEach((n) => {
        n.mesh.geometry.dispose();
        n.material.dispose();
      });
    };
  }, []);

  return <div ref={mountRef} className="h-full w-full" />;
}
