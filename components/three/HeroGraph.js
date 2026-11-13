"use client";

import { useEffect, useRef, useState } from "react";
import { useT } from "@/components/i18n/LanguageProvider";
import useTheme from "@/lib/useTheme";
import { resolveMotion } from "@/lib/motion";
import styles from "./HeroGraph.module.css";

// Escena 3D "grafo vivo" — SOLO tema claro.
// - ~58 nodos (InstancedMesh de esferas), aristas finas (LineSegments),
//   28 paquetes de luz (Points) viajando por las conexiones.
// - 5 piezas procedurales que rotan (Software/Arquitectura/Redes/Electrónica/Formación).
// - Densidad a la derecha; izquierda casi vacía (el velo lavender lo cubre).
// - Parallax de cámara con el puntero (amortiguado); ScrollTrigger con scrub
//   al salir del héroe (giro leve + alejamiento + atenuación). Sin pin.
// - Monta solo si: tema claro, ≥768 px, movimiento permitido, WebGL disponible,
//   sin saveData. En cualquier otro caso: fallback (velo + luces CSS).
// - canvas aria-hidden, pointer-events none. Pausa con IntersectionObserver
//   y con visibilityState. Cap ~45 fps.

const NODE_COUNT = 58;
const PACKET_COUNT = 28;
const SPHERE_RADIUS = 0.055;
const MIN_DIST = 0.45;
const FRAME_MS = 1000 / 45;
const NODE_COLORS = [0x4f46e5, 0x2563eb, 0x7c3aed];

// PRNG determinista (layout estable entre montajes)
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function HeroGraph() {
  const containerRef = useRef(null);
  const { t } = useT();
  const theme = useTheme();
  const [label, setLabel] = useState(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const motion = resolveMotion();
    const saveData =
      typeof navigator !== "undefined" && (navigator.connection?.saveData ?? false);
    const wideEnough = window.innerWidth >= 768;
    if (theme !== "light" || !wideEnough || !motion.allowed || saveData) {
      return undefined;
    }

    let disposed = false;
    let cleanup = null;

    (async () => {
      let THREE;
      try {
        THREE = await import("three");
      } catch {
        return; // three no disponible: fallback (velo + luces)
      }
      if (disposed) return;

      // ¿WebGL disponible?
      let renderer;
      try {
        const probe = document.createElement("canvas");
        const gl =
          probe.getContext("webgl2") ||
          probe.getContext("webgl") ||
          probe.getContext("experimental-webgl");
        if (!gl) return;
        renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: window.devicePixelRatio < 2,
          powerPreference: "low-power",
        });
      } catch {
        return;
      }

      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
      renderer.domElement.className = styles.canvas;
      renderer.domElement.setAttribute("aria-hidden", "true");
      renderer.domElement.setAttribute("focusable", "false");

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
      camera.position.set(0, 0.05, 8.4);
      camera.lookAt(1.1, 0.05, 0);

      // Luces suaves
      scene.add(new THREE.HemisphereLight(0xffffff, 0xe9e4ff, 1.05));
      const key = new THREE.DirectionalLight(0xffffff, 1.35);
      key.position.set(5, 7, 6);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xdfe4ff, 0.55);
      fill.position.set(-6, -2, 3);
      scene.add(fill);

      // ---------- Grafo ----------
      const rand = mulberry32(20261112);
      const positions = [];
      const leftTarget = 11;
      let leftPlaced = 0;

      while (leftPlaced < leftTarget) {
        const x = -1.2 - rand() * 2.6;
        const y = (rand() - 0.4) * 4.2;
        const z = (rand() - 0.5) * 2.6;
        if (positions.every(([px, py, pz]) => Math.hypot(px - x, py - y, pz - z) >= MIN_DIST)) {
          positions.push([x, y, z]);
          leftPlaced += 1;
        }
      }
      while (positions.length < NODE_COUNT) {
        const x = 0.6 + rand() * 5.9;
        const y = (rand() - 0.5) * 4.0;
        const z = (rand() - 0.5) * 3.0;
        if (positions.every(([px, py, pz]) => Math.hypot(px - x, py - y, pz - z) >= MIN_DIST)) {
          positions.push([x, y, z]);
        }
      }

      const sphereGeo = new THREE.SphereGeometry(SPHERE_RADIUS, 12, 12);
      const sphereMat = new THREE.MeshStandardMaterial({
        roughness: 0.45,
        metalness: 0.2,
        transparent: true,
      });
      const nodeMesh = new THREE.InstancedMesh(sphereGeo, sphereMat, positions.length);
      const dummy = new THREE.Object3D();
      const instanceColor = new THREE.Color();
      positions.forEach(([x, y, z], i) => {
        dummy.position.set(x, y, z);
        dummy.updateMatrix();
        nodeMesh.setMatrixAt(i, dummy.matrix);
        instanceColor.setHex(NODE_COLORS[Math.floor(rand() * NODE_COLORS.length)]);
        nodeMesh.setColorAt(i, instanceColor);
      });
      nodeMesh.instanceColor.needsUpdate = true;
      nodeMesh.instanceMatrix.needsUpdate = true;
      scene.add(nodeMesh);

      // Aristas: cada nodo conecta con sus 2 vecinos más cercanos
      const edgeKeys = new Set();
      positions.forEach(([x, y, z], i) => {
        const nearest = positions
          .map(([px, py, pz], j) => ({ j, d: Math.hypot(px - x, py - y, pz - z) }))
          .filter(({ j }) => j !== i)
          .sort((a, b) => a.d - b.d);
        nearest.slice(0, 2).forEach(({ j }) => {
          edgeKeys.add(i < j ? `${i}-${j}` : `${j}-${i}`);
        });
      });
      const edgeList = [...edgeKeys].map((key) => key.split("-").map(Number));
      const edgePositions = new Float32Array(edgeList.length * 6);
      edgeList.forEach(([a, b], e) => {
        edgePositions.set(positions[a], e * 6);
        edgePositions.set(positions[b], e * 6 + 3);
      });
      const lineGeo = new THREE.BufferGeometry();
      lineGeo.setAttribute("position", new THREE.BufferAttribute(edgePositions, 3));
      const lineMat = new THREE.LineBasicMaterial({
        color: 0xa5b4fc,
        transparent: true,
        opacity: 0.5,
      });
      scene.add(new THREE.LineSegments(lineGeo, lineMat));

      // Paquetes de luz viajando por las conexiones
      const packetGeo = new THREE.BufferGeometry();
      const packetPositions = new Float32Array(PACKET_COUNT * 3);
      packetGeo.setAttribute("position", new THREE.BufferAttribute(packetPositions, 3));
      const packetMat = new THREE.PointsMaterial({
        color: 0x06b6d4,
        size: 0.085,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      });
      scene.add(new THREE.Points(packetGeo, packetMat));
      const packets = Array.from({ length: PACKET_COUNT }, () => ({
        edge: Math.floor(rand() * edgeList.length),
        t: rand(),
        speed: 0.25 + rand() * 0.3,
      }));

      // ---------- 5 piezas procedurales ----------
      const materials = [sphereMat, lineMat, packetMat];
      const pieces = [];
      function addPiece(group, areaId) {
        group.traverse((child) => {
          if (child.isMesh || child.isLine || child.isLineSegments) {
            materials.push(child.material);
            child.material.transparent = true;
          }
        });
        scene.add(group);
        pieces.push({ group, areaId });
      }

      // Software: cubo con aristas
      const software = new THREE.Group();
      software.position.set(4.9, 1.2, 0.35);
      const softwareMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.52, 0.52, 0.52),
        new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.35, metalness: 0.4 }),
      );
      software.add(softwareMesh);
      software.add(
        new THREE.LineSegments(
          new THREE.EdgesGeometry(softwareMesh.geometry),
          new THREE.LineBasicMaterial({ color: 0x1d4ed8 }),
        ),
      );
      addPiece(software, "software");

      // Arquitectura: tres placas planas apiladas
      const arquitectura = new THREE.Group();
      arquitectura.position.set(3.35, -1.3, -0.35);
      [-0.14, 0.02, 0.18].forEach((dy, i) => {
        const plate = new THREE.Mesh(
          new THREE.BoxGeometry(0.92 - i * 0.16, 0.06, 0.66),
          new THREE.MeshStandardMaterial({
            color: i === 1 ? 0x4f46e5 : 0x6366f1,
            roughness: 0.4,
            metalness: 0.3,
          }),
        );
        plate.position.y = dy;
        plate.rotation.y = i * 0.16;
        arquitectura.add(plate);
      });
      addPiece(arquitectura, "arquitectura");

      // Redes: tetraedro con esferas en los vértices
      const redes = new THREE.Group();
      redes.position.set(5.6, -0.1, -0.9);
      const redesTetra = new THREE.Mesh(
        new THREE.TetrahedronGeometry(0.4),
        new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.35, metalness: 0.35 }),
      );
      redes.add(redesTetra);
      const vertexGeo = new THREE.TetrahedronGeometry(0.4);
      const vertexPos = vertexGeo.getAttribute("position");
      const seenVertices = new Set();
      for (let i = 0; i < vertexPos.count; i += 1) {
        const v = [vertexPos.getX(i), vertexPos.getY(i), vertexPos.getZ(i)];
        const key = v.map((n) => n.toFixed(3)).join(",");
        if (seenVertices.has(key)) continue;
        seenVertices.add(key);
        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(0.075, 10, 10),
          new THREE.MeshStandardMaterial({ color: 0x06b6d4, roughness: 0.3, metalness: 0.3 }),
        );
        sphere.position.set(v[0], v[1], v[2]);
        redes.add(sphere);
      }
      vertexGeo.dispose();
      addPiece(redes, "redes");

      // Electrónica: chip (caja plana con pines)
      const electronica = new THREE.Group();
      electronica.position.set(2.45, 1.55, -1.05);
      const chipBody = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 0.1, 0.55),
        new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.35, metalness: 0.45 }),
      );
      electronica.add(chipBody);
      for (let side = -1; side <= 1; side += 2) {
        for (let i = -2; i <= 2; i += 1) {
          const pin = new THREE.Mesh(
            new THREE.BoxGeometry(0.07, 0.05, 0.16),
            new THREE.MeshStandardMaterial({ color: 0xdde3f0, roughness: 0.25, metalness: 0.7 }),
          );
          pin.position.set(i * 0.17, 0, side * 0.35);
          electronica.add(pin);
        }
      }
      addPiece(electronica, "electronica");

      // Formación: birrete (cilindro bajo + placa plana)
      const formacion = new THREE.Group();
      formacion.position.set(4.2, 0.35, 0.95);
      const capBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.34, 0.34, 0.1, 24),
        new THREE.MeshStandardMaterial({ color: 0x4f46e5, roughness: 0.4, metalness: 0.3 }),
      );
      formacion.add(capBase);
      const board = new THREE.Mesh(
        new THREE.BoxGeometry(0.72, 0.045, 0.72),
        new THREE.MeshStandardMaterial({ color: 0x7c3aed, roughness: 0.35, metalness: 0.35 }),
      );
      board.position.y = 0.095;
      board.rotation.y = 0.35;
      formacion.add(board);
      addPiece(formacion, "formacion");

      // ---------- Interacción: parallax cámara + hover ----------
      const raycaster = new THREE.Raycaster();
      const pointer = { x: 0, y: 0, nx: 0, ny: 0 };
      const onPointerMove = (event) => {
        if (!window.matchMedia("(pointer: fine)").matches) return;
        pointer.nx = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.ny = (event.clientY / window.innerHeight) * 2 - 1;
        pointer.x = event.clientX;
        pointer.y = event.clientY;

        // Raycast a las 5 piezas para etiqueta flotante i18n
        const rect = container.getBoundingClientRect();
        const px = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const py = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera({ x: px, y: py }, camera);
        const intersects = raycaster.intersectObjects(
          pieces.map((p) => p.group),
          true,
        );
        if (intersects.length > 0) {
          const hit = intersects[0].object;
          const piece = pieces.find((p) => {
            let found = false;
            p.group.traverse((node) => {
              if (node === hit) found = true;
            });
            return found;
          });
          if (piece && rect.width > 0) {
            const worldPos = new THREE.Vector3();
            piece.group.getWorldPosition(worldPos);
            const projected = worldPos.project(camera);
            setLabel({
              areaId: piece.areaId,
              x: ((projected.x + 1) / 2) * rect.width,
              y: ((1 - projected.y) / 2) * rect.height,
            });
            return;
          }
        }
        setLabel(null);
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });

      // ---------- Resize ----------
      const resize = () => {
        const w = container.clientWidth || 1;
        const h = container.clientHeight || 1;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(container);

      // ---------- Pausa con IntersectionObserver + visibilityState ----------
      let inView = true;
      let pageVisible = !document.hidden;
      const io = new IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting;
        },
        { threshold: 0 },
      );
      io.observe(container);
      const onVisibility = () => {
        pageVisible = !document.hidden;
      };
      document.addEventListener("visibilitychange", onVisibility);

      // ---------- GSAP ScrollTrigger: salir del hero ----------
      let gsapCtx = null;
      (async () => {
        try {
          const { gsap } = await import("gsap");
          const { ScrollTrigger } = await import("gsap/ScrollTrigger");
          gsap.registerPlugin(ScrollTrigger);
          const hero = document.getElementById("inicio");
          if (!hero || disposed) return;
          const fade = { v: 1 };
          gsapCtx = gsap.context(() => {
            gsap.to(scene.rotation, {
              y: 0.55,
              ease: "none",
              scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 },
            });
            gsap.to(camera.position, {
              z: 10.6,
              ease: "none",
              scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 },
            });
            gsap.to(fade, {
              v: 0.12,
              ease: "none",
              onUpdate: () => {
                materials.forEach((mat) => {
                  mat.opacity = fade.v;
                });
              },
              scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: 0.6 },
            });
          }, container);
        } catch {
          // sin gsap: la escena queda estática con atenuación solo por scroll CSS
        }
      })();

      // ---------- Bucle principal ----------
      // Delta propio (THREE.Clock está deprecado); el resultado visual es idéntico.
      let prevTime = performance.now();
      let lastFrame = 0;
      let rafId = 0;
      const camBase = camera.position.clone();
      const pointerSmoothed = { x: 0, y: 0 };

      const tick = () => {
        rafId = window.requestAnimationFrame(tick);
        const now = performance.now();
        if (now - lastFrame < FRAME_MS) return;
        lastFrame = now;
        if (!inView || !pageVisible) return;

        const dt = Math.min((now - prevTime) / 1000, 0.05);
        prevTime = now;

        // Amortiguado del parallax de cámara hacia el puntero
        pointerSmoothed.x += (pointer.nx - pointerSmoothed.x) * 0.04;
        pointerSmoothed.y += (pointer.ny - pointerSmoothed.y) * 0.04;
        camera.position.x = camBase.x + pointerSmoothed.x * 0.45;
        camera.position.y = camBase.y - pointerSmoothed.y * 0.3;
        camera.lookAt(1.1, 0.05, 0);

        // Rotación lenta de piezas
        pieces.forEach((piece, i) => {
          piece.group.rotation.y += dt * (0.25 + i * 0.06) * (i % 2 === 0 ? 1 : -1);
        });

        // Paquetes recorriendo aristas
        const attr = packetGeo.getAttribute("position");
        packets.forEach((packet, i) => {
          packet.t += packet.speed * dt;
          if (packet.t >= 1) {
            packet.t = 0;
            packet.edge = Math.floor(Math.random() * edgeList.length);
          }
          const [a, b] = edgeList[packet.edge];
          const pa = positions[a];
          const pb = positions[b];
          attr.setXYZ(
            i,
            pa[0] + (pb[0] - pa[0]) * packet.t,
            pa[1] + (pb[1] - pa[1]) * packet.t,
            pa[2] + (pb[2] - pa[2]) * packet.t,
          );
        });
        attr.needsUpdate = true;

        renderer.render(scene, camera);
      };

      const onContextLost = (event) => {
        event.preventDefault();
        disposed = true;
        if (cleanup) cleanup();
      };
      renderer.domElement.addEventListener("webglcontextlost", onContextLost);

      container.appendChild(renderer.domElement);
      tick();

      // ---------- Limpieza ----------
      cleanup = () => {
        window.cancelAnimationFrame(rafId);
        ro.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("pointermove", onPointerMove);
        if (gsapCtx && gsapCtx.revert) gsapCtx.revert();
        renderer.domElement.removeEventListener("webglcontextlost", onContextLost);
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement);
        }
        scene.traverse((obj) => {
          if (obj.isInstancedMesh && obj.dispose) obj.dispose();
          if (obj.geometry) obj.geometry.dispose();
          const mats = obj.material
            ? Array.isArray(obj.material)
              ? obj.material
              : [obj.material]
            : [];
          mats.forEach((mat) => mat.dispose());
        });
        sphereGeo.dispose();
        lineGeo.dispose();
        packetGeo.dispose();
        renderer.dispose();
        if (renderer.forceContextLoss) renderer.forceContextLoss();
      };
    })();

    return () => {
      disposed = true;
      if (cleanup) cleanup();
    };
  }, [theme]);

  const areaTitles = (() => {
    const areas = t("sections.specs.areas");
    if (!Array.isArray(areas)) return {};
    return Object.fromEntries(areas.map((a) => [a.id, a.title]));
  })();

  if (theme !== "light") return null;

  return (
    <div ref={containerRef} className={styles.graph} aria-hidden="true">
      {label ? (
        <span className={styles.label} style={{ left: label.x, top: label.y }}>
          {areaTitles[label.areaId] ?? label.areaId}
        </span>
      ) : null}
    </div>
  );
}
