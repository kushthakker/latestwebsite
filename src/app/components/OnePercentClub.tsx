"use client";

import { useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";

// ─── Design Tokens ──────────────────────────────────────────────────────
const DARK_BG = "#030303"; // Deep premium black
const NODE_COLOR = new THREE.Color("#ffffff");
const CENTER_NODE_COLOR = new THREE.Color("#E8DCCC"); // Soft champagne
const CONNECTION_COLOR = new THREE.Color("#ffffff");

// ─── Node data for hover labels ─────────────────────────────────────────
const NODE_LABELS = [
  "Kavya Iyer, Sequoia",
  "Arjun Mehta, NexaFlow",
  "Priya Venkatesh, Notion",
  "Marcus Chen, Ramp",
  "Sarah Kim, Stripe",
  "David Park, Carta",
  "James Liu, a16z",
  "Ananya Rao, Google",
  "Rajan Anand, Tiger Global",
  "Nina Patel, Sequoia",
  "Meera Shah, Figma",
  "Rohan Gupta, Lightspeed",
  "Aisha Patel, Index",
  "Daniel Wong, Databricks",
  "Sophie Chen, Plaid",
  "Vikram Sharma, Flipkart",
  "Emily Torres, Benchmark",
  "Raj Patel, Notion",
  "Lauren Kim, Stripe",
  "Omar Hassan, Scale AI",
];

// ─── Constellation Geometry ─────────────────────────────────────────────
interface NodeData {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  noiseOffsetX: number;
  noiseOffsetY: number;
  phase: number;
  label: string;
  isCenter: boolean;
}

interface EdgeData {
  from: number;
  to: number;
  dist: number;
}

function generateConstellation(count: number): {
  nodes: NodeData[];
  edges: EdgeData[];
} {
  const nodes: NodeData[] = [];
  const edges: EdgeData[] = [];

  // Center node (YOU)
  nodes.push({
    x: 0,
    y: 0,
    z: 0,
    baseX: 0,
    baseY: 0,
    baseZ: 0,
    noiseOffsetX: Math.random() * 1000,
    noiseOffsetY: Math.random() * 1000,
    phase: Math.random() * Math.PI * 2,
    label: "You",
    isCenter: true,
  });

  // Generate surrounding nodes in clusters
  const clusterCount = 6;
  const nodesPerCluster = Math.floor((count - 1) / clusterCount);

  for (let c = 0; c < clusterCount; c++) {
    const clusterAngle = (c / clusterCount) * Math.PI * 2 + Math.random() * 0.3;
    const clusterDist = 2.5 + Math.random() * 2.0;
    const cx = Math.cos(clusterAngle) * clusterDist;
    const cy = Math.sin(clusterAngle) * clusterDist;

    for (let i = 0; i < nodesPerCluster; i++) {
      const idx = nodes.length;
      const angle = Math.random() * Math.PI * 2;
      const dist = 0.2 + Math.random() * 1.5;
      const x = cx + Math.cos(angle) * dist;
      const y = cy + Math.sin(angle) * dist;
      const z = (Math.random() - 0.5) * 2.0;

      nodes.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        noiseOffsetX: Math.random() * 1000,
        noiseOffsetY: Math.random() * 1000,
        phase: Math.random() * Math.PI * 2,
        label: NODE_LABELS[idx % NODE_LABELS.length],
        isCenter: false,
      });

      // Connect to center with some probability
      if (Math.random() < 0.12) {
        edges.push({ from: 0, to: idx, dist: 0 });
      }

      // Connect within cluster
      if (i > 0 && Math.random() < 0.35) {
        const prev = idx - Math.floor(Math.random() * Math.min(i, 3)) - 1;
        if (prev >= 1) edges.push({ from: prev, to: idx, dist: 0 });
      }
    }
  }

  // Add cross-cluster connections for organic feel
  for (let i = 0; i < count * 0.15; i++) {
    const a = 1 + Math.floor(Math.random() * (nodes.length - 1));
    const b = 1 + Math.floor(Math.random() * (nodes.length - 1));
    if (a !== b) {
      const dx = nodes[a].x - nodes[b].x;
      const dy = nodes[a].y - nodes[b].y;
      if (Math.sqrt(dx * dx + dy * dy) < 3.5) {
        edges.push({ from: a, to: b, dist: 0 });
      }
    }
  }

  // Compute edge distances for proximity-based reveal
  for (const edge of edges) {
    const a = nodes[edge.from];
    const b = nodes[edge.to];
    edge.dist = Math.sqrt(
      (a.baseX - b.baseX) ** 2 + (a.baseY - b.baseY) ** 2,
    );
  }

  // Sort: center connections first, then by proximity (short edges before long)
  edges.sort((a, b) => {
    const aCenter = a.from === 0 || a.to === 0 ? 0 : 1;
    const bCenter = b.from === 0 || b.to === 0 ? 0 : 1;
    if (aCenter !== bCenter) return aCenter - bCenter;
    return a.dist - b.dist;
  });

  return { nodes, edges };
}

// ─── Simplex-like noise (cheap approximation) ──────────────────────────
function pseudoNoise(x: number, y: number): number {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return (n - Math.floor(n)) * 2 - 1;
}

// ═══════════════════════════════════════════════════════════════════════════
// THREE.JS CONSTELLATION
// ═══════════════════════════════════════════════════════════════════════════

function useConstellation(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  scrollRef: React.RefObject<number>,
  tooltipRef: React.RefObject<HTMLDivElement | null>,
  isNarrow: boolean,
) {
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    nodesMesh: THREE.Points;
    linesMesh: THREE.LineSegments;
    nodes: NodeData[];
    edges: EdgeData[];
    mouse: { x: number; y: number };
    mousePx: { x: number; y: number };
    animFrame: number;
    time: number;
  } | null>(null);

  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || sceneRef.current) return;

    const hoverEnabled =
      !isNarrow && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const pixelRatioCap = isNarrow ? 1.5 : 2;
    const NODE_COUNT = isNarrow ? 72 : window.innerWidth < 768 ? 100 : 200;
    const { nodes, edges } = generateConstellation(NODE_COUNT);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setClearColor(0x000000, 0);

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const aspect = canvas.clientWidth / canvas.clientHeight;
    const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
    camera.position.z = 12;

    // Premium Node Sprite (Soft glow)
    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = 128;
    spriteCanvas.height = 128;
    const ctx = spriteCanvas.getContext("2d")!;
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.2, "rgba(255,255,255,0.8)");
    gradient.addColorStop(0.5, "rgba(255,255,255,0.2)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    const spriteTexture = new THREE.CanvasTexture(spriteCanvas);

    // Points geometry
    const positions = new Float32Array(nodes.length * 3);
    const colors = new Float32Array(nodes.length * 3);
    const sizes = new Float32Array(nodes.length);

    for (let i = 0; i < nodes.length; i++) {
      const scatterAngle = Math.random() * Math.PI * 2;
      const scatterDist = 20 + Math.random() * 15;
      positions[i * 3] = Math.cos(scatterAngle) * scatterDist;
      positions[i * 3 + 1] = Math.sin(scatterAngle) * scatterDist;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 8;

      const color = nodes[i].isCenter ? CENTER_NODE_COLOR : NODE_COLOR;
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = nodes[i].isCenter ? 0.45 : 0.15 + Math.random() * 0.1;
    }

    const pointsGeom = new THREE.BufferGeometry();
    pointsGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3),
    );
    pointsGeom.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    pointsGeom.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    const pointsMat = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: spriteTexture },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, pixelRatioCap) },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float uPixelRatio;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * uPixelRatio * (350.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform sampler2D uTexture;
        varying vec3 vColor;
        void main() {
          vec4 tex = texture2D(uTexture, gl_PointCoord);
          gl_FragColor = vec4(vColor * tex.rgb, tex.a);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const nodesMesh = new THREE.Points(pointsGeom, pointsMat);
    scene.add(nodesMesh);

    // Lines geometry
    const linePositions = new Float32Array(edges.length * 6);
    const lineColors = new Float32Array(edges.length * 6);

    const lineGeom = new THREE.BufferGeometry();
    lineGeom.setAttribute(
      "position",
      new THREE.BufferAttribute(linePositions, 3),
    );
    lineGeom.setAttribute("color", new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      linewidth: 1,
    });

    const linesMesh = new THREE.LineSegments(lineGeom, lineMat);
    scene.add(linesMesh);

    sceneRef.current = {
      renderer,
      scene,
      camera,
      nodesMesh,
      linesMesh,
      nodes,
      edges,
      mouse: { x: 0, y: 0 },
      mousePx: { x: -1000, y: -1000 },
      animFrame: 0,
      time: 0,
    };

    // Mouse tracking
    const onMouseMove = (e: MouseEvent) => {
      if (!sceneRef.current) return;
      sceneRef.current.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      sceneRef.current.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      sceneRef.current.mousePx.x = e.clientX;
      sceneRef.current.mousePx.y = e.clientY;
    };
    if (hoverEnabled) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }

    // Resize
    const onResize = () => {
      if (!sceneRef.current) return;
      const { renderer: r, camera: c } = sceneRef.current;
      const w = window.innerWidth;
      const h = window.innerHeight;
      r.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatioCap));
      r.setSize(w, h);
      c.aspect = w / h;
      c.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize, { passive: true });

    const vector = new THREE.Vector3();

    // Animation loop
    const animate = () => {
      if (!sceneRef.current) return;
      sceneRef.current.animFrame = requestAnimationFrame(animate);

      const s = sceneRef.current;
      s.time += 0.006;
      const progress = scrollRef.current;

      const gatherProgress = Math.min(1, Math.max(0, (progress - 0.05) / 0.45));
      const edgeCount = s.edges.length;
      const centerGlow = Math.min(1, Math.max(0, (progress - 0.45) / 0.2));
      const interactivity = Math.min(1, Math.max(0, (progress - 0.6) / 0.15));

      const posAttr = s.nodesMesh.geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      const colAttr = s.nodesMesh.geometry.getAttribute(
        "color",
      ) as THREE.BufferAttribute;
      const sizeAttr = s.nodesMesh.geometry.getAttribute(
        "size",
      ) as THREE.BufferAttribute;

      // Smooth easing (Cubic)
      const g =
        gatherProgress < 0.5
          ? 4 * gatherProgress * gatherProgress * gatherProgress
          : 1 - Math.pow(-2 * gatherProgress + 2, 3) / 2;

      let closestNode: { node: NodeData; px: number; py: number } | null = null;
      let minDist = 70; // Hover trigger distance in pixels

      for (let i = 0; i < s.nodes.length; i++) {
        const node = s.nodes[i];

        // Drift noise
        const nx = pseudoNoise(node.noiseOffsetX + s.time * 0.2, 0) * 0.08;
        const ny = pseudoNoise(0, node.noiseOffsetY + s.time * 0.2) * 0.08;

        const tx = node.baseX + nx;
        const ty = node.baseY + ny;
        const tz = node.baseZ;

        const sx = posAttr.getX(i);
        const sy = posAttr.getY(i);
        const sz = posAttr.getZ(i);

        // Lerp from scatter to target
        const easeSpeed = 0.02 + g * 0.06;
        posAttr.setXYZ(
          i,
          sx + (tx - sx) * easeSpeed,
          sy + (ty - sy) * easeSpeed,
          sz + (tz - sz) * easeSpeed,
        );

        node.x = posAttr.getX(i);
        node.y = posAttr.getY(i);
        node.z = posAttr.getZ(i);

        const breathe = 1 + Math.sin(s.time * 2.0 + node.phase) * 0.08;

        // Tooltip logic and hover state
        let isHovered = false;
        if (hoverEnabled && interactivity > 0.5) {
          vector.set(node.x, node.y, node.z);
          vector.project(s.camera);
          const px = (vector.x * 0.5 + 0.5) * window.innerWidth;
          const py = -(vector.y * 0.5 - 0.5) * window.innerHeight;

          const dist = Math.hypot(px - s.mousePx.x, py - s.mousePx.y);
          if (dist < minDist) {
            minDist = dist;
            closestNode = { node, px, py };
            isHovered = true;
          }
        }

        // Color & Sizing
        if (node.isCenter) {
          const glow = 0.8 + centerGlow * 0.3 + (isHovered ? 0.4 : 0);
          colAttr.setXYZ(
            i,
            CENTER_NODE_COLOR.r * glow,
            CENTER_NODE_COLOR.g * glow,
            CENTER_NODE_COLOR.b * glow,
          );
          sizeAttr.setX(
            i,
            (0.45 + centerGlow * 0.2) * breathe * (isHovered ? 1.2 : 1),
          );
        } else {
          const baseAlpha = 0.4 + gatherProgress * 0.4;
          const glow = baseAlpha + (isHovered ? 1.0 : 0);
          colAttr.setXYZ(
            i,
            NODE_COLOR.r * glow,
            NODE_COLOR.g * glow,
            NODE_COLOR.b * glow,
          );
          sizeAttr.setX(
            i,
            (0.15 + Math.random() * 0.02) * breathe * (isHovered ? 2.5 : 1),
          );
        }
      }

      // Update Tooltip DOM
      if (tooltipRef.current) {
        if (hoverEnabled && closestNode && interactivity > 0.8) {
          tooltipRef.current.style.opacity = "1";
          tooltipRef.current.style.transform = `translate3d(${closestNode.px + 20}px, ${closestNode.py - 20}px, 0)`;
          if (tooltipRef.current.innerText !== closestNode.node.label) {
            tooltipRef.current.innerText = closestNode.node.label;
          }
        } else {
          tooltipRef.current.style.opacity = "0";
        }
      }

      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
      sizeAttr.needsUpdate = true;

      // Update lines
      const linePos = s.linesMesh.geometry.getAttribute(
        "position",
      ) as THREE.BufferAttribute;
      const lineCol = s.linesMesh.geometry.getAttribute(
        "color",
      ) as THREE.BufferAttribute;

      for (let i = 0; i < s.edges.length; i++) {
        const edge = s.edges[i];
        const fromNode = s.nodes[edge.from];
        const toNode = s.nodes[edge.to];

        // Progressive reveal — sorted so center/short edges appear first
        const edgeRatio = i / edgeCount;
        const edgeStart = 0.06 + edgeRatio * 0.58;
        const edgeAlpha = Math.min(1, Math.max(0, (progress - edgeStart) / 0.12));

        // Line-draw effect: connection grows from "from" toward "to"
        const drawT = Math.min(1, edgeAlpha * 2.5);
        const eased = drawT * drawT * (3 - 2 * drawT); // smoothstep
        const endX = fromNode.x + (toNode.x - fromNode.x) * eased;
        const endY = fromNode.y + (toNode.y - fromNode.y) * eased;
        const endZ = fromNode.z + (toNode.z - fromNode.z) * eased;

        linePos.setXYZ(i * 2, fromNode.x, fromNode.y, fromNode.z);
        linePos.setXYZ(i * 2 + 1, endX, endY, endZ);

        // Distance-based brightness — closer connections glow brighter
        const distFade = Math.max(0.25, 1 - edge.dist / 7);

        // Hover highlight
        let edgeBrightness = 0.15 * distFade;
        if (
          closestNode &&
          (edge.from === s.nodes.indexOf(closestNode.node) ||
            edge.to === s.nodes.indexOf(closestNode.node))
        ) {
          edgeBrightness = 0.8;
        }

        // Brief pulse when connection first forms
        const pulse = edgeAlpha < 0.4 ? 1 + (1 - edgeAlpha / 0.4) * 0.6 : 1;

        const sparkle = Math.sin(s.time * 3 + i * 11.3) > 0.98 ? 0.4 : 0;
        const b = (edgeBrightness + sparkle) * edgeAlpha * pulse;

        lineCol.setXYZ(
          i * 2,
          CONNECTION_COLOR.r * b,
          CONNECTION_COLOR.g * b,
          CONNECTION_COLOR.b * b,
        );
        lineCol.setXYZ(
          i * 2 + 1,
          CONNECTION_COLOR.r * b * 0.3,
          CONNECTION_COLOR.g * b * 0.3,
          CONNECTION_COLOR.b * b * 0.3,
        );
      }

      linePos.needsUpdate = true;
      lineCol.needsUpdate = true;
      (s.linesMesh.material as THREE.LineBasicMaterial).opacity = 1; // Alpha handled via vertex colors

      // Cinematic slow parallax
      const targetX = hoverEnabled ? s.mouse.x * 0.5 : 0;
      const targetY = hoverEnabled ? s.mouse.y * 0.5 : 0;
      s.camera.position.x += (targetX - s.camera.position.x) * 0.03;
      s.camera.position.y += (targetY - s.camera.position.y) * 0.03;
      s.camera.lookAt(0, 0, 0);

      s.renderer.render(s.scene, s.camera);
    };

    animate();

    return () => {
      if (hoverEnabled) {
        window.removeEventListener("mousemove", onMouseMove);
      }
      window.removeEventListener("resize", onResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animFrame);
        sceneRef.current.renderer.dispose();
        sceneRef.current = null;
      }
    };
  }, [canvasRef, isNarrow, scrollRef, tooltipRef]);

  return { init, sceneRef };
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function OnePercentClub({ isNarrow = false }: { isNarrow?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end end"],
  });

  const scrollRef = useRef(0);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      scrollRef.current = v;
    });
    return unsub;
  }, [scrollYProgress]);

  const { init } = useConstellation(canvasRef, scrollRef, tooltipRef, isNarrow);

  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, [init]);

  // ─── Animations & Transitions ──────────────────────────────────────────
  const bgOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);

  // Cinematic blur & opacity curves
  const phase1Op = useTransform(
    scrollYProgress,
    [0.05, 0.12, 0.30, 0.36],
    [0, 1, 1, 0],
  );
  const phase1Blur = useTransform(
    scrollYProgress,
    [0.05, 0.12, 0.30, 0.36],
    ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"],
  );
  const phase1Y = useTransform(
    scrollYProgress,
    [0.05, 0.12, 0.30, 0.36],
    [40, 0, 0, -40],
  );

  const phase2Op = useTransform(
    scrollYProgress,
    [0.36, 0.42, 0.52, 0.58],
    [0, 1, 1, 0],
  );
  const phase2Blur = useTransform(
    scrollYProgress,
    [0.36, 0.42, 0.52, 0.58],
    ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"],
  );
  const phase2Y = useTransform(
    scrollYProgress,
    [0.36, 0.42, 0.52, 0.58],
    [40, 0, 0, -40],
  );

  const phase3Op = useTransform(
    scrollYProgress,
    [0.58, 0.64, 0.74, 0.80],
    [0, 1, 1, 0],
  );
  const phase3Blur = useTransform(
    scrollYProgress,
    [0.58, 0.64, 0.74, 0.80],
    ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"],
  );
  const phase3Y = useTransform(
    scrollYProgress,
    [0.58, 0.64, 0.74, 0.80],
    [40, 0, 0, -40],
  );

  const phase4Op = useTransform(scrollYProgress, [0.80, 0.88], [0, 1]);
  const phase4Blur = useTransform(
    scrollYProgress,
    [0.80, 0.88],
    ["blur(12px)", "blur(0px)"],
  );
  const phase4Y = useTransform(scrollYProgress, [0.80, 0.88], [40, 0]);

  const ctaOp = useTransform(scrollYProgress, [0.88, 0.95], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.88, 0.95], [20, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative font-sans"
      style={{ height: isNarrow ? "260svh" : "500vh" }}
    >
      {/* Background Transition */}
      <motion.div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background: DARK_BG,
          opacity: bgOpacity,
        }}
      />

      {/* Sticky Viewport Container */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: isNarrow ? "100svh" : "100vh", zIndex: 1 }}
      >
        {/* WebGL Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ zIndex: 0 }}
        />

        {/* Global Floating Tooltip for WebGL Nodes */}
        <div
          ref={tooltipRef}
          className="pointer-events-none absolute left-0 top-0 z-50 rounded-lg border border-white/10 bg-black/50 px-3 py-1.5 font-mono text-xs text-white/90 backdrop-blur-md transition-opacity duration-200"
          style={{ opacity: 0, willChange: "transform", display: isNarrow ? "none" : "block" }}
        />

        {/* Cinematic Typography Overlays */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 px-6">
          {/* Phase 1 */}
          <motion.h3
            style={{
              opacity: phase1Op,
              y: phase1Y,
              filter: phase1Blur,
            }}
            className="absolute max-w-2xl text-center text-[clamp(1.6rem,3.2vw,2.8rem)] font-semibold tracking-tight text-white/90 leading-snug"
          >
            You don&rsquo;t have to network harder.
          </motion.h3>

          {/* Phase 2 */}
          <motion.h3
            style={{
              opacity: phase2Op,
              y: phase2Y,
              filter: phase2Blur,
            }}
            className="absolute max-w-2xl text-center text-[clamp(1.6rem,3.2vw,2.8rem)] font-semibold tracking-tight text-white/90 leading-snug"
          >
            You don&rsquo;t have to send more cold emails.
          </motion.h3>

          {/* Phase 3 */}
          <motion.h3
            style={{
              opacity: phase3Op,
              y: phase3Y,
              filter: phase3Blur,
            }}
            className="absolute max-w-3xl text-center text-[clamp(1.6rem,3.2vw,2.8rem)] font-semibold tracking-tight text-white/80 leading-snug"
          >
            Just focus on the work.{" "}
            <br className="hidden sm:block" />
            <span className="text-white/40">
              Brace keeps the people.
            </span>
          </motion.h3>

        </div>

        {/* Phase 4: The Reveal — bottom-anchored so constellation breathes */}
        <motion.div
          style={{ opacity: phase4Op, filter: phase4Blur }}
          className="absolute inset-0 z-10 pointer-events-none"
        >
          {/* Gradient stage — solid at bottom, fades to transparent */}
          <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-[#030303] from-15% via-[#030303]/50 via-55% to-transparent" />

          <div
            className="absolute inset-x-0 bottom-0 flex flex-col items-center px-6 text-center"
            style={{
              paddingBottom: isNarrow
                ? "max(5rem, calc(env(safe-area-inset-bottom) + 4rem))"
                : "8vh",
            }}
          >
            <motion.div style={{ y: phase4Y }}>
              <h2 className="text-[clamp(2.8rem,5.5vw,5rem)] font-bold tracking-tighter text-white leading-none">
                Nothing Goes Unnoticed.
              </h2>
              <p className="mt-5 text-[clamp(1rem,1.3vw,1.25rem)] tracking-normal text-white/50 font-medium">
                Brace — the intelligence layer for human relationships.
              </p>
            </motion.div>

            {/* Premium CTA */}
            <motion.div
              style={{ opacity: ctaOp, y: ctaY }}
              className={`pointer-events-auto ${isNarrow ? "mt-8" : "mt-10"}`}
            >
              <a
                href="#"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-8 py-4 text-[15px] font-semibold text-black transition-all duration-300 backdrop-blur-2xl bg-white/75 border border-white/80 shadow-[0_2px_16px_rgba(255,255,255,0.12),0_8px_32px_rgba(255,255,255,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] hover:scale-105 hover:bg-white/85 hover:shadow-[0_2px_24px_rgba(255,255,255,0.18),0_12px_48px_rgba(255,255,255,0.10),inset_0_1px_0_rgba(255,255,255,1)]"
              >
                <span>Get Early Access</span>
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
