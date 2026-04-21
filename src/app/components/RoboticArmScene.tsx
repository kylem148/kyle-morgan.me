"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Pose = {
  sY: number; uX: number; eX: number; wX: number; wZ: number; grip: number;
};

const POSES: Pose[] = [
  { sY: -0.5, uX: -0.6, eX: 1.2,  wX:  0.3, wZ:  0.0, grip: 0.4 },
  { sY:  0.2, uX: -0.2, eX: 1.4,  wX: -0.4, wZ:  0.1, grip: 0.2 },
  { sY: -0.8, uX: -0.8, eX: 1.8,  wX: -0.3, wZ:  0.2, grip: 0.3 },
  { sY:  0.8, uX:  0.1, eX: 0.9,  wX: -0.2, wZ: -0.2, grip: 0.4 },
  { sY: -0.3, uX: -1.0, eX: 2.1,  wX:  0.2, wZ:  0.0, grip: 0.1 },
];

type Props = {
  progressRef: React.MutableRefObject<number>;
  velocityRef: React.MutableRefObject<number>;
};

export default function RoboticArmScene({ progressRef, velocityRef }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let width = mount.clientWidth;
    let height = mount.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0xf2efe8, 8, 24);

    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 0, 10);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(width, height);
    renderer.setClearColor(0xf2efe8, 1);
    mount.appendChild(renderer.domElement);

    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(4, 6, 4);
    scene.add(key);
    scene.add(new THREE.AmbientLight(0xcfd4df, 0.55));
    const rim = new THREE.DirectionalLight(0xff9a6b, 0.5);
    rim.position.set(-5, 2, -3);
    scene.add(rim);

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(3, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.08 }),
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = -3.6;
    scene.add(shadow);

    const matMetal = new THREE.MeshStandardMaterial({ color: 0xc7bfae, metalness: 0.85, roughness: 0.3 });
    const matAccent = new THREE.MeshStandardMaterial({ color: 0xd46a3a, metalness: 0.4, roughness: 0.5 });
    const matJoint = new THREE.MeshStandardMaterial({ color: 0x2a2622, metalness: 0.6, roughness: 0.4 });

    const root = new THREE.Group();
    root.position.y = -2.4;
    scene.add(root);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.05, 0.25, 32), matMetal);
    root.add(base);
    const baseRing = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.04, 12, 48), matAccent);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = 0.13;
    root.add(baseRing);

    const shoulder = new THREE.Group();
    shoulder.position.y = 0.22;
    root.add(shoulder);
    shoulder.add(new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.45, 0.35, 24), matJoint));

    const upperPivot = new THREE.Group();
    upperPivot.position.y = 0.22;
    shoulder.add(upperPivot);

    const upper = new THREE.Mesh(new THREE.BoxGeometry(0.3, 1.6, 0.3), matMetal);
    upper.position.y = 0.8;
    upperPivot.add(upper);
    const upperStripe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.3, 0.32), matAccent);
    upperStripe.position.set(0.12, 0.8, 0);
    upperPivot.add(upperStripe);

    const elbowPivot = new THREE.Group();
    elbowPivot.position.y = 1.6;
    upperPivot.add(elbowPivot);
    elbowPivot.add(new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), matJoint));
    const elbowRing = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.04, 8, 32), matAccent);
    elbowRing.rotation.y = Math.PI / 2;
    elbowPivot.add(elbowRing);

    const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.26, 1.4, 0.26), matMetal);
    forearm.position.y = 0.7;
    elbowPivot.add(forearm);

    const wristPivot = new THREE.Group();
    wristPivot.position.y = 1.4;
    elbowPivot.add(wristPivot);
    wristPivot.add(new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.25, 20), matJoint));

    const gripperRoot = new THREE.Group();
    gripperRoot.position.y = 0.2;
    wristPivot.add(gripperRoot);
    gripperRoot.add(new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.12, 0.18), matMetal));
    const fingerL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.35, 0.12), matMetal);
    fingerL.position.set(-0.12, 0.22, 0);
    gripperRoot.add(fingerL);
    const fingerR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.35, 0.12), matMetal);
    fingerR.position.set(0.12, 0.22, 0);
    gripperRoot.add(fingerR);

    const ledMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.04, 12, 12), ledMat);
    led.position.set(0.7, 0.18, 0);
    root.add(led);

    const cur: Pose = { ...POSES[0] };

    let raf = 0;
    const t0 = performance.now();

    const render = () => {
      const t = (performance.now() - t0) / 1000;
      const p = Math.max(0, Math.min(1, progressRef.current));
      const v = velocityRef.current;

      camera.position.x = Math.sin(p * Math.PI * 0.5) * 1.5;
      camera.position.y = 0.5 + p * 0.8;
      camera.position.z = 8.5 - p * 1.8;
      camera.lookAt(0, -0.3 + p * 0.4, 0);

      const idxF = p * (POSES.length - 1);
      const i0 = Math.floor(idxF);
      const i1 = Math.min(POSES.length - 1, i0 + 1);
      const k = idxF - i0;
      const a = POSES[i0];
      const b = POSES[i1];
      const lerp = (x: number, y: number) => x * (1 - k) + y * k;

      const targetSY = lerp(a.sY, b.sY);
      const targetUX = lerp(a.uX, b.uX);
      const targetEX = lerp(a.eX, b.eX);
      const targetWX = lerp(a.wX, b.wX);
      const targetWZ = lerp(a.wZ, b.wZ);
      const targetGrip = lerp(a.grip, b.grip);

      const sway = Math.sin(t * 0.6) * 0.03;
      const swayB = Math.sin(t * 0.45 + 1.2) * 0.025;

      const ease = 0.06;
      cur.sY += (targetSY + sway - cur.sY) * ease;
      cur.uX += (targetUX + swayB - cur.uX) * ease;
      cur.eX += (targetEX - cur.eX) * ease;
      cur.wX += (targetWX - cur.wX) * ease;
      cur.wZ += (targetWZ - cur.wZ) * ease;
      cur.grip += (targetGrip - cur.grip) * ease;

      shoulder.rotation.y = cur.sY;
      upperPivot.rotation.x = cur.uX;
      elbowPivot.rotation.x = cur.eX;
      wristPivot.rotation.x = cur.wX;
      wristPivot.rotation.z = cur.wZ;

      fingerL.position.x = -0.06 - cur.grip * 0.06;
      fingerR.position.x = 0.06 + cur.grip * 0.06;

      const vMag = Math.min(1, Math.abs(v) * 0.002);
      ledMat.color.setRGB(0.1 + vMag * 0.8, 0.8 - vMag * 0.3, 0.2);

      root.rotation.y = Math.sin(p * Math.PI) * 0.25;

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
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
        const mat = (obj as THREE.Mesh).material;
        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
        else if (mat) (mat as THREE.Material).dispose();
      });
    };
  }, [progressRef, velocityRef]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
