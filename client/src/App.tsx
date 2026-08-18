/*
 * alish02 / Observatory Noir: the avatar is the product surface.
 * Keep the asymmetric instrument-panel layout, amber signal color,
 * Space Grotesk + IBM Plex Sans hierarchy, and restrained motion.
 */
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, ContactShadows, Float } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Group, Mesh } from "three";
import {
  Aperture,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Gauge,
  Menu,
  Moon,
  RotateCcw,
  Settings2,
  Sparkles,
  Sun,
  X,
} from "lucide-react";
import "./index.css";

type AvatarId = "nova" | "sora" | "atlas";
type AvatarDefinition = {
  id: AvatarId;
  name: string;
  role: string;
  descriptor: string;
  signal: string;
  skin: string;
  hair: string;
  suit: string;
  accent: string;
  badge: string;
};

const avatars: AvatarDefinition[] = [
  {
    id: "nova",
    name: "Nova",
    role: "Signal Cartographer",
    descriptor: "A calm navigator for ideas, files, and local models.",
    signal: "A-01",
    skin: "#e7b58c",
    hair: "#6a5478",
    suit: "#51485f",
    accent: "#f3b562",
    badge: "AMBER",
  },
  {
    id: "sora",
    name: "Sora",
    role: "Archive Listener",
    descriptor: "A soft-spoken archivist built for context and recall.",
    signal: "M-07",
    skin: "#d9a17e",
    hair: "#46736e",
    suit: "#385c51",
    accent: "#98d5b8",
    badge: "MINT",
  },
  {
    id: "atlas",
    name: "Atlas",
    role: "Systems Scout",
    descriptor: "A precise systems partner for experiments and prototypes.",
    signal: "C-12",
    skin: "#c98768",
    hair: "#334563",
    suit: "#4d5078",
    accent: "#b9a7ff",
    badge: "VIOLET",
  },
];

function readStoredAvatar(): AvatarId {
  if (typeof window === "undefined") return "nova";
  try {
    const value = window.localStorage.getItem("alish02-avatar");
    return avatars.some((avatar) => avatar.id === value) ? (value as AvatarId) : "nova";
  } catch {
    return "nova";
  }
}

function readStoredMotion(): boolean {
  if (typeof window === "undefined") return true;
  try {
    return window.localStorage.getItem("alish02-motion") !== "off";
  } catch {
    return true;
  }
}

function AvatarModel({ avatar, motion }: { avatar: AvatarDefinition; motion: boolean }) {
  const group = useRef<Group>(null);
  const visor = useRef<Mesh>(null);
  const t = useRef(0);

  useFrame((_, delta) => {
    if (!group.current) return;
    t.current += delta;
    const idle = motion ? Math.sin(t.current * 1.1) * 0.035 : 0;
    group.current.rotation.y += ((motion ? Math.sin(t.current * 0.32) * 0.12 : 0) - group.current.rotation.y) * 0.04;
    group.current.position.y = idle;
    if (visor.current && !Array.isArray(visor.current.material)) {
      visor.current.material.opacity = 0.58 + Math.sin(t.current * 1.6) * 0.08;
    }
  });

  return (
    <group ref={group} position={[0, -0.98, 0]}>
      <Float speed={motion ? 1.1 : 0} rotationIntensity={motion ? 0.08 : 0} floatIntensity={motion ? 0.18 : 0}>
        <mesh position={[0, 1.78, 0]} castShadow>
          <sphereGeometry args={[0.62, 32, 32]} />
          <meshStandardMaterial color={avatar.skin} roughness={0.75} />
        </mesh>
        <mesh position={[0, 2.18, -0.36]} castShadow>
          <sphereGeometry args={[0.66, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.62]} />
          <meshStandardMaterial color={avatar.hair} roughness={0.45} />
        </mesh>
        <mesh position={[-0.27, 2.03, 0.31]} rotation={[0, 0, -0.28]}>
          <boxGeometry args={[0.24, 0.48, 0.18]} />
          <meshStandardMaterial color={avatar.hair} roughness={0.42} />
        </mesh>
        <mesh position={[0.28, 2.08, 0.29]} rotation={[0, 0, 0.22]}>
          <boxGeometry args={[0.22, 0.42, 0.18]} />
          <meshStandardMaterial color={avatar.hair} roughness={0.42} />
        </mesh>
        <mesh ref={visor} position={[0, 1.85, 0.57]} rotation={[0.02, 0, 0]}>
          <boxGeometry args={[0.9, 0.16, 0.035]} />
          <meshStandardMaterial color={avatar.accent} emissive={avatar.accent} emissiveIntensity={1.5} transparent opacity={0.7} />
        </mesh>
        <mesh position={[-0.22, 1.82, 0.56]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#fff7e4" emissive="#fff7e4" emissiveIntensity={1.3} />
        </mesh>
        <mesh position={[0.22, 1.82, 0.56]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshStandardMaterial color="#fff7e4" emissive="#fff7e4" emissiveIntensity={1.3} />
        </mesh>
        <mesh position={[0, 1.69, 0.57]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.12, 0.018, 8, 20, Math.PI]} />
          <meshStandardMaterial color={avatar.accent} emissive={avatar.accent} emissiveIntensity={0.4} />
        </mesh>
        <mesh position={[0, 1.76, 0.59]}>
          <coneGeometry args={[0.045, 0.12, 4]} />
          <meshStandardMaterial color={avatar.skin} roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.31, 0]} castShadow>
          <capsuleGeometry args={[0.72, 0.92, 8, 24]} />
          <meshStandardMaterial color={avatar.suit} metalness={0.18} roughness={0.58} />
        </mesh>
        <mesh position={[0, 1.25, 0.7]}>
          <boxGeometry args={[0.34, 0.24, 0.07]} />
          <meshStandardMaterial color={avatar.accent} emissive={avatar.accent} emissiveIntensity={0.75} />
        </mesh>
        <mesh position={[0, 0.82, 0.73]}>
          <boxGeometry args={[0.46, 0.42, 0.055]} />
          <meshStandardMaterial color={avatar.accent} metalness={0.3} roughness={0.35} />
        </mesh>
        <mesh position={[-0.78, 0.42, 0]} castShadow rotation={[0, 0, -0.08]}>
          <capsuleGeometry args={[0.18, 1.02, 6, 14]} />
          <meshStandardMaterial color={avatar.suit} roughness={0.62} />
        </mesh>
        <mesh position={[0.78, 0.42, 0]} castShadow rotation={[0, 0, 0.08]}>
          <capsuleGeometry args={[0.18, 1.02, 6, 14]} />
          <meshStandardMaterial color={avatar.suit} roughness={0.62} />
        </mesh>
      </Float>
    </group>
  );
}

function AvatarStage({ avatar, motion }: { avatar: AvatarDefinition; motion: boolean }) {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0.15, 7.4], fov: 39 }} gl={{ antialias: true }}>
      <color attach="background" args={["#171615"]} />
      <ambientLight intensity={1.45} />
      <directionalLight position={[3, 5, 4]} intensity={3} color="#fff0d2" castShadow />
      <pointLight position={[-3, 2, 2]} intensity={4} color={avatar.accent} distance={6} />
      <pointLight position={[3, 0, -2]} intensity={2} color="#a8b6ff" distance={5} />
      <AvatarModel avatar={avatar} motion={motion} />
      <ContactShadows position={[0, -2.32, 0]} opacity={0.55} scale={4.2} blur={2.4} far={4} color="#000000" />
      <OrbitControls enablePan={false} enableZoom={false} minPolarAngle={Math.PI / 2.2} maxPolarAngle={Math.PI / 1.9} autoRotate={motion} autoRotateSpeed={0.45} />
    </Canvas>
  );
}

function App() {
  const [activeId, setActiveId] = useState<AvatarId>(readStoredAvatar);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [motion, setMotion] = useState(readStoredMotion);
  const [dark, setDark] = useState(true);
  const active = useMemo(() => avatars.find((avatar) => avatar.id === activeId) ?? avatars[0], [activeId]);
  const activeIndex = avatars.findIndex((avatar) => avatar.id === active.id);
  const pagesBase = import.meta.env.BASE_URL;
  const markSrc = pagesBase === "/" ? "/manus-storage/alish02-mark_82607bd3.png" : `${pagesBase}alish02-mark.svg`;
  const stageBackground = pagesBase === "/" ? "/manus-storage/alish02-observatory-bg_c2146f3f.jpg" : `${pagesBase}observatory-bg.svg`;

  useEffect(() => {
    try {
      window.localStorage.setItem("alish02-avatar", activeId);
    } catch {
      // The UI remains usable when browser storage is disabled.
    }
  }, [activeId]);
  useEffect(() => {
    try {
      window.localStorage.setItem("alish02-motion", motion ? "on" : "off");
    } catch {
      // The motion toggle remains an in-memory preference for this session.
    }
  }, [motion]);
  useEffect(() => {
    if (!settingsOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSettingsOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [settingsOpen]);

  const changeAvatar = (direction: number) => {
    const next = (activeIndex + direction + avatars.length) % avatars.length;
    setActiveId(avatars[next].id);
  };

  return (
    <main className={dark ? "app-shell" : "app-shell light-mode"}>
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark"><img src={markSrc} alt="" /></div>
          <div className="wordmark"><strong>alish<sup>02</sup></strong><span>AVATAR OBSERVATORY</span></div>
        </div>
        <div className="top-meta"><span className="live-dot" /> LOCAL COLLECTION <span className="mono">v0.1 / VRM-READY</span></div>
        <button className="settings-trigger" onClick={() => setSettingsOpen(true)} aria-label="فتح إعدادات الافتار"><Settings2 size={17} /> Settings</button>
      </header>

      <div className="layout">
        <aside className="rail">
          <div className="rail-top"><button className="icon-button" aria-label="فتح قائمة الأرشيف"><Menu size={18} /></button><span className="vertical-label">ARCHIVE / 03</span></div>
          <div className="rail-bottom"><button className="icon-button" onClick={() => setDark((value) => !value)} aria-label="تبديل السمة">{dark ? <Sun size={17} /> : <Moon size={17} />}</button><button className="icon-button" aria-label="مساعدة alish02"><CircleHelp size={17} /></button></div>
        </aside>

        <section className="content">
          <div className="intro-row">
            <div><p className="eyebrow">OPEN-SOURCE AVATAR STUDY · 2026</p><h1>Choose your<br /><em>digital presence.</em></h1></div>
            <div className="intro-note"><span className="rule" />Every character is a<br />different way to think.</div>
          </div>

          <div className="stage-grid">
            <div className="stage-wrap">
              <div className="stage-meta"><span><Aperture size={14} /> STAGE / {active.signal}</span><span className="mono">{active.badge} SIGNAL</span></div>
              <div className="stage" style={{ backgroundImage: `linear-gradient(180deg, rgba(23,22,21,.12), rgba(23,22,21,.58)), url('${stageBackground}')` }}><AvatarStage avatar={active} motion={motion} /><div className="status-rail"><span className="status-ready"><i /> READY</span><span>LOADING</span><span>ERROR</span></div><div className="stage-corner top-left" /><div className="stage-corner bottom-right" /><div className="stage-coordinate">x 04° 18' 09" / y 52° 31' 22"</div></div>
              <div className="stage-controls"><button onClick={() => changeAvatar(-1)} aria-label="الافتار السابق"><ChevronLeft size={18} /></button><div><span className="mono">0{activeIndex + 1} / 0{avatars.length}</span><strong>{active.name}</strong></div><button onClick={() => changeAvatar(1)} aria-label="الافتار التالي"><ChevronRight size={18} /></button></div>
            </div>

            <aside className="info-panel"><div className="panel-kicker"><span className="signal-line" /> CURRENT SUBJECT <span className="status-chip"><i /> READY</span></div><div className="subject-name"><span>{active.signal}</span><h2>{active.name}</h2><p>{active.role}</p></div><p className="descriptor">{active.descriptor}</p><div className="stats"><div><span>FORMAT</span><strong>PROCEDURAL 3D</strong></div><div><span>LICENSE</span><strong>MIT / CC0 SAFE</strong></div><div><span>STATUS</span><strong className="ready"><Check size={13} /> RENDERING</strong></div></div><button className="switch-button" onClick={() => setSettingsOpen(true)}>Configure presence <ArrowUpRight size={16} /></button><div className="panel-footer"><Gauge size={14} /> 60 FPS TARGET <span>·</span> WEBGL 2</div></aside>
          </div>

          <div className="collection-strip"><div className="strip-title"><span className="eyebrow">COLLECTION INDEX / 003</span><strong>Three ways to arrive.</strong><div className="archive-ticks"><i /><i /><i /><i /><i /><i /><i /></div></div><div className="avatar-tabs">{avatars.map((avatar) => <button key={avatar.id} className={avatar.id === active.id ? "avatar-tab active" : "avatar-tab"} onClick={() => setActiveId(avatar.id)}><span className="tab-number">{avatar.signal}</span><span><strong>{avatar.name}</strong><small>{avatar.role}</small></span><span className="tab-swatch" style={{ background: avatar.accent }} /></button>)}</div></div>
        </section>
      </div>

      {settingsOpen && <div className="settings-backdrop" onClick={() => setSettingsOpen(false)}><aside className="settings-drawer" role="dialog" aria-modal="true" aria-labelledby="presence-settings-title" onClick={(event) => event.stopPropagation()}><div className="drawer-head"><div><span className="eyebrow">CONTROL ROOM</span><h2 id="presence-settings-title">Presence settings</h2></div><button className="icon-button" onClick={() => setSettingsOpen(false)} aria-label="إغلاق الإعدادات"><X size={18} /></button></div><p className="drawer-copy">Your selection stays in this browser. Choose a subject, then return to the observatory.</p><div className="drawer-section"><span className="drawer-label">AVATAR SUBJECT</span>{avatars.map((avatar) => <button key={avatar.id} className={avatar.id === active.id ? "drawer-avatar selected" : "drawer-avatar"} onClick={() => setActiveId(avatar.id)}><span className="drawer-index">{avatar.signal}</span><span><strong>{avatar.name}</strong><small>{avatar.role}</small></span>{avatar.id === active.id && <Check size={16} />}</button>)}</div><div className="drawer-section"><span className="drawer-label">MOTION PROFILE</span><button className="toggle-row" onClick={() => setMotion((value) => !value)}><span><strong>Ambient movement</strong><small>Idle drift and auto-rotation</small></span><span className={motion ? "toggle on" : "toggle"}><i /></span></button></div><div className="drawer-section"><span className="drawer-label">SESSION</span><button className="reset-button" onClick={() => { setActiveId("nova"); setMotion(true); }}><RotateCcw size={15} /> Reset to Nova baseline</button></div><div className="drawer-note"><Sparkles size={15} /> VRM loading is the next expansion point. This build uses lightweight procedural characters so GitHub Pages remains fast and dependable.</div></aside></div>}
    </main>
  );
}

export default App;
