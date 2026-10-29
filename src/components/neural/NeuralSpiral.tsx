import { useRef, useMemo, useEffect, useState } from 'react';
import * as THREE from 'three';

interface NeuralSpiralProps {
  accentColor: 'blue' | 'violet' | 'cyan';
  paused?: boolean;
  reduced?: boolean;
}

const ACCENT_COLORS = {
  blue: { primary: 0x3b82f6, secondary: 0x06b6d4, glow: '#3b82f6' },
  violet: { primary: 0x8b5cf6, secondary: 0x3b82f6, glow: '#8b5cf6' },
  cyan: { primary: 0x06b6d4, secondary: 0x8b5cf6, glow: '#06b6d4' },
};

function buildSpiralNodes(count: number, turns: number, radius: number, height: number) {
  const nodes: THREE.Vector3[] = [];
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const angle = t * turns * Math.PI * 2;
    const r = radius * (0.3 + t * 0.7);
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const y = t * height - height / 2;
    nodes.push(new THREE.Vector3(x, y, z));
  }
  return nodes;
}

function buildConnections(nodes: THREE.Vector3[], maxDist: number, maxConn: number) {
  const connections: [number, number][] = [];
  for (let i = 0; i < nodes.length; i++) {
    let count = 0;
    for (let j = i + 1; j < nodes.length && count < maxConn; j++) {
      if (nodes[i].distanceTo(nodes[j]) < maxDist) {
        connections.push([i, j]);
        count++;
      }
    }
  }
  return connections;
}

export default function NeuralSpiral({ accentColor, paused = false, reduced = false }: NeuralSpiralProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: 0, y: 0 });
  const sceneDataRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    particles: THREE.Points;
    linesMesh: THREE.LineSegments;
    nodeMeshes: THREE.InstancedMesh;
    pulses: { progress: number; conn: [number, number]; speed: number }[];
    pulseMesh: THREE.InstancedMesh;
    nodes: THREE.Vector3[];
    connections: [number, number][];
    time: number;
  } | null>(null);

  const colors = ACCENT_COLORS[accentColor];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 6);

    // Nodes
    const NODE_COUNT = reduced ? 40 : 70;
    const nodes = buildSpiralNodes(NODE_COUNT, 3, 2.2, 4.5);
    const connections = buildConnections(nodes, reduced ? 1.0 : 1.4, 4);

    // Node instanced mesh
    const nodeGeo = new THREE.SphereGeometry(0.045, 8, 8);
    const nodeMat = new THREE.MeshBasicMaterial({ color: colors.primary });
    const nodeMeshes = new THREE.InstancedMesh(nodeGeo, nodeMat, nodes.length);
    const dummy = new THREE.Object3D();
    nodes.forEach((pos, i) => {
      dummy.position.copy(pos);
      dummy.updateMatrix();
      nodeMeshes.setMatrixAt(i, dummy.matrix);
    });
    nodeMeshes.instanceMatrix.needsUpdate = true;
    scene.add(nodeMeshes);

    // Lines
    const linePositions: number[] = [];
    for (const [a, b] of connections) {
      linePositions.push(nodes[a].x, nodes[a].y, nodes[a].z);
      linePositions.push(nodes[b].x, nodes[b].y, nodes[b].z);
    }
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({ color: colors.secondary, transparent: true, opacity: 0.18 });
    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(linesMesh);

    // Pulse dots
    const MAX_PULSES = reduced ? 8 : 18;
    const pulseGeo = new THREE.SphereGeometry(0.055, 6, 6);
    const pulseMat = new THREE.MeshBasicMaterial({ color: colors.primary, transparent: true, opacity: 0.9 });
    const pulseMesh = new THREE.InstancedMesh(pulseGeo, pulseMat, MAX_PULSES);
    scene.add(pulseMesh);

    const pulses: { progress: number; conn: [number, number]; speed: number }[] = [];
    for (let i = 0; i < MAX_PULSES; i++) {
      const conn = connections[Math.floor(Math.random() * connections.length)];
      pulses.push({ progress: Math.random(), conn, speed: 0.003 + Math.random() * 0.005 });
    }

    // Background particles
    const particleCount = reduced ? 60 : 150;
    const pPositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      pPositions[i * 3] = (Math.random() - 0.5) * 12;
      pPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPositions, 3));
    const particleMat = new THREE.PointsMaterial({ color: colors.secondary, size: 0.025, transparent: true, opacity: 0.5 });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    sceneDataRef.current = {
      renderer, scene, camera, particles, linesMesh, nodeMeshes, pulses, pulseMesh, nodes, connections, time: 0
    };

    const handleResize = () => {
      if (!canvas.parentElement) return;
      const w = canvas.parentElement.clientWidth;
      const h = canvas.parentElement.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    handleResize();
    const ro = new ResizeObserver(handleResize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        mouseRef.current.x = (e.touches[0].clientX / window.innerWidth - 0.5) * 2;
        mouseRef.current.y = -(e.touches[0].clientY / window.innerHeight - 0.5) * 2;
      }
    };
    window.addEventListener('touchmove', handleTouch, { passive: true });

    function animate() {
      animRef.current = requestAnimationFrame(animate);
      const sd = sceneDataRef.current;
      if (!sd || paused) return;

      sd.time += 0.008;

      // Camera parallax
      const targetX = mouseRef.current.x * 0.6;
      const targetY = mouseRef.current.y * 0.4;
      sd.camera.position.x += (targetX - sd.camera.position.x) * 0.03;
      sd.camera.position.y += (targetY - sd.camera.position.y) * 0.03;
      sd.camera.lookAt(0, 0, 0);

      // Slow rotation
      sd.scene.rotation.y = sd.time * 0.12;
      sd.scene.rotation.x = Math.sin(sd.time * 0.07) * 0.1;

      // Pulse animation
      const dummy2 = new THREE.Object3D();
      sd.pulses.forEach((p, idx) => {
        p.progress += p.speed;
        if (p.progress >= 1) {
          p.progress = 0;
          p.conn = sd.connections[Math.floor(Math.random() * sd.connections.length)];
        }
        const a = sd.nodes[p.conn[0]];
        const b = sd.nodes[p.conn[1]];
        dummy2.position.lerpVectors(a, b, p.progress);
        dummy2.updateMatrix();
        sd.pulseMesh.setMatrixAt(idx, dummy2.matrix);
      });
      sd.pulseMesh.instanceMatrix.needsUpdate = true;

      // Node pulse
      const nodeScale = 1 + Math.sin(sd.time * 1.5) * 0.04;
      dummy2.scale.setScalar(nodeScale);
      nodes.forEach((pos, i) => {
        const s = 1 + Math.sin(sd.time * 1.5 + i * 0.4) * 0.06;
        dummy2.position.copy(pos);
        dummy2.scale.setScalar(s);
        dummy2.updateMatrix();
        sd.nodeMeshes.setMatrixAt(i, dummy2.matrix);
      });
      sd.nodeMeshes.instanceMatrix.needsUpdate = true;

      // Particles drift
      const pPos = sd.particles.geometry.attributes.position;
      for (let i = 0; i < particleCount; i++) {
        pPos.setY(i, pPos.getY(i) + 0.003);
        if (pPos.getY(i) > 5) pPos.setY(i, -5);
      }
      pPos.needsUpdate = true;

      sd.renderer.render(sd.scene, sd.camera);
    }
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouch);
      ro.disconnect();
      renderer.dispose();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accentColor, reduced]);

  // Update pause state without reinitializing
  useEffect(() => {
    // paused state is read inside the animation loop via closure
  }, [paused]);

  return (
    <canvas
      ref={canvasRef}
      className="neural-canvas"
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
