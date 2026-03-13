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
        edges.push({ from: 0, to: idx });
      }

      // Connect within cluster
      if (i > 0 && Math.random() < 0.35) {
        const prev = idx - Math.floor(Math.random() * Math.min(i, 3)) - 1;
        if (prev >= 1) edges.push({ from: prev, to: idx });
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
        edges.push({ from: a, to: b });
      }
    }
  }

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

    const NODE_COUNT = window.innerWidth < 768 ? 100 : 200;
    const { nodes, edges } = generateConstellation(NODE_COUNT);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
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
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Resize
    const onResize = () => {
      if (!sceneRef.current) return;
      const { renderer: r, camera: c } = sceneRef.current;
      const w = window.innerWidth;
      const h = window.innerHeight;
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
      const connectionAlpha = Math.min(
        1,
        Math.max(0, (progress - 0.25) / 0.25),
      );
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
        if (interactivity > 0.5) {
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
        if (closestNode && interactivity > 0.8) {
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

        linePos.setXYZ(i * 2, fromNode.x, fromNode.y, fromNode.z);
        linePos.setXYZ(i * 2 + 1, toNode.x, toNode.y, toNode.z);

        // Determine if line connects to a hovered node
        let edgeBrightness = 0.15; // default subtle line
        if (
          closestNode &&
          (edge.from === s.nodes.indexOf(closestNode.node) ||
            edge.to === s.nodes.indexOf(closestNode.node))
        ) {
          edgeBrightness = 0.8;
        }

        const sparkle = Math.sin(s.time * 3 + i * 11.3) > 0.98 ? 0.4 : 0;
        const b = (edgeBrightness + sparkle) * connectionAlpha;

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
      const targetX = s.mouse.x * 0.5;
      const targetY = s.mouse.y * 0.5;
      s.camera.position.x += (targetX - s.camera.position.x) * 0.03;
      s.camera.position.y += (targetY - s.camera.position.y) * 0.03;
      s.camera.lookAt(0, 0, 0);

      s.renderer.render(s.scene, s.camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      if (sceneRef.current) {
        cancelAnimationFrame(sceneRef.current.animFrame);
        sceneRef.current.renderer.dispose();
        sceneRef.current = null;
      }
    };
  }, [canvasRef, scrollRef, tooltipRef]);

  return { init, sceneRef };
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function OnePercentClub() {
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

  const { init } = useConstellation(canvasRef, scrollRef, tooltipRef);

  useEffect(() => {
    const cleanup = init();
    return cleanup;
  }, [init]);

  // ─── Animations & Transitions ──────────────────────────────────────────
  const bgOpacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);

  // Cinematic blur & opacity curves
  const phase1Op = useTransform(
    scrollYProgress,
    [0.06, 0.12, 0.22, 0.28],
    [0, 1, 1, 0],
  );
  const phase1Blur = useTransform(
    scrollYProgress,
    [0.06, 0.12, 0.22, 0.28],
    ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"],
  );
  const phase1Y = useTransform(
    scrollYProgress,
    [0.06, 0.12, 0.22, 0.28],
    [40, 0, 0, -40],
  );

  const phase2Op = useTransform(
    scrollYProgress,
    [0.28, 0.34, 0.44, 0.5],
    [0, 1, 1, 0],
  );
  const phase2Blur = useTransform(
    scrollYProgress,
    [0.28, 0.34, 0.44, 0.5],
    ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"],
  );
  const phase2Y = useTransform(
    scrollYProgress,
    [0.28, 0.34, 0.44, 0.5],
    [40, 0, 0, -40],
  );

  const phase3Op = useTransform(
    scrollYProgress,
    [0.5, 0.56, 0.66, 0.72],
    [0, 1, 1, 0],
  );
  const phase3Blur = useTransform(
    scrollYProgress,
    [0.5, 0.56, 0.66, 0.72],
    ["blur(12px)", "blur(0px)", "blur(0px)", "blur(12px)"],
  );
  const phase3Y = useTransform(
    scrollYProgress,
    [0.5, 0.56, 0.66, 0.72],
    [40, 0, 0, -40],
  );

  const phase4Op = useTransform(scrollYProgress, [0.72, 0.8], [0, 1]);
  const phase4Blur = useTransform(
    scrollYProgress,
    [0.72, 0.8],
    ["blur(12px)", "blur(0px)"],
  );
  const phase4Y = useTransform(scrollYProgress, [0.72, 0.8], [40, 0]);

  const ctaOp = useTransform(scrollYProgress, [0.82, 0.9], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.82, 0.9], [20, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative font-sans"
      style={{ height: "400vh" }}
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
        className="sticky top-0 h-screen w-full overflow-hidden"
        style={{ zIndex: 1 }}
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
          style={{ opacity: 0, willChange: "transform" }}
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
            className="absolute max-w-2xl text-center text-[clamp(1.5rem,3vw,2.5rem)] font-medium tracking-tight text-white/90 leading-snug"
          >
            The top 1% of professionals don&rsquo;t network harder.
          </motion.h3>

          {/* Phase 2 */}
          <motion.h3
            style={{
              opacity: phase2Op,
              y: phase2Y,
              filter: phase2Blur,
            }}
            className="absolute max-w-2xl text-center text-[clamp(1.5rem,3vw,2.5rem)] font-medium tracking-tight text-white/90 leading-snug"
          >
            They see what others can&rsquo;t.
          </motion.h3>

          {/* Phase 3 */}
          <motion.h3
            style={{
              opacity: phase3Op,
              y: phase3Y,
              filter: phase3Blur,
            }}
            className="absolute max-w-3xl text-center text-[clamp(1.5rem,3vw,2.5rem)] font-medium tracking-tight text-white/80 leading-snug"
          >
            They show up at the right time. <br className="hidden sm:block" />
            <span className="text-white/50">
              With the right words. Through the right path.
            </span>
          </motion.h3>

          {/* Phase 4: The Reveal */}
          <motion.div
            style={{
              opacity: phase4Op,
              y: phase4Y,
              filter: phase4Blur,
            }}
            className="absolute flex flex-col items-center text-center"
          >
            <h2 className="text-[clamp(3rem,6vw,5rem)] font-semibold tracking-tighter text-white leading-none">
              Welcome to the 1%.
            </h2>
            <p className="mt-6 text-lg tracking-wide text-white/50 font-medium">
              Brace — The intelligence layer for human relationships.
            </p>

            {/* Premium CTA */}
            <motion.div
              style={{ opacity: ctaOp, y: ctaY }}
              className="pointer-events-auto mt-12"
            >
              <a
                href="#"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-8 py-4 text-[15px] font-semibold text-black transition-all duration-300 hover:scale-105 hover:bg-white/90 hover:shadow-[0_0_40px_rgba(255,255,255,0.2)]"
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
          </motion.div>
        </div>
      </div>
    </section>
  );
}
